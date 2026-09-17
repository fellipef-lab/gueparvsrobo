// =====================================================================
// DADOS — carrega as três tabelas de uma vez, atualiza o cache em
// state.dados e dispara o render de cada módulo de entidade.
// É o único ponto que "conhece" todos os módulos de domínio.
// =====================================================================
import { state } from './state.js';
import { conexao, toast, explicarErro } from './utils.js';
import { renderDashboard } from './dashboard.js';
import { renderPecas } from './pecas.js';
import { renderGuepar } from './guepar.js';
import { renderFornecedores } from './fornecedores.js';

export async function carregarTudo() {
  const { sb } = state;
  const [p, g, f] = await Promise.all([
    sb.from('pecas').select('*').order('id'),
    sb.from('guepar_uso').select('*').order('id'),
    sb.from('fornecedores').select('*').order('id')
  ]);
  const falha = p.error || g.error || f.error;
  if (falha) { conexao('erro', 'Falha ao carregar'); toast(explicarErro(falha)); return; }

  state.dados = { pecas: p.data, guepar: g.data, fornecedores: f.data };
  renderDashboard();
  renderPecas();
  renderGuepar();
  renderFornecedores();
  conexao('ok', 'Sincronizado');
}

// Mudança feita em qualquer máquina aparece aqui sem recarregar a página.
export function ouvirMudancas() {
  state.sb.channel('painel-guepar')
    .on('postgres_changes', { event: '*', schema: 'public' }, carregarTudo)
    .subscribe(status => {
      if (status === 'SUBSCRIBED') conexao('ok', 'Sincronizado em tempo real');
      if (status === 'CHANNEL_ERROR') conexao('esperando', 'Tempo real indisponível');
    });
}
