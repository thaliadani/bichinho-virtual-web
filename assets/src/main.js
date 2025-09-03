// Seleciona todos os elementos do DOM que precisamos manipular
const tamagotchiBichinho = document.querySelector('.tamagotchi-bichinho');
const statusFome = document.querySelector('.status-progresso.fome');
const statusFelicidade = document.querySelector('.status-progresso.felicidade');
const statusHigiene = document.querySelector('.status-progresso.higiene');
const statusSaude = document.querySelector('.status-progresso.saude');
const botoesContainer = document.querySelector('.botoes-container');
const mensagemElemento = document.getElementById('mensagem');
const botaoReiniciar = document.getElementById('botaoReiniciar');
const experienciaProgresso = document.querySelector('.experiencia-progresso');
const nivelBichinhoElemento = document.getElementById('nivelBichinho');
const emojiBichinhoElemento = document.getElementById('emojiBichinho');

// --- Novos elementos para a tela de boas-vindas ---
const telaBoasVindas = document.getElementById('boasVindas');
const containerJogo = document.getElementById('containerJogo');
const inputNome = document.getElementById('inputNome');
const botaoComecar = document.getElementById('botaoComecar');
const nomeBichinhoElemento = document.getElementById('nomeBichinho');

// --- Elementos dos novos botões ---
const botaoLoja = document.getElementById('botaoLoja');
const botaoTreinamento = document.getElementById('botaoTreinamento');
const botaoBatalha = document.getElementById('botaoBatalha');

// --- Elementos para seleção de bichinhos ---
const opcoesBichinhos = document.querySelectorAll('.opcao-bichinho');

// --- Elementos para a loja ---
const containerLoja = document.getElementById('containerLoja');
const botaoSairLoja = document.getElementById('botaoSairLoja');

// Mapeamento de emojis para cada tipo de bichinho
const emojisBichinhos = {
    'cachorro': '🐶',
    'gato': '🐱',
    'coelho': '🐰',
    'panda': '🐼',
    'vaca': '🐮',
    'sapo': '🐸',
    'hamster': '🐹',
    'porco': '🐷'
};

// Objeto que armazena o estado do bichinho
let meuBichinho = {
    nome: "Bichinho", // Definimos um nome padrão
    tipo: "cachorro", // Tipo padrão
    fome: 100,
    felicidade: 100,
    higiene: 100,
    saude: 100,
    nivel: 1,
    experiencia: 0,
    experienciaProximoNivel: 100, // Experiência necessária para o próximo nível
    acessorios: {} // Novo objeto para armazenar acessórios equipados
};

// Variável para controlar o loop do jogo
let gameLoop;

// --- Funções Principais ---

// Modifique a função atualizarUI para mudar a cor gradativamente
function atualizarUI() {
    // Altera a largura das barras de progresso com base nos valores
    statusFome.style.width = meuBichinho.fome + '%';
    statusFelicidade.style.width = meuBichinho.felicidade + '%';
    statusHigiene.style.width = meuBichinho.higiene + '%';
    statusSaude.style.width = meuBichinho.saude + '%';

    // Atualiza a barra de experiência
    const porcentagemExperiencia = (meuBichinho.experiencia / meuBichinho.experienciaProximoNivel) * 100;
    experienciaProgresso.style.width = porcentagemExperiencia + '%';

    // Atualiza o nível
    nivelBichinhoElemento.textContent = meuBichinho.nivel;

    // Atualiza o emoji do bichinho
    emojiBichinhoElemento.textContent = emojisBichinhos[meuBichinho.tipo];

    // Primeiro verifica se o bichinho está morto (prioridade máxima)
    if (meuBichinho.saude <= 0) {
        tamagotchiBichinho.style.backgroundColor = '#9e9e9e'; // Cinza quando morto
        tamagotchiBichinho.classList.remove('triste');
    } else {
        // Calcula a "nota" geral do bichinho baseada na média das necessidades
        const notaGeral = (meuBichinho.fome + meuBichinho.felicidade + meuBichinho.higiene + meuBichinho.saude) / 4;

        // Muda a cor gradativamente conforme o estado do bichinho
        if (notaGeral >= 70) {
            // Verde quando saudável (70-100%)
            tamagotchiBichinho.style.backgroundColor = '#4caf50';
        } else if (notaGeral >= 40) {
            // Amarelo quando em alerta (40-69%)
            tamagotchiBichinho.style.backgroundColor = '#ffc107';
        } else if (notaGeral >= 10) {
            // Laranja quando em perigo (10-39%)
            tamagotchiBichinho.style.backgroundColor = '#ff9800';
        } else {
            // Vermelho quando crítico (0-9%)
            tamagotchiBichinho.style.backgroundColor = '#f44336';
        }

        // Altera a expressão do bichinho se a felicidade estiver baixa
        if (meuBichinho.felicidade < 30) {
            tamagotchiBichinho.classList.add('triste');
        } else {
            tamagotchiBichinho.classList.remove('triste');
        }
    }

    // Controla o estado dos botões com base nos status
    document.getElementById('botaoAlimentar').disabled = meuBichinho.fome >= 100;
    document.getElementById('botaoBrincar').disabled = meuBichinho.felicidade >= 100;
    document.getElementById('botaoLimpar').disabled = meuBichinho.higiene >= 100;
    document.getElementById('botaoSaude').disabled = meuBichinho.saude >= 100;

    // Atualiza o nome do bichinho na interface
    nomeBichinhoElemento.textContent = meuBichinho.nome;
    
    // Atualiza os acessórios
    atualizarAcessorios();
}

// Adiciona experiência e verifica se subiu de nível
function adicionarExperiencia(qtd) {
    meuBichinho.experiencia += qtd;

    // Verifica se subiu de nível
    while (meuBichinho.experiencia >= meuBichinho.experienciaProximoNivel) {
        meuBichinho.experiencia -= meuBichinho.experienciaProximoNivel;
        meuBichinho.nivel++;
        // Aumenta a experiência necessária para o próximo nível (pode ajustar esta fórmula)
        meuBichinho.experienciaProximoNivel = Math.floor(meuBichinho.experienciaProximoNivel * 1.5);

        // Mensagem de novo nível
        mensagemElemento.textContent = `Parabéns! ${meuBichinho.nome} subiu para o nível ${meuBichinho.nivel}!`;
        setTimeout(() => {
            mensagemElemento.textContent = '';
        }, 3000);
    }

    atualizarUI();
    salvarDados();
}

// Salva os dados do bichinho no localStorage
function salvarDados() {
    localStorage.setItem('meuBichinho', JSON.stringify(meuBichinho));
}

// Carrega os dados do localStorage, se existirem
function carregarDados() {
    const dadosSalvos = localStorage.getItem('meuBichinho');
    if (dadosSalvos) {
        meuBichinho = JSON.parse(dadosSalvos);
        // Se dados forem carregados, já pode iniciar o jogo diretamente
        iniciarJogo();
    } else {
        // Se não houver dados, mostra a tela de boas-vindas
        telaBoasVindas.style.display = 'flex';
        containerJogo.style.display = 'none';

        // Seleciona o primeiro bichinho por padrão
        opcoesBichinhos[0].classList.add('selecionado');
    }
}

// Inicia o jogo, escondendo a tela de boas-vindas e mostrando o jogo
function iniciarJogo() {
    telaBoasVindas.style.display = 'none';
    containerJogo.style.display = 'flex';
    containerJogo.style.flexDirection = 'column';
    containerJogo.style.alignItems = 'center';

    // Se o nome foi inserido, atualiza o objeto com o novo nome
    if (inputNome.value.trim() !== "") {
        meuBichinho.nome = inputNome.value.trim();
    }

    atualizarUI();
    salvarDados();

    // Inicia o loop do jogo
    gameLoop = setInterval(passarTempo, 1000);
}

// Na função reiniciarJogo, certifique-se de resetar a cor
function reiniciarJogo() {
    meuBichinho.fome = 100;
    meuBichinho.felicidade = 100;
    meuBichinho.higiene = 100;
    meuBichinho.saude = 100;
    meuBichinho.nivel = 1;
    meuBichinho.experiencia = 0;
    meuBichinho.experienciaProximoNivel = 100;
    meuBichinho.acessorios = {};

    mensagemElemento.textContent = '';
    tamagotchiBichinho.style.backgroundColor = '#4caf50'; // Volta para verde
    tamagotchiBichinho.classList.remove('triste');

    // Mostra os botões de ação e esconde o de reiniciar
    controlarVisibilidadeBotoes(true);
    botaoReiniciar.style.display = 'none';

    atualizarUI();
    salvarDados();

    // Inicia o loop do jogo novamente
    gameLoop = setInterval(passarTempo, 1000);
}

// Na função passarTempo, modifique a verificação de morte
function passarTempo() {
    // Se a saúde for zero, o bichinho "morre"
    if (meuBichinho.saude <= 0) {
        mensagemElemento.textContent = `Oh não! ${meuBichinho.nome} morreu.`;
        tamagotchiBichinho.style.backgroundColor = '#9e9e9e'; // Cinza quando morto
        tamagotchiBichinho.classList.remove('triste');

        // Esconde os botões de ação e mostra o de reiniciar
        controlarVisibilidadeBotoes(false);
        botaoReiniciar.style.display = 'block';

        clearInterval(gameLoop);
        return;
    }

    // Diminui os status com o tempo
    meuBichinho.fome -= 1;
    meuBichinho.felicidade -= 1;
    meuBichinho.higiene -= 1;

    // Garante que os valores não fiquem abaixo de zero
    if (meuBichinho.fome < 0) meuBichinho.fome = 0;
    if (meuBichinho.felicidade < 0) meuBichinho.felicidade = 0;
    if (meuBichinho.higiene < 0) meuBichinho.higiene = 0;

    // Se fome, felicidade ou higiene estiverem baixas, a saúde diminui
    if (meuBichinho.fome <= 0 || meuBichinho.felicidade <= 0 || meuBichinho.higiene <= 0) {
        meuBichinho.saude -= 2;
        if (meuBichinho.saude < 0) meuBichinho.saude = 0;
    }

    atualizarUI();
    salvarDados();
}

// Controla a visibilidade dos botões de ação (função original)
function controlarVisibilidadeBotoes(visivel) {
    if (visivel) {
        botoesContainer.style.display = 'flex';
    } else {
        botoesContainer.style.display = 'none';
    }
}

// --- Novas funções para a loja de acessórios ---

function abrirLoja() {
    containerLoja.style.display = 'flex';
}

function fecharLoja() {
    containerLoja.style.display = 'none';
    containerJogo.style.display = 'flex';
}

function equiparOuDesequiparAcessorio(tipoAcessorio) {
    // Se o acessório já está equipado, desequipa
    if (meuBichinho.acessorios[tipoAcessorio]) {
        // Desequipa este acessório
        meuBichinho.acessorios[tipoAcessorio] = false;
        mensagemElemento.textContent = `Acessório removido!`;
    } else {
        // Desequipa todos os outros acessórios primeiro
        for (const acessorio in meuBichinho.acessorios) {
            meuBichinho.acessorios[acessorio] = false;
        }
        // Equipa o novo acessório
        meuBichinho.acessorios[tipoAcessorio] = true;
        mensagemElemento.textContent = `Acessório equipado!`;
    }
    
    // Atualiza a visualização
    atualizarAcessorios();
    
    // Salva os dados
    salvarDados();
    
    setTimeout(() => {
        mensagemElemento.textContent = '';
    }, 2000);
}

function atualizarAcessorios() {
    const containerAcessorios = document.getElementById('acessoriosBichinho');
    
    // Limpa acessórios atuais
    containerAcessorios.innerHTML = '';
    
    // Atualiza o texto dos botões e adiciona acessórios equipados
    const botoesAcessorio = document.querySelectorAll('.botao-comprar');
    botoesAcessorio.forEach(botao => {
        const tipoAcessorio = botao.getAttribute('data-acessorio');
        if (meuBichinho.acessorios[tipoAcessorio]) {
            botao.textContent = 'Desequipar';
            botao.style.backgroundColor = '#f44336'; // Vermelho para desequipar
            
            // Adiciona o acessório visualmente ao bichinho
            const emojiAcessorio = document.createElement('div');
            emojiAcessorio.classList.add('acessorio-equipado', `${tipoAcessorio}-equipado`);
            
            // Define o emoji correto para cada acessório
            switch(tipoAcessorio) {
                case 'coroa':
                    emojiAcessorio.textContent = '👑';
                    break;
                case 'chapeu-laco':
                    emojiAcessorio.textContent = '👒';
                    break;
                case 'chapeu-cartola':
                    emojiAcessorio.textContent = '🎩';
                    break;
                case 'laco':
                    emojiAcessorio.textContent = '🎀';
                    break;
            }
            
            containerAcessorios.appendChild(emojiAcessorio);
        } else {
            botao.textContent = 'Equipar';
            botao.style.backgroundColor = '#4caf50'; // Verde para equipar
        }
    });
}

// --- Novas funções para os botões do menu ---

function iniciarTreinamento() {
    mensagemElemento.textContent = `${meuBichinho.nome} está treinando muito!`;
    meuBichinho.felicidade = Math.min(100, meuBichinho.felicidade + 5);
    meuBichinho.fome = Math.max(0, meuBichinho.fome - 15);
    meuBichinho.saude = Math.max(0, meuBichinho.saude - 5);
    adicionarExperiencia(25);
    setTimeout(() => {
        mensagemElemento.textContent = '';
    }, 2000);
    atualizarUI();
    salvarDados();
}

function iniciarBatalha() {
    mensagemElemento.textContent = `${meuBichinho.nome} está em uma batalha épica!`;
    meuBichinho.felicidade = Math.min(100, meuBichinho.felicidade + 10);
    meuBichinho.fome = Math.max(0, meuBichinho.fome - 20);
    meuBichinho.saude = Math.max(0, meuBichinho.saude - 10);
    adicionarExperiencia(35);
    setTimeout(() => {
        mensagemElemento.textContent = '';
    }, 2000);
    atualizarUI();
    salvarDados();
}

// Modifique os eventos dos botões para verificar se estão desabilitados
document.getElementById('botaoAlimentar').addEventListener('click', () => {
    if (meuBichinho.fome >= 100) return; // Não faz nada se a barra estiver cheia
    meuBichinho.fome = Math.min(100, meuBichinho.fome + 20);
    adicionarExperiencia(5);
    atualizarUI();
    salvarDados();
});

document.getElementById('botaoBrincar').addEventListener('click', () => {
    if (meuBichinho.felicidade >= 100) return; // Não faz nada se a barra estiver cheia
    meuBichinho.felicidade = Math.min(100, meuBichinho.felicidade + 20);
    meuBichinho.fome = Math.max(0, meuBichinho.fome - 5);
    adicionarExperiencia(8);
    atualizarUI();
    salvarDados();
});

document.getElementById('botaoLimpar').addEventListener('click', () => {
    if (meuBichinho.higiene >= 100) return; // Não faz nada se a barra estiver cheia
    meuBichinho.higiene = Math.min(100, meuBichinho.higiene + 20);
    adicionarExperiencia(3);
    atualizarUI();
    salvarDados();
});

document.getElementById('botaoSaude').addEventListener('click', () => {
    if (meuBichinho.saude >= 100) return; // Não faz nada se a barra estiver cheia
    meuBichinho.saude = Math.min(100, meuBichinho.saude + 20);
    adicionarExperiencia(5);
    atualizarUI();
    salvarDados();
});

// Evento para o botão de reinício
botaoReiniciar.addEventListener('click', () => {
    // Limpa o nome para que a tela de boas-vindas apareça novamente
    meuBichinho.nome = "Bichinho";
    localStorage.removeItem('meuBichinho');
    location.reload(); // Recarrega a página para reiniciar
});

// Evento para o novo botão "Começar"
botaoComecar.addEventListener('click', () => {
    // Se o usuário digitou algo, inicia o jogo
    if (inputNome.value.trim() !== "") {
        iniciarJogo();
    } else {
        // Senão, exibe uma mensagem de erro
        alert("Por favor, digite um nome para o seu bichinho!");
    }
});

// Eventos para os novos botões do menu
botaoLoja.addEventListener('click', abrirLoja);
botaoTreinamento.addEventListener('click', iniciarTreinamento);
botaoBatalha.addEventListener('click', iniciarBatalha);

// Eventos para seleção de bichinhos
opcoesBichinhos.forEach(opcao => {
    opcao.addEventListener('click', () => {
        // Remove a seleção de todos
        opcoesBichinhos.forEach(o => o.classList.remove('selecionado'));

        // Adiciona a seleção ao clicado
        opcao.classList.add('selecionado');

        // Atualiza o tipo do bichinho
        meuBichinho.tipo = opcao.getAttribute('data-tipo');
    });
});

// Eventos para a loja
botaoSairLoja.addEventListener('click', fecharLoja);

// Adiciona event listeners para os botões de comprar/equipar acessórios
document.addEventListener('DOMContentLoaded', function() {
    const botoesComprar = document.querySelectorAll('.botao-comprar');
    botoesComprar.forEach(botao => {
        botao.addEventListener('click', function() {
            const acessorio = this.getAttribute('data-acessorio');
            equiparOuDesequiparAcessorio(acessorio);
        });
    });
});

// Adiciona container para acessórios no bichinho ao carregar a página
window.addEventListener('load', function() {
    const tamagotchiContainer = document.querySelector('.tamagotchi-container');
    const acessoriosContainer = document.createElement('div');
    acessoriosContainer.id = 'acessoriosBichinho';
    acessoriosContainer.className = 'acessorios-bichinho';
    tamagotchiContainer.appendChild(acessoriosContainer);
    
    // Carrega acessórios se existirem
    if (meuBichinho.acessorios) {
        atualizarAcessorios();
    }
});



// --- Início do Jogo ---

// 1. A única coisa que fazemos ao carregar a página é carregar os dados
//    e a função carregarDados decide se mostra a tela de boas-vindas ou o jogo.
carregarDados();