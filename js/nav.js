import { state } from './state.js';

export function initNav() {
  const links = document.querySelectorAll('.nav-item');
  
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetAba = link.getAttribute('data-aba') || link.getAttribute('href')?.replace('#', '');
      if (targetAba) {
        trocarAba(targetAba);
      }
    });
  });

  const hash = window.location.hash.replace('#', '') || 'dashboard';
  trocarAba(hash);
  aplicarPermissoesNav();
}

export function trocarAba(nomeAba) {
  const abas = document.querySelectorAll('.aba-conteudo');
  const links = document.querySelectorAll('.nav-item');

  abas.forEach(aba => aba.classList.add('hidden'));
  
  links.forEach(link => {
    link.className = "nav-item flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold text-sm transition text-gray-400 hover:text-white hover:bg-slate-800/50";
  });

  let abaAtiva = document.getElementById(`aba-${nomeAba}`);
  let linkAtivo = document.querySelector(`[data-aba="${nomeAba}"]`) || document.querySelector(`[href="#${nomeAba}"]`);

  if (!abaAtiva) {
    nomeAba = 'dashboard';
    abaAtiva = document.getElementById('aba-dashboard');
    linkAtivo = document.querySelector('[data-aba="dashboard"]');
  }

  if (abaAtiva) abaAtiva.classList.remove('hidden');

  if (linkAtivo) {
    linkAtivo.className = "nav-item flex items-center space-x-3 px-4 py-3 rounded-xl font-bold text-sm transition text-cyan-400 bg-cyan-500/10 border border-cyan-500/20";
  }

  window.location.hash = nomeAba;
}

export function aplicarPermissoesNav() {
  const navUsuarios = document.getElementById('nav-usuarios');
  if (!navUsuarios) return;

  const role = state.role || localStorage.getItem('guepar_role') || 'admin';

  // Se for admin (ou fallback no primeiro acesso), mostra o botão Usuários
  if (role === 'admin') {
    navUsuarios.classList.remove('hidden');
    navUsuarios.style.display = 'flex';
  } else {
    navUsuarios.classList.add('hidden');
    navUsuarios.style.display = 'none';
  }
}
