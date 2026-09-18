export const $ = id => document.getElementById(id);

export const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export const num = v => { const n = parseInt(v, 10); return Number.isFinite(n) ? n : NaN; };

export const vazio = (cols, texto) => `<tr><td colspan="${cols}" class="p-8 text-center text-gray-400">${texto}</td></tr>`;

export function toast(msg) {
  const t = $('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.remove('hidden');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.add('hidden'), 3200);
}

export const abrirModal = id => { const el = $(id); if (el) el.classList.remove('hidden'); };
export const fecharModal = id => { const el = $(id); if (el) el.classList.add('hidden'); };

export function logoFallback() {
  const d = document.createElement('div');
  d.className = 'h-10 w-10 rounded-full bg-white text-blue-700 font-black flex items-center justify-center mr-3 shrink-0';
  d.textContent = 'G';
  return d;
}

export function confirmar(texto, aoConfirmar) {
  const elTexto = $('confirma-texto');
  const elOk = $('confirma-ok');
  if (elTexto) elTexto.textContent = texto;
  if (elOk) elOk.onclick = () => { fecharModal('modalConfirma'); aoConfirmar(); };
  abrirModal('modalConfirma');
}

export function conexao(estado, texto) {
  const cores = { ok: 'bg-green-400', erro: 'bg-red-500', esperando: 'bg-yellow-400' };
  const ponto = $('ponto-conexao');
  const txt = $('texto-conexao');
  
  if (ponto) ponto.className = `w-2 h-2 rounded-full shrink-0 ${cores[estado] || 'bg-gray-500'}`;
  if (txt) txt.textContent = texto;
}

export function explicarErro(erro) {
  const m = erro?.message || 'Erro desconhecido';
  if (/JWT|not authenticated|session/i.test(m)) return 'Sua sessão expirou. Entre de novo.';
  if (/row-level security|policy/i.test(m))     return 'O banco recusou a operação. Confira se o RLS do schema.sql foi aplicado.';
  if (/Failed to fetch|NetworkError/i.test(m))  return 'Sem resposta do Supabase. Verifique a internet e a URL do projeto.';
  if (/does not exist|relation/i.test(m))       return 'Tabela não encontrada. Rode o schema.sql no SQL Editor.';
  return m;
}

export function statusEstoque(item, rotulos) {
  if (item.estoque <= 0) return `<span class="text-red-500 bg-red-500/10 px-2 py-1 rounded text-sm font-bold">${rotulos[0]}</span>`;
  if (item.estoque <= item.min_estoque) return `<span class="text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded text-sm font-bold">${rotulos[1]}</span>`;
  return `<span class="text-green-500 bg-green-500/10 px-2 py-1 rounded text-sm font-bold">${rotulos[2]}</span>`;
}