import { state } from './state.js';
import { esc, statusEstoque } from './utils.js';

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
    <!-- CARDS DE RESUMO -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl backdrop-blur-md">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-semibold text-gray-400 uppercase">Peças do Robô</p>
            <h3 class="text-3xl font-black text-white mt-1">${totalPecas}</h3>
          </div>
          <div class="p-3 bg-cyan-500/10 text-cyan-400 rounded-xl">
            <i class="ph ph-cpu text-2xl"></i>
          </div>
        </div>
        <p class="text-xs text-gray-400 mt-3"><span class="text-yellow-400 font-bold">${pecasCriticas}</span> com estoque crítico</p>
      </div>

      <div class="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl backdrop-blur-md">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-semibold text-gray-400 uppercase">Guepar Uso</p>
            <h3 class="text-3xl font-black text-white mt-1">${totalGuepar}</h3>
          </div>
          <div class="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
            <i class="ph ph-wrench text-2xl"></i>
          </div>
        </div>
        <p class="text-xs text-gray-400 mt-3">Itens cadastrados</p>
      </div>

      <div class="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl backdrop-blur-md">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-semibold text-gray-400 uppercase">Manutenções</p>
            <h3 class="text-3xl font-black text-white mt-1">${totalManutencoes}</h3>
          </div>
          <div class="p-3 bg-amber-500/10 text-amber-400 rounded-xl">
            <i class="ph ph-calendar-check text-2xl"></i>
          </div>
        </div>
        <p class="text-xs text-gray-400 mt-3">Registros de controle</p>
      </div>

      <div class="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl backdrop-blur-md">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-semibold text-gray-400 uppercase">Fornecedores</p>
            <h3 class="text-3xl font-black text-white mt-1">${fornecedores.length}</h3>
          </div>
          <div class="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
            <i class="ph ph-users-three text-2xl"></i>
          </div>
        </div>
        <p class="text-xs text-gray-400 mt-3">Parceiros ativos</p>
      </div>
    </div>

    <!-- TABELA RESUMO DE PEÇAS CRÍTICAS -->
    <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 backdrop-blur-md">
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
  `;
}
