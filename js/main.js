import { state } from './state.js';
import { iniciar as iniciarAuth, carregarPerfilEPermissoes } from './auth.js';
import { initNav, aplicarPermissoesNav } from './nav.js';
import { carregarTudo } from './dados.js';

document.addEventListener('DOMContentLoaded', async () => {
  // Inicializa o cliente do Supabase
  if (typeof supabase !== 'undefined' && state.SUPABASE_URL && state.SUPABASE_KEY) {
    state.sb = supabase.createClient(state.SUPABASE_URL, state.SUPABASE_KEY);
  }

  // Inicializa o menu de navegação
  initNav();

  // Inicializa a autenticação e sessão do utilizador
  await iniciarAuth();

  // Se o utilizador estiver autenticado, carrega os dados e ajusta as permissões
  if (state.usuario) {
    await carregarPerfilEPermissoes();
    aplicarPermissoesNav();
    await carregarTudo();
  }
});
