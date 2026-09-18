import { fecharModal } from './utils.js';
import { abrirFormPeca, excluirPeca, salvarPeca, editarPeca } from './pecas.js';
import { abrirFormGuepar, excluirGuepar, salvarGuepar, editarGuepar } from './guepar.js';
import { abrirFormForn, excluirForn, salvarForn, editarForn } from './fornecedores.js';
import { abrirModalManutencao, fecharModalManutencao, salvarManutencao, deletarManutencao, editarManutencao } from './manutencoes.js';
import { gerarRelatorio } from './relatorios.js';
import { iniciarNav } from './nav.js';
import { iniciarChat } from './chat.js';
import { iniciar } from './auth.js';

// Anexa todas as funções globalmente ao objeto window
Object.assign(window, {
  fecharModal,
  abrirFormPeca, abrirFormGuepar, abrirFormForn,
  excluirPeca, excluirGuepar, excluirForn,
  salvarPeca, salvarGuepar, salvarForn,
  editarPeca, editarGuepar, editarForn,
  abrirModalManutencao, fecharModalManutencao, salvarManutencao, deletarManutencao, editarManutencao,
  gerarRelatorio
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') document.querySelectorAll('[id^="modal"]').forEach(m => m.classList.add('hidden'));
});

iniciarNav();
iniciarChat();
iniciar();