/**
 * MEU BICHINHO VIRTUAL - JAVASCRIPT
 * 
 * Este arquivo contém toda a lógica do jogo de bichinho virtual,
 * incluindo manipulação do DOM, gerenciamento de estado e persistência de dados.
 */

// ===== SELEÇÃO DE ELEMENTOS DO DOM =====
const telaBoasVindas = document.getElementById("boas-vindas");
const containerJogo = document.getElementById("container-jogo");
const tamagotchiBichinho = document.querySelector(".tamagotchi-bichinho");
const emojiBichinhoElemento = document.getElementById("emoji-bichinho");
const opcoesBichinhos = document.querySelectorAll(".opcao-bichinho");
const nomeBichinhoElemento = document.getElementById("nome-bichinho");
const inputNome = document.getElementById("input-nome");
const experienciaProgresso = document.querySelector(".experiencia-progresso");
const nivelBichinhoElemento = document.getElementById("nivel-bichinho");
const statusFome = document.querySelector(".status-progresso.fome");
const statusFelicidade = document.querySelector(".status-progresso.felicidade");
const statusHigiene = document.querySelector(".status-progresso.higiene");
const statusSaude = document.querySelector(".status-progresso.saude");
const botaoAlimentar = document.getElementById("botao-alimentar");
const botaoBrincar = document.getElementById("botao-brincar");
const botaoLimpar = document.getElementById("botao-limpar");
const botaoMedicar = document.getElementById("botao-medicar");
const botaoComecar = document.getElementById("botao-comecar");
const botaoReiniciar = document.getElementById("botao-reiniciar");
const mensagemElemento = document.getElementById("mensagem");
const containerLoja = document.getElementById("container-loja");
const botaoLoja = document.getElementById("botao-loja");
const botaoSairLoja = document.getElementById("botao-sair-loja");
const containerMiniGames = document.getElementById("container-mini-games");
const botaoMiniGames = document.getElementById("botao-mini-games");
const botaoSairMiniGames = document.getElementById("botao-sair-mini-games");
const botaoTema = document.getElementById("botao-tema");
const corpoDocumento = document.body;

// ===== CONSTANTES E CONFIGURAÇÕES =====
/**
 * Mapeamento de emojis para cada tipo de bichinho disponível
 */
const EMOJIS_BICHINHOS = {
  cachorro: "🐶",
  gato: "🐱",
  coelho: "🐰",
  panda: "🐼",
  vaca: "🐮",
  sapo: "🐸",
  hamster: "🐹",
  porco: "🐷",
};

// ===== VARIÁVEIS GLOBAIS =====
/**
 * Objeto que armazena o estado completo do bichinho virtual
 * @property {string} nome - Nome do bichinho
 * @property {string} tipo - Tipo de animal (cachorro, gato, etc.)
 * @property {number} fome - Nível de fome (0-100)
 * @property {number} felicidade - Nível de felicidade (0-100)
 * @property {number} higiene - Nível de higiene (0-100)
 * @property {number} saude - Nível de saúde (0-100)
 * @property {number} nivel - Nível atual do bichinho
 * @property {number} experiencia - Experiência acumulada no nível atual
 * @property {number} experienciaProximoNivel - Experiência necessária para o próximo nível
 * @property {Object} acessorios - Acessórios equipados no bichinho
 */
let meuBichinho = {
  nome: "Bichinho",
  tipo: "cachorro",
  fome: 100,
  felicidade: 100,
  higiene: 100,
  saude: 100,
  nivel: 1,
  experiencia: 0,
  experienciaProximoNivel: 100,
  acessorios: {},
};

let gameLoop; // Referência para o intervalo do loop principal do jogo

// ===== FUNÇÕES PRINCIPAIS DO JOGO =====

/**
 * Atualiza a interface do usuário com base no estado atual do bichinho
 * Controla a aparência das barras de status, emoji, cor de fundo, etc.
 */
function atualizarUI() {
  // Atualiza as barras de status
  statusFome.style.width = meuBichinho.fome + "%";
  statusFelicidade.style.width = meuBichinho.felicidade + "%";
  statusHigiene.style.width = meuBichinho.higiene + "%";
  statusSaude.style.width = meuBichinho.saude + "%";

  // Atualiza a barra de experiência
  const porcentagemExperiencia = (meuBichinho.experiencia / meuBichinho.experienciaProximoNivel) * 100;
  experienciaProgresso.style.width = porcentagemExperiencia + "%";

  // Atualiza o nível exibido
  nivelBichinhoElemento.textContent = meuBichinho.nivel;

  // Atualiza o emoji do bichinho
  emojiBichinhoElemento.textContent = EMOJIS_BICHINHOS[meuBichinho.tipo];

  // Verifica se o bichinho está morto (saúde zerada)
  if (meuBichinho.saude <= 0) {
    tamagotchiBichinho.style.backgroundColor = "#9e9e9e";
    tamagotchiBichinho.style.filter = "grayscale(80%)";
  } else {
    // Calcula a "nota" geral baseada na média das necessidades
    const notaGeral = (meuBichinho.fome + meuBichinho.felicidade + meuBichinho.higiene + meuBichinho.saude) / 4;
    
    // Define a cor de fundo com base no estado do bichinho
    if (notaGeral >= 70) {
      tamagotchiBichinho.style.backgroundColor = "#4caf50"; // Verde - Saudável
    } else if (notaGeral >= 40) {
      tamagotchiBichinho.style.backgroundColor = "#ffc107"; // Amarelo - Em alerta
    } else if (notaGeral >= 10) {
      tamagotchiBichinho.style.backgroundColor = "#ff9800"; // Laranja - Em perigo
    } else {
      tamagotchiBichinho.style.backgroundColor = "#f44336"; // Vermelho - Crítico
    }
    tamagotchiBichinho.style.filter = "none";
  }

  // Controla o estado dos botões com base nos status
  botaoAlimentar.disabled = meuBichinho.fome >= 100;
  botaoBrincar.disabled = meuBichinho.felicidade >= 100;
  botaoLimpar.disabled = meuBichinho.higiene >= 100;
  botaoMedicar.disabled = meuBichinho.saude >= 100;

  // Atualiza o nome do bichinho na interface
  nomeBichinhoElemento.textContent = meuBichinho.nome;

  // Atualiza os acessórios equipados
  atualizarAcessorios();
}

/**
 * Adiciona experiência ao bichinho e verifica se ele subiu de nível
 * @param {number} qtd - Quantidade de experiência a ser adicionada
 */
function adicionarExperiencia(qtd) {
  meuBichinho.experiencia += qtd;

  // Verifica se subiu de nível (pode subir múltiplos níveis de uma vez)
  while (meuBichinho.experiencia >= meuBichinho.experienciaProximoNivel) {
    meuBichinho.experiencia -= meuBichinho.experienciaProximoNivel;
    meuBichinho.nivel++;
    
    // Aumenta a experiência necessária para o próximo nível (progressão)
    meuBichinho.experienciaProximoNivel = Math.floor(meuBichinho.experienciaProximoNivel * 1.5);

    // Exibe mensagem de novo nível
    mensagemElemento.textContent = `Parabéns! ${meuBichinho.nome} subiu para o nível ${meuBichinho.nivel}!`;
    setTimeout(() => {
      mensagemElemento.textContent = "";
    }, 3000);
  }

  atualizarUI();
  salvarDados();
}

/**
 * Salva os dados do bichinho no localStorage do navegador
 */
function salvarDados() {
  localStorage.setItem("meuBichinho", JSON.stringify(meuBichinho));
}

/**
 * Carrega os dados do bichinho do localStorage, se existirem
 * Se não houver dados salvos, mostra a tela de boas-vindas
 */
function carregarDados() {
  const dadosSalvos = localStorage.getItem("meuBichinho");
  if (dadosSalvos) {
    meuBichinho = JSON.parse(dadosSalvos);
    iniciarJogo(); // Inicia o jogo diretamente se houver dados salvos
  } else {
    // Mostra a tela de boas-vindas para novo jogo
    telaBoasVindas.style.display = "flex";
    containerJogo.style.display = "none";
    
    // Seleciona o primeiro bichinho por padrão
    opcoesBichinhos[0].classList.add("selecionado");
    meuBichinho.tipo = opcoesBichinhos[0].getAttribute("data-tipo");
  }
}

/**
 * Inicia o jogo, escondendo a tela de boas-vindas e mostrando o jogo principal
 * Também inicia o loop principal do jogo
 */
function iniciarJogo() {
  telaBoasVindas.style.display = "none";
  containerJogo.style.display = "flex";
  containerJogo.style.flexDirection = "column";
  containerJogo.style.alignItems = "center";

  // Atualiza o nome do bichinho se foi inserido um novo
  if (inputNome.value.trim() !== "") {
    meuBichinho.nome = inputNome.value.trim();
  }

  atualizarUI();
  salvarDados();

  // Inicia o loop do jogo (atualiza a cada segundo)
  gameLoop = setInterval(passarTempo, 1000);
}

/**
 * Reinicia completamente o jogo, resetando todos os status
 */
function reiniciarJogo() {
  // Reseta todos os status do bichinho
  meuBichinho.fome = 100;
  meuBichinho.felicidade = 100;
  meuBichinho.higiene = 100;
  meuBichinho.saude = 100;
  meuBichinho.nivel = 1;
  meuBichinho.experiencia = 0;
  meuBichinho.experienciaProximoNivel = 100;
  meuBichinho.acessorios = {};

  // Limpa mensagens e reseta a aparência
  mensagemElemento.textContent = "";
  tamagotchiBichinho.style.backgroundColor = "#4caf50";
  tamagotchiBichinho.style.filter = "none";
  tamagotchiBichinho.classList.remove("triste");

  // Mostra os botões de ação e esconde o de reiniciar
  controlarVisibilidadeBotoes(true);
  botaoReiniciar.style.display = "none";

  atualizarUI();
  salvarDados();

  // Reinicia o loop do jogo
  gameLoop = setInterval(passarTempo, 1000);
}

/**
 * Função executada a cada segundo pelo loop do jogo
 * Atualiza os status do bichinho e verifica condições de game over
 */
function passarTempo() {
  // Verifica se o bichinho morreu (saúde zerada)
  if (meuBichinho.saude <= 0) {
    mensagemElemento.textContent = `Oh não! ${meuBichinho.nome} morreu.`;
    tamagotchiBichinho.style.backgroundColor = "#9e9e9e";
    tamagotchiBichinho.style.filter = "grayscale(80%)";
    tamagotchiBichinho.classList.remove("triste");

    // Esconde botões de ação e mostra o de reiniciar
    controlarVisibilidadeBotoes(false);
    botaoReiniciar.style.display = "block";

    clearInterval(gameLoop); // Para o loop do jogo
    return;
  }

  // Diminui os status com o passar do tempo
  meuBichinho.fome -= 1;
  meuBichinho.felicidade -= 1;
  meuBichinho.higiene -= 1;

  // Garante que os valores não fiquem abaixo de zero
  if (meuBichinho.fome < 0) meuBichinho.fome = 0;
  if (meuBichinho.felicidade < 0) meuBichinho.felicidade = 0;
  if (meuBichinho.higiene < 0) meuBichinho.higiene = 0;

  // Se fome, felicidade ou higiene estiverem zeradas, a saúde diminui
  if (meuBichinho.fome <= 0 || meuBichinho.felicidade <= 0 || meuBichinho.higiene <= 0) {
    meuBichinho.saude -= 2;
    if (meuBichinho.saude < 0) meuBichinho.saude = 0;
  }

  atualizarUI();
  salvarDados();
}

/**
 * Controla a visibilidade dos botões de ação
 * @param {boolean} visivel - Se true, mostra os botões; se false, esconde
 */
function controlarVisibilidadeBotoes(visivel) {
  const botoesContainer = document.querySelector(".botoes-container");
  botoesContainer.style.display = visivel ? "flex" : "none";
}

// ===== FUNÇÕES DE TEMAS =====

/**
 * Aplica o tema salvo no localStorage ao carregar a página
 */
function aplicarTemaSalvo() {
  const temaSalvo = localStorage.getItem('tema');
  if (temaSalvo === 'escuro') {
    corpoDocumento.classList.add('dark-mode');
    botaoTema.textContent = '☀️';
  } else {
    corpoDocumento.classList.remove('dark-mode');
    botaoTema.textContent = '🌑';
  }
}

// ===== FUNÇÕES DA LOJA DE ACESSÓRIOS =====

/**
 * Abre a loja de acessórios
 */
function abrirLoja() {
  containerLoja.style.display = "flex";
}

/**
 * Fecha a loja de acessórios
 */
function fecharLoja() {
  containerLoja.style.display = "none";
}

/**
 * Equipa ou desequipa um acessório no bichinho
 * @param {string} tipoAcessorio - O tipo de acessório a ser equipado/desequipado
 */
function equiparOuDesequiparAcessorio(tipoAcessorio) {
  // Se o acessório já está equipado, desequipa
  if (meuBichinho.acessorios[tipoAcessorio]) {
    meuBichinho.acessorios[tipoAcessorio] = false;
  } else {
    // Desequipa todos os outros acessórios primeiro
    for (const acessorio in meuBichinho.acessorios) {
      meuBichinho.acessorios[acessorio] = false;
    }
    // Equipa o novo acessório
    meuBichinho.acessorios[tipoAcessorio] = true;
  }

  atualizarAcessorios();
  salvarDados();
}

/**
 * Atualiza a exibição dos acessórios no bichinho e nos botões da loja
 */
function atualizarAcessorios() {
  const containerAcessorios = document.getElementById("acessorios-bichinho");

  // Limpa acessórios atuais
  containerAcessorios.innerHTML = "";

  // Atualiza o texto dos botões e adiciona acessórios equipados
  const botoesAcessorio = document.querySelectorAll(".botao-comprar");
  botoesAcessorio.forEach((botao) => {
    const tipoAcessorio = botao.getAttribute("data-acessorio");
    if (meuBichinho.acessorios[tipoAcessorio]) {
      botao.textContent = "Desequipar";
      botao.style.backgroundColor = "#f44336"; // Vermelho para desequipar

      // Adiciona o acessório visualmente ao bichinho
      const emojiAcessorio = document.createElement("div");
      emojiAcessorio.classList.add("acessorio-equipado", `${tipoAcessorio}-equipado`);

      // Define o emoji correto para cada acessório
      switch (tipoAcessorio) {
        case "coroa":
          emojiAcessorio.textContent = "👑";
          break;
        case "chapeu-laco":
          emojiAcessorio.textContent = "👒";
          break;
        case "chapeu-cartola":
          emojiAcessorio.textContent = "🎩";
          break;
        case "laco":
          emojiAcessorio.textContent = "🎀";
          break;
      }

      containerAcessorios.appendChild(emojiAcessorio);
    } else {
      botao.textContent = "Equipar";
      botao.style.backgroundColor = "#4caf50"; // Verde para equipar
    }
  });
}

// ===== FUNÇÕES DE MINI GAMES =====

/**
 * Abre a tela de mini games
 */
function abrirMiniGames() {
  containerMiniGames.style.display = "flex";
}

/**
 * Fecha a tela de mini games
 */
function fecharMiniGames() {
  containerMiniGames.style.display = "none";
}

// ===== CONFIGURAÇÃO DE EVENT LISTENERS =====

// Aplica o tema salvo quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', aplicarTemaSalvo);

// Event listener para o botão de tema
botaoTema.addEventListener('click', () => {
  corpoDocumento.classList.toggle('dark-mode');
  
  // Salva a preferência do usuário
  if (corpoDocumento.classList.contains('dark-mode')) {
    localStorage.setItem('tema', 'escuro');
    botaoTema.textContent = '☀️';
  } else {
    localStorage.setItem('tema', 'claro');
    botaoTema.textContent = '🌑';
  }
});

// Event listeners para seleção de bichinhos
opcoesBichinhos.forEach((opcao) => {
  opcao.addEventListener("click", () => {
    // Remove a seleção de todos
    opcoesBichinhos.forEach((o) => o.classList.remove("selecionado"));
    
    // Adiciona a seleção ao clicado
    opcao.classList.add("selecionado");
    
    // Atualiza o tipo do bichinho
    meuBichinho.tipo = opcao.getAttribute("data-tipo");
  });
});

// Event listener para o botão "Começar"
botaoComecar.addEventListener("click", () => {
  if (inputNome.value.trim() !== "") {
    iniciarJogo();
  } else {
    inputNome.focus();
    inputNome.classList.add("input-erro");
  }
});

// Event listeners para os botões de ação
botaoAlimentar.addEventListener("click", () => {
  if (meuBichinho.fome >= 100) return;
  meuBichinho.fome = Math.min(100, meuBichinho.fome + 20);
  adicionarExperiencia(5);
});

botaoBrincar.addEventListener("click", () => {
  if (meuBichinho.felicidade >= 100) return;
  meuBichinho.felicidade = Math.min(100, meuBichinho.felicidade + 20);
  meuBichinho.fome = Math.max(0, meuBichinho.fome - 5);
  adicionarExperiencia(8);
});

botaoLimpar.addEventListener("click", () => {
  if (meuBichinho.higiene >= 100) return;
  meuBichinho.higiene = Math.min(100, meuBichinho.higiene + 20);
  adicionarExperiencia(3);
});

botaoMedicar.addEventListener("click", () => {
  if (meuBichinho.saude >= 100) return;
  meuBichinho.saude = Math.min(100, meuBichinho.saude + 20);
  adicionarExperiencia(5);
});

// Event listener para o botão de reinício
botaoReiniciar.addEventListener("click", () => {
  // Limpa o nome e recarrega a página para reiniciar completamente
  meuBichinho.nome = "Bichinho";
  localStorage.removeItem("meuBichinho");
  location.reload();
});

// Event listeners para a loja
botaoLoja.addEventListener("click", abrirLoja);
botaoSairLoja.addEventListener("click", fecharLoja);

// Event listeners para mini games
botaoMiniGames.addEventListener("click", abrirMiniGames);
botaoSairMiniGames.addEventListener("click", fecharMiniGames);

// Event listeners para os botões de comprar/equipar acessórios
document.addEventListener("DOMContentLoaded", function() {
  const botoesComprar = document.querySelectorAll(".botao-comprar");
  botoesComprar.forEach((botao) => {
    botao.addEventListener("click", function() {
      const acessorio = this.getAttribute("data-acessorio");
      equiparOuDesequiparAcessorio(acessorio);
    });
  });
});

// Adiciona container para acessórios no bichinho ao carregar a página
window.addEventListener("load", function() {
  const tamagotchiContainer = document.querySelector(".tamagotchi-container");
  const acessoriosContainer = document.createElement("div");
  acessoriosContainer.id = "acessorios-bichinho";
  acessoriosContainer.className = "acessorios-bichinho";
  tamagotchiContainer.appendChild(acessoriosContainer);

  // Carrega acessórios se existirem
  if (meuBichinho.acessorios) {
    atualizarAcessorios();
  }
});

// ===== INICIALIZAÇÃO DO JOGO =====
carregarDados();