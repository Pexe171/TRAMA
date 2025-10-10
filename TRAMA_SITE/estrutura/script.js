/**
 * Inicializa os componentes interativos da página TRAMA com validação de elementos.
 */
(function inicializarPagina() {
  const botaoMenu = document.querySelector('#botao-menu');
  const menuPrincipal = document.querySelector('#menu-principal');
  const carrossel = document.querySelector('#carrossel-destaques');

  if (botaoMenu instanceof HTMLButtonElement && menuPrincipal instanceof HTMLUListElement) {
    configurarMenuResponsivo(botaoMenu, menuPrincipal);
  }

  if (carrossel instanceof HTMLElement) {
    configurarCarrossel(carrossel);
  }

  atualizarAnoAtual();
})();

/**
 * Configura a alternância do menu principal com acessibilidade.
 * @param {HTMLButtonElement} botaoMenu - Botão responsável por abrir e fechar o menu.
 * @param {HTMLUListElement} menuPrincipal - Lista principal de navegação.
 */
function configurarMenuResponsivo(botaoMenu, menuPrincipal) {
  const classeMenuVisivel = 'menu-visivel';
  const consultaMobile = window.matchMedia('(max-width: 768px)');

  /**
   * Abre o menu principal ajustando atributos de acessibilidade.
   */
  const abrirMenu = () => {
    menuPrincipal.classList.add(classeMenuVisivel);
    botaoMenu.setAttribute('aria-expanded', 'true');
  };

  /**
   * Fecha o menu principal mantendo consistência visual em dispositivos móveis.
   */
  const fecharMenu = () => {
    menuPrincipal.classList.remove(classeMenuVisivel);
    botaoMenu.setAttribute('aria-expanded', 'false');
  };

  /**
   * Define o estado inicial conforme a largura da tela, prevenindo falhas em redimensionamentos.
   * @param {MediaQueryList | MediaQueryListEvent} mediaQuery - Resultado da consulta de mídia.
   */
  const aplicarEstadoInicial = (mediaQuery) => {
    if ('matches' in mediaQuery && mediaQuery.matches) {
      fecharMenu();
    } else {
      menuPrincipal.classList.remove(classeMenuVisivel);
      botaoMenu.setAttribute('aria-expanded', 'true');
    }
  };

  aplicarEstadoInicial(consultaMobile);

  if (typeof consultaMobile.addEventListener === 'function') {
    consultaMobile.addEventListener('change', aplicarEstadoInicial);
  } else if (typeof consultaMobile.addListener === 'function') {
    consultaMobile.addListener(aplicarEstadoInicial);
  }

  botaoMenu.addEventListener('click', () => {
    if (menuPrincipal.classList.contains(classeMenuVisivel)) {
      fecharMenu();
    } else {
      abrirMenu();
    }
  });

  menuPrincipal.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      if (consultaMobile.matches) {
        fecharMenu();
      }
    });
  });
}

/**
 * Configura o carrossel de destaques garantindo validação dos itens.
 * @param {HTMLElement} carrossel - Contêiner principal do carrossel.
 */
function configurarCarrossel(carrossel) {
  const botoesControle = carrossel.querySelectorAll('.controle');
  const itens = carrossel.querySelectorAll('.cartaz');

  if (botoesControle.length === 0 || itens.length === 0) {
    return;
  }

  let indiceAtivo = Array.from(itens).findIndex((item) => item.classList.contains('ativo'));
  indiceAtivo = indiceAtivo >= 0 ? indiceAtivo : 0;

  botoesControle.forEach((botao) => {
    botao.addEventListener('click', () => {
      const direcao = botao.dataset.direcao;
      if (direcao !== 'anterior' && direcao !== 'proximo') {
        return;
      }

      itens[indiceAtivo].classList.remove('ativo');

      if (direcao === 'anterior') {
        indiceAtivo = (indiceAtivo - 1 + itens.length) % itens.length;
      } else {
        indiceAtivo = (indiceAtivo + 1) % itens.length;
      }

      itens[indiceAtivo].classList.add('ativo');
    });
  });
}

/**
 * Atualiza dinamicamente o ano exibido no rodapé.
 */
function atualizarAnoAtual() {
  const elementoAno = document.querySelector('#ano-atual');
  if (elementoAno instanceof HTMLElement) {
    elementoAno.textContent = String(new Date().getFullYear());
  }
}
