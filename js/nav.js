import { renderDashboard } from './dashboard.js';

export function ativarAba(tabName) {
    const btns = document.querySelectorAll('.menu-btn');
    const tabs = document.querySelectorAll('.tab-content');

    tabs.forEach(t => t.classList.add('hidden'));
    btns.forEach(b => b.classList.remove('bg-tech-700/50', 'text-white'));

    const targetTab = document.getElementById(`tab-${tabName}`);
    const targetBtn = document.querySelector(`.menu-btn[data-tab="${tabName}"]`);

    if (targetTab) targetTab.classList.remove('hidden');
    if (targetBtn) targetBtn.classList.add('bg-tech-700/50', 'text-white');

    if (tabName === 'dashboard') {
        renderDashboard();
    }
}

export function iniciarNav() {
    const btns = document.querySelectorAll('.menu-btn');

    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.getAttribute('data-tab');
            ativarAba(tabName);
        });
    });

    ativarAba('dashboard');
}