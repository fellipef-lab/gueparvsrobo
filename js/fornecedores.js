import { state } from './state.js';
import { esc } from './utils.js';

export function renderFornecedores() {
  const container = document.getElementById('aba-fornecedores');
  if (!container) return;

  const dados = state.dados.fornecedores || [];

  container.innerHTML = `
    <div class="flex justify-between items-center bg-slate-900/90 border border-slate-800 p-6 rounded-2xl backdrop-blur-md">
      <div>
        <h1 class="text-2xl font-black text-white">Diretório de Fornecedores</h1>
        <p class="text-sm text-gray-400">Parceiros e contatos cadastrados</p>
      </div>
    </div>

    <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 backdrop-blur-md">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm text-gray-300">
          <thead class="bg-slate-800/60 text-xs uppercase text-gray-400 border-b border-slate-700">
            <tr>
              <th class="p-3">Empresa</th>
              <th class="p-3">CNPJ</th>
              <th class="p-3">Contato</th>
              <th class="p-3">Telefone</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800">
            ${dados.map(f => `
              <tr class="hover:bg-slate-800/30 transition">
                <td class="p-3 font-semibold text-white">${esc(f.nome)}</td>
                <td class="p-3">${esc(f.cnpj || '-')}</td>
                <td class="p-3">${esc(f.contato || '-')}</td>
                <td class="p-3 font-mono text-cyan-400">${esc(f.telefone || '-')}</td>
              </tr>
            `).join('') || `<tr><td colspan="4" class="p-4 text-center text-gray-400">Nenhum fornecedor encontrado.</td></tr>`}
          </tbody>
        </table>
      </div>
    </div>
  `;
}
