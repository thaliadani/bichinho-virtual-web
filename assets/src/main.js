// ===== SELEÇÃO DE ELEMENTOS DO DOM =====
const telaBoasVindas = document.getElementById("boas-vindas");
const containerJogo = document.getElementById("container-jogo");
const tamagotchiBichinho = document.querySelector(".tamagotchi-bichinho");
const emojiBichinhoElemento = document.getElementById("emoji-bichinho");
const opcoesBichinhos = document.querySelectorAll(".opcao-bichinho");
const nomeBichinhoElemento = document.getElementById("nome-bichinho");
const inputNome = document.getElementById("input-nome");

// Elementos de status
const statusFome = document.querySelector(".status-progresso.fome");
const statusFelicidade = document.querySelector(".status-progresso.felicidade");
const statusHigiene = document.querySelector(".status-progresso.higiene");
const statusSaude = document.querySelector(".status-progresso.saude");

// Elementos de ação
const botaoAlimentar = document.getElementById("botao-alimentar");
const botaoBrincar = document.getElementById("botao-brincar");
const botaoLimpar = document.getElementById("botao-limpar");
const botaoMedicar = document.getElementById("botao-medicar");
const botaoComecar = document.getElementById("botao-comecar");
const botaoReiniciar = document.getElementById("botao-reiniciar");

// Elementos de menu e loja
const mensagemElemento = document.getElementById("mensagem");
const containerLoja = document.getElementById("container-loja");
const botaoLoja = document.getElementById("botao-loja");
const botaoSairLoja = document.getElementById("botao-sair-loja");
const containerMiniGames = document.getElementById("container-mini-games");
const botaoMiniGames = document.getElementById("botao-mini-games");
const botaoSairMiniGames = document.getElementById("botao-sair-mini-games");
const botaoTema = document.getElementById("botao-tema");
const corpoDocumento = document.body;
const moedasElemento = document.getElementById("moedas");

// ===== SELEÇÃO DE ELEMENTOS DO JOGO DA VELHA =====
const jogoDaVelhaBoard = document.getElementById("jogo-da-velha-board");
const celulas = document.querySelectorAll("#jogo-da-velha-board .celula");
const statusJogoVelha = document.getElementById("jogo-da-velha-status");
const reiniciarJogoVelha = document.getElementById("reiniciar-jogo-velha");

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

/**
 * Mapeamento de preços para cada acessório
 */
const PRECOS_ACESSORIOS = {
    coroa: 10,
    "chapeu-laco": 10,
    "chapeu-cartola": 10,
    laco: 10,
};

// Condições de vitória para o Jogo da Velha
const condicoesDeVitoria = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Linhas
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Colunas
    [0, 4, 8], [2, 4, 6]  // Diagonais
];

// ===== VARIÁVEIS GLOBAIS =====
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

// Variáveis de estado do Jogo da Velha
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
        iniciarJogo();
    } else {
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

    if (meuBichinho.fome < 0) meuBichinho.fome = 0;
    if (meuBichinho.felicidade < 0) meuBichinho.felicidade = 0;
    if (meuBichinho.higiene < 0) meuBichinho.higiene = 0;

    if (meuBichinho.fome <= 0 || meuBichinho.felicidade <= 0 || meuBichinho.higiene <= 0) {
        meuBichinho.saude -= 2;
        if (meuBichinho.saude < 0) meuBichinho.saude = 0;
    }

    atualizarUI();
    salvarDados();
}

function controlarVisibilidadeBotoes(visivel) {
    const botoesContainer = document.querySelector(".botoes-container");
    botoesContainer.style.display = visivel ? "flex" : "none";
}

// ===== FUNÇÕES DE TEMAS =====
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

function equiparOuDesequiparAcessorio(tipoAcessorio) {
    // Lógica para garantir que apenas um acessório esteja equipado por vez
    if (meuBichinho.acessorios.hasOwnProperty(tipoAcessorio)) {
        const isEquipado = meuBichinho.acessorios[tipoAcessorio].equipado;

        // Desequipa todos os acessórios
        for (const acessorio in meuBichinho.acessorios) {
            meuBichinho.acessorios[acessorio].equipado = false;
        }

        // Se o acessório clicado não estava equipado, ele será agora
        if (!isEquipado) {
            meuBichinho.acessorios[tipoAcessorio].equipado = true;
        }

    } else {
        const preco = PRECOS_ACESSORIOS[tipoAcessorio];
        if (meuBichinho.moedas >= preco) {
            meuBichinho.moedas -= preco;
            // Desequipa todos os outros ao comprar um novo
            for (const acessorio in meuBichinho.acessorios) {
                meuBichinho.acessorios[acessorio].equipado = false;
            }
            meuBichinho.acessorios[tipoAcessorio] = {
                comprado: true,
                equipado: true
            };

            exibirMensagem(`Você comprou e equipou o acessório!`);
        } else {
            exibirMensagem("Moedas insuficientes para comprar este acessório!");
        }
    }

    salvarDados();
    atualizarUI();
    atualizarBotoesLoja();
}

function atualizarAcessorios() {
    const containerAcessorios = document.getElementById("acessorios-bichinho");

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
    const botoesComprar = document.querySelectorAll(".botao-comprar");
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
    containerMiniGames.style.display = "flex";
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
        celula.addEventListener("click", lidarComClick, { once: true });
    });
    // Garante que o tabuleiro está ativo no início do jogo
    jogoDaVelhaBoard.style.pointerEvents = 'auto';
}

function lidarComClick(evento) {
    const celulaClicada = evento.target;
    const index = celulaClicada.getAttribute("data-index");

    if (boardState[index] !== "" || !jogoAtivo) {
        return;
    }

    // Jogada do jogador humano (X)
    boardState[index] = "X";
    celulaClicada.textContent = "X";
    celulaClicada.classList.add("x");

    // Checa se o jogador venceu ou se deu empate
    if (checarVitoria("X")) {
        statusJogoVelha.textContent = `Parabéns, você venceu! 🎉`;
        darRecompensa();
        jogoAtivo = false;
        reiniciarJogoVelha.style.display = "block";
        return;
    }

    if (checarEmpate()) {
        statusJogoVelha.textContent = "Empate!";
        jogoAtivo = false;
        reiniciarJogoVelha.style.display = "block";
        return;
    }

    // Se o jogo continua, é a vez do bot
    statusJogoVelha.textContent = "Vez do computador (O)...";
    // Desativa os cliques do usuário enquanto o bot pensa
    jogoDaVelhaBoard.style.pointerEvents = 'none';

    // Pequeno atraso para a jogada do bot
    setTimeout(jogadaDoBot, 1000);
}

function jogadaDoBot() {
    // 1. Tenta vencer o jogo
    const movimentoVitoria = checarMovimentoVencedor("O");
    if (movimentoVitoria !== null) {
        fazerJogada(movimentoVitoria, "O");
        statusJogoVelha.textContent = "O computador venceu! 🤖";
        jogoAtivo = false;
        reiniciarJogoVelha.style.display = "block";
        jogoDaVelhaBoard.style.pointerEvents = 'auto';
        return;
    }

    // 2. Tenta bloquear o jogador
    const movimentoBloqueio = checarMovimentoVencedor("X");
    if (movimentoBloqueio !== null) {
        fazerJogada(movimentoBloqueio, "O");
        // Verifica se o jogo acabou após o movimento de bloqueio
        if (checarEmpate()) {
            statusJogoVelha.textContent = "Empate!";
            jogoAtivo = false;
            reiniciarJogoVelha.style.display = "block";
        }
        // ******* TRECHO CORRIGIDO *******
        // Garante que os cliques voltem a funcionar mesmo após o movimento do bot
        jogoDaVelhaBoard.style.pointerEvents = 'auto';
        return;
    }

    // 3. Tenta pegar o centro
    if (boardState[4] === "") {
        fazerJogada(4, "O");
        jogoDaVelhaBoard.style.pointerEvents = 'auto';
        return;
    }

    // 4. Escolhe um movimento aleatório
    const movimentosDisponiveis = boardState.map((val, index) => val === "" ? index : null).filter(val => val !== null);
    if (movimentosDisponiveis.length > 0) {
        const randomIndex = Math.floor(Math.random() * movimentosDisponiveis.length);
        const movimentoAleatorio = movimentosDisponiveis[randomIndex];
        fazerJogada(movimentoAleatorio, "O");

        // Verifica se o jogo acabou após o movimento aleatório
        if (checarEmpate()) {
            statusJogoVelha.textContent = "Empate!";
            jogoAtivo = false;
            reiniciarJogoVelha.style.display = "block";
        }
        // ******* TRECHO CORRIGIDO *******
        // Garante que os cliques voltem a funcionar mesmo após o movimento do bot
        jogoDaVelhaBoard.style.pointerEvents = 'auto';
        return;
    }

    // Se por algum motivo o jogo não terminou, reativa os cliques
    // ******* TRECHO CORRIGIDO *******
    // Este código garante que os cliques sempre serão reativados
    jogoDaVelhaBoard.style.pointerEvents = 'auto';
}

function checarMovimentoVencedor(player) {
    for (let i = 0; i < condicoesDeVitoria.length; i++) {
        const [a, b, c] = condicoesDeVitoria[i];
        if (boardState[a] === player && boardState[b] === player && boardState[c] === "") {
            return c;
        }
        if (boardState[a] === player && boardState[c] === player && boardState[b] === "") {
            return b;
        }
        if (boardState[b] === player && boardState[c] === player && boardState[a] === "") {
            return a;
        }
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
        return condicao.every(index => {
            return boardState[index] === player;
        });
    });
}

function checarEmpate() {
    return boardState.every(celula => celula !== "");
}

function darRecompensa() {
    const moedasGanhas = 5;
    adicionarMoedas(moedasGanhas);
    exibirMensagem(`Você ganhou ${moedasGanhas} moedas!`);
}

// ===== CONFIGURAÇÃO DE EVENT LISTENERS =====
document.addEventListener('DOMContentLoaded', aplicarTemaSalvo);
botaoTema.addEventListener('click', () => {
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
        opcoesBichinhos.forEach((o) => o.classList.remove("selecionado"));
        opcao.classList.add("selecionado");
        meuBichinho.tipo = opcao.getAttribute("data-tipo");
    });
});
botaoComecar.addEventListener("click", () => {
    if (inputNome.value.trim() !== "") {
        iniciarJogo();
    } else {
        inputNome.focus();
        inputNome.classList.add("input-erro");
    }
});

// Ações de cuidado com o bichinho (não dão moedas)
botaoAlimentar.addEventListener("click", () => {
    if (meuBichinho.fome >= 100) return;
    meuBichinho.fome = Math.min(100, meuBichinho.fome + 20);
    exibirMensagem("Bichinho alimentado!");
    atualizarUI();
    salvarDados();
});
botaoBrincar.addEventListener("click", () => {
    if (meuBichinho.felicidade >= 100) return;
    meuBichinho.felicidade = Math.min(100, meuBichinho.felicidade + 20);
    meuBichinho.fome = Math.max(0, meuBichinho.fome - 5);
    exibirMensagem("Que divertido!");
    atualizarUI();
    salvarDados();
});
botaoLimpar.addEventListener("click", () => {
    if (meuBichinho.higiene >= 100) return;
    meuBichinho.higiene = Math.min(100, meuBichinho.higiene + 20);
    exibirMensagem("Agora está limpinho!");
    atualizarUI();
    salvarDados();
});
botaoMedicar.addEventListener("click", () => {
    if (meuBichinho.saude >= 100) return;
    meuBichinho.saude = Math.min(100, meuBichinho.saude + 20);
    exibirMensagem("Bichinho medicado!");
    atualizarUI();
    salvarDados();
});

botaoReiniciar.addEventListener("click", () => {
    meuBichinho.nome = "Bichinho";
    localStorage.removeItem("meuBichinho");
    location.reload();
});

botaoLoja.addEventListener("click", abrirLoja);
botaoSairLoja.addEventListener("click", fecharLoja);
botaoMiniGames.addEventListener("click", abrirMiniGames);
botaoSairMiniGames.addEventListener("click", fecharMiniGames);
document.addEventListener("DOMContentLoaded", function () {
    const botoesComprar = document.querySelectorAll(".botao-comprar");
    botoesComprar.forEach((botao) => {
        botao.addEventListener("click", function () {
            const acessorio = this.getAttribute("data-acessorio");
            equiparOuDesequiparAcessorio(acessorio);
        });
    });
});
reiniciarJogoVelha.addEventListener("click", iniciarJogoDaVelha);
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
carregarDados();