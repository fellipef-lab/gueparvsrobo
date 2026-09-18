import { state } from './state.js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';
import { $, explicarErro } from './utils.js';
import { carregarTudo, ouvirMudancas } from './dados.js';
import { addMensagem } from './chat.js';
import { ativarAba } from './nav.js';

export async function entrar() {
  const email = $('login-email')?.value.trim();
  const senha = $('login-senha')?.value;
  if (!email || !senha) { 
    if ($('login-erro')) $('login-erro').textContent = 'Preencha e-mail e senha.'; 
    return; 
  }

  const btn = $('btn-entrar'); 
  if (btn) { btn.disabled = true; btn.textContent = 'Entrando...'; }

  const { error } = await state.sb.auth.signInWithPassword({ email, password: senha });
  
  if (btn) { btn.disabled = false; btn.textContent = 'Entrar'; }

  if (error && $('login-erro')) {
    $('login-erro').textContent = /Invalid login/i.test(error.message)
      ? 'E-mail ou senha incorretos.'
      : /Email not confirmed/i.test(error.message)
        ? 'Esse e-mail ainda não foi confirmado no Supabase.'
        : explicarErro(error);
  }
}

export function mostrarApp() {
  $('tela-login')?.classList.add('hidden');
  $('app')?.classList.remove('hidden');
  
  const elUser = $('usuario-atual');
  if (elUser && state.usuario) elUser.textContent = state.usuario.email;

  const chatBox = $('chat-box');
  if (chatBox) {
    chatBox.innerHTML = '';
    addMensagem('Estou lendo direto do banco. Pergunte o que está faltando ou peça um resumo do estoque.', 'ia');
  }
  
  if (typeof ativarAba === 'function') {
    ativarAba('dashboard');
  }
  
  carregarTudo();
  ouvirMudancas();
}

export function mostrarLogin() {
  $('app')?.classList.add('hidden');
  $('tela-login')?.classList.remove('hidden');
  if ($('login-senha')) $('login-senha').value = '';
  if ($('login-erro')) $('login-erro').textContent = '';
  $('login-email')?.focus();
}

function iniciarEventos() {
  if ($('btn-entrar')) $('btn-entrar').onclick = entrar;
  ['login-email','login-senha'].forEach(id => {
    $(id)?.addEventListener('keydown', e => { if (e.key === 'Enter') entrar(); });
  });
  if ($('btn-sair')) $('btn-sair').onclick = () => state.sb.auth.signOut();
}

export function iniciar() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY || SUPABASE_URL.startsWith('COLE') || SUPABASE_ANON_KEY.startsWith('COLE')) {
    $('tela-config')?.classList.remove('hidden');
    return;
  }
  
  iniciarEventos();
  state.sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  state.sb.auth.onAuthStateChange((evento, sessao) => {
    state.usuario = sessao?.user ?? null;
    if (state.usuario) mostrarApp(); else mostrarLogin();
  });

  state.sb.auth.getSession().then(({ data }) => {
    state.usuario = data.session?.user ?? null;
    if (state.usuario) mostrarApp(); else mostrarLogin();
  });
}