// =====================================================================
// ESTADO — único objeto mutável compartilhado entre os módulos.
// A fonte da verdade continua sendo o Postgres; isto é só cache local
// para renderizar a tela sem refazer a consulta a cada clique.
// =====================================================================
export const state = {
  sb: null,        // cliente do Supabase, criado em auth.js::iniciar()
  usuario: null,    // usuário autenticado (ou null)
  dados: { pecas: [], guepar: [], fornecedores: [], manutencoes: [] }
};
