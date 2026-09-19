// Gestor de Estado Global da Aplicação
export const state = {
  // Substitui os valores entre aspas pelas tuas credenciais reais do Supabase:
  SUPABASE_URL: 'https://xxxxxxx.supabase.co', 
  SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',               
  
  sb: null,

  usuario: (function() {
    try {
      const saved = localStorage.getItem('guepar_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  })(),

  dados: {
    manutencoes: [],
    pecas: [],
    guepar: [],
    fornecedores: []
  }
};
