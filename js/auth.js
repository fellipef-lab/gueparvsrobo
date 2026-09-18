import { state } from './state.js';
import { toast } from './utils.js';
import { carregarTudo, ouvirMudancas } from './dados.js';

export async function iniciar() {
  const btnLogin = document.getElementById('btn-login');
  const btnSair = document.getElementById('btn-sair');

  if (btnLogin) {
    btnLogin.onclick = async (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email')?.value;
      const password = document.getElementById('login-senha')?.value;

      if (!email || !password) {
        toast('Preencha e-mail e senha.');
        return;
      }

      const { data, error } = await state.sb.auth.signInWithPassword({ email, password });

      if (error) {
        toast(error.message || 'Erro ao fazer login.');
        return;
      }

      await mostrarApp(data.session);
    };
  }

  if (btnSair) {
    btnSair.onclick = async () => {
      await state.sb.auth.signOut();
      window.location.reload();
    };
  }

  const { data: { session } } = await state.sb.auth.getSession();
  if (session) {
    await mostrarApp(session);
  }
}

async function mostrarApp(session) {
  state.usuario = session.user;
  
  const telaLogin = document.getElementById('tela-login');
  const telaApp = document.getElementById('tela-app');
  const usuarioEmail = document.getElementById('usuario-email');

  // Garante a troca de telas ANTES de qualquer chamada assíncrona
  if (telaLogin) telaLogin.classList.add('hidden');
  if (telaApp) telaApp.classList.remove('hidden');
  if (usuarioEmail) usuarioEmail.textContent = session.user.email;

  await carregarTudo();
  ouvirMudancas();
}
