import { state } from './state.js';
import { aplicarPermissoesNav } from './nav.js';

export async function carregarPerfilEPermissoes() {
  if (!state.usuario || !state.sb) return;

  try {
    const { data: profile } = await state.sb
      .from('profiles')
      .select('role')
      .eq('id', state.usuario.id)
      .maybeSingle();

    // Se não encontrar no banco, assume admin para a sua conta principal
    state.role = profile?.role || 'admin';
    localStorage.setItem('guepar_role', state.role);

    // Atualiza o texto visual do role no rodapé da sidebar
    const elRole = document.getElementById('usuario-role');
    if (elRole) elRole.textContent = state.role.toUpperCase();

    // EXIBE A ABA USUÁRIOS CASO SEJA ADMIN
    aplicarPermissoesNav();

  } catch (err) {
    console.warn('Não foi possível carregar o perfil:', err);
    state.role = 'admin';
    aplicarPermissoesNav();
  }
}
