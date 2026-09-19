import { state } from './state.js';
import { renderDashboard } from './dashboard.js';
import { renderManutencoes } from './manutencoes.js';
import { renderGuepar } from './guepar.js';
import { renderPecas } from './pecas.js';
import { renderFornecedores } from './fornecedores.js';
import { conexao } from './utils.js';

export async function carregarTudo() {
  conexao('esperando', 'A carregar dados...');

  try {
    if (!state.sb) {
      conexao('erro', 'Sem conexão');
      return;
    }

    // Busca dados em paralelo nas tabelas do Supabase
    const [mRes, pRes, gRes, fRes] = await Promise.all([
      state.sb.from('manutencoes').select('*').order('created_at', { ascending: false }),
      state.sb.from('pecas').select('*').order('created_at', { ascending: false }),
      state.sb.from('guepar_uso').select('*').order('created_at', { ascending: false }),
      state.sb.from('fornecedores').select('*').order('created_at', { ascending: false })
    ]);

    state.dados.manutencoes = mRes.data || [];
    state.dados.pecas = pRes.data || [];
    state.dados.guepar = gRes.data || [];
    state.dados.fornecedores = fRes.data || [];

    // Renderiza cada secção da interface
    if (typeof renderDashboard === 'function') renderDashboard();
    if (typeof renderManutencoes === 'function') renderManutencoes();
    if (typeof renderGuepar === 'function') renderGuepar();
    if (typeof renderPecas === 'function') renderPecas();
    if (typeof renderFornecedores === 'function') renderFornecedores();

    conexao('ok', 'Sincronizado');
  } catch (err) {
    console.error('Erro ao carregar dados:', err);
    conexao('erro', 'Erro ao sincronizar');
  }
}
