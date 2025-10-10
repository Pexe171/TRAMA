/**
 * Inicializa o comportamento interativo do carrossel principal do site.
 * A função garante que a estrutura necessária exista antes de registrar os eventos.
 */
function inicializarCarrossel() {
  const seletorCarrossel = document.querySelector('.carrossel');
  if (!seletorCarrossel) {
    console.warn('Carrossel não encontrado na página.');
    return;
  }

  const itens = Array.from(seletorCarrossel.querySelectorAll('.carrossel__item'));
  const indicadores = Array.from(seletorCarrossel.querySelectorAll('.carrossel__indicador'));
  const botoes = Array.from(seletorCarrossel.querySelectorAll('.carrossel__controle'));

  if (itens.length === 0 || indicadores.length === 0 || botoes.length === 0) {
    console.warn('Elementos essenciais do carrossel não foram encontrados.');
    return;
  }

  let indiceAtual = 0;

  /**
   * Atualiza o slide visível do carrossel, ativando o item correspondente e o indicador.
   * @param {number} novoIndice - Índice que representa o slide que deve ser ativado.
   */
  function atualizarSlide(novoIndice) {
    if (Number.isNaN(novoIndice)) {
      console.error('O índice informado não é um número válido.');
      return;
    }

    const totalSlides = itens.length;
    const indiceNormalizado = ((novoIndice % totalSlides) + totalSlides) % totalSlides;

    itens.forEach((item, index) => {
      const ativo = index === indiceNormalizado;
      item.classList.toggle('carrossel__item--ativo', ativo);
    });

    indicadores.forEach((indicador, index) => {
      const ativo = index === indiceNormalizado;
      indicador.classList.toggle('carrossel__indicador--ativo', ativo);
      indicador.setAttribute('aria-selected', ativo ? 'true' : 'false');
    });

    indiceAtual = indiceNormalizado;
  }

  indicadores.forEach((indicador, index) => {
    indicador.addEventListener('click', () => atualizarSlide(index));
  });

  botoes.forEach((botao) => {
    botao.addEventListener('click', () => {
      const direcao = botao.dataset.direcao;

      if (direcao === 'anterior') {
        atualizarSlide(indiceAtual - 1);
        return;
      }

      if (direcao === 'proximo') {
        atualizarSlide(indiceAtual + 1);
        return;
      }

      console.warn('Direção do carrossel desconhecida:', direcao);
    });
  });
}

/**
 * Atualiza automaticamente o ano exibido no rodapé do site.
 */
function atualizarAnoRodape() {
  const elementoAno = document.querySelector('[data-ano-atual]');

  if (!elementoAno) {
    console.warn('Elemento para exibir o ano atual não foi encontrado.');
    return;
  }

  const anoAtual = new Date().getFullYear();
  elementoAno.textContent = anoAtual.toString();
}

/**
 * Registra eventos globais após o carregamento do DOM garantindo segurança em navegadores antigos.
 */
function inicializarAplicacao() {
  try {
    inicializarCarrossel();
    atualizarAnoRodape();
  } catch (erro) {
    console.error('Não foi possível inicializar a aplicação:', erro);
  }
}

document.addEventListener('DOMContentLoaded', inicializarAplicacao);
