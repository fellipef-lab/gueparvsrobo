import { state } from './state.js';
import { conexao, toast, explicarErro } from './utils.js';
import { renderDashboard } from './dashboard.js';
import { renderPecas } from './pecas.js';
import { renderGuepar } from './guepar.js';
import { renderFornecedores } from './fornecedores.js';
import { renderManutencoes } from './manutencoes.js';

export async function carregarTudo() {
  const { sb } = state;
  if (!sb) return;

  try {
    const [p, g, f, m] = await Promise.all([
      sb.from('pecas').select('*').order('id'),
      sb.from('guepar_uso').select('*').order('id'),
      sb.from('fornecedores').select('*').order('id'),
      sb.from('manutencoes').select('*').order('validade')
    ]);

    const falha = p.error || g.error || f.error || m.error;
    if (falha) { 
      conexao('erro', 'Falha ao carregar'); 
      toast(explicarErro(falha)); 
      return; 
    }

    state.dados = { 
      pecas: p.data || [], 
      guepar: g.data || [], 
      fornecedores: f.data || [], 
      manutencoes: m.data || [] 
    };

    if (typeof renderDashboard === 'function') renderDashboard();
    if (typeof renderPecas === 'function') renderPecas();
    if (typeof renderGuepar === 'function') renderGuepar();
    if (typeof renderFornecedores === 'function') renderFornecedores();
    if (typeof renderManutencoes === 'function') renderManutencoes();
    
    conexao('ok', 'Sincronizado');
  } catch (e) {
    console.error('Erro ao carregar dados:', e);
  }
}

let canalRealtime = null;

export function ouvirMudancas() {
  if (canalRealtime || !state.sb) return;

  canalRealtime = state.sb.channel('painel-guepar')
    .on('postgres_changes', { event: '*', schema: 'public' }, () => carregarTudo())
    .subscribe(status => {
      if (status === 'SUBSCRIBED') conexao('ok', 'Sincronizado em tempo real');
      if (status === 'CHANNEL_ERROR') conexao('esperando', 'Tempo real indisponível');
    });
}