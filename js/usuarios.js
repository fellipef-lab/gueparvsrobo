// Função para criar novo utilizador vinculando o nível de permissão
async function criarNovoUsuario(email, password, role) {
  // 1. Regista no Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password
  });

  if (error) {
    alert("Erro ao criar utilizador: " + error.message);
    return;
  }

  // 2. Guarda o nível de acesso (admin, operador, visitante) na tabela 'profiles'
  if (data.user) {
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([{ id: data.user.id, email: email, role: role }]);

    if (profileError) {
      alert("Utilizador criado, mas falhou ao definir perfil: " + profileError.message);
    } else {
      alert(`Utilizador ${email} criado com sucesso como ${role.toUpperCase()}!`);
    }
  }
}

// Função para verificar se o utilizador logado é Visitante e ocultar botões de apagar/editar
async function aplicarRestricoesDePerfil() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  // Busca o perfil do utilizador logado
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile && profile.role === 'visitante') {
    // Esconde todos os botões de criar, editar ou apagar
    const botoesRestritos = document.querySelectorAll('.btn-delete, .btn-edit, .btn-create, #btnNovaPeca, #btnNovoUso');
    botoesRestritos.forEach(btn => btn.style.display = 'none');
  }
}
