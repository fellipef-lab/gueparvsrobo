import { state } from './state.js';
import { esc } from './utils.js';
import { gerarRelatorio } from './relatorios.js';

export function renderManutencoes() {
  const container = document.getElementById('aba-manutencoes');
  if (!container) return;

  const dados = state.dados.manutencoes || [];

  container.innerHTML = `
    <div class="flex justify-between items-center bg-slate-900/90 border border-slate-800 p-6 rounded-2xl backdrop-blur-md">
      <div>
        <h1 class="text-2xl font-black text-white">Controle de Manutenções</h1>
        <p class="text-sm text-gray-400">Acompanhamento e prazos dos equipamentos</p>
      </div>
      <button id="btn-relatorio-manutencao" class="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold px-4 py-2.5 rounded-xl border border-cyan-500/20 transition">
        <i class="ph ph-printer text-lg"></i>
        <span>Relatório</span>
      </button>
    </div>

    <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 backdrop-blur-md mt-6">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm text-gray-300">
          <thead class="bg-slate-800/60 text-xs uppercase text-gray-400 border-b border-slate-700">
            <tr>
              <th class="p-3">Equipamento</th>
              <th class="p-3">Tipo</th>
              <th class="p-3">Última Troca</th>
              <th class="p-3">Validade</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800">
            ${dados.map(m => `
              <tr class="hover:bg-slate-800/30 transition">
                <td class="p-3 font-semibold text-white">${esc(m.nome)}</td>
                <td class="p-3 capitalize">${esc(m.tipo || '-')}</td>
                <td class="p-3">${m.ultima_troca ? m.ultima_troca.split('-').reverse().join('/') : '-'}</td>
                <td class="p-3 font-semibold text-cyan-400">${m.validade ? m.validade.split('-').reverse().join('/') : '-'}</td>
              </tr>
            `).join('') || `<tr><td colspan="4" class="p-4 text-center text-gray-400">Nenhum registro encontrado.</td></tr>`}
          </tbody>
        </table>
      </div>
    </div>
  `;

  document.getElementById('btn-relatorio-manutencao')?.addEventListener('click', () => gerarRelatorio('manutencoes'));
}
