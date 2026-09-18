import { state } from './state.js';
import { esc, toast, modalConfirma } from './utils.js';
import { gerarRelatorio } from './relatorios.js';
import { carregarTudo } from './dados.js';

export function renderFornecedores() {
  const container = document.getElementById('aba-fornecedores');
  if (!container) return;

  const dados = state.dados.fornecedores || [];

  container.innerHTML = `
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/90 border border-slate-800 p-6 rounded-2xl backdrop-blur-md">
      <div>
        <h1 class="text-2xl font-black text-white">Diretório de Fornecedores</h1>
        <p class="text-sm text-gray-400">Parceiros e contatos cadastrados</p>
      </div>
      <div class="flex items-center space-x-3">
        <button id="btn-relatorio-fornecedores" class="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold px-4 py-2.5 rounded-xl border border-emerald-500/20 transition">
          <i class="ph ph-printer text-lg"></i>
          <span>Relatório</span>
        </button>
        <button id="btn-novo-fornecedor" class="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2.5 rounded-xl transition shadow-lg shadow-emerald-900/30">
          <i class="ph ph-plus-circle text-lg"></i>
          <span>Novo Fornecedor</span>
        </button>
      </div>
    </div>

    <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 backdrop-blur-md mt-6">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm text-gray-300">
          <thead class="bg-slate-800/60 text-xs uppercase text-gray-400 border-b border-slate-700">
            <tr>
              <th class="p-3">Empresa</th>
              <th class="p-3">CNPJ</th>
              <th class="p-3">Contato</th>
              <th class="p-3">Telefone</th>
              <th class="p-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800">
            ${dados.map(f => `
              <tr class="hover:bg-slate-800/30 transition">
                <td class="p-3 font-semibold text-white">${esc(f.nome)}</td>
                <td class="p-3">${esc(f.cnpj || '-')}</td>
                <td class="p-3">${esc(f.contato || '-')}</td>
                <td class="p-3 font-mono text-cyan-400">${esc(f.telefone || '-')}</td>
                <td class="p-3 text-right space-x-2">
                  <button class="btn-editar-f px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-lg text-xs transition" data-id="${f.id}">
                    <i class="ph ph-pencil-simple"></i>
                  </button>
                  <button class="btn-excluir-f px-2.5 py-1.5 bg-slate-800 hover:bg-red-500/20 text-red-400 rounded-lg text-xs transition" data-id="${f.id}">
                    <i class="ph ph-trash"></i>
                  </button>
                </td>
              </tr>
            `).join('') || `<tr><td colspan="5" class="p-4 text-center text-gray-400">Nenhum fornecedor encontrado.</td></tr>`}
          </tbody>
        </table>
      </div>
    </div>
  `;

  document.getElementById('btn-relatorio-fornecedores')?.addEventListener('click', () => gerarRelatorio('fornecedores'));
  document.getElementById('btn-novo-fornecedor')?.addEventListener('click', () => abrirModal(null));

  container.querySelectorAll('.btn-editar-f').forEach(btn => {
    btn.onclick = () => {
      const item = dados.find(x => x.id == btn.dataset.id);
      if (item) abrirModal(item);
    };
  });

  container.querySelectorAll('.btn-excluir-f').forEach(btn => {
    btn.onclick = () => {
      modalConfirma('Deseja excluir este fornecedor?', async () => {
        await state.sb.from('fornecedores').delete().eq('id', btn.dataset.id);
        toast('Fornecedor removido!');
        carregarTudo();
      });
    };
  });
}

function abrirModal(item = null) {
  const container = document.getElementById('container-modais');
  if (!container) return;

  container.innerHTML = `
    <div id="modalF" class="fixed inset-0 bg-slate-950/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div class="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-md w-full space-y-4 shadow-2xl">
        <h3 class="text-lg font-bold text-white">${item ? 'Editar' : 'Novo'} Fornecedor</h3>
        <div>
          <label class="block text-xs uppercase text-gray-400 font-semibold mb-1">Empresa</label>
          <input type="text" id="f-nome" value="${item ? item.nome || '' : ''}" class="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white">
        </div>
        <div>
          <label class="block text-xs uppercase text-gray-400 font-semibold mb-1">CNPJ</label>
          <input type="text" id="f-cnpj" value="${item ? item.cnpj || '' : ''}" class="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white">
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs uppercase text-gray-400 font-semibold mb-1">Contato</label>
            <input type="text" id="f-contato" value="${item ? item.contato || '' : ''}" class="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white">
          </div>
          <div>
            <label class="block text-xs uppercase text-gray-400 font-semibold mb-1">Telefone</label>
            <input type="text" id="f-telefone" value="${item ? item.telefone || '' : ''}" class="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white">
          </div>
        </div>
        <div class="flex justify-end space-x-3 pt-2">
          <button onclick="document.getElementById('modalF').remove()" class="px-4 py-2 bg-slate-800 text-gray-300 rounded-lg text-sm font-semibold">Cancelar</button>
          <button id="btn-salvar-f" class="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold">Salvar</button>
        </div>
      </div>
    </div>
  `;

  document.getElementById('btn-salvar-f').onclick = async () => {
    const payload = {
      nome: document.getElementById('f-nome').value,
      cnpj: document.getElementById('f-cnpj').value,
      contato: document.getElementById('f-contato').value,
      telefone: document.getElementById('f-telefone').value
    };

    if (item && item.id) {
      await state.sb.from('fornecedores').update(payload).eq('id', item.id);
    } else {
      await state.sb.from('fornecedores').insert([payload]);
    }

    document.getElementById('modalF').remove();
    toast('Fornecedor salvo!');
    carregarTudo();
  };
}
