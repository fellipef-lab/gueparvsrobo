// =====================================================================
// PONTO DE ENTRADA — importa todos os módulos, liga os eventos globais
// e expõe em `window` as funções que o HTML chama via onclick="...".
// =====================================================================
import { fecharModal } from './utils.js';
import { abrirFormPeca, excluirPeca } from './pecas.js';
import { abrirFormGuepar, excluirGuepar } from './guepar.js';
import { abrirFormForn, excluirForn } from './fornecedores.js';
import { abrirModalManutencao, fecharModalManutencao, salvarManutencao, deletarManutencao } from './manutencoes.js';
import { iniciarNav } from './nav.js';
import { iniciarChat } from './chat.js';
import { iniciar } from './auth.js';

// O HTML usa atributos onclick="abrirFormPeca()" etc. (ver index.html),
// então essas funções precisam existir em window.
Object.assign(window, {
  fecharModal,
  abrirFormPeca, abrirFormGuepar, abrirFormForn,
  excluirPeca, excluirGuepar, excluirForn,
  abrirModalManutencao, fecharModalManutencao, salvarManutencao, deletarManutencao
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') document.querySelectorAll('[id^="modal"]').forEach(m => m.classList.add('hidden'));
});

iniciarNav();
iniciarChat();
iniciar();
