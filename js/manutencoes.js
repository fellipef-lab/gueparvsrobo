import { state } from './state.js';
import { esc, statusEstoque } from './utils.js';

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
    </div>

    <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 backdrop-blur-md">
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
            `).join('') || `<tr><td colspan="4" class="p-4 text-center text-gray-400">Nenhum registro de manutenção encontrado.</td></tr>`}
          </tbody>
        </table>
      </div>
    </div>
  `;
}
