export function conexao(estado, texto) {
  const cores = { ok: 'bg-green-400', erro: 'bg-red-500', esperando: 'bg-yellow-400' };
  const ponto = $('ponto-conexao');
  const txt = $('texto-conexao');
  
  if (ponto) ponto.className = `w-2 h-2 rounded-full shrink-0 ${cores[estado] || 'bg-gray-500'}`;
  if (txt) txt.textContent = texto;
}