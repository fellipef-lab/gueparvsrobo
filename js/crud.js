import { state } from './state.js';
import { toast, modalConfirma } from './utils.js';
import { carregarTudo } from './dados.js';

// --- MANUTENÇÕES ---
export function abrirModalManutencao(item = null) {
  const container = document.getElementById('container-modais');
  if (!container) return;

  container.innerHTML = `
    <div id="modalM" class="fixed inset-0 bg-slate-950/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div class="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-md w-full space-y-4 shadow-2xl">
        <h3 class="text-lg font-bold text-white">${item ? 'Editar' : 'Nova'} Manutenção</h3>
        <input type="hidden" id="m-id" value="${item ? item.id : ''}">
        <div>
          <label class="block text-xs uppercase text-gray-400 font-semibold mb-1">Equipamento</label>
          <input type="text" id="m-nome" value="${item ? item.nome || '' : ''}" class="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white">
        </div>
        <div>
          <label class="block text-xs uppercase text-gray-400 font-semibold mb-1">Tipo</label>
          <input type="text" id="m-tipo" value="${item ? item.tipo || '' : ''}" class="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white">
        </div>
        <div>
          <label class="block text-xs uppercase text-gray-400 font-semibold mb-1">Última Troca</label>
          <input type="date" id="m-troca" value="${item ? item.ultima_troca || '' : ''}" class="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white">
        </div>
        <div>
          <label class="block text-xs uppercase text-gray-400 font-semibold mb-1">Validade</label>
          <input type="date" id="m-validade" value="${item ? item.validade || '' : ''}" class="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white">
        </div>
        <div class="flex justify-end space-x-3 pt-2">
          <button onclick="document.getElementById('modalM').remove()" class="px-4 py-2 bg-slate-800 text-gray-300 rounded-lg text-sm font-semibold">Cancelar</button>
          <button id="btn-salvar-m" class="px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm font-semibold">Salvar</button>
        </div>
      </div>
    </div>
  `;

  document.getElementById('btn-salvar-m').onclick = async () => {
    const id = document.getElementById('m-id').value;
    const payload = {
      nome: document.getElementById('m-nome').value,
      tipo: document.getElementById('m-tipo').value,
      ultima_troca: document.getElementById('m-troca').value || null,
      validade: document.getElementById('m-validade').value || null
    };

    if (id) {
      await state.sb.from('manutencoes').update(payload).eq('id', id);
    } else {
      await state.sb.from('manutencoes').insert([payload]);
    }
    
    document.getElementById('modalM').remove();
    toast('Manutenção salva!');
    carregarTudo();
  };
}

export function deletarManutencao(id) {
  modalConfirma('Deseja excluir esta manutenção?', async () => {
    await state.sb.from('manutencoes').delete().eq('id', id);
    toast('Manutenção removida!');
    carregarTudo();
  });
}

// --- PEÇAS DO ROBÔ ---
export function abrirModalPeca(item = null) {
  const container = document.getElementById('container-modais');
  if (!container) return;

  container.innerHTML = `
    <div id="modalP" class="fixed inset-0 bg-slate-950/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div class="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-md w-full space-y-4 shadow-2xl">
        <h3 class="text-lg font-bold text-white">${item ? 'Editar' : 'Nova'} Peça</h3>
        <input type="hidden" id="p-id" value="${item ? item.id : ''}">
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
    const id = document.getElementById('p-id').value;
    const payload = {
      nome: document.getElementById('p-nome').value,
      estoque: Number(document.getElementById('p-estoque').value),
      min_estoque: Number(document.getElementById('p-min').value)
    };

    if (id) {
      await state.sb.from('pecas').update(payload).eq('id', id);
    } else {
      await state.sb.from('pecas').insert([payload]);
    }
    
    document.getElementById('modalP').remove();
    toast('Peça salva!');
    carregarTudo();
  };
}

export function deletarPeca(id) {
  modalConfirma('Deseja excluir esta peça?', async () => {
    await state.sb.from('pecas').delete().eq('id', id);
    toast('Peça removida!');
    carregarTudo();
  });
}

// --- GUEPAR USO ---
export function abrirModalGuepar(item = null) {
  const container = document.getElementById('container-modais');
  if (!container) return;

  container.innerHTML = `
    <div id="modalG" class="fixed inset-0 bg-slate-950/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div class="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-md w-full space-y-4 shadow-2xl">
        <h3 class="text-lg font-bold text-white">${item ? 'Editar' : 'Novo'} Item Guepar</h3>
        <input type="hidden" id="g-id" value="${item ? item.id : ''}">
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
    const id = document.getElementById('g-id').value;
    const payload = {
      nome: document.getElementById('g-nome').value,
      marca: document.getElementById('g-marca').value,
      estoque: Number(document.getElementById('g-estoque').value)
    };

    if (id) {
      await state.sb.from('guepar_uso').update(payload).eq('id', id);
    } else {
      await state.sb.from('guepar_uso').insert([payload]);
    }
    
    document.getElementById('modalG').remove();
    toast('Item salvo!');
    carregarTudo();
  };
}

export function deletarGuepar(id) {
  modalConfirma('Deseja excluir este item?', async () => {
    await state.sb.from('guepar_uso').delete().eq('id', id);
    toast('Item removido!');
    carregarTudo();
  });
}

// --- FORNECEDORES ---
export function abrirModalFornecedor(item = null) {
  const container = document.getElementById('container-modais');
  if (!container) return;

  container.innerHTML = `
    <div id="modalF" class="fixed inset-0 bg-slate-950/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div class="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-md w-full space-y-4 shadow-2xl">
        <h3 class="text-lg font-bold text-white">${item ? 'Editar' : 'Novo'} Fornecedor</h3>
        <input type="hidden" id="f-id" value="${item ? item.id : ''}">
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
    const id = document.getElementById('f-id').value;
    const payload = {
      nome: document.getElementById('f-nome').value,
      cnpj: document.getElementById('f-cnpj').value,
      contato: document.getElementById('f-contato').value,
      telefone: document.getElementById('f-telefone').value
    };

    if (id) {
      await state.sb.from('fornecedores').update(payload).eq('id', id);
    } else {
      await state.sb.from('fornecedores').insert([payload]);
    }
    
    document.getElementById('modalF').remove();
    toast('Fornecedor salvo!');
    carregarTudo();
  };
}

export function deletarFornecedor(id) {
  modalConfirma('Deseja excluir este fornecedor?', async () => {
    await state.sb.from('fornecedores').delete().eq('id', id);
    toast('Fornecedor removido!');
    carregarTudo();
  });
}
