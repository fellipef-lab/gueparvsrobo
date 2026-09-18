export function esc(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function toast(msg) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.remove('hidden');
  setTimeout(() => el.classList.add('hidden'), 3000);
}

export function conexao(status, msg) {
  const ponto = document.getElementById('ponto-conexao');
  const texto = document.getElementById('texto-conexao');
  
  if (ponto) {
    ponto.className = 'w-2 h-2 rounded-full shrink-0 ' + 
      (status === 'ok' ? 'bg-emerald-500' : status === 'esperando' ? 'bg-yellow-500 animate-pulse' : 'bg-red-500');
  }
  if (texto) {
    texto.textContent = msg;
  }
}

export function statusEstoque(item, labels = ['Esgotado', 'Crítico', 'OK']) {
  const est = Number(item.estoque || 0);
  const min = Number(item.min_estoque || 0);

  if (est <= 0) {
    return `<span class="px-2 py-0.5 rounded-full text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30">${labels[0]}</span>`;
  }
  if (est <= min) {
    return `<span class="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">${labels[1]}</span>`;
  }
  return `<span class="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">${labels[2]}</span>`;
}

export function modalConfirma(texto, acao) {
  const modal = document.getElementById('modalConfirma');
  const txt = document.getElementById('confirma-texto');
  const btnOk = document.getElementById('confirma-ok');

  if (!modal || !txt || !btnOk) {
    if (confirm(texto)) acao();
    return;
  }

  txt.textContent = texto;
  modal.classList.remove('hidden');

  btnOk.onclick = () => {
    modal.classList.add('hidden');
    acao();
  };
}

window.fecharModal = function(id) {
  const m = document.getElementById(id);
  if (m) m.classList.add('hidden');
};
