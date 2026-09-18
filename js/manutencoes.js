import { state } from './state.js';
import { $, esc, toast, abrirModal, fecharModal } from './utils.js';

let idEditandoManu = null;

export function renderManutencoes() {
    const tbody = $('tabela-manutencoes');
    if (!tbody) return;

    const hoje = new Date();
    hoje.setHours(0,0,0,0);

    tbody.innerHTML = (state.dados.manutencoes || []).map(m => {
        const diff = Math.ceil((new Date(m.validade + 'T00:00:00') - hoje) / (1000 * 60 * 60 * 24));
        let badge = '<span class="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded font-bold">No prazo</span>';
        if (diff < 0) badge = '<span class="bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded font-bold">Vencido</span>';
        else if (diff <= 7) badge = '<span class="bg-yellow-500/20 text-yellow-400 text-xs px-2 py-1 rounded font-bold">Atenção</span>';

        const uTroca = m.ultima_troca ? m.ultima_troca.split('-').reverse().join('/') : '-';
        const val = m.validade ? m.validade.split('-').reverse().join('/') : '-';

        return `
            <tr class="border-b border-tech-700 hover:bg-tech-700/30 transition-colors">
                <td class="p-4 font-semibold text-white">${esc(m.nome)}</td>
                <td class="p-4 text-gray-300 capitalize">${esc(m.tipo)}</td>
                <td class="p-4 text-gray-400">${uTroca}</td>
                <td class="p-4">${val} ${badge}</td>
                <td class="p-4 text-center">
                    <button onclick="editarManutencao(${m.id})" class="text-blue-400 hover:text-blue-300 p-1"><i class="ph ph-pencil text-lg"></i></button>
                    <button onclick="deletarManutencao(${m.id})" class="text-red-400 hover:text-red-300 p-1 ml-2"><i class="ph ph-trash text-lg"></i></button>
                </td>
            </tr>
        `;
    }).join('');
}

export function abrirModalManutencao(item = null) {
    idEditandoManu = item ? item.id : null;
    $('modal-manutencao-titulo').textContent = item ? 'Editar Manutenção' : 'Agendar Manutenção';
    $('manu-nome').value = item ? item.nome : '';
    $('manu-tipo').value = item ? item.tipo : 'bateria';
    $('manu-ultima-troca').value = item ? item.ultima_troca || '' : '';
    $('manu-validade').value = item ? item.validade || '' : '';
    $('manu-erro').textContent = '';

    abrirModal('modal-manutencao');
}

export function fecharModalManutencao() {
    fecharModal('modal-manutencao');
}

export function editarManutencao(id) {
    const item = state.dados.manutencoes.find(m => m.id === id);
    if (item) abrirModalManutencao(item);
}

export async function salvarManutencao() {
    const nome = $('manu-nome').value.trim();
    const tipo = $('manu-tipo').value;
    const ultima_troca = $('manu-ultima-troca').value || null;
    const validade = $('manu-validade').value;

    if (!nome || !validade) {
        $('manu-erro').textContent = 'Preencha o Nome e a Data de Validade.';
        return;
    }

    const payload = { nome, tipo, ultima_troca, validade };
    let res;

    if (idEditandoManu) {
        res = await state.sb.from('manutencoes').update(payload).eq('id', idEditandoManu);
    } else {
        res = await state.sb.from('manutencoes').insert([payload]);
    }

    if (res.error) {
        $('manu-erro').textContent = 'Erro ao salvar: ' + res.error.message;
    } else {
        fecharModal('modal-manutencao');
        toast('Manutenção salva!');
        state.carregarTudo();
    }
}

export function deletarManutencao(id) {
    $('confirma-texto').textContent = 'Deseja excluir este agendamento de manutenção?';
    $('confirma-ok').onclick = async () => {
        const { error } = await state.sb.from('manutencoes').delete().eq('id', id);
        fecharModal('modalConfirma');
        if (!error) {
            toast('Registro removido!');
            state.carregarTudo();
        }
    };
    abrirModal('modalConfirma');
}