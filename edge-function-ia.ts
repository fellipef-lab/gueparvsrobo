// =====================================================================
// Edge Function "ia" — a chave do Gemini fica aqui, no servidor.
//
// Como publicar:
//   1. npm i -g supabase
//   2. supabase login
//   3. supabase link --project-ref SEU_PROJECT_REF
//   4. supabase functions new ia      (e cole este arquivo em supabase/functions/ia/index.ts)
//   5. supabase secrets set GEMINI_API_KEY=sua_chave_nova
//   6. supabase functions deploy ia
//
// Sem esta função publicada, o painel continua funcionando no modo local.
// =====================================================================

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

const json = (corpo: unknown, status = 200) =>
  new Response(JSON.stringify(corpo), { status, headers: { ...CORS, 'Content-Type': 'application/json' } });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });

  // Só responde a quem está logado no painel.
  const auth = req.headers.get('Authorization') ?? '';
  const sb = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: auth } } }
  );
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return json({ erro: 'Não autenticado' }, 401);

  const chave = Deno.env.get('GEMINI_API_KEY');
  if (!chave) return json({ erro: 'GEMINI_API_KEY não configurada' }, 500);

  const { mensagem, contexto } = await req.json();

  // Lê o estoque do banco em vez de confiar no que o navegador mandou.
  const [pecas, guepar, fornecedores] = await Promise.all([
    sb.from('pecas').select('nome, estoque, min_estoque'),
    sb.from('guepar_uso').select('nome, estoque, min_estoque'),
    sb.from('fornecedores').select('nome, contato, telefone')
  ]);

  const prompt = `Você é o assistente do painel de estoque "Guepar vs RobÔ".
Peças do robô: ${JSON.stringify(pecas.data)}
Materiais Guepar: ${JSON.stringify(guepar.data)}
Fornecedores: ${JSON.stringify(fornecedores.data)}
Itens abaixo do mínimo: ${(contexto?.faltando ?? []).join(', ') || 'nenhum'}
Pergunta do usuário: ${mensagem}
Responda em português do Brasil, de forma direta e amigável.`;

  const r = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${chave}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    }
  );

  if (!r.ok) return json({ erro: `Gemini recusou (${r.status})` }, 502);

  const j = await r.json();
  const resposta = j?.candidates?.[0]?.content?.parts?.[0]?.text;
  return resposta ? json({ resposta }) : json({ erro: 'Resposta vazia do Gemini' }, 502);
});
