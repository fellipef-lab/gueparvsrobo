import { state } from './state.js';
import { esc, statusEstoque } from './utils.js';
import { gerarRelatorio } from './relatorios.js';

let chartInstancia = null;

export function renderDashboard() {
  const container = document.getElementById('aba-dashboard');
  if (!container) return;

  const pecas = state.dados.pecas || [];
  const guepar = state.dados.guepar || [];
  const manutencoes = state.dados.manutencoes || [];
  const fornecedores = state.dados.fornecedores || [];

  const totalPecas = pecas.length;
  const pecasCriticas = pecas.filter(p => Number(p.estoque) <= Number(p.min_estoque)).length;
  const totalGuepar = guepar.length;
  const totalManutencoes = manutencoes.length;

  container.innerHTML = `
    <!-- HEADER COM O BOTÃO DE RELATÓRIO GERAL -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/90 border border-slate-800 p-6 rounded-2xl backdrop-blur-md">
      <div>
        <h1 class="text-2xl font-black text-white">Dashboard Geral</h1>
        <p class="text-sm text-gray-400">Resumo em tempo real do sistema Guepar vs RobÔ</p>
      </div>
      <button id="btn-relatorio-geral" class="flex items-center space-x-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-4 py-2.5 rounded-xl transition shadow-lg shadow-cyan-900/30">
        <i class="ph ph-printer text-lg"></i>
        <span>Relatório Geral</span>
      </button>
    </div>

    <!-- CARDS DE RESUMO COM BOTÕES DE RELATÓRIO INDIVIDUAL (UM POR UM) -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      
      <!-- CARD PEÇAS -->
      <div class="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl backdrop-blur-md flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-semibold text-gray-400 uppercase">Peças do Robô</p>
              <h3 class="text-3xl font-black text-white mt-1">${totalPecas}</h3>
            </div>
            <div class="p-3 bg-cyan-500/10 text-cyan-400 rounded-xl">
              <i class="ph ph-cpu text-2xl"></i>
            </div>
          </div>
          <p class="text-xs text-gray-400 mt-2"><span class="text-yellow-400 font-bold">${pecasCriticas}</span> com estoque crítico</p>
        </div>
        <button id="btn-rel-pecas" class="mt-4 w-full flex items-center justify-center space-x-1.5 bg-slate-800/80 hover:bg-cyan-600/20 text-cyan-400 text-xs font-semibold py-2 rounded-lg transition border border-cyan-500/20">
          <i class="ph ph-printer text-sm"></i>
          <span>Relatório de Peças</span>
        </button>
      </div>

      <!-- CARD GUEPAR USO -->
      <div class="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl backdrop-blur-md flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-semibold text-gray-400 uppercase">Guepar Uso</p>
              <h3 class="text-3xl font-black text-white mt-1">${totalGuepar}</h3>
            </div>
            <div class="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
              <i class="ph ph-wrench text-2xl"></i>
            </div>
          </div>
          <p class="text-xs text-gray-400 mt-2">Itens cadastrados</p>
        </div>
        <button id="btn-rel-guepar" class="mt-4 w-full flex items-center justify-center space-x-1.5 bg-slate-800/80 hover:bg-blue-600/20 text-blue-400 text-xs font-semibold py-2 rounded-lg transition border border-blue-500/20">
          <i class="ph ph-printer text-sm"></i>
          <span>Relatório Guepar</span>
        </button>
      </div>

      <!-- CARD MANUTENÇÕES -->
      <div class="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl backdrop-blur-md flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-semibold text-gray-400 uppercase">Manutenções</p>
              <h3 class="text-3xl font-black text-white mt-1">${totalManutencoes}</h3>
            </div>
            <div class="p-3 bg-amber-500/10 text-amber-400 rounded-xl">
              <i class="ph ph-calendar-check text-2xl"></i>
            </div>
          </div>
          <p class="text-xs text-gray-400 mt-2">Registros de controle</p>
        </div>
        <button id="btn-rel-manutencoes" class="mt-4 w-full flex items-center justify-center space-x-1.5 bg-slate-800/80 hover:bg-amber-600/20 text-amber-400 text-xs font-semibold py-2 rounded-lg transition border border-amber-500/20">
          <i class="ph ph-printer text-sm"></i>
          <span>Relatório Manutenções</span>
        </button>
      </div>

      <!-- CARD FORNECEDORES -->
      <div class="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl backdrop-blur-md flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-semibold text-gray-400 uppercase">Fornecedores</p>
              <h3 class="text-3xl font-black text-white mt-1">${fornecedores.length}</h3>
            </div>
            <div class="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <i class="ph ph-users-three text-2xl"></i>
            </div>
          </div>
          <p class="text-xs text-gray-400 mt-2">Parceiros ativos</p>
        </div>
        <button id="btn-rel-fornecedores" class="mt-4 w-full flex items-center justify-center space-x-1.5 bg-slate-800/80 hover:bg-emerald-600/20 text-emerald-400 text-xs font-semibold py-2 rounded-lg transition border border-emerald-500/20">
          <i class="ph ph-printer text-sm"></i>
          <span>Relatório Fornecedores</span>
        </button>
      </div>

    </div>

    <!-- GRÁFICO E TABELA -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 backdrop-blur-md flex flex-col items-center justify-center">
        <h2 class="text-lg font-bold text-white mb-4 w-full text-left flex items-center space-x-2">
          <i class="ph ph-chart-donut text-cyan-400 text-xl"></i>
          <span>Distribuição de Dados</span>
        </h2>
        <div class="w-full h-64 relative flex items-center justify-center">
          <canvas id="graficoDashboard"></canvas>
        </div>
      </div>

      <div class="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 backdrop-blur-md">
        <h2 class="text-lg font-bold text-white mb-4 flex items-center space-x-2">
          <i class="ph ph-warning-circle text-yellow-400 text-xl"></i>
          <span>Alerta de Estoque Crítico</span>
        </h2>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm text-gray-300">
            <thead class="bg-slate-800/60 text-xs uppercase text-gray-400 border-b border-slate-700">
              <tr>
                <th class="p-3">Item</th>
                <th class="p-3">Atual</th>
                <th class="p-3">Mínimo</th>
                <th class="p-3">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800">
              ${pecas.filter(p => Number(p.estoque) <= Number(p.min_estoque)).map(p => `
                <tr class="hover:bg-slate-800/30 transition">
                  <td class="p-3 font-semibold text-white">${esc(p.nome)}</td>
                  <td class="p-3 font-mono">${p.estoque}</td>
                  <td class="p-3 font-mono text-gray-400">${p.min_estoque}</td>
                  <td class="p-3">${statusEstoque(p, ['Esgotado', 'Crítico', 'OK'])}</td>
                </tr>
              `).join('') || `<tr><td colspan="4" class="p-4 text-center text-gray-400">Nenhum item com estoque crítico no momento!</td></tr>`}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  // VINCULAR EVENTOS DOS BOTÕES DE RELATÓRIO
  document.getElementById('btn-relatorio-geral')?.addEventListener('click', () => gerarRelatorio('tudo'));
  document.getElementById('btn-rel-pecas')?.addEventListener('click', () => gerarRelatorio('pecas'));
  document.getElementById('btn-rel-guepar')?.addEventListener('click', () => gerarRelatorio('guepar'));
  document.getElementById('btn-rel-manutencoes')?.addEventListener('click', () => gerarRelatorio('manutencoes'));
  document.getElementById('btn-rel-fornecedores')?.addEventListener('click', () => gerarRelatorio('fornecedores'));

  // RENDERIZAR O GRÁFICO CIRCULAR
  setTimeout(() => renderizarGrafico(totalPecas, totalGuepar, totalManutencoes, fornecedores.length), 50);
}

function renderizarGrafico(pecas, guepar, manutencoes, fornecedores) {
  const canvas = document.getElementById('graficoDashboard');
  if (!canvas || typeof Chart === 'undefined') return;

  if (chartInstancia) chartInstancia.destroy();

  chartInstancia = new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels: ['Peças do Robô', 'Guepar Uso', 'Manutenções', 'Fornecedores'],
      datasets: [{
        data: [pecas, guepar, manutencoes, fornecedores],
        backgroundColor: ['#06b6d4', '#3b82f6', '#f59e0b', '#10b981'],
        borderWidth: 2,
        borderColor: '#0f172a'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: '#94a3b8', font: { size: 12 } }
        }
      }
    }
  });
}
