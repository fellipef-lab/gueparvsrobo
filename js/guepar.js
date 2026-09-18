import { state } from './state.js';
import { esc } from './utils.js';
import { abrirModalGuepar, deletarGuepar } from './crud.js';
import { gerarRelatorio } from './relatorios.js';

export function renderGuepar() {
  const container = document.getElementById('aba-guepar');
  if (!container) return;

  const dados = state.dados.guepar || [];

  container.innerHTML = `
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/90 border border-slate-800 p-6 rounded-2xl backdrop-blur-md">
      <div>
        <h1 class="text-2xl font-black text-white">Materiais Guepar Uso</h1>
        <p class="text-sm text-gray-400">Insumos e materiais de uso contínuo</p>
      </div>
      <div class="flex items-center space-x-3">
        <button id="btn-relatorio-guepar" class="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-blue-400 font-bold px-4 py-2.5 rounded-xl border border-blue-500/20 transition">
          <i class="ph ph-printer text-lg"></i>
          <span>Relatório</span>
        </button>
        <button id="btn-novo-guepar" class="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2.5 rounded-xl transition shadow-lg shadow-blue-900/30">
          <i class="ph ph-plus-circle text-lg"></i>
          <span>Novo Item</span>
        </button>
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
              <th class="p-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800">
            ${dados.map(g => `
              <tr class="hover:bg-slate-800/30 transition">
                <td class="p-3 font-semibold text-white">${esc(g.nome)}</td>
                <td class="p-3">${esc(g.marca || '-')}</td>
                <td class="p-3 font-bold text-cyan-400">${g.estoque}</td>
                <td class="p-3 text-right space-x-2">
                  <button class="btn-editar-g px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-lg text-xs transition" data-id="${g.id}">
                    <i class="ph ph-pencil-simple"></i>
                  </button>
                  <button class="btn-excluir-g px-2.5 py-1.5 bg-slate-800 hover:bg-red-500/20 text-red-400 rounded-lg text-xs transition" data-id="${g.id}">
                    <i class="ph ph-trash"></i>
                  </button>
                </td>
              </tr>
            `).join('') || `<tr><td colspan="4" class="p-4 text-center text-gray-400">Nenhum item cadastrado.</td></tr>`}
          </tbody>
        </table>
      </div>
    </div>
  `;

  document.getElementById('btn-novo-guepar')?.addEventListener('click', () => abrirModalGuepar());
  document.getElementById('btn-relatorio-guepar')?.addEventListener('click', () => gerarRelatorio('guepar'));

  container.querySelectorAll('.btn-editar-g').forEach(btn => {
    btn.onclick = () => {
      const item = dados.find(x => x.id == btn.dataset.id);
      if (item) abrirModalGuepar(item);
    };
  });

  container.querySelectorAll('.btn-excluir-g').forEach(btn => {
    btn.onclick = () => deletarGuepar(btn.dataset.id);
  });
}
