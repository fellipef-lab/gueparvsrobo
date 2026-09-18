import { state } from './state.js';
import { esc, statusEstoque } from './utils.js';
import { gerarRelatorio } from './relatorios.js';

export function renderPecas() {
  const container = document.getElementById('aba-pecas');
  if (!container) return;

  const dados = state.dados.pecas || [];

  container.innerHTML = `
    <div class="flex justify-between items-center bg-slate-900/90 border border-slate-800 p-6 rounded-2xl backdrop-blur-md">
      <div>
        <h1 class="text-2xl font-black text-white">Peças do Robô</h1>
        <p class="text-sm text-gray-400">Inventário de componentes técnicos</p>
      </div>
      <button id="btn-relatorio-pecas" class="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold px-4 py-2.5 rounded-xl border border-cyan-500/20 transition">
        <i class="ph ph-printer text-lg"></i>
        <span>Relatório</span>
      </button>
    </div>

    <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 backdrop-blur-md mt-6">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm text-gray-300">
          <thead class="bg-slate-800/60 text-xs uppercase text-gray-400 border-b border-slate-700">
            <tr>
              <th class="p-3">Peça</th>
              <th class="p-3">Estoque Atual</th>
              <th class="p-3">Estoque Mínimo</th>
              <th class="p-3">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800">
            ${dados.map(p => `
              <tr class="hover:bg-slate-800/30 transition">
                <td class="p-3 font-semibold text-white">${esc(p.nome)}</td>
                <td class="p-3 font-bold">${p.estoque}</td>
                <td class="p-3 text-gray-400">${p.min_estoque}</td>
                <td class="p-3">${statusEstoque(p, ['Esgotado', 'Crítico', 'OK'])}</td>
              </tr>
            `).join('') || `<tr><td colspan="4" class="p-4 text-center text-gray-400">Nenhuma peça cadastrada.</td></tr>`}
          </tbody>
        </table>
      </div>
    </div>
  `;

  document.getElementById('btn-relatorio-pecas')?.addEventListener('click', () => gerarRelatorio('pecas'));
}
