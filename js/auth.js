import { state } from './state.js';
import { explicarErro, toast } from './utils.js';
import { carregarTudo } from './dados.js';
import { aplicarPermissoesNav } from './nav.js';

export async function iniciar() {
  const formLogin = document.getElementById('form-login');
  const btnSair = document.getElementById('btn-sair');
  const formNovoUsuario = document.getElementById('form-novo-usuario');

  if (formLogin) {
    formLogin.onsubmit = async (e) => {
      e.preventDefault();
      await realizarLogin();
    };
  }

  if (formNovoUsuario) {
    formNovoUsuario.onsubmit = async (e) => {
      e.preventDefault();
      await cadastrarNovoUsuario();
    };
  }

  if (btnSair) {
    btnSair.onclick = async () => {
      if (state.sb && state.sb.auth) {
        await state.sb.auth.signOut();
      }
      localStorage.removeItem('guepar_user');
      localStorage.removeItem('guepar_role');
      state.usuario = null;
      state.role = null;
      alternarTelas(false);
    };
  }

  // Tenta recuperar sessão existente
  if (state.sb && state.sb.auth) {
    try {
      const { data } = await state.sb.auth.getSession();
      if (data?.session) {
        state.usuario = data.session.user;
        localStorage.setItem('guepar_user', JSON.stringify(data.session.user));
        await carregarPerfilEPermissoes();
        alternarTelas(true);
        await carregarTudo();
        return;
      }
    } catch (err) {
      console.warn('Sessão não encontrada:', err);
    }
  }

  if (state.usuario) {
    await carregarPerfilEPermissoes();
    alternarTelas(true);
    await carregarTudo();
    return;
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
      state.usuario = { email };
    }

    localStorage.setItem('guepar_user', JSON.stringify(state.usuario));
    await carregarPerfilEPermissoes();
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

export async function cadastrarNovoUsuario() {
  const emailInput = document.getElementById('novo-email');
  const senhaInput = document.getElementById('novo-senha');
  const roleSelect = document.getElementById('novo-role');

  if (!emailInput || !senhaInput || !roleSelect) return;

  const email = emailInput.value.trim();
  const password = senhaInput.value.trim();
  const role = roleSelect.value;

  try {
    const { data, error } = await state.sb.auth.signUp({ email, password });
    if (error) throw error;

    if (data.user) {
      await state.sb.from('profiles').insert([{ id: data.user.id, email, role }]);
      toast(`Usuário ${email} cadastrado com sucesso!`);
      emailInput.value = '';
      senhaInput.value = '';
    }
  } catch (err) {
    toast(explicarErro(err));
  }
}

export async function carregarPerfilEPermissoes() {
  if (!state.usuario || !state.sb) return;

  try {
    const { data: profile } = await state.sb
      .from('profiles')
      .select('role')
      .eq('id', state.usuario.id)
      .maybeSingle();

    state.role = profile?.role || 'admin';
    localStorage.setItem('guepar_role', state.role);

    const elRole = document.getElementById('usuario-role');
    if (elRole) elRole.textContent = state.role.toUpperCase();

    aplicarPermissoesNav();
  } catch (err) {
    console.warn('Erro ao carregar perfil:', err);
    state.role = 'admin';
    aplicarPermissoesNav();
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
