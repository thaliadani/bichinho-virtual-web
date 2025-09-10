// ===== SELEÇÃO DE ELEMENTOS DO DOM =====

// Agrupa todas as referências para elementos HTML, facilitando a manipulação do DOM.
const telaBoasVindas = document.getElementById("boas-vindas");
const containerJogo = document.getElementById("container-jogo");

const tamagotchiBichinho = document.querySelector(".tamagotchi-bichinho");
const emojiBichinhoElemento = document.getElementById("emoji-bichinho");

const opcoesBichinhos = document.querySelectorAll(".opcao-bichinho");

const nomeBichinhoElemento = document.getElementById("nome-bichinho");
const inputNome = document.getElementById("input-nome");

const moedasElemento = document.getElementById("moedas");
const mensagemElemento = document.getElementById("mensagem");

// Elementos de tema
const botaoTema = document.getElementById("botao-tema");
const corpoDocumento = document.body;

// Elementos de status do bichinho
const statusFome = document.querySelector(".status-progresso.fome");
const statusFelicidade = document.querySelector(".status-progresso.felicidade");
const statusHigiene = document.querySelector(".status-progresso.higiene");
const statusSaude = document.querySelector(".status-progresso.saude");

// Botões de ação do jogo principal
const botaoAlimentar = document.getElementById("botao-alimentar");
const botaoBrincar = document.getElementById("botao-brincar");
const botaoLimpar = document.getElementById("botao-limpar");
const botaoMedicar = document.getElementById("botao-medicar");
const botaoComecar = document.getElementById("botao-comecar");
const botaoReiniciar = document.getElementById("botao-reiniciar");

// Elementos da loja
const containerLoja = document.getElementById("container-loja");
const botaoLoja = document.getElementById("botao-loja");
const botaoSairLoja = document.getElementById("botao-sair-loja");
const botoesComprar = document.querySelectorAll(".botao-comprar");

// Elementos de mini games
const containerMiniGames = document.getElementById("container-mini-games");
const botaoMiniGames = document.getElementById("botao-mini-games");
const botaoSairMiniGames = document.getElementById("botao-sair-mini-games");

// Elementos do Jogo da Velha
const jogoDaVelhaBoard = document.getElementById("jogo-da-velha-board");
const celulas = document.querySelectorAll("#jogo-da-velha-board .celula");
const statusJogoVelha = document.getElementById("jogo-da-velha-status");
const reiniciarJogoVelha = document.getElementById("reiniciar-jogo-velha");

// Elementos de configuração
const containerConfig = document.getElementById("menu-config");
const botaoConfig = document.getElementById("botao-config");
const botaoConfigFechar = document.getElementById("botao-config-fechar");

const sliderMusica = document.getElementById("input-musica");
const sliderSons = document.getElementById("input-sons");

// Elementos de Áudio
const backgroundAudio = new Audio("../../assets/sounds/funbgm032014(fun).wav");
const clickAudio = new Audio("../../assets/sounds/Menu Selection Click.wav");
const cutAudio = new Audio("../../assets/sounds/zipclick.flac");
const coinAudio = new Audio("../../assets/sounds/coinsplash.ogg");

// ===== CONSTANTES E CONFIGURAÇÕES FIXAS =====
/**
 * Mapeamento de emojis para cada tipo de bichinho disponível.
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

/**
 * Mapeamento de preços para cada acessório na loja.
 */
const PRECOS_ACESSORIOS = {
    coroa: 10,
    "chapeu-laco": 10,
    "chapeu-cartola": 10,
    laco: 10,
};

// Condições de vitória para o Jogo da Velha.
const condicoesDeVitoria = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Linhas
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Colunas
    [0, 4, 8], [2, 4, 6]  // Diagonais
];


// ===== VARIÁVEIS GLOBAIS DO JOGO =====
// Objeto que armazena o estado atual do bichinho.
let meuBichinho = {
    nome: "Bichinho",
    tipo: "cachorro",
    fome: 100,
    felicidade: 100,
    higiene: 100,
    saude: 100,
    moedas: 10,
    acessorios: {},
};

let gameLoop; // Variável para o intervalo de tempo do jogo principal.

// Variáveis de estado do Jogo da Velha
let boardState = ["", "", "", "", "", "", "", "", ""];
let jogoAtivo = true; // Controla se o mini game está em andamento.

// ===== FUNÇÕES PRINCIPAIS DO JOGO =====

/**
 * Atualiza a interface do usuário com os dados atuais do bichinho.
 * Isso inclui as barras de status, o emoji, o nome e as moedas.
 * Também controla a cor de fundo do bichinho com base na sua saúde geral.
 */
function atualizarUI() {
    statusFome.style.width = meuBichinho.fome + "%";
    statusFelicidade.style.width = meuBichinho.felicidade + "%";
    statusHigiene.style.width = meuBichinho.higiene + "%";
    statusSaude.style.width = meuBichinho.saude + "%";

    emojiBichinhoElemento.textContent = EMOJIS_BICHINHOS[meuBichinho.tipo];

    if (meuBichinho.saude <= 0) {
        // Estado de "morte" do bichinho
        tamagotchiBichinho.style.backgroundColor = "#9e9e9e";
        tamagotchiBichinho.style.filter = "grayscale(80%)";
    } else {
        // Altera a cor de fundo do bichinho com base na média de seus status
        const notaGeral = (meuBichinho.fome + meuBichinho.felicidade + meuBichinho.higiene + meuBichinho.saude) / 4;
        if (notaGeral >= 70) {
            tamagotchiBichinho.style.backgroundColor = "#4caf50"; // Verde
        } else if (notaGeral >= 40) {
            tamagotchiBichinho.style.backgroundColor = "#ffc107"; // Amarelo
        } else if (notaGeral >= 10) {
            tamagotchiBichinho.style.backgroundColor = "#ff9800"; // Laranja
        } else {
            tamagotchiBichinho.style.backgroundColor = "#f44336"; // Vermelho
        }
        tamagotchiBichinho.style.filter = "none";
    }

    // Desabilita botões de ação se o status já estiver no máximo
    botaoAlimentar.disabled = meuBichinho.fome >= 100;
    botaoBrincar.disabled = meuBichinho.felicidade >= 100;
    botaoLimpar.disabled = meuBichinho.higiene >= 100;
    botaoMedicar.disabled = meuBichinho.saude >= 100;

    nomeBichinhoElemento.textContent = meuBichinho.nome;
    if (moedasElemento) {
        moedasElemento.textContent = meuBichinho.moedas;
    }

    atualizarAcessorios();
}

/**
 * Adiciona moedas ao saldo do bichinho e salva os dados.
 * @param {number} qtd - A quantidade de moedas a ser adicionada.
 */
function adicionarMoedas(qtd) {
    coinAudio.play();
    meuBichinho.moedas += qtd;
    salvarDados();
    atualizarUI();
}

/**
 * Salva o estado atual do bichinho no Local Storage do navegador.
 */
function salvarDados() {
    localStorage.setItem("meuBichinho", JSON.stringify(meuBichinho));
}

/**
 * Carrega os dados do bichinho do Local Storage.
 * Se houver dados salvos, o jogo é iniciado. Caso contrário, a tela de boas-vindas é exibida.
 */
function carregarDados() {
    const dadosSalvos = localStorage.getItem("meuBichinho");
    if (dadosSalvos) {
        meuBichinho = JSON.parse(dadosSalvos);
        iniciarJogo();
    } else {
        telaBoasVindas.style.display = "flex";
        containerJogo.style.display = "none";
        // Define o bichinho padrão se não houver dados salvos.
        opcoesBichinhos[0].classList.add("selecionado");
        meuBichinho.tipo = opcoesBichinhos[0].getAttribute("data-tipo");
    }
}

/**
 * Inicia o jogo principal: esconde a tela de boas-vindas, mostra o jogo
 * e inicia o loop principal do jogo.
 */
function iniciarJogo() {
    telaBoasVindas.style.display = "none";
    containerJogo.style.display = "flex";
    containerJogo.style.flexDirection = "column";
    containerJogo.style.alignItems = "center";

    if (inputNome.value.trim() !== "") {
        meuBichinho.nome = inputNome.value.trim();
    }

    atualizarUI();
    salvarDados();
    gameLoop = setInterval(passarTempo, 1000); // O loop do jogo roda a cada 1 segundo.
}

/**
 * Reinicia o estado do bichinho para os valores padrão.
 */
function reiniciarJogo() {
    meuBichinho.fome = 100;
    meuBichinho.felicidade = 100;
    meuBichinho.higiene = 100;
    meuBichinho.saude = 100;
    meuBichinho.moedas = 10;
    meuBichinho.acessorios = {};

    mensagemElemento.textContent = "";
    tamagotchiBichinho.style.backgroundColor = "#4caf50";
    tamagotchiBichinho.style.filter = "none";
    tamagotchiBichinho.classList.remove("triste");

    controlarVisibilidadeBotoes(true);
    botaoReiniciar.style.display = "none";

    atualizarUI();
    salvarDados();
    gameLoop = setInterval(passarTempo, 1000);
}

/**
 * Função principal do game loop, chamada a cada segundo.
 * Diminui os status do bichinho e verifica se ele morreu.
 */
function passarTempo() {
    if (meuBichinho.saude <= 0) {
        // Lógica de morte do bichinho
        mensagemElemento.textContent = `Oh não! ${meuBichinho.nome} morreu.`;
        tamagotchiBichinho.style.backgroundColor = "#9e9e9e";
        tamagotchiBichinho.style.filter = "grayscale(80%)";
        tamagotchiBichinho.classList.remove("triste");

        controlarVisibilidadeBotoes(false);
        botaoReiniciar.style.display = "block";
        clearInterval(gameLoop); // Para o game loop.
        return;
    }

    // Diminui os status do bichinho
    meuBichinho.fome -= 1;
    meuBichinho.felicidade -= 1;
    meuBichinho.higiene -= 1;

    // Garante que os valores não fiquem negativos
    meuBichinho.fome = Math.max(0, meuBichinho.fome);
    meuBichinho.felicidade = Math.max(0, meuBichinho.felicidade);
    meuBichinho.higiene = Math.max(0, meuBichinho.higiene);

    // Se algum status está em zero, a saúde diminui
    if (meuBichinho.fome <= 0 || meuBichinho.felicidade <= 0 || meuBichinho.higiene <= 0) {
        meuBichinho.saude -= 2;
        meuBichinho.saude = Math.max(0, meuBichinho.saude);
    }

    atualizarUI();
    salvarDados();
}

/**
 * Controla a visibilidade dos botões de ação do jogo.
 * @param {boolean} visivel - 'true' para mostrar os botões, 'false' para escondê-los.
 */
function controlarVisibilidadeBotoes(visivel) {
    const botoesContainer = document.querySelector(".botoes-container");
    botoesContainer.style.display = visivel ? "flex" : "none";
}

// ===== FUNÇÕES DE CONFIGURAÇÃO (TEMA E ÁUDIO) =====
function abrirConfig() {
    containerConfig.style.display = "flex";
}

function fecharConfig() {
    containerConfig.style.display = "none";
}

/**
 * Aplica o tema (claro ou escuro) salvo no Local Storage.
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
function abrirLoja() {
    containerLoja.style.display = "flex";
    atualizarBotoesLoja();
}

function fecharLoja() {
    containerLoja.style.display = "none";
}

/**
 * Gerencia a compra, equipa e desequipa acessórios.
 * @param {string} tipoAcessorio - O tipo de acessório a ser manipulado.
 */
function equiparOuDesequiparAcessorio(tipoAcessorio) {
    clickAudio.play();

    // Se o acessório já foi comprado
    if (meuBichinho.acessorios.hasOwnProperty(tipoAcessorio)) {
        const isEquipado = meuBichinho.acessorios[tipoAcessorio].equipado;
        // Desequipa todos os acessórios antes de equipar um novo
        for (const acessorio in meuBichinho.acessorios) {
            meuBichinho.acessorios[acessorio].equipado = false;
        }
        // Se o acessório clicado não estava equipado, ele será agora.
        if (!isEquipado) {
            meuBichinho.acessorios[tipoAcessorio].equipado = true;
        }
    } else {
        // Lógica de compra
        const preco = PRECOS_ACESSORIOS[tipoAcessorio];
        if (meuBichinho.moedas >= preco) {
            meuBichinho.moedas -= preco;
            // Desequipa os outros ao comprar um novo
            for (const acessorio in meuBichinho.acessorios) {
                meuBichinho.acessorios[acessorio].equipado = false;
            }
            meuBichinho.acessorios[tipoAcessorio] = {
                comprado: true,
                equipado: true
            };
            coinAudio.play();
            exibirMensagem(`Você comprou e equipou o acessório!`);
        } else {
            exibirMensagem("Moedas insuficientes para comprar este acessório!");
        }
    }

    salvarDados();
    atualizarUI();
    atualizarBotoesLoja();
}

/**
 * Adiciona os emojis dos acessórios equipados ao bichinho.
 */
function atualizarAcessorios() {
    const containerAcessorios = document.getElementById("acessorios-bichinho");
    if (!containerAcessorios) return;

    containerAcessorios.innerHTML = ""; // Limpa os acessórios atuais
    for (const tipoAcessorio in meuBichinho.acessorios) {
        if (meuBichinho.acessorios[tipoAcessorio].equipado) {
            const emojiAcessorio = document.createElement("div");
            emojiAcessorio.classList.add("acessorio-equipado", `${tipoAcessorio}-equipado`);

            // Mapeia o nome do acessório para o emoji correspondente
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
        }
    }
}

/**
 * Atualiza o texto e a aparência dos botões da loja com base no estado de compra dos acessórios.
 */
function atualizarBotoesLoja() {
    botoesComprar.forEach(botao => {
        const tipoAcessorio = botao.getAttribute("data-acessorio");
        const preco = PRECOS_ACESSORIOS[tipoAcessorio];
        const itemComprado = meuBichinho.acessorios.hasOwnProperty(tipoAcessorio);
        const itemEquipado = itemComprado && meuBichinho.acessorios[tipoAcessorio].equipado;

        if (itemComprado) {
            botao.textContent = itemEquipado ? "Desequipar" : "Equipar";
            botao.style.backgroundColor = itemEquipado ? "#f44336" : "#4caf50";
        } else {
            botao.textContent = `Comprar (${preco}🪙)`;
            botao.style.backgroundColor = meuBichinho.moedas >= preco ? "#4caf50" : "#9e9e9e";
            botao.disabled = meuBichinho.moedas < preco;
        }
    });
}

/**
 * Exibe uma mensagem temporária na tela.
 * @param {string} texto - A mensagem a ser exibida.
 */
function exibirMensagem(texto) {
    mensagemElemento.textContent = texto;
    setTimeout(() => {
        mensagemElemento.textContent = "";
    }, 3000);
}


// ===== FUNÇÕES DE MINI GAMES =====
function abrirMiniGames() {
    containerMiniGames.style.display = "flex";
    iniciarJogoDaVelha();
}

function fecharMiniGames() {
    containerMiniGames.style.display = "none";
}


// ===== LÓGICA DO JOGO DA VELHA =====

/**
 * Reseta o tabuleiro e o estado do Jogo da Velha para um novo jogo.
 */
function iniciarJogoDaVelha() {
    boardState = ["", "", "", "", "", "", "", "", ""];
    jogoAtivo = true;
    statusJogoVelha.textContent = "Sua vez (X)!";
    reiniciarJogoVelha.style.display = "none";
    celulas.forEach(celula => {
        celula.textContent = "";
        celula.classList.remove("x", "o");
        // Remove e adiciona o evento para evitar múltiplos listeners.
        celula.removeEventListener("click", lidarComClick);
        celula.addEventListener("click", lidarComClick, { once: true });
    });
    jogoDaVelhaBoard.style.pointerEvents = 'auto'; // Reativa os cliques.
}

/**
 * Manipula o clique do jogador e inicia a jogada do bot.
 * @param {Event} evento - O evento de clique.
 */
function lidarComClick(evento) {
    clickAudio.play();
    const celulaClicada = evento.target;
    const index = celulaClicada.getAttribute("data-index");

    if (boardState[index] !== "" || !jogoAtivo) {
        return;
    }

    fazerJogada(index, "X");

    if (checarVitoria("X")) {
        statusJogoVelha.textContent = `Parabéns, você venceu! 🎉`;
        darRecompensa();
        finalizarJogo();
        return;
    }

    if (checarEmpate()) {
        statusJogoVelha.textContent = "Empate!";
        finalizarJogo();
        return;
    }

    statusJogoVelha.textContent = "Vez do computador (O)...";
    jogoDaVelhaBoard.style.pointerEvents = 'none';
    setTimeout(jogadaDoBot, 1000);
}

/**
 * Implementa a lógica de jogada do computador (bot).
 * A lógica segue uma hierarquia de prioridades:
 * 1. Tentar vencer.
 * 2. Bloquear a vitória do jogador.
 * 3. Pegar o centro.
 * 4. Fazer uma jogada aleatória.
 */
function jogadaDoBot() {
    const movimentoVitoria = checarMovimentoVencedor("O");
    if (movimentoVitoria !== null) {
        fazerJogada(movimentoVitoria, "O");
        statusJogoVelha.textContent = "O computador venceu! 🤖";
        finalizarJogo();
        return;
    }

    const movimentoBloqueio = checarMovimentoVencedor("X");
    if (movimentoBloqueio !== null) {
        fazerJogada(movimentoBloqueio, "O");
        if (checarEmpate()) {
            statusJogoVelha.textContent = "Empate!";
            finalizarJogo();
        }
        jogoDaVelhaBoard.style.pointerEvents = 'auto';
        return;
    }

    if (boardState[4] === "") {
        fazerJogada(4, "O");
        jogoDaVelhaBoard.style.pointerEvents = 'auto';
        return;
    }

    const movimentosDisponiveis = boardState.map((val, index) => val === "" ? index : null).filter(val => val !== null);
    if (movimentosDisponiveis.length > 0) {
        const randomIndex = Math.floor(Math.random() * movimentosDisponiveis.length);
        const movimentoAleatorio = movimentosDisponiveis[randomIndex];
        fazerJogada(movimentoAleatorio, "O");
        if (checarEmpate()) {
            statusJogoVelha.textContent = "Empate!";
            finalizarJogo();
        }
        jogoDaVelhaBoard.style.pointerEvents = 'auto';
        return;
    }
    jogoDaVelhaBoard.style.pointerEvents = 'auto';
}

/**
 * Checa se um jogador pode vencer na próxima jogada e retorna o índice da célula para a vitória.
 * @param {string} player - O jogador a ser verificado ("X" ou "O").
 * @returns {number|null} O índice da célula para a vitória ou null se não houver.
 */
function checarMovimentoVencedor(player) {
    for (let i = 0; i < condicoesDeVitoria.length; i++) {
        const [a, b, c] = condicoesDeVitoria[i];
        if (boardState[a] === player && boardState[b] === player && boardState[c] === "") return c;
        if (boardState[a] === player && boardState[c] === player && boardState[b] === "") return b;
        if (boardState[b] === player && boardState[c] === player && boardState[a] === "") return a;
    }
    return null;
}

/**
 * Executa uma jogada em uma célula específica.
 * @param {number} index - O índice da célula.
 * @param {string} player - O jogador ("X" ou "O").
 */
function fazerJogada(index, player) {
    boardState[index] = player;
    celulas[index].textContent = player;
    celulas[index].classList.add(player.toLowerCase());
    celulas[index].removeEventListener("click", lidarComClick);
    statusJogoVelha.textContent = `Sua vez (X)!`;
}

/**
 * Verifica se um jogador venceu o jogo.
 * @param {string} player - O jogador a ser verificado ("X" ou "O").
 * @returns {boolean} True se o jogador venceu, false caso contrário.
 */
function checarVitoria(player) {
    return condicoesDeVitoria.some(condicao => {
        return condicao.every(index => boardState[index] === player);
    });
}

/**
 * Verifica se o jogo da velha resultou em empate.
 * @returns {boolean} True se for um empate, false caso contrário.
 */
function checarEmpate() {
    return boardState.every(celula => celula !== "");
}

/**
 * Finaliza o jogo da velha, desabilitando novas jogadas e mostrando o botão de reiniciar.
 */
function finalizarJogo() {
    jogoAtivo = false;
    reiniciarJogoVelha.style.display = "block";
    jogoDaVelhaBoard.style.pointerEvents = 'auto';
}

/**
 * Concede moedas ao jogador como recompensa.
 */
function darRecompensa() {
    const moedasGanhas = 5;
    adicionarMoedas(moedasGanhas);
    exibirMensagem(`Você ganhou ${moedasGanhas} moedas!`);
}

// Configurações de Áudio Padrão
backgroundAudio.loop = true;
backgroundAudio.volume = 0.04;
clickAudio.volume = 0.2;
cutAudio.volume = 0.2;
coinAudio.volume = 0.2;


// ===== CONFIGURAÇÃO DE EVENT LISTENERS (MONITORAMENTO DE EVENTOS) =====
// Eventos de configurações de áudio
botaoConfig.addEventListener('click', abrirConfig);
botaoConfigFechar.addEventListener('click', fecharConfig);

sliderMusica.addEventListener('input', (evento) => {
    backgroundAudio.volume = evento.target.value;
});

sliderSons.addEventListener('input', (evento) => {
    clickAudio.volume = evento.target.value;
    cutAudio.volume = evento.target.value;
});

// Eventos de tema
document.addEventListener('DOMContentLoaded', aplicarTemaSalvo);
botaoTema.addEventListener('click', () => {
    clickAudio.play();
    corpoDocumento.classList.toggle('dark-mode');
    if (corpoDocumento.classList.contains('dark-mode')) {
        localStorage.setItem('tema', 'escuro');
        botaoTema.textContent = '☀️';
    } else {
        localStorage.setItem('tema', 'claro');
        botaoTema.textContent = '🌑';
    }
});

// Eventos da tela de boas-vindas
opcoesBichinhos.forEach((opcao) => {
    opcao.addEventListener("click", () => {
        clickAudio.play();
        opcoesBichinhos.forEach((o) => o.classList.remove("selecionado"));
        opcao.classList.add("selecionado");
        meuBichinho.tipo = opcao.getAttribute("data-tipo");
    });
});

botaoComecar.addEventListener("click", () => {
    clickAudio.play();
    if (inputNome.value.trim() !== "") {
        iniciarJogo();
    } else {
        inputNome.focus();
        inputNome.classList.add("input-erro");
    }
});

// Ações de cuidado com o bichinho
botaoAlimentar.addEventListener("click", () => {
    clickAudio.play();
    if (meuBichinho.fome >= 100) return;
    meuBichinho.fome = Math.min(100, meuBichinho.fome + 20);
    exibirMensagem("Bichinho alimentado!");
    atualizarUI();
    salvarDados();
});

botaoBrincar.addEventListener("click", () => {
    clickAudio.play();
    if (meuBichinho.felicidade >= 100) return;
    meuBichinho.felicidade = Math.min(100, meuBichinho.felicidade + 20);
    meuBichinho.fome = Math.max(0, meuBichinho.fome - 5);
    exibirMensagem("Que divertido!");
    atualizarUI();
    salvarDados();
});

botaoLimpar.addEventListener("click", () => {
    clickAudio.play();
    if (meuBichinho.higiene >= 100) return;
    meuBichinho.higiene = Math.min(100, meuBichinho.higiene + 20);
    exibirMensagem("Agora está limpinho!");
    atualizarUI();
    salvarDados();
});

botaoMedicar.addEventListener("click", () => {
    clickAudio.play();
    if (meuBichinho.saude >= 100) return;
    meuBichinho.saude = Math.min(100, meuBichinho.saude + 20);
    exibirMensagem("Bichinho medicado!");
    atualizarUI();
    salvarDados();
});

botaoReiniciar.addEventListener("click", () => {
    clickAudio.play();
    meuBichinho.nome = "Bichinho";
    localStorage.removeItem("meuBichinho");
    location.reload(); // Recarrega a página para reiniciar completamente o jogo.
});

// Eventos da loja
botaoLoja.addEventListener("click", () => {
    clickAudio.play();
    abrirLoja();
});
botaoSairLoja.addEventListener("click", () => {
    cutAudio.play();
    fecharLoja();
});
botoesComprar.forEach((botao) => {
    botao.addEventListener("click", function () {
        const acessorio = this.getAttribute("data-acessorio");
        equiparOuDesequiparAcessorio(acessorio);
    });
});

// Eventos dos mini games
botaoMiniGames.addEventListener("click", () => {
    clickAudio.play();
    abrirMiniGames();
});
botaoSairMiniGames.addEventListener("click", () => {
    cutAudio.play();
    fecharMiniGames();
});

// Eventos do Jogo da Velha
reiniciarJogoVelha.addEventListener("click", () => {
    clickAudio.play();
    iniciarJogoDaVelha();
});

// Lógica para adicionar o container de acessórios dinamicamente
window.addEventListener("load", function () {
    const tamagotchiContainer = document.querySelector(".tamagotchi-container");
    const acessoriosContainer = document.createElement("div");
    acessoriosContainer.id = "acessorios-bichinho";
    acessoriosContainer.className = "acessorios-bichinho";
    tamagotchiContainer.appendChild(acessoriosContainer);
    if (meuBichinho.acessorios) {
        atualizarAcessorios();
    }
});

// ===== INICIALIZAÇÃO DO JOGO =====
backgroundAudio.play();
carregarDados();