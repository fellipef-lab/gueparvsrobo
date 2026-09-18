import { renderDashboard } from './dashboard.js';
import { renderPecas } from './pecas.js';
import { renderGuepar } from './guepar.js';
import { renderFornecedores } from './fornecedores.js';
import { renderManutencoes } from './manutencoes.js';

export const state = {
  sb: null,
  usuario: null,
  dados: {
    pecas: [],
    guepar: [],
    fornecedores: [],
    manutencoes: []
  },
  async carregarTudo() {
    if (!this.sb) return;
    try {
      const [p, g, f, m] = await Promise.all([
        this.sb.from('pecas').select('*').order('nome'),
        this.sb.from('guepar_uso').select('*').order('nome'),
        this.sb.from('fornecedores').select('*').order('nome'),
        this.sb.from('manutencoes').select('*').order('validade')
      ]);

      if (p.data) this.dados.pecas = p.data;
      if (g.data) this.dados.guepar = g.data;
      if (f.data) this.dados.fornecedores = f.data;
      if (m.data) this.dados.manutencoes = m.data;

      if (typeof renderDashboard === 'function') renderDashboard();
      if (typeof renderPecas === 'function') renderPecas();
      if (typeof renderGuepar === 'function') renderGuepar();
      if (typeof renderFornecedores === 'function') renderFornecedores();
      if (typeof renderManutencoes === 'function') renderManutencoes();
    } catch (err) {
      console.error('Erro ao carregar dados do Supabase:', err);
    }
  }
};