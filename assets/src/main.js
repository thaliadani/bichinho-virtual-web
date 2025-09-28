// ===== SELEÇÃO DE ELEMENTOS DO DOM =====

// Agrupa todas as referências para elementos HTML, facilitando a manipulação do DOM.
const telaBoasVindas = document.getElementById("boas-vindas");
const containerJogo = document.getElementById("container-jogo");

const notificacaoAudio = document.getElementById("notificacao-audio");
const botaoAtivarAudio = document.getElementById("botao-ativar-audio");

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
const containerOpcoesMiniGames = document.getElementById("opcoes-mini-games");

// Elementos do Jogo da Velha
const botaoJogarJogoDaVelha = document.getElementById("botao-jogar-jogo-da-velha");
const botaoVoltarJogoDaVelha = document.getElementById("botao-voltar-jogo-da-velha");
const containerJogoDaVelha = document.getElementById("jogo-da-velha-container");

const jogoDaVelhaBoard = document.getElementById("jogo-da-velha-board");
const celulas = document.querySelectorAll("#jogo-da-velha-board .celula");
const statusJogoVelha = document.getElementById("jogo-da-velha-status");
const reiniciarJogoVelha = document.getElementById("reiniciar-jogo-velha");

//Elementos do Jogo da Memoria
const botaoJogarJogoDaMemoria = document.getElementById("botao-jogar-jogo-da-memoria");
const botaoVoltarJogoDaMemoria = document.getElementById("botao-voltar-jogo-da-memoria");
const containerJogoDaMemoria = document.getElementById("jogo-da-memoria-container");

const jogoDaMemoriaCartas = document.getElementById("jogo-da-memoria-board");

const statusJogoMemoria = document.getElementById("jogo-da-memoria-status");

const botaoReiniciarJogoMemoria = document.getElementById("reiniciar-jogo-memoria");

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

const PRECOS_ACESSORIOS = {
    coroa: 10,
    "chapeu-laco": 10,
    "chapeu-cartola": 10,
    laco: 10,
};

const condicoesDeVitoria = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

// ===== VARIÁVEIS GLOBAIS DO JOGO =====
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

let gameLoop;
let boardState = ["", "", "", "", "", "", "", "", ""];
let jogoAtivo = true;

// ===== FUNÇÕES PRINCIPAIS DO JOGO =====

function atualizarUI() {
    statusFome.style.width = meuBichinho.fome + "%";
    statusFelicidade.style.width = meuBichinho.felicidade + "%";
    statusHigiene.style.width = meuBichinho.higiene + "%";
    statusSaude.style.width = meuBichinho.saude + "%";
    emojiBichinhoElemento.textContent = EMOJIS_BICHINHOS[meuBichinho.tipo];

    if (meuBichinho.saude <= 0) {
        tamagotchiBichinho.style.backgroundColor = "#9e9e9e";
        tamagotchiBichinho.style.filter = "grayscale(80%)";
    } else {
        const notaGeral = (meuBichinho.fome + meuBichinho.felicidade + meuBichinho.higiene + meuBichinho.saude) / 4;
        if (notaGeral >= 70) {
            tamagotchiBichinho.style.backgroundColor = "#4caf50";
        } else if (notaGeral >= 40) {
            tamagotchiBichinho.style.backgroundColor = "#ffc107";
        } else if (notaGeral >= 10) {
            tamagotchiBichinho.style.backgroundColor = "#ff9800";
        } else {
            tamagotchiBichinho.style.backgroundColor = "#f44336";
        }
        tamagotchiBichinho.style.filter = "none";
    }

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

function adicionarMoedas(qtd) {
    coinAudio.play();
    meuBichinho.moedas += qtd;
    salvarDados();
    atualizarUI();
}

function salvarDados() {
    localStorage.setItem("meuBichinho", JSON.stringify(meuBichinho));
}

function carregarDados() {
    const dadosSalvos = localStorage.getItem("meuBichinho");
    if (dadosSalvos) {
        meuBichinho = JSON.parse(dadosSalvos);
        // Atualiza o atributo do body para indicar que o jogo está sendo carregado.
        document.body.setAttribute('data-status', 'game');
        iniciarJogo();
    } else {
        // Se não houver dados salvos, a tela de boas-vindas é mostrada.
        document.body.setAttribute('data-status', 'welcome');
        telaBoasVindas.style.display = "flex";
        containerJogo.style.display = "none";
        opcoesBichinhos[0].classList.add("selecionado");
        meuBichinho.tipo = opcoesBichinhos[0].getAttribute("data-tipo");
    }
}

function iniciarJogo() {
    telaBoasVindas.style.display = "none";
    containerJogo.style.display = "flex";
    containerJogo.style.flexDirection = "column";
    containerJogo.style.alignItems = "center";

    if (inputNome.value.trim() !== "") {
        meuBichinho.nome = inputNome.value.trim();
    }

    // Tenta iniciar a reprodução da música de fundo.
    backgroundAudio.play().catch(e => {
        // Se a reprodução automática for bloqueada, mostre a notificação.
        console.error("A reprodução automática do áudio foi bloqueada pelo navegador:", e);
        notificacaoAudio.style.display = "flex";
    });

    atualizarUI();
    salvarDados();
    gameLoop = setInterval(passarTempo, 1000);
}

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

function passarTempo() {
    if (meuBichinho.saude <= 0) {
        mensagemElemento.textContent = `Oh não! ${meuBichinho.nome} morreu.`;
        tamagotchiBichinho.style.backgroundColor = "#9e9e9e";
        tamagotchiBichinho.style.filter = "grayscale(80%)";
        tamagotchiBichinho.classList.remove("triste");

        controlarVisibilidadeBotoes(false);
        botaoReiniciar.style.display = "block";
        clearInterval(gameLoop);
        return;
    }

    meuBichinho.fome -= 1;
    meuBichinho.felicidade -= 1;
    meuBichinho.higiene -= 1;

    meuBichinho.fome = Math.max(0, meuBichinho.fome);
    meuBichinho.felicidade = Math.max(0, meuBichinho.felicidade);
    meuBichinho.higiene = Math.max(0, meuBichinho.higiene);

    if (meuBichinho.fome <= 0 || meuBichinho.felicidade <= 0 || meuBichinho.higiene <= 0) {
        meuBichinho.saude -= 2;
        meuBichinho.saude = Math.max(0, meuBichinho.saude);
    }

    atualizarUI();
    salvarDados();
}

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
    if (containerMiniGames.style.display === "none") {
        containerLoja.style.display = "flex";
    } else {
        fecharMiniGames();
        containerLoja.style.display = "flex";
    }
    atualizarBotoesLoja();
}

function fecharLoja() {
    containerLoja.style.display = "none";
}

function equiparOuDesequiparAcessorio(tipoAcessorio) {
    clickAudio.play();

    if (meuBichinho.acessorios.hasOwnProperty(tipoAcessorio)) {
        const isEquipado = meuBichinho.acessorios[tipoAcessorio].equipado;
        for (const acessorio in meuBichinho.acessorios) {
            meuBichinho.acessorios[acessorio].equipado = false;
        }
        if (!isEquipado) {
            meuBichinho.acessorios[tipoAcessorio].equipado = true;
        }
    } else {
        const preco = PRECOS_ACESSORIOS[tipoAcessorio];
        if (meuBichinho.moedas >= preco) {
            meuBichinho.moedas -= preco;
            for (const acessorio in meuBichinho.acessorios) {
                meuBichinho.acessorios[acessorio].equipado = false;
            }
            meuBichinho.acessorios[tipoAcessorio] = {
                comprado: true,
                equipado: true
            };
            coinAudio.play();
        }
    }

    salvarDados();
    atualizarUI();
    atualizarBotoesLoja();
}

function atualizarAcessorios() {
    const containerAcessorios = document.getElementById("acessorios-bichinho");
    if (!containerAcessorios) return;

    containerAcessorios.innerHTML = "";
    for (const tipoAcessorio in meuBichinho.acessorios) {
        if (meuBichinho.acessorios[tipoAcessorio].equipado) {
            const emojiAcessorio = document.createElement("div");
            emojiAcessorio.classList.add("acessorio-equipado", `${tipoAcessorio}-equipado`);

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

function exibirMensagem(texto) {
    mensagemElemento.textContent = texto;
    setTimeout(() => {
        mensagemElemento.textContent = "";
    }, 3000);
}

// ===== FUNÇÕES DE MINI GAMES =====
function abrirMiniGames() {
    if (containerLoja.style.display === "none") {
        containerMiniGames.style.display = "flex";
    } else {
        fecharLoja();
        containerMiniGames.style.display = "flex";
    }
    iniciarJogoDaVelha();
}

function fecharMiniGames() {
    containerMiniGames.style.display = "none";
}

// ===== LÓGICA DO JOGO DA VELHA =====
function iniciarJogoDaVelha() {
    boardState = ["", "", "", "", "", "", "", "", ""];
    jogoAtivo = true;
    statusJogoVelha.textContent = "Sua vez (X)!";
    reiniciarJogoVelha.style.display = "none";
    celulas.forEach(celula => {
        celula.textContent = "";
        celula.classList.remove("x", "o");
        celula.removeEventListener("click", lidarComClick);
        celula.addEventListener("click", lidarComClick, { once: true });
    });
    jogoDaVelhaBoard.style.pointerEvents = 'auto';
}

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

function checarMovimentoVencedor(player) {
    for (let i = 0; i < condicoesDeVitoria.length; i++) {
        const [a, b, c] = condicoesDeVitoria[i];
        if (boardState[a] === player && boardState[b] === player && boardState[c] === "") return c;
        if (boardState[a] === player && boardState[c] === player && boardState[b] === "") return b;
        if (boardState[b] === player && boardState[c] === player && boardState[a] === "") return a;
    }
    return null;
}

function fazerJogada(index, player) {
    boardState[index] = player;
    celulas[index].textContent = player;
    celulas[index].classList.add(player.toLowerCase());
    celulas[index].removeEventListener("click", lidarComClick);
    statusJogoVelha.textContent = `Sua vez (X)!`;
}

function checarVitoria(player) {
    return condicoesDeVitoria.some(condicao => {
        return condicao.every(index => boardState[index] === player);
    });
}

function checarEmpate() {
    return boardState.every(celula => celula !== "");
}

function finalizarJogo() {
    jogoAtivo = false;
    reiniciarJogoVelha.style.display = "block";
    jogoDaVelhaBoard.style.pointerEvents = 'auto';
}

function darRecompensa() {
    const moedasGanhas = 5;
    adicionarMoedas(moedasGanhas);
    exibirMensagem(`Você ganhou ${moedasGanhas} moedas!`);
}

// ===== LÓGICA DO JOGO DA MEMÓRIA =====
const imagensMemoria = ["🐶", "🐱", "🐰", "🐼", "🐮", "🐸"];

let cartasEscolhidas = [];

function iniciarJogoDaMemoria() {
    cartasEscolhidas = [];
    statusJogoMemoria.textContent = "Encontre os pares!";
    botaoReiniciarJogoMemoria.style.display = "none";
    jogoDaMemoriaCartas.innerHTML = "";
    const cartasDuplicadas = [...imagensMemoria, ...imagensMemoria];
    const cartasEmbaralhadas = cartasDuplicadas.sort(() => Math.random() - 0.5);
    cartasEmbaralhadas.forEach((imagem, index) => {
        const carta = document.createElement("div");
        carta.classList.add("carta-memoria");
        carta.setAttribute("data-index", index);
        carta.setAttribute("data-imagem", imagem);
        carta.textContent = "❓";
        carta.addEventListener("click", lidarComClickMemoria);
        jogoDaMemoriaCartas.appendChild(carta);
    });
}

function lidarComClickMemoria(evento) {
    const cartaClicada = evento.currentTarget;
    const imagem = cartaClicada.getAttribute("data-imagem");
    if (cartasEscolhidas.length < 2 && !cartasEscolhidas.includes(cartaClicada) && cartaClicada.textContent === "❓") {
        clickAudio.play();
        cartaClicada.textContent = imagem;
        cartasEscolhidas.push(cartaClicada);
        if (cartasEscolhidas.length === 2) {
            setTimeout(verificarPar, 1000);
        }
    }
}

function verificarPar() {
    const [carta1, carta2] = cartasEscolhidas;
    if (carta1.getAttribute("data-imagem") === carta2.getAttribute("data-imagem")) {

        carta1.removeEventListener("click", lidarComClickMemoria);

        carta2.removeEventListener("click", lidarComClickMemoria);

        carta1.setAttribute("data-encontrada", "true");

        carta2.setAttribute("data-encontrada", "true");

        const cartasEncontradas = document.querySelectorAll(".carta-memoria[data-encontrada='true']").length;

        const totalCartas = document.querySelectorAll(".carta-memoria").length;

        if (cartasEncontradas === totalCartas) {
            statusJogoMemoria.textContent = "Você venceu! 🎉";
            coinAudio.play();
            darRecompensa();
            botaoReiniciarJogoMemoria.style.display = "block";
        }
    }
    else {
        cutAudio.play();
        carta1.textContent = "❓";
        carta2.textContent = "❓";
    }
    cartasEscolhidas = [];
}

// ===== FUNÇÕES DE ÁUDIO E VOLUME =====

/**
 * Salva as configurações de volume no Local Storage.
 */
function salvarConfiguracoesDeAudio() {
    localStorage.setItem("volumeMusica", sliderMusica.value);
    localStorage.setItem("volumeSons", sliderSons.value);
}

/**
 * Carrega as configurações de volume salvas no Local Storage.
 */
function carregarConfiguracoesDeAudio() {
    const volumeMusicaSalvo = localStorage.getItem("volumeMusica");
    const volumeSonsSalvo = localStorage.getItem("volumeSons");

    if (volumeMusicaSalvo !== null) {
        const novoVolume = parseFloat(volumeMusicaSalvo) / 100;
        backgroundAudio.volume = novoVolume;
        sliderMusica.value = volumeMusicaSalvo;
    } else {
        backgroundAudio.volume = 0.1;
    }

    if (volumeSonsSalvo !== null) {
        const sonsVolume = parseFloat(volumeSonsSalvo) / 100;
        clickAudio.volume = sonsVolume;
        cutAudio.volume = sonsVolume;
        coinAudio.volume = sonsVolume;
        sliderSons.value = volumeSonsSalvo;
    } else {
        const sonsVolumePadrao = 0.2;
        clickAudio.volume = sonsVolumePadrao;
        cutAudio.volume = sonsVolumePadrao;
        coinAudio.volume = sonsVolumePadrao;
    }
}

// ===== CONFIGURAÇÃO DE EVENT LISTENERS (MONITORAMENTO DE EVENTOS) =====

botaoAtivarAudio.addEventListener('click', () => {
    // Tente reproduzir a música novamente com a interação do usuário.
    backgroundAudio.play().then(() => {
        // Se a reprodução for bem-sucedida, esconda a notificação.
        notificacaoAudio.style.display = 'none';
    }).catch(e => {
        console.error("Erro ao tentar ativar o áudio:", e);
    });
});

botaoConfig.addEventListener('click', () => {
    clickAudio.play();
    abrirConfig();
});

botaoConfigFechar.addEventListener('click', () => {
    cutAudio.play();
    fecharConfig();
});

sliderMusica.addEventListener('input', (evento) => {
    // Pega o valor do slider e o converte para o intervalo de 0 a 1.
    const valorSlider = parseFloat(evento.target.value);
    const novoVolume = valorSlider / 100;

    backgroundAudio.volume = novoVolume;

    // Se o áudio estiver pausado e o volume for maior que 0, inicie a reprodução.
    if (novoVolume > 0 && backgroundAudio.paused) {
        backgroundAudio.play().catch(e => {
            console.error("Erro ao tentar retomar a reprodução do áudio:", e);
        });
    }

    // Salva o valor do slider no localStorage.
    salvarConfiguracoesDeAudio();
});

sliderSons.addEventListener('input', (evento) => {
    // Pega o valor do slider e o converte para o intervalo de 0 a 1.
    const valorSlider = parseFloat(evento.target.value);
    const sonsVolume = valorSlider / 100;

    clickAudio.volume = sonsVolume;
    cutAudio.volume = sonsVolume;
    coinAudio.volume = sonsVolume;

    // Salva o valor do slider no localStorage.
    salvarConfiguracoesDeAudio();
});

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
    location.reload();
});

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

botaoMiniGames.addEventListener("click", () => {
    clickAudio.play();
    abrirMiniGames();
});

botaoSairMiniGames.addEventListener("click", () => {
    cutAudio.play();
    fecharMiniGames();
});

botaoVoltarJogoDaVelha.addEventListener("click", () => {
    clickAudio.play();
    containerJogoDaVelha.style.display = "none";
    containerOpcoesMiniGames.style.display = "grid";
})

botaoJogarJogoDaVelha.addEventListener("click", () => {
    clickAudio.play();
    containerJogoDaVelha.style.display = "flex";
    containerOpcoesMiniGames.style.display = "none";
})

reiniciarJogoVelha.addEventListener("click", () => {
    clickAudio.play();
    iniciarJogoDaVelha();
});

botaoJogarJogoDaMemoria.addEventListener("click", () => {
    clickAudio.play();
    containerJogoDaMemoria.style.display = "flex";
    containerOpcoesMiniGames.style.display = "none";
    iniciarJogoDaMemoria();
});

botaoVoltarJogoDaMemoria.addEventListener("click", () => {
    clickAudio.play();
    containerJogoDaMemoria.style.display = "none";
    containerOpcoesMiniGames.style.display = "grid";
});

botaoReiniciarJogoMemoria.addEventListener("click", () => {
    clickAudio.play();
    iniciarJogoDaMemoria();
});

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
carregarConfiguracoesDeAudio();
carregarDados();