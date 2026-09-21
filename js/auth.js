import { state } from './state.js';
import { explicarErro, toast } from './utils.js';
import { carregarTudo } from './dados.js';

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

  // Evento para o formulário de cadastrar novos utilizadores
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

  // Tenta recuperar sessão do Supabase
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

  // Se já existir utilizador guardado em cache
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

// Função para o Administrador cadastrar novos utilizadores com Nível de Acesso
export async function cadastrarNovoUsuario() {
  const emailInput = document.getElementById('novo-email');
  const senhaInput = document.getElementById('novo-senha');
  const roleSelect = document.getElementById('novo-role');

  if (!emailInput || !senhaInput || !roleSelect) return;

  const email = emailInput.value.trim();
  const password = senhaInput.value.trim();
  const role = roleSelect.value;

  if (!email || !password) {
    toast('Preencha o e-mail e a palavra-passe do novo utilizador.');
    return;
  }

  try {
    const { data, error } = await state.sb.auth.signUp({ email, password });
    if (error) throw error;

    if (data.user) {
      // Regista o nível de acesso na tabela profiles
      await state.sb.from('profiles').insert([{ id: data.user.id, email, role }]);
      toast(`Utilizador ${email} criado como ${role.toUpperCase()} com sucesso!`);
      emailInput.value = '';
      senhaInput.value = '';
    }
  } catch (err) {
    toast(explicarErro(err));
  }
}

// Carrega o perfil do banco e esconde os botões para 'visitante'
export async function carregarPerfilEPermissoes() {
  if (!state.usuario || !state.sb) return;

  try {
    const { data: profile } = await state.sb
      .from('profiles')
      .select('role')
      .eq('id', state.usuario.id)
      .maybeSingle();

    state.role = profile?.role || 'operador';
    localStorage.setItem('guepar_role', state.role);

    // Se o perfil for 'visitante', oculta os botões de criar, editar e apagar
    if (state.role === 'visitante') {
      document.querySelectorAll('.btn-delete, .btn-edit, .btn-novo, button[type="submit"]').forEach(el => {
        el.style.display = 'none';
      });
    }
  } catch (err) {
    console.warn('Não foi possível carregar o perfil:', err);
  }
}

export function alternarTelas(logado) {
  const telaLogin = document.getElementById('tela-login');
  const telaApp = document.getElementById('tela-app');
  const usuarioEmail = document.getElementById('usuario-email');

  if (logado) {
    if (telaLogin) telaLogin.classList.add('hidden');
    if (telaApp) telaApp.classList.remove('hidden');
    if (usuarioEmail) usuarioEmail.textContent = state.usuario?.email || 'utilizador@grupodime.com.br';
  } else {
    if (telaApp) telaApp.classList.add('hidden');
    if (telaLogin) telaLogin.classList.remove('hidden');
  }
}
