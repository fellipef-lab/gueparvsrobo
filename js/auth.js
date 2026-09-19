import { state } from './state.js';
import { explicarErro, toast } from './utils.js';
import { carregarTudo } from './dados.js';

export async function iniciar() {
  const formLogin = document.getElementById('form-login');
  const btnSair = document.getElementById('btn-sair');

  if (formLogin) {
    formLogin.onsubmit = async (e) => {
      e.preventDefault();
      await realizarLogin();
    };
  }

  if (btnSair) {
    btnSair.onclick = async () => {
      if (state.sb && state.sb.auth) {
        await state.sb.auth.signOut();
      }
      localStorage.removeItem('guepar_user');
      state.usuario = null;
      alternarTelas(false);
    };
  }

  // Se já existir utilizador guardado em cache, entra direto
  if (state.usuario) {
    alternarTelas(true);
    await carregarTudo();
    return;
  }

  // Tenta recuperar sessão do Supabase
  if (state.sb && state.sb.auth) {
    try {
      const { data } = await state.sb.auth.getSession();
      if (data?.session) {
        state.usuario = data.session.user;
        localStorage.setItem('guepar_user', JSON.stringify(data.session.user));
        alternarTelas(true);
        await carregarTudo();
        return;
      }
    } catch (err) {
      console.warn('Sessão não encontrada:', err);
    }
  }

  alternarTelas(false);
}

export async function realizarLogin() {
  const emailInput = document.getElementById('login-email');
  const senhaInput = document.getElementById('login-senha');
  const btnLogin = document.getElementById('btn-login');

  if (!emailInput || !senhaInput) return;

  const email = emailInput.value.trim();
  const password = senhaInput.value.trim();

  if (!email || !password) {
    toast('Preencha todos os campos.');
    return;
  }

  if (btnLogin) {
    btnLogin.disabled = true;
    btnLogin.innerText = 'A entrar...';
  }

  try {
    if (!state.sb && typeof supabase !== 'undefined' && state.SUPABASE_URL && state.SUPABASE_KEY) {
      state.sb = supabase.createClient(state.SUPABASE_URL, state.SUPABASE_KEY);
    }

    if (state.sb && state.sb.auth) {
      const { data, error } = await state.sb.auth.signInWithPassword({ email, password });
      if (error) throw error;
      state.usuario = data.user;
    } else {
      // Fallback local se o Supabase não responder
      state.usuario = { email };
    }

    localStorage.setItem('guepar_user', JSON.stringify(state.usuario));
    alternarTelas(true);
    await carregarTudo();
  } catch (err) {
    toast(explicarErro(err));
  } finally {
    if (btnLogin) {
      btnLogin.disabled = false;
      btnLogin.innerText = 'Entrar no Sistema';
    }
  }
}

export function alternarTelas(logado) {
  const telaLogin = document.getElementById('tela-login');
  const telaApp = document.getElementById('tela-app');
  const usuarioEmail = document.getElementById('usuario-email');

  if (logado) {
    if (telaLogin) telaLogin.classList.add('hidden');
    if (telaApp) telaApp.classList.remove('hidden');
    if (usuarioEmail) usuarioEmail.textContent = state.usuario?.email || 'fellipe.f@grupodime.com.br';
  } else {
    if (telaApp) telaApp.classList.add('hidden');
    if (telaLogin) telaLogin.classList.remove('hidden');
  }
}
