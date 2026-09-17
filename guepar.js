// =====================================================================
// GUEPAR — tudo que envolve a tabela `guepar_uso`: listar, renderizar,
// abrir o formulário de cadastro/edição e excluir.
// =====================================================================
import { state } from './state.js';
import { $, num, esc, vazio, statusEstoque, toast, abrirModal, fecharModal, confirmar, explicarErro } from './utils.js';
import { carregarTudo } from './dados.js';

const TABELA = 'guepar_uso';

// ---------- Render ----------
export function renderGuepar() {
  const html = state.dados.guepar.map(linha).join('');
  $('tbody-guepar').innerHTML = html || vazio(5, 'Nenhum material cadastrado ainda.');
}

function linha(item) {
  return `<tr class="border-t border-tech-700 hover:bg-tech-700/30 transition-colors">
    <td class="p-4 text-tech-accent font-mono">#G-${item.id}</td>
    <td class="p-4 font-semibold">${esc(item.nome)}</td>
    <td class="p-4">${item.estoque} <span class="text-gray-500 text-sm">/ mín ${item.min_estoque}</span></td>
    <td class="p-4">${statusEstoque(item, ['Falta','Repor','Ok'])}</td>
    <td class="p-4 flex gap-4 justify-center">
      <button onclick="abrirFormGuepar(${item.id})" class="text-blue-400 hover:text-blue-300 font-bold text-sm"><i class="ph ph-pencil-simple mr-1"></i>Editar</button>
      <button onclick="excluirGuepar(${item.id})" class="text-red-400 hover:text-red-300 font-bold text-sm"><i class="ph ph-trash mr-1"></i>Excluir</button>
    </td></tr>`;
}

// ---------- Acesso a dados ----------
async function inserir(registro) {
  const { error } = await state.sb.from(TABELA).insert(registro);
  if (error) { toast(explicarErro(error)); return false; }
  await carregarTudo(); return true;
}
async function atualizar(id, registro) {
  const { error } = await state.sb.from(TABELA).update(registro).eq('id', id);
  if (error) { toast(explicarErro(error)); return false; }
  await carregarTudo(); return true;
}
async function remover(id) {
  const { error } = await state.sb.from(TABELA).delete().eq('id', id);
  if (error) { toast(explicarErro(error)); return false; }
  await carregarTudo(); return true;
}

// ---------- Formulário ----------
export function abrirFormGuepar(id) {
  const reg = id ? state.dados.guepar.find(i => i.id === id) : null;
  $('modalItem-titulo').textContent = reg ? 'Editar material' : 'Cadastrar material Guepar';
  $('modalItem-titulo').className = 'text-2xl font-bold mb-6 ' + (reg ? 'text-tech-accent' : 'text-white');
  $('item-nome').value    = reg ? reg.nome : '';
  $('item-estoque').value = reg ? reg.estoque : '';
  $('item-min').value     = reg ? reg.min_estoque : '';
  $('item-erro').textContent = '';

  $('item-salvar').onclick = async () => {
    const nome = $('item-nome').value.trim();
    const estoque = num($('item-estoque').value);
    const min_estoque = num($('item-min').value);
    if (!nome) return $('item-erro').textContent = 'Informe o nome do item.';
    if (Number.isNaN(estoque) || Number.isNaN(min_estoque)) return $('item-erro').textContent = 'Quantidade e mínimo precisam ser números.';
    if (estoque < 0 || min_estoque < 0) return $('item-erro').textContent = 'Use valores iguais ou maiores que zero.';

    const btn = $('item-salvar'); btn.disabled = true; btn.textContent = 'Salvando...';
    const ok = reg ? await atualizar(reg.id, { nome, estoque, min_estoque }) : await inserir({ nome, estoque, min_estoque });
    btn.disabled = false; btn.textContent = 'Salvar';
    if (ok) { fecharModal('modalItem'); toast(reg ? 'Item atualizado.' : 'Item cadastrado.'); }
  };
  abrirModal('modalItem');
  $('item-nome').focus();
}

// ---------- Exclusão ----------
export function excluirGuepar(id) {
  const reg = state.dados.guepar.find(i => i.id === id);
  confirmar(`Remover “${reg.nome}” do banco? Isso apaga o registro para todos.`, async () => {
    if (await remover(id)) toast('Registro excluído.');
  });
}
