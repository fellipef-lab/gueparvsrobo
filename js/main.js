import { iniciar } from './auth.js';
import { iniciarNav, ativarAba } from './nav.js';
import { carregarTudo } from './dados.js';

document.addEventListener('DOMContentLoaded', async () => {
  // Inicializa o sistema e escuta a sessão
  await iniciar();
  
  // Configura os cliques do menu
  iniciarNav();
  
  // Força a exibição e o carregamento do Dashboard por padrão
  ativarAba('dashboard');
  carregarTudo();
});
