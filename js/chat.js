// =====================================================================
// ASSISTENTE — chat que consulta a Edge Function de IA e cai num
// modo de respostas locais se a função não estiver disponível.
// =====================================================================
import { state } from './state.js';
import { $, esc } from './utils.js';

export function addMensagem(html, lado) {
  const box = $('chat-box');
  const div = document.createElement('div');
  div.className = `flex mb-4 ${lado === 'usuario' ? 'justify-end' : 'justify-start'}`;
  div.innerHTML = lado === 'usuario'
    ? `<div class="bg-blue-600 p-4 rounded-xl rounded-tr-none max-w-[80%] shadow-md">${html}</div>`
    : `<div class="bg-tech-900 border border-tech-700 p-4 rounded-xl rounded-tl-none max-w-[90%] text-gray-300 shadow-lg">${html}</div>`;
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
  return div;
}

function contexto() {
  const { dados } = state;
  const faltandoPecas  = dados.pecas.filter(p => p.estoque <= p.min_estoque).map(p => p.nome);
  const faltandoGuepar = dados.guepar.filter(g => g.estoque <= 0).map(g => g.nome);
  return {
    pecas: dados.pecas, guepar: dados.guepar, fornecedores: dados.fornecedores,
    faltando: [...faltandoPecas, ...faltandoGuepar]
  };
}

function respostaLocal(pergunta) {
  const c = contexto();
  const q = pergunta.toLowerCase();
  const listaPecas  = arr => arr.map(i => `• ${esc(i.nome)} — ${i.estoque} un. (mínimo ${i.min_estoque})`).join('<br>');
  const listaGuepar = arr => arr.map(i => `• ${esc(i.nome)}${i.marca ? ' (' + esc(i.marca) + ')' : ''} — ${i.estoque} un.`).join('<br>');

  if (/(falta|repor|acaband|crítico|critico|alerta|comprar)/.test(q))
    return c.faltando.length
      ? `Precisam de reposição agora:<br>${c.faltando.map(n => '• ' + esc(n)).join('<br>')}`
      : 'Nada abaixo do mínimo. Todo o estoque está acima do nível de alerta.';
  if (/(fornecedor|contato|telefone|cnpj)/.test(q))
    return `São ${c.fornecedores.length} fornecedores cadastrados:<br>` +
      c.fornecedores.map(f => `• ${esc(f.nome)} — ${esc(f.contato)}, ${esc(f.telefone)}`).join('<br>');
  if (/(peça|peca|robô|robo)/.test(q))
    return c.pecas.length ? `Peças do robô:<br>${listaPecas(c.pecas)}` : 'Nenhuma peça cadastrada ainda.';
  if (/(guepar|material|materiais|uso)/.test(q))
    return c.guepar.length ? `Materiais Guepar:<br>${listaGuepar(c.guepar)}` : 'A lista de materiais Guepar está vazia.';
  if (/(relatório|relatorio|resumo|geral|situação|situacao)/.test(q))
    return `Resumo do estoque:<br>• ${c.pecas.length} peças do robô<br>• ${c.guepar.length} materiais Guepar<br>• ${c.fornecedores.length} fornecedores<br>` +
      (c.faltando.length ? `<br>Em alerta: ${c.faltando.map(esc).join(', ')}.` : '<br>Nenhum item abaixo do mínimo.');
  return 'Consigo responder com base no que está cadastrado. Tente: “o que está faltando”, “resumo do estoque”, “listar peças”, “materiais guepar” ou “fornecedores”.';
}

// Chama a Edge Function, que guarda a chave do Gemini no servidor.
// Se a função não estiver publicada, cai no modo local sem quebrar.
export async function enviarMensagem() {
  const input = $('chat-input');
  const msg = input.value.trim();
  if (!msg) return;
  addMensagem(esc(msg), 'usuario');
  input.value = '';

  const pensando = addMensagem('<span class="italic text-gray-400">Consultando o estoque...</span>', 'ia');
  try {
    const { data, error } = await state.sb.functions.invoke('ia', { body: { mensagem: msg, contexto: contexto() } });
    pensando.remove();
    if (error || !data?.resposta) addMensagem(respostaLocal(msg), 'ia');
    else addMensagem(esc(data.resposta).replace(/\n/g, '<br>'), 'ia');
  } catch (e) {
    pensando.remove();
    addMensagem(respostaLocal(msg), 'ia');
  }
}

// Liga os eventos assim que o módulo é carregado.
export function iniciarChat() {
  $('btn-enviar').onclick = enviarMensagem;
  $('chat-input').addEventListener('keydown', e => { if (e.key === 'Enter') enviarMensagem(); });
}
