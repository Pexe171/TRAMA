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
  const classeVisivel = 'menu-principal--visivel';

  const abrirMenu = () => {
    menuPrincipal.classList.add(classeVisivel);
    botaoMenu.setAttribute('aria-expanded', 'true');
  };

  const fecharMenu = () => {
    menuPrincipal.classList.remove(classeVisivel);
    botaoMenu.setAttribute('aria-expanded', 'false');
  };

  botaoMenu.addEventListener('click', () => {
    const menuVisivel = menuPrincipal.classList.contains(classeVisivel);

    if (menuVisivel) {
      fecharMenu();
    } else {
      abrirMenu();
    }
  });

  const atualizarMenuPorLargura = () => {
    if (typeof window === 'undefined') {
      return;
    }

    if (typeof window.matchMedia !== 'function') {
      abrirMenu();
      return;
    }

    const deveExibir = window.matchMedia('(min-width: 769px)').matches;
    if (deveExibir) {
      abrirMenu();
    } else {
      fecharMenu();
    }
  };

  atualizarMenuPorLargura();

  if (typeof window !== 'undefined') {
    window.addEventListener('resize', atualizarMenuPorLargura);
  }
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
