// =====================================================================
// FORNECEDORES — tudo que envolve a tabela `fornecedores`: listar,
// renderizar, abrir o formulário de cadastro/edição e excluir.
// =====================================================================
import { state } from './state.js';
import { $, esc, vazio, toast, abrirModal, fecharModal, confirmar, explicarErro } from './utils.js';
import { carregarTudo } from './dados.js';

const TABELA = 'fornecedores';

// ---------- Render ----------
export function renderFornecedores() {
  const html = state.dados.fornecedores.map(linha).join('');
  $('tbody-fornecedores').innerHTML = html || vazio(6, 'Nenhum fornecedor cadastrado.');
}

function linha(f) {
  return `<tr class="border-t border-tech-700 hover:bg-tech-700/30 transition-colors">
    <td class="p-4 text-tech-accent font-mono">#F-${f.id}</td>
    <td class="p-4 font-semibold">${esc(f.nome)}</td>
    <td class="p-4 text-gray-300">${esc(f.cnpj) || '-'}</td>
    <td class="p-4">${esc(f.contato)}</td>
    <td class="p-4">${esc(f.telefone)}</td>
    <td class="p-4 flex gap-4 justify-center">
      <button onclick="abrirFormForn(${f.id})" class="text-blue-400 hover:text-blue-300 font-bold text-sm"><i class="ph ph-pencil-simple mr-1"></i>Editar</button>
      <button onclick="excluirForn(${f.id})" class="text-red-400 hover:text-red-300 font-bold text-sm"><i class="ph ph-trash mr-1"></i>Excluir</button>
    </td>
  </tr>`;
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
export function abrirFormForn(id) {
  const reg = id ? state.dados.fornecedores.find(f => f.id === id) : null;
  $('modalForn-titulo').textContent = reg ? 'Editar fornecedor' : 'Cadastrar fornecedor';
  $('modalForn-titulo').className = 'text-2xl font-bold mb-6 ' + (reg ? 'text-tech-accent' : 'text-white');
  $('forn-nome').value     = reg ? reg.nome : '';
  $('forn-cnpj').value     = reg ? (reg.cnpj || '') : '';
  $('forn-contato').value  = reg ? (reg.contato || '') : '';
  $('forn-telefone').value = reg ? (reg.telefone || '') : '';
  $('forn-erro').textContent = '';

  $('forn-salvar').onclick = async () => {
    const registro = {
      nome: $('forn-nome').value.trim(),
      cnpj: $('forn-cnpj').value.trim(),
      contato: $('forn-contato').value.trim(),
      telefone: $('forn-telefone').value.trim()
    };
    if (!registro.nome) return $('forn-erro').textContent = 'Informe o nome da empresa.';
    if (!registro.contato || !registro.telefone) return $('forn-erro').textContent = 'Contato e telefone são obrigatórios.';

    const btn = $('forn-salvar'); btn.disabled = true; btn.textContent = 'Salvando...';
    const ok = reg ? await atualizar(reg.id, registro) : await inserir(registro);
    btn.disabled = false; btn.textContent = 'Salvar';
    if (ok) { fecharModal('modalForn'); toast(reg ? 'Fornecedor atualizado.' : 'Fornecedor cadastrado.'); }
  };
  abrirModal('modalForn');
  $('forn-nome').focus();
}

// ---------- Exclusão ----------
export function excluirForn(id) {
  const reg = state.dados.fornecedores.find(i => i.id === id);
  confirmar(`Remover “${reg.nome}” do banco? Isso apaga o registro para todos.`, async () => {
    if (await remover(id)) toast('Registro excluído.');
  });
}
