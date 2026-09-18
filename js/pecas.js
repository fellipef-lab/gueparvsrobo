import { state } from './state.js';
import { $, esc, toast, abrirModal, fecharModal } from './utils.js';

let idEditandoPeca = null;

export function renderPecas() {
    const tbody = $('tbody-pecas');
    if (!tbody) return;

    tbody.innerHTML = (state.dados.pecas || []).map(p => `
        <tr class="border-b border-tech-700 hover:bg-tech-700/30 transition-colors">
            <td class="p-4 text-gray-400">#${p.id}</td>
            <td class="p-4 font-semibold text-white">${esc(p.nome)}</td>
            <td class="p-4 text-gray-300">${p.estoque} / <span class="text-gray-500">${p.min_estoque}</span></td>
            <td class="p-4 text-center">
                <button onclick="editarPeca(${p.id})" class="text-blue-400 hover:text-blue-300 p-1"><i class="ph ph-pencil text-lg"></i></button>
                <button onclick="excluirPeca(${p.id})" class="text-red-400 hover:text-red-300 p-1 ml-2"><i class="ph ph-trash text-lg"></i></button>
            </td>
        </tr>
    `).join('');
}

export function abrirFormPeca(item = null) {
    idEditandoPeca = item ? item.id : null;
    $('modalItem-titulo').textContent = item ? 'Editar Peça' : 'Nova Peça do Robô';
    $('item-nome').value = item ? item.nome : '';
    $('item-estoque').value = item ? item.estoque : 0;
    $('item-min').value = item ? item.min_estoque : 0;
    $('item-erro').textContent = '';

    abrirModal('modalItem');
}

export function editarPeca(id) {
    const item = state.dados.pecas.find(p => p.id === id);
    if (item) abrirFormPeca(item);
}

export async function salvarPeca() {
    const nome = $('item-nome').value.trim();
    const estoque = Math.max(0, parseInt($('item-estoque').value) || 0);
    const min_estoque = Math.max(0, parseInt($('item-min').value) || 0);

    if (!nome) {
        $('item-erro').textContent = 'Informe o nome da peça.';
        return;
    }

    const payload = { nome, estoque, min_estoque };
    let res = idEditandoPeca 
        ? await state.sb.from('pecas').update(payload).eq('id', idEditandoPeca)
        : await state.sb.from('pecas').insert([payload]);

    if (res.error) {
        $('item-erro').textContent = 'Erro ao salvar: ' + res.error.message;
    } else {
        fecharModal('modalItem');
        toast('Peça salva!');
        await state.carregarTudo();
    }
}

export function excluirPeca(id) {
    $('confirma-texto').textContent = 'Deseja excluir esta peça do robô?';
    $('confirma-ok').onclick = async () => {
        const { error } = await state.sb.from('pecas').delete().eq('id', id);
        fecharModal('modalConfirma');
        if (!error) {
            toast('Peça removida!');
            await state.carregarTudo();
        }
    };
    abrirModal('modalConfirma');
}