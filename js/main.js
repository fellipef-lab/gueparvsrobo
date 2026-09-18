import { iniciar } from './auth.js';
import { iniciarNav, ativarAba } from './nav.js';
import { carregarTudo } from './dados.js';

document.addEventListener('DOMContentLoaded', async () => {
  // Inicializa autenticação e estado do Supabase
  await iniciar();

  // Ativa os cliques nos botões do menu lateral
  iniciarNav();

  // Define Dashboard como inicial e carrega o banco
  ativarAba('dashboard');
  carregarTudo();
});
