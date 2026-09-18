import { renderDashboard } from './dashboard.js';
import { renderPecas } from './pecas.js';
import { renderGuepar } from './guepar.js';
import { renderFornecedores } from './fornecedores.js';
import { renderManutencoes } from './manutencoes.js';

export function ativarAba(nomeAba) {
  // Esconde todas as abas
  document.querySelectorAll('.conteudo-aba').forEach(el => el.classList.add('hidden'));

  // Remove destaque de todos os botões do menu
  document.querySelectorAll('.btn-aba').forEach(btn => {
    btn.classList.remove('bg-cyan-600/20', 'text-cyan-400', 'border-r-4', 'border-cyan-400');
    btn.classList.add('text-gray-400');
  });

  // Exibe a aba pretendida
  const abaAlvo = document.getElementById(`aba-${nomeAba}`);
  if (abaAlvo) {
    abaAlvo.classList.remove('hidden');
  }

  // Destaque no botão ativo
  const btnAtivo = document.querySelector(`.btn-aba[data-aba="${nomeAba}"]`);
  if (btnAtivo) {
    btnAtivo.classList.remove('text-gray-400');
    btnAtivo.classList.add('bg-cyan-600/20', 'text-cyan-400', 'border-r-4', 'border-cyan-400');
  }

  // Executa o renderizador da aba clicada
  if (nomeAba === 'dashboard') renderDashboard();
  if (nomeAba === 'pecas') renderPecas();
  if (nomeAba === 'guepar') renderGuepar();
  if (nomeAba === 'fornecedores') renderFornecedores();
  if (nomeAba === 'manutencoes') renderManutencoes();
}

export function iniciarNav() {
  document.querySelectorAll('.btn-aba').forEach(btn => {
    btn.onclick = (e) => {
      e.preventDefault();
      const aba = btn.getAttribute('data-aba');
      if (aba) ativarAba(aba);
    };
  });
}
