import { state } from './state.js';
import { esc } from './utils.js';

export function gerarRelatorio(tipo = 'tudo') {
    const area = document.getElementById('area-impressao');
    if (!area) return;

    const dataHoje = new Date().toLocaleDateString('pt-BR');
    let html = `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #111; background: #fff;">
            <h1 style="text-align: center; margin-bottom: 5px;">Painel Guepar vs RobÔ</h1>
            <p style="text-align: center; color: #555; margin-top: 0;">Relatório de Estoque e Manutenção — Gerado em ${dataHoje}</p>
            <hr style="margin: 20px 0; border: 0; border-top: 1px solid #ccc;">
    `;

    if (tipo === 'tudo' || tipo === 'manutencoes') {
        html += `
            <h2 style="color: #007acc; border-bottom: 2px solid #007acc; padding-bottom: 4px;">1. Controle de Manutenções</h2>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;" border="1" cellpadding="8">
                <thead style="background: #f0f0f0;">
                    <tr><th>Equipamento</th><th>Tipo</th><th>Última Troca</th><th>Validade</th></tr>
                </thead>
                <tbody>
                    ${(state.dados.manutencoes || []).map(m => `
                        <tr>
                            <td>${esc(m.nome)}</td>
                            <td style="text-transform: capitalize;">${esc(m.tipo)}</td>
                            <td>${m.ultima_troca ? m.ultima_troca.split('-').reverse().join('/') : '-'}</td>
                            <td>${m.validade ? m.validade.split('-').reverse().join('/') : '-'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    if (tipo === 'tudo' || tipo === 'guepar') {
        html += `
            <h2 style="color: #007acc; border-bottom: 2px solid #007acc; padding-bottom: 4px;">2. Materiais Guepar Uso</h2>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;" border="1" cellpadding="8">
                <thead style="background: #f0f0f0;">
                    <tr><th>Item</th><th>Marca</th><th>Estoque</th></tr>
                </thead>
                <tbody>
                    ${(state.dados.guepar || []).map(g => `
                        <tr>
                            <td>${esc(g.nome)}</td>
                            <td>${esc(g.marca || '-')}</td>
                            <td><b>${g.estoque}</b></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    if (tipo === 'tudo' || tipo === 'pecas') {
        html += `
            <h2 style="color: #007acc; border-bottom: 2px solid #007acc; padding-bottom: 4px;">3. Peças do Robô</h2>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;" border="1" cellpadding="8">
                <thead style="background: #f0f0f0;">
                    <tr><th>Peça</th><th>Qtd Atual</th><th>Qtd Mínima</th></tr>
                </thead>
                <tbody>
                    ${(state.dados.pecas || []).map(p => `
                        <tr>
                            <td>${esc(p.nome)}</td>
                            <td>${p.estoque}</td>
                            <td>${p.min_estoque}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    if (tipo === 'tudo' || tipo === 'fornecedores') {
        html += `
            <h2 style="color: #007acc; border-bottom: 2px solid #007acc; padding-bottom: 4px;">4. Diretório de Fornecedores</h2>
            <table style="width: 100%; border-collapse: collapse;" border="1" cellpadding="8">
                <thead style="background: #f0f0f0;">
                    <tr><th>Empresa</th><th>CNPJ</th><th>Contato</th><th>Telefone</th></tr>
                </thead>
                <tbody>
                    ${(state.dados.fornecedores || []).map(f => `
                        <tr>
                            <td>${esc(f.nome)}</td>
                            <td>${esc(f.cnpj || '-')}</td>
                            <td>${esc(f.contato || '-')}</td>
                            <td>${esc(f.telefone || '-')}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    html += `</div>`;
    area.innerHTML = html;
    area.classList.remove('hidden');
    window.print();
    area.classList.add('hidden');
}