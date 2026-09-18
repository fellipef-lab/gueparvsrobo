import { state } from './state.js';
import { $ } from './utils.js';

export function addMensagem(texto, tipo = 'ia') {
  const box = $('chat-box');
  if (!box) return;

  const div = document.createElement('div');
  div.className = tipo === 'ia' 
    ? 'bg-slate-800/80 text-gray-200 p-3 rounded-xl border border-slate-700/50 max-w-[85%]'
    : 'bg-cyan-600 text-white p-3 rounded-xl max-w-[85%] ml-auto';
  
  div.textContent = texto;
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
}

export function iniciarChat() {
  const btnEnviar = $('btn-enviar-chat');
  const inputChat = $('input-chat');

  if (btnEnviar) {
    btnEnviar.onclick = enviarMensagemChat;
  }

  if (inputChat) {
    inputChat.onkeydown = (e) => {
      if (e.key === 'Enter') enviarMensagemChat();
    };
  }
}

export function enviarMensagemChat() {
  const input = $('input-chat');
  if (!input) return;
  const txt = input.value.trim();
  if (!txt) return;

  addMensagem(txt, 'user');
  input.value = '';

  setTimeout(() => {
    responderIA(txt);
  }, 600);
}

function responderIA(pergunta) {
  const p = pergunta.toLowerCase();
  
  if (p.includes('estoque') || p.includes('peça') || p.includes('peca')) {
    const totalPecas = state.dados.pecas.length;
    const baixas = state.dados.pecas.filter(x => x.estoque <= x.min_estoque).length;
    addMensagem(`Temos ${totalPecas} peças cadastradas. ${baixas} estão com estoque igual ou abaixo do mínimo.`, 'ia');
    return;
  }

  if (p.includes('manutenção') || p.includes('manutencao') || p.includes('troca')) {
    const totalM = state.dados.manutencoes.length;
    addMensagem(`Existem ${totalM} registros de manutenção configurados no sistema.`, 'ia');
    return;
  }

  addMensagem('Entendi! Caso precise de informações sobre o estoque de peças ou manutenções, pode me perguntar.', 'ia');
}