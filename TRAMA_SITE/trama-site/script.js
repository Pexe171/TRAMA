"use strict";

/**
 * Inicializa o carrossel com suporte a navegação por botões e teclado.
 * @param {HTMLElement} elementoCarrossel - Contêiner que agrupa os slides.
 * @param {NodeListOf<HTMLElement>} slides - Lista de slides disponíveis.
 * @param {HTMLElement} botaoAnterior - Botão para navegar ao slide anterior.
 * @param {HTMLElement} botaoProximo - Botão para navegar ao próximo slide.
 */
function inicializarCarrossel(elementoCarrossel, slides, botaoAnterior, botaoProximo) {
    if (!elementoCarrossel || slides.length === 0 || !botaoAnterior || !botaoProximo) {
        console.error("Carrossel não pôde ser iniciado: elementos essenciais não encontrados.");
        return;
    }

    let indiceAtual = 0;

    /**
     * Atualiza a interface para refletir o slide selecionado.
     * @param {number} novoIndice - Índice do slide a ser apresentado.
     */
    function atualizarSlide(novoIndice) {
        if (Number.isNaN(novoIndice) || novoIndice < 0 || novoIndice >= slides.length) {
            console.error("Índice inválido recebido para o carrossel.");
            return;
        }

        slides[indiceAtual].classList.remove("ativo");
        slides[novoIndice].classList.add("ativo");
        const deslocamento = novoIndice * 100;
        elementoCarrossel.style.transform = `translateX(-${deslocamento}%)`;
        indiceAtual = novoIndice;
    }

    botaoAnterior.addEventListener("click", () => {
        const novoIndice = indiceAtual === 0 ? slides.length - 1 : indiceAtual - 1;
        atualizarSlide(novoIndice);
    });

    botaoProximo.addEventListener("click", () => {
        const novoIndice = indiceAtual === slides.length - 1 ? 0 : indiceAtual + 1;
        atualizarSlide(novoIndice);
    });

    document.addEventListener("keydown", (evento) => {
        if (evento.key === "ArrowLeft") {
            botaoAnterior.click();
        }
        if (evento.key === "ArrowRight") {
            botaoProximo.click();
        }
    });
}

/**
 * Ativa o comportamento do menu principal com foco em acessibilidade.
 * @param {HTMLButtonElement} botaoMenu - Botão responsável por alternar a exibição da lista de editorias.
 * @param {HTMLElement} listaEditorias - Lista que agrupa os links das editorias.
 */
function inicializarMenu(botaoMenu, listaEditorias) {
    if (!botaoMenu || !listaEditorias) {
        console.error("Menu não pôde ser iniciado: elementos essenciais não encontrados.");
        return;
    }

    botaoMenu.addEventListener("click", () => {
        const estaAberto = botaoMenu.getAttribute("aria-expanded") === "true";
        const novoEstado = !estaAberto;
        botaoMenu.setAttribute("aria-expanded", String(novoEstado));
        if (novoEstado) {
            listaEditorias.removeAttribute("hidden");
        } else {
            listaEditorias.setAttribute("hidden", "");
        }
    });
}

window.addEventListener("DOMContentLoaded", () => {
    const carrossel = document.querySelector(".carrossel-container");
    const slides = document.querySelectorAll(".carrossel .slide");
    const botaoAnterior = document.querySelector(".controle.anterior");
    const botaoProximo = document.querySelector(".controle.proximo");
    const botaoMenu = document.querySelector(".botao-menu");
    const listaEditorias = document.querySelector("#lista-editorias");
    const campoAno = document.querySelector("#ano-atual");

    if (carrossel && slides.length > 0 && botaoAnterior && botaoProximo) {
        inicializarCarrossel(carrossel, slides, botaoAnterior, botaoProximo);
    }

    if (botaoMenu && listaEditorias) {
        inicializarMenu(botaoMenu, listaEditorias);
    }

    if (campoAno) {
        const anoAtual = new Date().getFullYear();
        campoAno.textContent = String(anoAtual);
    }
});
