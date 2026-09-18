import { state } from './state.js';
import { esc } from './utils.js';

export function renderGuepar() {
  const container = document.getElementById('aba-guepar');
  if (!container) return;

  const dados = state.dados.guepar || [];

  container.innerHTML = `
    <div class="flex justify-between items-center bg-slate-900/90 border border-slate-800 p-6 rounded-2xl backdrop-blur-md">
      <div>
        <h1 class="text-2xl font-black text-white">Materiais Guepar Uso</h1>
        <p class="text-sm text-gray-400">Insumos e materiais de uso contínuo</p>
      </div>
    </div>

    <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 backdrop-blur-md">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm text-gray-300">
          <thead class="bg-slate-800/60 text-xs uppercase text-gray-400 border-b border-slate-700">
            <tr>
              <th class="p-3">Item</th>
              <th class="p-3">Marca</th>
              <th class="p-3">Estoque</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800">
            ${dados.map(g => `
              <tr class="hover:bg-slate-800/30 transition">
                <td class="p-3 font-semibold text-white">${esc(g.nome)}</td>
                <td class="p-3">${esc(g.marca || '-')}</td>
                <td class="p-3 font-bold text-cyan-400">${g.estoque}</td>
              </tr>
            `).join('') || `<tr><td colspan="3" class="p-4 text-center text-gray-400">Nenhum item do Guepar Uso cadastrado.</td></tr>`}
          </tbody>
        </table>
      </div>
    </div>
  `;
}
