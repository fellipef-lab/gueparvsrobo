// =====================================================================
// GUEPAR — tudo que envolve a tabela `guepar_uso`: listar, renderizar,
// abrir o formulário de cadastro/edição e excluir.
// Este item não usa "qtd. mínima" (diferente de Peças) — só nome, marca
// e quantidade em estoque.
// =====================================================================
import { state } from './state.js';
import { $, num, esc, vazio, toast, abrirModal, fecharModal, confirmar, explicarErro } from './utils.js';
import { carregarTudo } from './dados.js';

const TABELA = 'guepar_uso';

// ---------- Render ----------
export function renderGuepar() {
  const html = state.dados.guepar.map(linha).join('');
  $('tbody-guepar').innerHTML = html || vazio(6, 'Nenhum material cadastrado ainda.');
}

function statusGuepar(item) {
  return item.estoque <= 0
    ? '<span class="text-red-500 bg-red-500/10 px-2 py-1 rounded text-sm font-bold">Falta</span>'
    : '<span class="text-green-500 bg-green-500/10 px-2 py-1 rounded text-sm font-bold">Ok</span>';
}

function linha(item) {
  return `<tr class="border-t border-tech-700 hover:bg-tech-700/30 transition-colors">
    <td class="p-4 text-tech-accent font-mono">#G-${item.id}</td>
    <td class="p-4 font-semibold">${esc(item.nome)}</td>
    <td class="p-4 text-gray-300">${esc(item.marca) || '-'}</td>
    <td class="p-4">${item.estoque}</td>
    <td class="p-4">${statusGuepar(item)}</td>
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
  $('modalGuepar-titulo').textContent = reg ? 'Editar material' : 'Cadastrar material Guepar';
  $('modalGuepar-titulo').className = 'text-2xl font-bold mb-6 ' + (reg ? 'text-tech-accent' : 'text-white');
  $('guepar-nome').value    = reg ? reg.nome : '';
  $('guepar-marca').value   = reg ? (reg.marca || '') : '';
  $('guepar-estoque').value = reg ? reg.estoque : '';
  $('guepar-erro').textContent = '';

  $('guepar-salvar').onclick = async () => {
    const nome = $('guepar-nome').value.trim();
    const marca = $('guepar-marca').value.trim();
    const estoque = num($('guepar-estoque').value);
    if (!nome) return $('guepar-erro').textContent = 'Informe o nome do item.';
    if (Number.isNaN(estoque)) return $('guepar-erro').textContent = 'Quantidade precisa ser um número.';
    if (estoque < 0) return $('guepar-erro').textContent = 'Use um valor igual ou maior que zero.';

    const btn = $('guepar-salvar'); btn.disabled = true; btn.textContent = 'Salvando...';
    const registro = { nome, marca, estoque };
    const ok = reg ? await atualizar(reg.id, registro) : await inserir(registro);
    btn.disabled = false; btn.textContent = 'Salvar';
    if (ok) { fecharModal('modalGuepar'); toast(reg ? 'Item atualizado.' : 'Item cadastrado.'); }
  };
  abrirModal('modalGuepar');
  $('guepar-nome').focus();
}

// ---------- Exclusão ----------
export function excluirGuepar(id) {
  const reg = state.dados.guepar.find(i => i.id === id);
  confirmar(`Remover “${reg.nome}” do banco? Isso apaga o registro para todos.`, async () => {
    if (await remover(id)) toast('Registro excluído.');
  });
}
