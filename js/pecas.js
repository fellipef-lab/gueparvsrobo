import { state } from './state.js';
import { esc, statusEstoque, toast, modalConfirma } from './utils.js';
import { gerarRelatorio } from './relatorios.js';
import { carregarTudo } from './dados.js';

export function renderPecas() {
  const container = document.getElementById('aba-pecas');
  if (!container) return;

  const dados = state.dados.pecas || [];

  container.innerHTML = `
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/90 border border-slate-800 p-6 rounded-2xl backdrop-blur-md">
      <div>
        <h1 class="text-2xl font-black text-white">Peças do Robô</h1>
        <p class="text-sm text-gray-400">Inventário de componentes técnicos</p>
      </div>
      <div class="flex items-center space-x-3">
        <button id="btn-relatorio-pecas" class="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold px-4 py-2.5 rounded-xl border border-cyan-500/20 transition">
          <i class="ph ph-printer text-lg"></i>
          <span>Relatório</span>
        </button>
        <button id="btn-nova-peca" class="flex items-center space-x-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-4 py-2.5 rounded-xl transition shadow-lg shadow-cyan-900/30">
          <i class="ph ph-plus-circle text-lg"></i>
          <span>Nova Peça</span>
        </button>
      </div>
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
              <th class="p-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800">
            ${dados.map(p => `
              <tr class="hover:bg-slate-800/30 transition">
                <td class="p-3 font-semibold text-white">${esc(p.nome)}</td>
                <td class="p-3 font-bold">${p.estoque}</td>
                <td class="p-3 text-gray-400">${p.min_estoque}</td>
                <td class="p-3">${statusEstoque(p, ['Esgotado', 'Crítico', 'OK'])}</td>
                <td class="p-3 text-right space-x-2">
                  <button class="btn-editar-p px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-lg text-xs transition" data-id="${p.id}">
                    <i class="ph ph-pencil-simple"></i>
                  </button>
                  <button class="btn-excluir-p px-2.5 py-1.5 bg-slate-800 hover:bg-red-500/20 text-red-400 rounded-lg text-xs transition" data-id="${p.id}">
                    <i class="ph ph-trash"></i>
                  </button>
                </td>
              </tr>
            `).join('') || `<tr><td colspan="5" class="p-4 text-center text-gray-400">Nenhuma peça cadastrada.</td></tr>`}
          </tbody>
        </table>
      </div>
    </div>
  `;

  document.getElementById('btn-relatorio-pecas')?.addEventListener('click', () => gerarRelatorio('pecas'));
  document.getElementById('btn-nova-peca')?.addEventListener('click', () => abrirModal(null));

  container.querySelectorAll('.btn-editar-p').forEach(btn => {
    btn.onclick = () => {
      const item = dados.find(x => x.id == btn.dataset.id);
      if (item) abrirModal(item);
    };
  });

  container.querySelectorAll('.btn-excluir-p').forEach(btn => {
    btn.onclick = () => {
      modalConfirma('Deseja excluir esta peça?', async () => {
        await state.sb.from('pecas').delete().eq('id', btn.dataset.id);
        toast('Peça removida!');
        carregarTudo();
      });
    };
  });
}

function abrirModal(item = null) {
  const container = document.getElementById('container-modais');
  if (!container) return;

  container.innerHTML = `
    <div id="modalP" class="fixed inset-0 bg-slate-950/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div class="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-md w-full space-y-4 shadow-2xl">
        <h3 class="text-lg font-bold text-white">${item ? 'Editar' : 'Nova'} Peça</h3>
        <div>
          <label class="block text-xs uppercase text-gray-400 font-semibold mb-1">Nome da Peça</label>
          <input type="text" id="p-nome" value="${item ? item.nome || '' : ''}" class="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white">
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs uppercase text-gray-400 font-semibold mb-1">Estoque Atual</label>
            <input type="number" id="p-estoque" value="${item ? item.estoque || 0 : 0}" class="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white">
          </div>
          <div>
            <label class="block text-xs uppercase text-gray-400 font-semibold mb-1">Estoque Mínimo</label>
            <input type="number" id="p-min" value="${item ? item.min_estoque || 0 : 0}" class="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white">
          </div>
        </div>
        <div class="flex justify-end space-x-3 pt-2">
          <button onclick="document.getElementById('modalP').remove()" class="px-4 py-2 bg-slate-800 text-gray-300 rounded-lg text-sm font-semibold">Cancelar</button>
          <button id="btn-salvar-p" class="px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm font-semibold">Salvar</button>
        </div>
      </div>
    </div>
  `;

  document.getElementById('btn-salvar-p').onclick = async () => {
    const payload = {
      nome: document.getElementById('p-nome').value,
      estoque: Number(document.getElementById('p-estoque').value),
      min_estoque: Number(document.getElementById('p-min').value)
    };

    if (item && item.id) {
      await state.sb.from('pecas').update(payload).eq('id', item.id);
    } else {
      await state.sb.from('pecas').insert([payload]);
    }

    document.getElementById('modalP').remove();
    toast('Peça salva!');
    carregarTudo();
  };
}
