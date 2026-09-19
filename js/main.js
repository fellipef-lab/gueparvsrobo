import { state } from './state.js';
import { iniciar as iniciarAuth } from './auth.js';
import { initNav } from './nav.js';
import { carregarTudo } from './dados.js';

document.addEventListener('DOMContentLoaded', async () => {
  if (typeof supabase !== 'undefined' && state.SUPABASE_URL && state.SUPABASE_KEY) {
    state.sb = supabase.createClient(state.SUPABASE_URL, state.SUPABASE_KEY);
  }
  
  initNav();
  await iniciarAuth();
  await carregarTudo();
});
