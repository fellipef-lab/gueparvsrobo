import { state } from './state.js';
import { $, esc } from './utils.js';

export function renderDashboard() {
    const { dados } = state;

    // 1. Destaques Operacionais
    const manutencoesCriticas = (dados.manutencoes || []).filter(m => {
        const diff = Math.ceil((new Date(m.validade + 'T00:00:00') - new Date().setHours(0,0,0,0)) / (1000 * 60 * 60 * 24));
        return diff <= 7;
    });

    const gueparZerar = (dados.guepar || []).filter(g => Number(g.estoque) === 0);

    const cardDestaque = (icone, titulo, valor, sub, cor) => `
        <div class="bg-tech-800 p-6 rounded-xl border border-${cor}-500/40 shadow-xl">
            <div class="flex items-center justify-between mb-4">
                <span class="text-gray-400 font-bold text-lg">${titulo}</span>
                <div class="p-3 bg-tech-900 rounded-lg text-${cor}-400 text-2xl"><i class="ph ph-${icone}"></i></div>
            </div>
            <p class="text-4xl font-extrabold text-white mb-2">${valor}</p>
            <p class="text-sm text-gray-400">${sub}</p>
        </div>
    `;

    const elDestaque = $('cards-destaque-main');
    if (elDestaque) {
        elDestaque.innerHTML = 
            cardDestaque('calendar-check', 'Manutenções Registradas', (dados.manutencoes || []).length, 
                manutencoesCriticas.length ? `<span class="text-red-400 font-bold">${manutencoesCriticas.length} vencidas ou em alerta</span>` : 'Todas em dia', 'cyan') +
            cardDestaque('wrench', 'Itens Guepar Uso', (dados.guepar || []).length, 
                gueparZerar.length ? `<span class="text-yellow-400 font-bold">${gueparZerar.length} zerados no estoque</span>` : 'Estoque regular', 'yellow');
    }

    // 2. Cards Secundários
    const pecasCriticas = (dados.pecas || []).filter(p => p.estoque <= p.min_estoque);
    const elSecundarios = $('cards-secundarios-main');
    if (elSecundarios) {
        elSecundarios.innerHTML = `
            <div class="bg-tech-800 p-4 rounded-lg border border-tech-700">
                <p class="text-gray-400 text-sm">Peças do Robô</p>
                <p class="text-2xl font-bold">${(dados.pecas || []).length} <span class="text-xs text-gray-500">(${pecasCriticas.length} em alerta)</span></p>
            </div>
            <div class="bg-tech-800 p-4 rounded-lg border border-tech-700">
                <p class="text-gray-400 text-sm">Fornecedores Cadastrados</p>
                <p class="text-2xl font-bold">${(dados.fornecedores || []).length}</p>
            </div>
        `;
    }

    renderizarGraficoManutencoes(state.sb);
    renderizarAlertasUnificados();
}

let graficoManutencoes = null;
export async function renderizarGraficoManutencoes(supabase) {
    if (!supabase) return;
    const { data } = await supabase.from('manutencoes').select('validade');
    if (!data) return;

    let noPrazo = 0, venceLogo = 0, vencido = 0;
    const hoje = new Date();
    hoje.setHours(0,0,0,0);

    data.forEach(item => {
        const diff = Math.ceil((new Date(item.validade + 'T00:00:00') - hoje) / (1000 * 60 * 60 * 24));
        if (diff < 0) vencido++;
        else if (diff <= 7) venceLogo++;
        else noPrazo++;
    });

    const ctx = document.getElementById('grafico-manutencoes');
    if (!ctx) return;
    if (graficoManutencoes) graficoManutencoes.destroy();

    graficoManutencoes = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['No Prazo', 'Vence em 7 dias', 'Vencido'],
            datasets: [{ data: [noPrazo, venceLogo, vencido], backgroundColor: ['#22c55e', '#facc15', '#ef4444'], borderWidth: 0 }]
        },
        options: { responsive: true, cutout: '70%', plugins: { legend: { position: 'bottom', labels: { color: '#9ca3af' } } } }
    });
}

function renderizarAlertasUnificados() {
    const { dados } = state;
    const lista = [];

    (dados.manutencoes || []).forEach(m => {
        const diff = Math.ceil((new Date(m.validade + 'T00:00:00') - new Date().setHours(0,0,0,0)) / (1000 * 60 * 60 * 24));
        if (diff < 0) lista.push(`<li class="text-red-400 font-medium"><i class="ph ph-warning"></i> Manutenção Vencida: <b>${esc(m.nome)}</b></li>`);
        else if (diff <= 7) lista.push(`<li class="text-yellow-400 font-medium"><i class="ph ph-clock"></i> Manutenção próxima do fim: <b>${esc(m.nome)}</b> (${diff} dias)</li>`);
    });

    (dados.guepar || []).forEach(g => {
        if (Number(g.estoque) === 0) lista.push(`<li class="text-yellow-400 font-medium"><i class="ph ph-package"></i> Material Guepar Zerado: <b>${esc(g.nome)}</b></li>`);
    });

    const elAlertas = $('alertas-dashboard');
    if (elAlertas) {
        elAlertas.innerHTML = lista.length 
            ? `<ul class="space-y-2 bg-tech-900 p-4 rounded-lg border border-tech-700">${lista.join('')}</ul>`
            : '<p class="text-gray-400 text-sm">Nenhum alerta crítico pendente no momento.</p>';
    }
}