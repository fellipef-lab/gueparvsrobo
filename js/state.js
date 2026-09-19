// Gestor de Estado Global da Aplicação
export const state = {
  // Configurações da API Supabase
  SUPABASE_URL: 'https://sua-url-do-supabase.supabase.co', // Substitua pela sua URL real do Supabase
  SUPABASE_KEY: 'sua-chave-anon-key-aqui',               // Substitua pela sua Anon Key real do Supabase
  
  // Instância do cliente Supabase (criada no main.js / auth.js)
  sb: null,

  // Recupera o usuário salvo no navegador (evita pedir login a todo F5)
  usuario: (function() {
    try {
      const saved = localStorage.getItem('guepar_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  })(),

  // Armazenamento local de cache das tabelas do banco de dados
  dados: {
    manutencoes: [],
    pecas: [],
    guepar: [],
    fornecedores: []
  }
};
