import { state } from './state.js';
import { esc, toast, modalConfirma } from './utils.js';
import { gerarRelatorio } from './relatorios.js';
import { carregarTudo } from './dados.js';

export function renderManutencoes() {
  const container = document.getElementById('aba-manutencoes');
  if (!container) return;

  const dados = state.dados.manutencoes || [];
  const isVisitante = state.role === 'visitante';

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
        ${!isVisitante ? `
          <button id="btn-nova-manutencao" class="flex items-center space-x-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-4 py-2.5 rounded-xl transition shadow-lg shadow-cyan-900/30">
            <i class="ph ph-plus-circle text-lg"></i>
            <span>Nova Manutenção</span>
          </button>
        ` : ''}
      </div>
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
              ${!isVisitante ? `<th class="p-3 text-right">Ações</th>` : ''}
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800">
            ${dados.map(m => `
              <tr class="hover:bg-slate-800/30 transition">
                <td class="p-3 font-semibold text-white">${esc(m.nome)}</td>
                <td class="p-3 capitalize">${esc(m.tipo || '-')}</td>
                <td class="p-3">${m.ultima_troca ? m.ultima_troca.split('-').reverse().join('/') : '-'}</td>
                <td class="p-3 font-semibold text-cyan-400">${m.validade ? m.validade.split('-').reverse().join('/') : '-'}</td>
                ${!isVisitante ? `
                  <td class="p-3 text-right space-x-2">
                    <button class="btn-editar-m px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-lg text-xs transition" data-id="${m.id}">
                      <i class="ph ph-pencil-simple"></i>
                    </button>
                    <button class="btn-excluir-m px-2.5 py-1.5 bg-slate-800 hover:bg-red-500/20 text-red-400 rounded-lg text-xs transition" data-id="${m.id}">
                      <i class="ph ph-trash"></i>
                    </button>
                  </td>
                ` : ''}
              </tr>
            `).join('') || `<tr><td colspan="${isVisitante ? 4 : 5}" class="p-4 text-center text-gray-400">Nenhum registro encontrado.</td></tr>`}
          </tbody>
        </table>
      </div>
    </div>
  `;

  document.getElementById('btn-relatorio-manutencao')?.addEventListener('click', () => gerarRelatorio('manutencoes'));
  document.getElementById('btn-nova-manutencao')?.addEventListener('click', () => abrirModal(null));

  container.querySelectorAll('.btn-editar-m').forEach(btn => {
    btn.onclick = () => {
      const item = dados.find(x => x.id == btn.dataset.id);
      if (item) abrirModal(item);
    };
  });

  container.querySelectorAll('.btn-excluir-m').forEach(btn => {
    btn.onclick = () => {
      modalConfirma('Deseja excluir esta manutenção?', async () => {
        await state.sb.from('manutencoes').delete().eq('id', btn.dataset.id);
        toast('Manutenção removida!');
        carregarTudo();
      });
    };
  });
}

function abrirModal(item = null) {
  const container = document.getElementById('container-modais');
  if (!container) return;

  const tipoAtual = item?.tipo || 'Bateria';

  container.innerHTML = `
    <div id="modalM" class="fixed inset-0 bg-slate-950/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div class="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-md w-full space-y-4 shadow-2xl">
        <h3 class="text-lg font-bold text-white">${item ? 'Editar' : 'Nova'} Manutenção</h3>
        
        <div>
          <label class="block text-xs uppercase text-gray-400 font-semibold mb-1">Equipamento</label>
          <input type="text" id="m-nome" value="${item ? esc(item.nome || '') : ''}" placeholder="Ex: Robô 1" class="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500">
        </div>

        <div>
          <label class="block text-xs uppercase text-gray-400 font-semibold mb-1">Tipo</label>
          <select id="m-tipo" class="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500">
            <option value="Bateria" ${tipoAtual === 'Bateria' ? 'selected' : ''}>Bateria</option>
            <option value="Graxa" ${tipoAtual === 'Graxa' ? 'selected' : ''}>Graxa</option>
            <option value="Rodinha" ${tipoAtual === 'Rodinha' ? 'selected' : ''}>Rodinha</option>
            <option value="Revisão Geral" ${tipoAtual === 'Revisão Geral' || tipoAtual === 'Geral' ? 'selected' : ''}>Revisão Geral</option>
          </select>
        </div>

        <div>
          <label class="block text-xs uppercase text-gray-400 font-semibold mb-1">Última Troca</label>
          <input type="date" id="m-troca" value="${item ? item.ultima_troca || '' : ''}" class="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500">
        </div>

        <div>
          <label class="block text-xs uppercase text-gray-400 font-semibold mb-1">Validade</label>
          <input type="date" id="m-validade" value="${item ? item.validade || '' : ''}" class="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500">
        </div>

        <div class="flex justify-end space-x-3 pt-2">
          <button onclick="document.getElementById('modalM').remove()" class="px-4 py-2 bg-slate-800 text-gray-300 hover:bg-slate-700 rounded-lg text-sm font-semibold transition">Cancelar</button>
          <button id="btn-salvar-m" class="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-sm font-semibold transition shadow-lg shadow-cyan-950/50">Salvar</button>
        </div>
      </div>
    </div>
  `;

  document.getElementById('btn-salvar-m').onclick = async () => {
    const nome = document.getElementById('m-nome').value.trim();
    if (!nome) {
      toast('Preencha o nome do equipamento.');
      return;
    }

    const payload = {
      nome: nome,
      tipo: document.getElementById('m-tipo').value,
      ultima_troca: document.getElementById('m-troca').value || null,
      validade: document.getElementById('m-validade').value || null
    };

    if (item && item.id) {
      await state.sb.from('manutencoes').update(payload).eq('id', item.id);
    } else {
      await state.sb.from('manutencoes').insert([payload]);
    }

    document.getElementById('modalM').remove();
    toast('Manutenção salva!');
    carregarTudo();
  };
}
