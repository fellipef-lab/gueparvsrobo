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

  // Carrega a aba inicial baseada na URL hash ou padrão para 'dashboard'
  const hash = window.location.hash.replace('#', '') || 'dashboard';
  trocarAba(hash);
}

export function trocarAba(nomeAba) {
  const abas = document.querySelectorAll('.aba-conteudo');
  const links = document.querySelectorAll('.nav-item');

  // 1. Esconde todas as abas
  abas.forEach(aba => aba.classList.add('hidden'));
  
  // 2. Reseta o estilo visual de todos os links de navegação
  links.forEach(link => {
    link.className = "nav-item flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold text-sm transition text-gray-400 hover:text-white hover:bg-slate-800/50";
  });

  // 3. Procura a aba de destino e o link correspondente
  let abaAtiva = document.getElementById(`aba-${nomeAba}`);
  let linkAtivo = document.querySelector(`[data-aba="${nomeAba}"]`) || document.querySelector(`[href="#${nomeAba}"]`);

  // Se a aba solicitada não existir, faz fallback para o Dashboard
  if (!abaAtiva) {
    nomeAba = 'dashboard';
    abaAtiva = document.getElementById('aba-dashboard');
    linkAtivo = document.querySelector('[data-aba="dashboard"]');
  }

  // 4. Exibe a aba ativa e aplica os estilos do botão selecionado
  if (abaAtiva) {
    abaAtiva.classList.remove('hidden');
  }

  if (linkAtivo) {
    linkAtivo.className = "nav-item flex items-center space-x-3 px-4 py-3 rounded-xl font-bold text-sm transition text-cyan-400 bg-cyan-500/10 border border-cyan-500/20";
  }

  // 5. Atualiza o Hash na barra do navegador
  window.location.hash = nomeAba;
}

// Oculta/Exibe o botão 'Usuários' da sidebar dependendo das permissões (Admin)
export function aplicarPermissoesNav() {
  const navUsuarios = document.getElementById('nav-usuarios');
  if (!navUsuarios) return;

  const role = state.role || localStorage.getItem('guepar_role');

  // Apenas Administradores podem visualizar a aba de Gestão de Usuários
  if (role === 'admin') {
    navUsuarios.classList.remove('hidden');
  } else {
    navUsuarios.classList.add('hidden');
  }
}
