// =====================================================================
// DASHBOARD — cards de resumo e lista de alertas de reposição.
// Único módulo que olha para as três entidades ao mesmo tempo.
// =====================================================================
import { state } from './state.js';
import { $, esc } from './utils.js';

export function renderDashboard() {
  const { dados } = state;
  const criticas  = dados.pecas.filter(p => p.estoque <= p.min_estoque);
  const criticosG = dados.guepar.filter(g => g.estoque <= 0);

  const card = (icone, titulo, valor, unidade, rodape) => `
    <div class="bg-tech-800 p-6 rounded-lg border border-tech-700 shadow-lg relative overflow-hidden">
      <div class="absolute top-0 right-0 p-4 opacity-10"><i class="ph ph-${icone} text-8xl"></i></div>
      <div class="flex items-center gap-3 mb-2"><i class="ph ph-${icone} text-2xl text-tech-accent"></i><h3 class="text-lg font-bold text-gray-300">${titulo}</h3></div>
      <p class="text-4xl font-bold mb-2">${valor} <span class="text-sm font-normal text-gray-400">${unidade}</span></p>
      ${rodape}
    </div>`;

  const ok = t => `<p class="text-green-400 text-sm font-bold bg-green-500/10 inline-block px-2 py-1 rounded"><i class="ph ph-check-circle mr-1"></i>${t}</p>`;
  const alertaVermelho = t => `<p class="text-red-400 text-sm font-bold bg-red-500/10 inline-block px-2 py-1 rounded"><i class="ph ph-warning mr-1"></i>${t}</p>`;
  const alertaAmarelo  = t => `<p class="text-yellow-400 text-sm font-bold bg-yellow-500/10 inline-block px-2 py-1 rounded"><i class="ph ph-warning mr-1"></i>${t}</p>`;

  $('cards-dashboard').innerHTML =
    card('cpu', 'Peças do robô', dados.pecas.length, 'itens',
      criticas.length ? alertaVermelho(` ${criticas.length} em alerta ou falta`) : ok(' Estoque saudável')) +
    card('wrench', 'Materiais Guepar', dados.guepar.length, 'itens',
      criticosG.length ? alertaAmarelo(` ${criticosG.length} precisam de reposição`) : ok(' Estoque saudável')) +
    card('users', 'Fornecedores', dados.fornecedores.length, 'empresas',
      `<p class="text-blue-400 text-sm font-bold bg-blue-500/10 inline-block px-2 py-1 rounded"><i class="ph ph-info mr-1"></i> Contatos ativos</p>`);

  const faltando = [...criticas, ...criticosG];
  $('alertas-dashboard').innerHTML = faltando.length ? `
    <div class="bg-tech-800 border border-yellow-500/40 rounded-lg p-6">
      <h3 class="font-bold text-yellow-400 mb-3 flex items-center gap-2"><i class="ph ph-warning-circle text-xl"></i> Repor com prioridade</h3>
      <ul class="space-y-2">${faltando.map(i => `
        <li class="flex justify-between border-b border-tech-700 pb-2 last:border-0">
          <span>${esc(i.nome)}</span>
          <span class="text-gray-400 text-sm">${i.estoque} em estoque${i.min_estoque != null ? ' · mínimo ' + i.min_estoque : ''}</span>
        </li>`).join('')}</ul>
    </div>` : '';
}
