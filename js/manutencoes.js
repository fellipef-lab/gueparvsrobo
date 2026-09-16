// =====================================================================
// MANUTENÇÕES — controle de validade/revisão de peças e materiais.
// Segue o mesmo padrão de pecas.js / guepar.js / fornecedores.js:
// usa state.sb (o cliente já conectado), não o `supabase` global da CDN.
// =====================================================================
import { state } from './state.js';
import { $, esc, toast, confirmar, explicarErro } from './utils.js';

const TABELA = 'manutencoes';

// Guarda qual registro está sendo editado (null = cadastro novo).
let editandoId = null;

// ---------- Regra de alerta por data ----------
function verificarAlerta(dataValidade) {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0); // zera a hora para comparar só o dia

  const vencimento = new Date(dataValidade + 'T00:00:00'); // evita bug de fuso horário
  const diffDias = Math.ceil((vencimento - hoje) / (1000 * 60 * 60 * 24));

  if (diffDias < 0) return { cor: 'text-red-500', aviso: ' (Vencido!)' };
  if (diffDias <= 7) return { cor: 'text-yellow-400', aviso: ` (Vence em ${diffDias} dias)` };
  return { cor: 'text-green-500', aviso: ' (No prazo)' };
}

const formatarData = iso => iso ? iso.split('-').reverse().join('/') : '—';

// ---------- Modal ----------
// Sem id: abre em branco para cadastrar. Com id: pré-preenche para editar.
export function abrirModalManutencao(id) {
  const reg = id ? state.dados.manutencoes.find(i => i.id === id) : null;
  editandoId = reg ? reg.id : null;

  $('modal-manutencao-titulo').textContent = reg ? 'Editar manutenção' : 'Agendar Manutenção';
  $('manu-nome').value = reg ? reg.nome : '';
  $('manu-tipo').value = reg ? reg.tipo : 'bateria';
  $('manu-ultima-troca').value = reg ? (reg.ultima_troca || '') : '';
  $('manu-validade').value = reg ? reg.validade : '';
  $('manu-erro').textContent = '';

  $('modal-manutencao').classList.remove('hidden');
  $('modal-manutencao').classList.add('flex');
}

export function fecharModalManutencao() {
  $('modal-manutencao').classList.add('hidden');
  $('modal-manutencao').classList.remove('flex');
  $('manu-nome').value = '';
  $('manu-tipo').value = 'bateria';
  $('manu-ultima-troca').value = '';
  $('manu-validade').value = '';
  editandoId = null;
}

// ---------- Render ----------
export async function carregarManutencoes() {
  const { data, error } = await state.sb.from(TABELA).select('*').order('validade', { ascending: true });
  if (error) { toast(explicarErro(error)); return; }

  state.dados.manutencoes = data;
  renderManutencoes();
}

function renderManutencoes() {
  const tbody = $('tabela-manutencoes');
  if (!tbody) return; // a aba pode não estar montada ainda

  const data = state.dados.manutencoes;
  tbody.innerHTML = data.length
    ? data.map(linha).join('')
    : '<tr><td colspan="5" class="p-8 text-center text-gray-400">Nenhuma manutenção agendada.</td></tr>';
}

function linha(item) {
  const alerta = verificarAlerta(item.validade);
  return `<tr class="hover:bg-tech-900/40 transition-colors border-b border-gray-800">
    <td class="p-4 text-gray-200">${esc(item.nome)}</td>
    <td class="p-4 capitalize text-gray-400">${esc(item.tipo)}</td>
    <td class="p-4 text-gray-400">${formatarData(item.ultima_troca)}</td>
    <td class="p-4 font-bold ${alerta.cor}">${formatarData(item.validade)} <span class="text-xs font-normal">${alerta.aviso}</span></td>
    <td class="p-4 text-right whitespace-nowrap">
      <button onclick="abrirModalManutencao(${item.id})" class="text-blue-400 hover:text-blue-300 p-2 rounded hover:bg-blue-500/10 transition-colors"><i class="ph ph-pencil-simple text-xl"></i></button>
      <button onclick="deletarManutencao(${item.id})" class="text-red-500 hover:text-red-400 p-2 rounded hover:bg-red-500/10 transition-colors"><i class="ph ph-trash text-xl"></i></button>
    </td>
  </tr>`;
}

// ---------- Salvar (cadastra novo ou atualiza o que estiver em edição) ----------
export async function salvarManutencao() {
  const nome = $('manu-nome').value.trim();
  const tipo = $('manu-tipo').value;
  const ultima_troca = $('manu-ultima-troca').value || null;
  const validade = $('manu-validade').value;

  if (!nome || !validade) { $('manu-erro').textContent = 'Preencha o nome e a data de validade.'; return; }

  const registro = { nome, tipo, ultima_troca, validade };
  const { error } = editandoId
    ? await state.sb.from(TABELA).update(registro).eq('id', editandoId)
    : await state.sb.from(TABELA).insert([registro]);

  if (error) { $('manu-erro').textContent = explicarErro(error); return; }

  const eraEdicao = !!editandoId;
  fecharModalManutencao();
  await carregarManutencoes();
  toast(eraEdicao ? 'Manutenção atualizada.' : 'Manutenção agendada.');
}

// ---------- Excluir ----------
export function deletarManutencao(id) {
  const reg = state.dados.manutencoes.find(i => i.id === id);
  confirmar(`Excluir o agendamento de “${reg?.nome ?? 'manutenção'}”?`, async () => {
    const { error } = await state.sb.from(TABELA).delete().eq('id', id);
    if (error) { toast(explicarErro(error)); return; }
    await carregarManutencoes();
    toast('Agendamento excluído.');
  });
}
