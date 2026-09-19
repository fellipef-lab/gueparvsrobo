// Gestor de Estado Global da Aplicação
export const state = {
  // A sua URL real extraída do seu projeto:
  SUPABASE_URL: 'https://vmqkutpgigftsbangesu.supabase.co', 
  
  // A sua chave publishable/anon que acabou de copiar:
  SUPABASE_KEY: 'sb_publishable_0tmGHhKQ00r7yTom2-0TQQ_J3tWKrMc',               
  
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
