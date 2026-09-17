// =====================================================================
// NAVEGAÇÃO — troca de aba e menu lateral no celular.
// =====================================================================
import { $ } from './utils.js';

export function mudarAba(nome) {
  if (!$('tab-' + nome)) nome = 'dashboard';
  document.querySelectorAll('.tab-content').forEach(s => { s.classList.add('hidden'); s.classList.remove('flex'); });
  const alvo = $('tab-' + nome);
  alvo.classList.remove('hidden');
  if (nome === 'ia') alvo.classList.add('flex');

  document.querySelectorAll('.menu-btn').forEach(b => {
    const ativo = b.dataset.tab === nome;
    b.classList.toggle('bg-tech-700', ativo);
    b.classList.toggle('border-l-4', ativo);
    b.classList.toggle('border-tech-accent', ativo);
    b.classList.toggle('text-tech-accent', ativo);
    b.classList.toggle('text-gray-400', !ativo);
  });
  location.hash = nome;
  fecharMenuMobile();
}

export function abrirMenuMobile() {
  $('sidebar').classList.remove('hidden');
  $('sidebar').classList.add('flex');
  $('overlay-menu').classList.remove('hidden');
}

export function fecharMenuMobile() {
  if (window.innerWidth >= 768) return; // no desktop o menu fica sempre visível
  $('sidebar').classList.add('hidden');
  $('sidebar').classList.remove('flex');
  $('overlay-menu').classList.add('hidden');
}

// Liga os eventos assim que o módulo é carregado.
export function iniciarNav() {
  document.querySelectorAll('.menu-btn').forEach(b => b.addEventListener('click', () => mudarAba(b.dataset.tab)));
  $('btn-menu-mobile')?.addEventListener('click', abrirMenuMobile);
  $('btn-fechar-menu')?.addEventListener('click', fecharMenuMobile);
  $('overlay-menu')?.addEventListener('click', fecharMenuMobile);
  window.addEventListener('resize', () => { if (window.innerWidth >= 768) $('overlay-menu').classList.add('hidden'); });
}
