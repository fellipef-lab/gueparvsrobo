export function mostrarApp() {
  $('tela-login').classList.add('hidden');
  $('app').classList.remove('hidden');
  
  // Verifica se o elemento existe antes de tentar atribuir valor
  const elUsuario = $('usuario-atual');
  if (elUsuario && state.usuario) {
    elUsuario.textContent = state.usuario.email;
  }

  const chatBox = $('chat-box');
  if (chatBox) {
    chatBox.innerHTML = '';
    addMensagem('Estou lendo direto do banco. Pergunte o que está faltando ou peça um resumo do estoque.', 'ia');
  }
  
  // Força a abertura da aba Dashboard
  if (typeof ativarAba === 'function') {
    ativarAba('dashboard');
  }
  
  carregarTudo();
  ouvirMudancas();
}