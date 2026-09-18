import { state } from './state.js';

// Função de escape local para não depender do utils.js
function escLocal(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function gerarRelatorio(tipo) {
  const dados = state.dados[tipo] || [];
  const titulos = {
    manutencoes: 'Relatório de Manutenções',
    pecas: 'Relatório de Peças do Robô',
    guepar: 'Relatório Guepar Uso',
    fornecedores: 'Relatório de Fornecedores'
  };

  const win = window.open('', '_blank');
  if (!win) return;

  let tabelaHTML = '';

  if (tipo === 'manutencoes') {
    tabelaHTML = `
      <table>
        <thead>
          <tr><th>Equipamento</th><th>Tipo</th><th>Última Troca</th><th>Validade</th></tr>
        </thead>
        <tbody>
          ${dados.map(m => `
            <tr>
              <td>${escLocal(m.nome)}</td>
              <td>${escLocal(m.tipo || '-')}</td>
              <td>${m.ultima_troca ? m.ultima_troca.split('-').reverse().join('/') : '-'}</td>
              <td>${m.validade ? m.validade.split('-').reverse().join('/') : '-'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  } else if (tipo === 'pecas') {
    tabelaHTML = `
      <table>
        <thead>
          <tr><th>Peça</th><th>Estoque Atual</th><th>Estoque Mínimo</th></tr>
        </thead>
        <tbody>
          ${dados.map(p => `
            <tr>
              <td>${escLocal(p.nome)}</td>
              <td>${p.estoque}</td>
              <td>${p.min_estoque}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  } else if (tipo === 'guepar') {
    tabelaHTML = `
      <table>
        <thead>
          <tr><th>Item</th><th>Marca</th><th>Estoque</th></tr>
        </thead>
        <tbody>
          ${dados.map(g => `
            <tr>
              <td>${escLocal(g.nome)}</td>
              <td>${escLocal(g.marca || '-')}</td>
              <td>${g.estoque}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  } else if (tipo === 'fornecedores') {
    tabelaHTML = `
      <table>
        <thead>
          <tr><th>Empresa</th><th>CNPJ</th><th>Contato</th><th>Telefone</th></tr>
        </thead>
        <tbody>
          ${dados.map(f => `
            <tr>
              <td>${escLocal(f.nome)}</td>
              <td>${escLocal(f.cnpj || '-')}</td>
              <td>${escLocal(f.contato || '-')}</td>
              <td>${escLocal(f.telefone || '-')}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  win.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>${titulos[tipo] || 'Relatório'}</title>
      <style>
        body { font-family: sans-serif; padding: 20px; color: #333; }
        h1 { border-bottom: 2px solid #0891b2; padding-bottom: 8px; color: #0891b2; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 10px; text-align: left; font-size: 14px; }
        th { background-color: #f1f5f9; font-weight: bold; }
        tr:nth-child(even) { background-color: #f8fafc; }
      </style>
    </head>
    <body>
      <h1>${titulos[tipo] || 'Relatório'}</h1>
      <p>Gerado em: ${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR')}</p>
      ${tabelaHTML}
      <script>window.print();</script>
    </body>
    </html>
  `);
  win.document.close();
}
