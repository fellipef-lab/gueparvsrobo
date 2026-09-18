import { iniciar } from './auth.js';
import { iniciarNav, ativarAba } from './nav.js';
import { carregarTudo } from './dados.js';

document.addEventListener('DOMContentLoaded', async () => {
  await iniciar();
  iniciarNav();
  ativarAba('dashboard');
  carregarTudo();
});
