import { state } from './state.js';
import { esc } from './utils.js';
import { abrirModalManutencao, deletarManutencao } from './crud.js';
import { gerarRelatorio } from './relatorios.js';

export function renderManutencoes() {
  const container = document.getElementById('aba-manutencoes');
  if (!container) return;

  const dados = state.dados.manutencoes || [];

  container.innerHTML = `
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/90 border border-slate-800 p-6 rounded-2xl backdrop-blur-md">
      <div>
        <h1 class="text-2xl font-black text-white">Controle de Manutenções</h1>
        <p class="text-sm text-gray-400">Acompanhamento e prazos dos equipamentos</p>
      </div>
      <div class="flex items-center space-x-3">
        <button id="btn-relatorio-manutencao" class="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold px-4 py-2.5 rounded-xl border border-cyan-500/20 transition">
          <i class="ph ph-printer text-lg"></i>
          <span>Relatório</span>
        </button>
        <button id="btn-nova-manutencao" class="flex items-center space-x-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-4 py-2.5 rounded-xl transition shadow-lg shadow-cyan-900/30">
          <i class="ph ph-plus-circle text-lg"></i>
          <span>Nova Manutenção</span>
        </button>
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
              <th class="p-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800">
            ${dados.map(m => `
              <tr class="hover:bg-slate-800/30 transition">
                <td class="p-3 font-semibold text-white">${esc(m.nome)}</td>
                <td class="p-3 capitalize">${esc(m.tipo || '-')}</td>
                <td class="p-3">${m.ultima_troca ? m.ultima_troca.split('-').reverse().join('/') : '-'}</td>
                <td class="p-3 font-semibold text-cyan-400">${m.validade ? m.validade.split('-').reverse().join('/') : '-'}</td>
                <td class="p-3 text-right space-x-2">
                  <button class="btn-editar-m px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-lg text-xs transition" data-id="${m.id}">
                    <i class="ph ph-pencil-simple"></i>
                  </button>
                  <button class="btn-excluir-m px-2.5 py-1.5 bg-slate-800 hover:bg-red-500/20 text-red-400 rounded-lg text-xs transition" data-id="${m.id}">
                    <i class="ph ph-trash"></i>
                  </button>
                </td>
              </tr>
            `).join('') || `<tr><td colspan="5" class="p-4 text-center text-gray-400">Nenhum registro encontrado.</td></tr>`}
          </tbody>
        </table>
      </div>
    </div>
  `;

  document.getElementById('btn-nova-manutencao')?.addEventListener('click', () => abrirModalManutencao());
  document.getElementById('btn-relatorio-manutencao')?.addEventListener('click', () => gerarRelatorio('manutencoes'));

  container.querySelectorAll('.btn-editar-m').forEach(btn => {
    btn.onclick = () => {
      const item = dados.find(x => x.id == btn.dataset.id);
      if (item) abrirModalManutencao(item);
    };
  });

  container.querySelectorAll('.btn-excluir-m').forEach(btn => {
    btn.onclick = () => deletarManutencao(btn.dataset.id);
  });
}
