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

  abas.forEach(aba => aba.classList.add('hidden'));
  
  links.forEach(link => {
    link.className = "nav-item flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold text-sm transition text-gray-400 hover:text-white hover:bg-slate-800/50";
  });

  const abaAtiva = document.getElementById(`aba-${nomeAba}`);
  const linkAtivo = document.querySelector(`[data-aba="${nomeAba}"]`) || document.querySelector(`[href="#${nomeAba}"]`);

  if (abaAtiva) {
    abaAtiva.classList.remove('hidden');
  }

  if (linkAtivo) {
    linkAtivo.className = "nav-item flex items-center space-x-3 px-4 py-3 rounded-xl font-bold text-sm transition text-cyan-400 bg-cyan-500/10 border border-cyan-500/20";
  }

  window.location.hash = nomeAba;
}
