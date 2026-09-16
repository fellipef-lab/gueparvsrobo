// =====================================================================
// AUTENTICAÇÃO — login/logout e o bootstrap do cliente Supabase.
// =====================================================================
import { state } from './state.js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';
import { $ } from './utils.js';
import { explicarErro } from './utils.js';
import { carregarTudo, ouvirMudancas } from './dados.js';
import { carregarManutencoes } from './manutencoes.js';
import { addMensagem } from './chat.js';
import { mudarAba } from './nav.js';

export async function entrar() {
  const email = $('login-email').value.trim();
  const senha = $('login-senha').value;
  if (!email || !senha) { $('login-erro').textContent = 'Preencha e-mail e senha.'; return; }

  const btn = $('btn-entrar'); btn.disabled = true; btn.textContent = 'Entrando...';
  const { error } = await state.sb.auth.signInWithPassword({ email, password: senha });
  btn.disabled = false; btn.textContent = 'Entrar';

  if (error) {
    $('login-erro').textContent = /Invalid login/i.test(error.message)
      ? 'E-mail ou senha incorretos.'
      : /Email not confirmed/i.test(error.message)
        ? 'Esse e-mail ainda não foi confirmado no Supabase.'
        : explicarErro(error);
  }
}

export function mostrarApp() {
  $('tela-login').classList.add('hidden');
  $('app').classList.remove('hidden');
  $('usuario-atual').textContent = state.usuario.email;
  $('chat-box').innerHTML = '';
  addMensagem('Estou lendo direto do banco. Pergunte o que está faltando ou peça um resumo do estoque.', 'ia');
  mudarAba((location.hash || '#dashboard').slice(1));
  carregarTudo();
  carregarManutencoes();
  ouvirMudancas();
}

export function mostrarLogin() {
  $('app').classList.add('hidden');
  $('tela-login').classList.remove('hidden');
  $('login-senha').value = '';
  $('login-erro').textContent = '';
  $('login-email').focus();
}

function iniciarEventos() {
  $('btn-entrar').onclick = entrar;
  ['login-email','login-senha'].forEach(id => $(id).addEventListener('keydown', e => { if (e.key === 'Enter') entrar(); }));
  $('btn-sair').onclick = () => state.sb.auth.signOut();
}

// Cria o cliente Supabase e liga o listener de sessão.
// Se as chaves não foram preenchidas, mostra a tela de configuração pendente.
export function iniciar() {
  if (SUPABASE_URL.startsWith('COLE') || SUPABASE_ANON_KEY.startsWith('COLE')) {
    $('tela-config').classList.remove('hidden');
    return;
  }
  iniciarEventos();
  state.sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // A sessão fica guardada pelo próprio SDK, então recarregar não desloga.
  state.sb.auth.onAuthStateChange((evento, sessao) => {
    state.usuario = sessao?.user ?? null;
    if (state.usuario) mostrarApp(); else mostrarLogin();
  });

  state.sb.auth.getSession().then(({ data }) => {
    state.usuario = data.session?.user ?? null;
    if (state.usuario) mostrarApp(); else mostrarLogin();
  });
}
