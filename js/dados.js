import { state } from './state.js';
import { conexao } from './utils.js';
import { renderDashboard } from './dashboard.js';
import { renderPecas } from './pecas.js';
import { renderGuepar } from './guepar.js';
import { renderFornecedores } from './fornecedores.js';
import { renderManutencoes } from './manutencoes.js';

export async function carregarTudo() {
  if (!state.sb) return;
  
  conexao('esperando', 'Buscando dados...');

  try {
    const [p, g, f, m] = await Promise.all([
      state.sb.from('pecas').select('*').order('nome'),
      state.sb.from('guepar_uso').select('*').order('nome'),
      state.sb.from('fornecedores').select('*').order('nome'),
      state.sb.from('manutencoes').select('*').order('validade')
    ]);

    if (p.data) state.dados.pecas = p.data;
    if (g.data) state.dados.guepar = g.data;
    if (f.data) state.dados.fornecedores = f.data;
    if (m.data) state.dados.manutencoes = m.data;

    conexao('ok', 'Sincronizado');

    // Renderiza todas as abas sem travar
    renderDashboard();
    if (typeof renderPecas === 'function') renderPecas();
    if (typeof renderGuepar === 'function') renderGuepar();
    if (typeof renderFornecedores === 'function') renderFornecedores();
    if (typeof renderManutencoes === 'function') renderManutencoes();

  } catch (err) {
    console.error('Erro ao carregar dados:', err);
    conexao('erro', 'Erro de conexão');
  }
}

export function ouvirMudancas() {
  if (!state.sb) return;

  try {
    const canal = state.sb.channel('mudancas-schema');
    canal
      .on('postgres_changes', { event: '*', schema: 'public' }, () => {
        carregarTudo();
      })
      .subscribe();
  } catch (e) {
    console.warn('Realtime indisponível ou já ativo:', e);
  }
}
