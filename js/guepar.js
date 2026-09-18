import { state } from './state.js';
import { $, esc, toast, abrirModal, fecharModal } from './utils.js';

let idEditandoGuepar = null;

export function renderGuepar() {
    const tbody = $('tbody-guepar');
    if (!tbody) return;

    tbody.innerHTML = (state.dados.guepar || []).map(g => `
        <tr class="border-b border-tech-700 hover:bg-tech-700/30 transition-colors">
            <td class="p-4 text-gray-400">#${g.id}</td>
            <td class="p-4 font-semibold text-white">${esc(g.nome)}</td>
            <td class="p-4 text-gray-300">${esc(g.marca || '-')}</td>
            <td class="p-4 font-bold text-tech-accent">${g.estoque}</td>
            <td class="p-4 text-center">
                <button onclick="editarGuepar(${g.id})" class="text-blue-400 hover:text-blue-300 p-1"><i class="ph ph-pencil text-lg"></i></button>
                <button onclick="excluirGuepar(${g.id})" class="text-red-400 hover:text-red-300 p-1 ml-2"><i class="ph ph-trash text-lg"></i></button>
            </td>
        </tr>
    `).join('');
}

export function abrirFormGuepar(item = null) {
    idEditandoGuepar = item ? item.id : null;
    $('modalGuepar-titulo').textContent = item ? 'Editar Item Guepar' : 'Novo Item Guepar';
    $('guepar-nome').value = item ? item.nome : '';
    $('guepar-marca').value = item ? item.marca || '' : '';
    $('guepar-estoque').value = item ? item.estoque : 0;
    $('guepar-erro').textContent = '';

    abrirModal('modalGuepar');
}

export function editarGuepar(id) {
    const item = state.dados.guepar.find(g => g.id === id);
    if (item) abrirFormGuepar(item);
}

export async function salvarGuepar() {
    const nome = $('guepar-nome').value.trim();
    const marca = $('guepar-marca').value.trim();
    const estoque = Math.max(0, parseInt($('guepar-estoque').value) || 0);

    if (!nome) {
        $('guepar-erro').textContent = 'Informe o nome do item.';
        return;
    }

    const payload = { nome, marca, estoque };
    let res = idEditandoGuepar 
        ? await state.sb.from('guepar_uso').update(payload).eq('id', idEditandoGuepar)
        : await state.sb.from('guepar_uso').insert([payload]);

    if (res.error) {
        $('guepar-erro').textContent = 'Erro ao salvar: ' + res.error.message;
    } else {
        fecharModal('modalGuepar');
        toast('Item salvo!');
        await state.carregarTudo();
    }
}

export function excluirGuepar(id) {
    $('confirma-texto').textContent = 'Deseja excluir este item do Guepar Uso?';$('confirma-ok').onclick = async () => {
        const { error } = await state.sb.from('guepar_uso').delete().eq('id', id);
        fecharModal('modalConfirma');
        if (!error) {
            toast('Item removido!');
            await state.carregarTudo();
        }
    };
    abrirModal('modalConfirma');
}