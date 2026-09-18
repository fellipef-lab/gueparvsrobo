import { state } from './state.js';
import { $, esc, toast, abrirModal, fecharModal } from './utils.js';

let idEditandoForn = null;

export function renderFornecedores() {
    const tbody = $('tbody-fornecedores');
    if (!tbody) return;

    tbody.innerHTML = (state.dados.fornecedores || []).map(f => `
        <tr class="border-b border-tech-700 hover:bg-tech-700/30 transition-colors">
            <td class="p-4 text-gray-400">#${f.id}</td>
            <td class="p-4 font-semibold text-white">${esc(f.nome)}</td>
            <td class="p-4 text-gray-300">${esc(f.cnpj || '-')}</td>
            <td class="p-4 text-gray-300">${esc(f.contato || '-')}</td>
            <td class="p-4 text-gray-300">${esc(f.telefone || '-')}</td>
            <td class="p-4 text-center">
                <button onclick="editarForn(${f.id})" class="text-blue-400 hover:text-blue-300 p-1"><i class="ph ph-pencil text-lg"></i></button>
                <button onclick="excluirForn(${f.id})" class="text-red-400 hover:text-red-300 p-1 ml-2"><i class="ph ph-trash text-lg"></i></button>
            </td>
        </tr>
    `).join('');
}

export function abrirFormForn(item = null) {
    idEditandoForn = item ? item.id : null;
    $('modalForn-titulo').textContent = item ? 'Editar Fornecedor' : 'Novo Fornecedor';
    $('forn-nome').value = item ? item.nome : '';
    $('forn-cnpj').value = item ? item.cnpj || '' : '';
    $('forn-contato').value = item ? item.contato || '' : '';
    $('forn-telefone').value = item ? item.telefone || '' : '';
    $('forn-erro').textContent = '';

    abrirModal('modalForn');
}

export function editarForn(id) {
    const item = state.dados.fornecedores.find(f => f.id === id);
    if (item) abrirFormForn(item);
}

export async function salvarForn() {
    const nome = $('forn-nome').value.trim();
    const cnpj = $('forn-cnpj').value.trim();
    const contato = $('forn-contato').value.trim();
    const telefone = $('forn-telefone').value.trim();

    if (!nome) {
        $('forn-erro').textContent = 'Informe o nome da empresa.';
        return;
    }

    const payload = { nome, cnpj, contato, telefone };
    let res = idEditandoForn 
        ? await state.sb.from('fornecedores').update(payload).eq('id', idEditandoForn)
        : await state.sb.from('fornecedores').insert([payload]);

    if (res.error) {
        $('forn-erro').textContent = 'Erro ao salvar: ' + res.error.message;
    } else {
        fecharModal('modalForn');
        toast('Fornecedor salvo!');
        await state.carregarTudo();
    }
}

export function excluirForn(id) {
    $('confirma-texto').textContent = 'Deseja excluir este fornecedor?';$('confirma-ok').onclick = async () => {
        const { error } = await state.sb.from('fornecedores').delete().eq('id', id);
        fecharModal('modalConfirma');
        if (!error) {
            toast('Fornecedor removido!');
            await state.carregarTudo();
        }
    };
    abrirModal('modalConfirma');
}