import { state } from './state.js';
import { toast } from './utils.js';
import { carregarTudo } from './dados.js';

export async function iniciar() {
  const formLogin = document.getElementById('form-login');
  const btnLogin = document.getElementById('btn-login');
  const btnSair = document.getElementById('btn-sair');

  // Função para processar o login
  const realizarLogin = async () => {
    const email = document.getElementById('login-email')?.value;
    const password = document.getElementById('login-senha')?.value;

    if (!email || !password) {
      toast('Preencha e-mail e senha.');
      return;
    }

    try {
      toast('A autenticar...');
      const { data, error } = await state.sb.auth.signInWithPassword({ email, password });

      if (error) {
        toast(error.message || 'Credenciais inválidas.');
        return;
      }

      mostrarApp(data.session);
    } catch (err) {
      console.error(err);
      toast('Erro ao ligar ao servidor.');
    }
  };

  // Escuta no Formulário (se existir)
  if (formLogin) {
    formLogin.onsubmit = (e) => {
      e.preventDefault();
      realizarLogin();
    };
  }

  // Escuta diretamente no Botão
  if (btnLogin) {
    btnLogin.onclick = (e) => {
      e.preventDefault();
      realizarLogin();
    };
  }

  if (btnSair) {
    btnSair.onclick = async () => {
      await state.sb.auth.signOut();
      window.location.reload();
    };
  }

  // Verifica se o utilizador já tem sessão ativa
  const { data: { session } } = await state.sb.auth.getSession();
  if (session) {
    mostrarApp(session);
  }
}

function mostrarApp(session) {
  if (session) state.usuario = session.user;
  
  const telaLogin = document.getElementById('tela-login');
  const telaApp = document.getElementById('tela-app');
  const usuarioEmail = document.getElementById('usuario-email');

  if (telaLogin) telaLogin.classList.add('hidden');
  if (telaApp) telaApp.classList.remove('hidden');
  if (usuarioEmail && session) usuarioEmail.textContent = session.user.email;

  carregarTudo();
}
