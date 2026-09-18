import { state } from './state.js';
import { esc, toast, modalConfirma } from './utils.js';
import { gerarRelatorio } from './relatorios.js';
import { carregarTudo } from './dados.js';

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

    <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 backdrop-blur-md mt-6">
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

  document.getElementById('btn-relatorio-guepar')?.addEventListener('click', () => gerarRelatorio('guepar'));
  document.getElementById('btn-novo-guepar')?.addEventListener('click', () => abrirModal(null));

  container.querySelectorAll('.btn-editar-g').forEach(btn => {
    btn.onclick = () => {
      const item = dados.find(x => x.id == btn.dataset.id);
      if (item) abrirModal(item);
    };
  });

  container.querySelectorAll('.btn-excluir-g').forEach(btn => {
    btn.onclick = () => {
      modalConfirma('Deseja excluir este item?', async () => {
        await state.sb.from('guepar_uso').delete().eq('id', btn.dataset.id);
        toast('Item removido!');
        carregarTudo();
      });
    };
  });
}

function abrirModal(item = null) {
  const container = document.getElementById('container-modais');
  if (!container) return;

  container.innerHTML = `
    <div id="modalG" class="fixed inset-0 bg-slate-950/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div class="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-md w-full space-y-4 shadow-2xl">
        <h3 class="text-lg font-bold text-white">${item ? 'Editar' : 'Novo'} Item Guepar</h3>
        <div>
          <label class="block text-xs uppercase text-gray-400 font-semibold mb-1">Nome do Item</label>
          <input type="text" id="g-nome" value="${item ? item.nome || '' : ''}" class="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white">
        </div>
        <div>
          <label class="block text-xs uppercase text-gray-400 font-semibold mb-1">Marca</label>
          <input type="text" id="g-marca" value="${item ? item.marca || '' : ''}" class="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white">
        </div>
        <div>
          <label class="block text-xs uppercase text-gray-400 font-semibold mb-1">Estoque</label>
          <input type="number" id="g-estoque" value="${item ? item.estoque || 0 : 0}" class="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white">
        </div>
        <div class="flex justify-end space-x-3 pt-2">
          <button onclick="document.getElementById('modalG').remove()" class="px-4 py-2 bg-slate-800 text-gray-300 rounded-lg text-sm font-semibold">Cancelar</button>
          <button id="btn-salvar-g" class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold">Salvar</button>
        </div>
      </div>
    </div>
  `;

  document.getElementById('btn-salvar-g').onclick = async () => {
    const payload = {
      nome: document.getElementById('g-nome').value,
      marca: document.getElementById('g-marca').value,
      estoque: Number(document.getElementById('g-estoque').value)
    };

    if (item && item.id) {
      await state.sb.from('guepar_uso').update(payload).eq('id', item.id);
    } else {
      await state.sb.from('guepar_uso').insert([payload]);
    }

    document.getElementById('modalG').remove();
    toast('Item salvo!');
    carregarTudo();
  };
}
