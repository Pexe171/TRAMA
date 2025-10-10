document.addEventListener('DOMContentLoaded', () => {
  inicializarComponentesGerais();
  registrarPostsPadrao();
  renderizarListasDePosts();
  prepararPainelAdministrativo();
});

const CHAVE_POSTS = 'trama-posts';
const CATEGORIAS_DISPONIVEIS = {
  'cine-movimento': {
    nome: 'Cine Movimento',
    descricao: 'Movimentos e narrativas que mantêm a linguagem audiovisual pulsando.',
  },
  'vale-o-ingresso': {
    nome: 'Vale o Ingresso',
    descricao: 'Estreias, análises e indicações de experiências na sala de cinema.',
  },
  'por-tras-do-cartaz': {
    nome: 'Por Trás do Cartaz',
    descricao: 'Bastidores de campanhas, estratégias e lançamentos que conectam públicos.',
  },
  'furo-de-roteiro': {
    nome: 'Furo de Roteiro',
    descricao: 'Apurações e novidades que movimentam o mercado audiovisual.',
  },
  'clube-da-noticia': {
    nome: 'Clube da Notícia',
    descricao: 'Curadoria de tendências e dados para profissionais de comunicação.',
  },
  'persona-em-cena': {
    nome: 'Persona em Cena',
    descricao: 'Histórias de quem transforma o cinema dentro e fora das telas.',
  },
  'de-volta-para-o-futuro': {
    nome: 'De Volta para o Futuro',
    descricao: 'Resgates históricos e conexões entre clássicos e novidades.',
  },
};

const POSTS_PADRAO = [
  {
    id: 'post-inicial-01',
    categoria: 'cine-movimento',
    titulo: 'Laboratório de Cinema Comunitário chega às periferias',
    resumo:
      'Coletivos independentes discutem produção colaborativa e buscam novos olhares para o audiovisual.',
    conteudo:
      'A nova edição do laboratório reúne 12 coletivos que irão circular por cinco capitais brasileiras. O foco do programa é fortalecer narrativas locais e criar oportunidades para diretores em início de carreira.',
    autores: ['Gustavo Augusto', 'Janaina Freitas'],
    dataPublicacao: '2025-01-18',
    imagemUrl: 'imagens/posts/laboratorio-cinema-comunitario.svg',
    videoUrl: '',
    fontesComplementares: ['https://www.youtube.com/watch?v=dQw4w9WgXcQ'],
  },
  {
    id: 'post-inicial-02',
    categoria: 'vale-o-ingresso',
    titulo: 'Estreia de "Aurora Solar" conquista plateias internacionais',
    resumo:
      'Longa brasileiro vence prêmio de roteiro em festival europeu e chega aos cinemas nacionais em março.',
    conteudo:
      'A produção independente dirigida por Milena Prado mistura ficção científica e drama familiar para discutir sustentabilidade. Após sessões lotadas em Roterdã, o longa chega ao circuito comercial com distribuição ampliada.',
    autores: ['Jhulles dos Santos'],
    dataPublicacao: '2025-02-02',
    imagemUrl: 'imagens/posts/aurora-solar-estreia.svg',
    videoUrl: '',
    fontesComplementares: [],
  },
  {
    id: 'post-inicial-03',
    categoria: 'por-tras-do-cartaz',
    titulo: 'Campanha transmídia reposiciona clássico dos anos 1990',
    resumo:
      'Estratégia aposta em narrativas interativas e ativações imersivas para apresentar um relançamento restaurado.',
    conteudo:
      'A distribuidora firmou parceria com streamers e coletivos de fãs para compor uma ação em camadas. O plano inclui podcasts, minidocumentário e um quebra-cabeça virtual que libera ingressos promocionais.',
    autores: ['Emily Oliveira'],
    dataPublicacao: '2025-01-28',
    imagemUrl: 'imagens/posts/campanha-transmidia.svg',
    videoUrl: '',
    fontesComplementares: ['https://www.behance.net'],
  },
  {
    id: 'post-inicial-04',
    categoria: 'furo-de-roteiro',
    titulo: 'Estúdios independentes criam aliança para coproduções',
    resumo:
      'A iniciativa prevê intercâmbio de roteiristas e estratégias de coprodução para séries documentais.',
    conteudo:
      'Os estúdios participantes irão compartilhar estruturas de pesquisa, mapear editais conjuntos e abrir residências criativas itinerantes. O primeiro resultado será anunciado em festival latino-americano.',
    autores: ['Equipe TRAMA'],
    dataPublicacao: '2024-12-12',
    imagemUrl: 'imagens/posts/alianca-coproducoes.svg',
    videoUrl: '',
    fontesComplementares: [],
  },
  {
    id: 'post-inicial-05',
    categoria: 'clube-da-noticia',
    titulo: 'Relatório aponta crescimento de audiências híbridas',
    resumo:
      'Pesquisa inédita revela como lançamentos simultâneos em salas e plataformas ampliam conversão de público.',
    conteudo:
      'Segundo o estudo, campanhas que combinam eventos presenciais com experiências digitais aumentam o reconhecimento de marca em até 37%. O material completo apresenta recomendações práticas para equipes de marketing.',
    autores: ['Redação TRAMA Insights'],
    dataPublicacao: '2025-01-09',
    imagemUrl: 'imagens/posts/audiencias-hibridas.svg',
    videoUrl: '',
    fontesComplementares: ['https://www.trends.google.com'],
  },
  {
    id: 'post-inicial-06',
    categoria: 'persona-em-cena',
    titulo: 'Montadora brasileira recebe prêmio internacional de inovação',
    resumo:
      'Reconhecimento destaca uso de ferramentas colaborativas no processo de pós-produção.',
    conteudo:
      'A profissional liderou a montagem de três longas em 2024 utilizando fluxo remoto com realidade aumentada. O júri ressaltou a criação de um laboratório aberto a novos talentos.',
    autores: ['Equipe Perfil TRAMA'],
    dataPublicacao: '2025-02-15',
    imagemUrl: 'imagens/posts/premio-montadora.svg',
    videoUrl: 'https://www.youtube.com/watch?v=ysz5S6PUM-U',
    fontesComplementares: [],
  },
  {
    id: 'post-inicial-07',
    categoria: 'de-volta-para-o-futuro',
    titulo: 'Mostra reconecta clássicos brasileiros com novas gerações',
    resumo:
      'Programação itinerante leva sessões comentadas e oficinas para escolas públicas.',
    conteudo:
      'O circuito passará por oito cidades com exibições em praças e espaços culturais. Historiadores do cinema conduzem debates sobre preservação e acessibilidade das obras restauradas.',
    autores: ['Curadoria TRAMA Memória'],
    dataPublicacao: '2024-11-27',
    imagemUrl: 'imagens/posts/mostra-classicos.svg',
    videoUrl: '',
    fontesComplementares: [],
  },
];

let postsEmMemoria = [];
let urlBaseRecursos = null;

/**
 * Inicializa menu responsivo, carrossel e atualização de rodapé.
 */
function inicializarComponentesGerais() {
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
  definirUrlBaseDeRecursos();
}

/**
 * Define a URL base para carregar imagens e vídeos de forma consistente entre páginas.
 */
function definirUrlBaseDeRecursos() {
  const scriptPrincipal = document.querySelector('script[src$="script.js"]');

  if (!(scriptPrincipal instanceof HTMLScriptElement)) {
    urlBaseRecursos = null;
    return;
  }

  const origem = window.location.href;
  const caminhoScript = scriptPrincipal.getAttribute('src');

  if (typeof caminhoScript !== 'string') {
    urlBaseRecursos = null;
    return;
  }

  try {
    const urlCompleta = new URL(caminhoScript, origem);
    const partes = urlCompleta.pathname.split('/');
    partes.pop();
    urlCompleta.pathname = partes.join('/') + '/';
    urlBaseRecursos = urlCompleta;
  } catch (erro) {
    console.error('Não foi possível definir a URL base de recursos.', erro);
    urlBaseRecursos = null;
  }
}

/**
 * Garante que existam posts padrão armazenados para exibição inicial.
 */
function registrarPostsPadrao() {
  const postsExistentes = carregarPosts();

  if (postsExistentes.length > 0) {
    return;
  }

  const postsNormalizados = POSTS_PADRAO.map(normalizarPost);
  salvarPosts(postsNormalizados);
}

/**
 * Executa a renderização das listas de posts em todas as páginas.
 */
function renderizarListasDePosts() {
  const contenedores = document.querySelectorAll('[data-editoria]');

  if (contenedores.length === 0) {
    return;
  }

  const postsOrdenados = ordenarPostsPorData(carregarPosts());

  contenedores.forEach((container) => {
    if (!(container instanceof HTMLElement)) {
      return;
    }

    const categoriaAlvo = container.dataset.editoria ?? '';
    const limite = Number.parseInt(container.dataset.limite ?? '', 10);
    const mensagemVazia = container.querySelector('[data-mensagem-vazia]');

    const postsFiltrados = categoriaAlvo === 'todas'
      ? postsOrdenados
      : postsOrdenados.filter((post) => post.categoria === categoriaAlvo);

    const postsParaExibir = Number.isFinite(limite) && limite > 0
      ? postsFiltrados.slice(0, limite)
      : postsFiltrados;

    container.querySelectorAll('.post-card').forEach((elemento) => elemento.remove());

    if (postsParaExibir.length === 0) {
      if (mensagemVazia instanceof HTMLElement) {
        mensagemVazia.hidden = false;
      }
      return;
    }

    if (mensagemVazia instanceof HTMLElement) {
      mensagemVazia.hidden = true;
    }

    const fragmento = document.createDocumentFragment();

    postsParaExibir.forEach((post) => {
      const cartao = criarCartaoDePost(post);
      fragmento.appendChild(cartao);
    });

    container.appendChild(fragmento);
  });
}

/**
 * Configura as ações do painel administrativo oculto quando disponível na página.
 */
function prepararPainelAdministrativo() {
  const formulario = document.querySelector('[data-formulario-post]');

  if (!(formulario instanceof HTMLFormElement)) {
    return;
  }

  const seletorCategoria = formulario.querySelector('select[name="categoria"]');
  const listaPosts = document.querySelector('[data-lista-admin]');
  const mensagemStatus = document.querySelector('[data-status-painel]');

  preencherOpcoesDeCategoria(seletorCategoria);
  atualizarListaAdministrativa(listaPosts);

  formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const resultado = extrairDadosDoFormulario(formulario);

    if (!resultado.valido) {
      exibirMensagemPainel(mensagemStatus, resultado.mensagem ?? 'Revise os campos obrigatórios.', true);
      return;
    }

    try {
      const postsAtualizados = ordenarPostsPorData([resultado.post, ...carregarPosts()]);
      salvarPosts(postsAtualizados);
      formulario.reset();
      exibirMensagemPainel(mensagemStatus, 'Post cadastrado com sucesso!', false);
      atualizarListaAdministrativa(listaPosts);
      renderizarListasDePosts();
    } catch (erro) {
      console.error('Falha ao salvar o novo post.', erro);
      exibirMensagemPainel(
        mensagemStatus,
        'Não foi possível salvar o post. Tente novamente ou limpe o armazenamento local.',
        true,
      );
    }
  });
}

/**
 * Preenche o seletor de categorias disponíveis com validação.
 * @param {Element|null} seletorCategoria - Campo de seleção de categorias.
 */
function preencherOpcoesDeCategoria(seletorCategoria) {
  if (!(seletorCategoria instanceof HTMLSelectElement)) {
    return;
  }

  seletorCategoria.innerHTML = '';
  const fragmento = document.createDocumentFragment();

  const opcaoPadrao = document.createElement('option');
  opcaoPadrao.value = '';
  opcaoPadrao.textContent = 'Selecione uma editoria';
  fragmento.appendChild(opcaoPadrao);

  Object.entries(CATEGORIAS_DISPONIVEIS).forEach(([slug, dados]) => {
    const opcao = document.createElement('option');
    opcao.value = slug;
    opcao.textContent = dados.nome;
    fragmento.appendChild(opcao);
  });

  seletorCategoria.appendChild(fragmento);
}

/**
 * Atualiza a lista de posts exibida no painel administrativo.
 * @param {Element|null} listaPosts - Elemento de lista que exibirá o resumo dos posts cadastrados.
 */
function atualizarListaAdministrativa(listaPosts) {
  if (!(listaPosts instanceof HTMLElement)) {
    return;
  }

  const posts = ordenarPostsPorData(carregarPosts());
  listaPosts.innerHTML = '';

  if (posts.length === 0) {
    const item = document.createElement('li');
    item.textContent = 'Nenhum post cadastrado até o momento.';
    listaPosts.appendChild(item);
    return;
  }

  const fragmento = document.createDocumentFragment();

  posts.forEach((post) => {
    const item = document.createElement('li');
    item.className = 'painel-admin__item';
    const tituloCategoria = CATEGORIAS_DISPONIVEIS[post.categoria]?.nome ?? 'Categoria desconhecida';
    item.innerHTML = `
      <strong>${sanitizarTexto(post.titulo)}</strong>
      <span>${sanitizarTexto(tituloCategoria)} • ${formatarData(post.dataPublicacao)}</span>
    `;
    fragmento.appendChild(item);
  });

  listaPosts.appendChild(fragmento);
}

/**
 * Exibe mensagens de feedback no painel administrativo.
 * @param {Element|null} alvoMensagem - Elemento destinado a exibir a mensagem.
 * @param {string} mensagem - Texto a ser comunicado.
 * @param {boolean} isErro - Indica se a mensagem representa um erro.
 */
function exibirMensagemPainel(alvoMensagem, mensagem, isErro) {
  if (!(alvoMensagem instanceof HTMLElement)) {
    return;
  }

  alvoMensagem.textContent = mensagem;
  alvoMensagem.dataset.status = isErro ? 'erro' : 'sucesso';
}

/**
 * Extrai e valida os dados informados no formulário administrativo.
 * @param {HTMLFormElement} formulario - Formulário utilizado para cadastrar posts.
 * @returns {{valido: boolean, mensagem?: string, post?: object}} Resultado da validação.
 */
function extrairDadosDoFormulario(formulario) {
  const dados = new FormData(formulario);
  const titulo = (dados.get('titulo') ?? '').toString().trim();
  const categoria = (dados.get('categoria') ?? '').toString().trim();
  const autores = (dados.get('autores') ?? '').toString().trim();
  const dataPublicacao = (dados.get('dataPublicacao') ?? '').toString().trim();
  const resumo = (dados.get('resumo') ?? '').toString().trim();
  const conteudo = (dados.get('conteudo') ?? '').toString().trim();
  const imagemUrl = (dados.get('imagemUrl') ?? '').toString().trim();
  const videoUrl = (dados.get('videoUrl') ?? '').toString().trim();
  const fontesComplementares = (dados.get('fontesComplementares') ?? '').toString();

  if (!titulo || !categoria || !autores || !dataPublicacao || !resumo) {
    return {
      valido: false,
      mensagem: 'Preencha título, editoria, autores, data de publicação e resumo.',
    };
  }

  if (!(categoria in CATEGORIAS_DISPONIVEIS)) {
    return {
      valido: false,
      mensagem: 'Selecione uma editoria válida.',
    };
  }

  if (!imagemUrl && !videoUrl) {
    return {
      valido: false,
      mensagem: 'Informe pelo menos uma imagem ou um vídeo para o post.',
    };
  }

  const dataValida = Number.isFinite(Date.parse(dataPublicacao));

  if (!dataValida) {
    return {
      valido: false,
      mensagem: 'Informe uma data de publicação válida.',
    };
  }

  const post = normalizarPost({
    id: gerarIdentificadorUnico(),
    categoria,
    titulo,
    autores: autores.split(',').map((autor) => autor.trim()).filter(Boolean),
    dataPublicacao,
    resumo,
    conteudo,
    imagemUrl,
    videoUrl,
    fontesComplementares: fontesComplementares
      .split('\n')
      .map((fonte) => fonte.trim())
      .filter(Boolean),
  });

  return {
    valido: true,
    post,
  };
}

/**
 * Cria um cartão visual para apresentar um post.
 * @param {object} post - Objeto contendo os dados do post normalizado.
 * @returns {HTMLElement} Elemento pronto para ser inserido no DOM.
 */
function criarCartaoDePost(post) {
  const artigo = document.createElement('article');
  artigo.className = 'post-card';

  if (post.imagemUrl) {
    const figura = document.createElement('figure');
    figura.className = 'post-card__midia';
    const imagem = document.createElement('img');
    imagem.loading = 'lazy';
    imagem.alt = `Imagem ilustrativa do post ${post.titulo}`;
    imagem.src = resolverCaminhoDeMidia(post.imagemUrl);
    figura.appendChild(imagem);
    artigo.appendChild(figura);
  }

  const cabecalho = document.createElement('header');
  cabecalho.className = 'post-card__cabecalho';

  const titulo = document.createElement('h3');
  titulo.textContent = post.titulo;
  cabecalho.appendChild(titulo);

  const meta = document.createElement('p');
  meta.className = 'post-card__meta';
  const autores = post.autores.length > 0 ? post.autores.join(', ') : 'Autor não informado';
  meta.textContent = `${autores} • ${formatarData(post.dataPublicacao)}`;
  cabecalho.appendChild(meta);

  artigo.appendChild(cabecalho);

  const destaque = document.createElement('p');
  destaque.className = 'post-card__resumo';
  destaque.textContent = post.resumo;
  artigo.appendChild(destaque);

  if (post.conteudo) {
    const corpo = document.createElement('div');
    corpo.className = 'post-card__conteudo';
    post.conteudo.split('\n').forEach((paragrafo) => {
      const texto = paragrafo.trim();
      if (!texto) {
        return;
      }
      const elementoParagrafo = document.createElement('p');
      elementoParagrafo.textContent = texto;
      corpo.appendChild(elementoParagrafo);
    });
    artigo.appendChild(corpo);
  }

  if (post.videoUrl) {
    const blocoVideo = criarBlocoDeVideo(post.videoUrl, post.titulo);
    if (blocoVideo) {
      artigo.appendChild(blocoVideo);
    }
  }

  if (post.fontesComplementares.length > 0) {
    const lista = document.createElement('ul');
    lista.className = 'post-card__fontes';

    post.fontesComplementares.forEach((fonte) => {
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.href = fonte;
      link.target = '_blank';
      link.rel = 'noreferrer noopener';
      link.textContent = fonte;
      item.appendChild(link);
      lista.appendChild(item);
    });

    artigo.appendChild(lista);
  }

  return artigo;
}

/**
 * Cria um bloco de vídeo com tratamento de diferentes formatos de URL.
 * @param {string} videoUrl - Endereço do vídeo informado no cadastro.
 * @param {string} titulo - Título do post para fins de acessibilidade.
 * @returns {HTMLElement|null} Elemento contendo o vídeo ou nulo em caso de erro.
 */
function criarBlocoDeVideo(videoUrl, titulo) {
  const urlTratada = videoUrl.trim();

  if (!urlTratada) {
    return null;
  }

  const container = document.createElement('div');
  container.className = 'post-card__video';

  try {
    if (urlTratada.includes('youtube.com') || urlTratada.includes('youtu.be')) {
      const url = new URL(urlTratada);
      let idVideo = url.searchParams.get('v');

      if (!idVideo && url.hostname === 'youtu.be') {
        idVideo = url.pathname.slice(1);
      }

      if (idVideo) {
        const iframe = document.createElement('iframe');
        iframe.src = `https://www.youtube.com/embed/${idVideo}`;
        iframe.title = `Reprodução de vídeo do post ${titulo}`;
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        iframe.allowFullscreen = true;
        container.appendChild(iframe);
        return container;
      }
    }

    if (urlTratada.endsWith('.mp4') || urlTratada.endsWith('.webm') || urlTratada.endsWith('.ogg')) {
      const video = document.createElement('video');
      video.controls = true;
      video.src = resolverCaminhoDeMidia(urlTratada);
      video.setAttribute('aria-label', `Vídeo do post ${titulo}`);
      container.appendChild(video);
      return container;
    }

    const link = document.createElement('a');
    link.href = urlTratada;
    link.target = '_blank';
    link.rel = 'noreferrer noopener';
    link.textContent = 'Assistir ao vídeo em nova aba';
    container.appendChild(link);
    return container;
  } catch (erro) {
    console.warn('Não foi possível incorporar o vídeo informado.', erro);
    return null;
  }
}

/**
 * Normaliza os dados de um post preenchendo campos opcionais.
 * @param {object} post - Objeto base do post.
 * @returns {object} Post normalizado.
 */
function normalizarPost(post) {
  return {
    id: typeof post.id === 'string' && post.id ? post.id : gerarIdentificadorUnico(),
    categoria: typeof post.categoria === 'string' ? post.categoria : '',
    titulo: typeof post.titulo === 'string' ? post.titulo : 'Título não informado',
    resumo: typeof post.resumo === 'string' ? post.resumo : '',
    conteudo: typeof post.conteudo === 'string' ? post.conteudo : '',
    autores: Array.isArray(post.autores)
      ? post.autores.filter((autor) => typeof autor === 'string' && autor.trim() !== '')
      : [],
    dataPublicacao: typeof post.dataPublicacao === 'string' ? post.dataPublicacao : new Date().toISOString(),
    imagemUrl: typeof post.imagemUrl === 'string' ? post.imagemUrl : '',
    videoUrl: typeof post.videoUrl === 'string' ? post.videoUrl : '',
    fontesComplementares: Array.isArray(post.fontesComplementares)
      ? post.fontesComplementares.filter((fonte) => typeof fonte === 'string' && fonte.trim() !== '')
      : [],
  };
}

/**
 * Carrega posts do armazenamento local com tratamento de erros.
 * @returns {object[]} Lista de posts válidos.
 */
function carregarPosts() {
  if (!armazenamentoDisponivel()) {
    return postsEmMemoria.slice();
  }

  try {
    const dados = window.localStorage.getItem(CHAVE_POSTS);

    if (!dados) {
      return postsEmMemoria.slice();
    }

    const posts = JSON.parse(dados);

    if (!Array.isArray(posts)) {
      return postsEmMemoria.slice();
    }

    const normalizados = posts
      .map(normalizarPost)
      .filter((post) => post.categoria in CATEGORIAS_DISPONIVEIS);

    postsEmMemoria = normalizados;
    return normalizados;
  } catch (erro) {
    console.warn('Não foi possível carregar os posts do armazenamento local.', erro);
    return postsEmMemoria.slice();
  }
}

/**
 * Salva posts no armazenamento com fallback para memória caso necessário.
 * @param {object[]} posts - Lista de posts a ser persistida.
 */
function salvarPosts(posts) {
  postsEmMemoria = posts.map(normalizarPost);

  if (!armazenamentoDisponivel()) {
    return;
  }

  try {
    const conteudo = JSON.stringify(postsEmMemoria);
    window.localStorage.setItem(CHAVE_POSTS, conteudo);
  } catch (erro) {
    console.warn('Não foi possível salvar os posts no armazenamento local.', erro);
  }
}

/**
 * Verifica se o armazenamento local está disponível.
 * @returns {boolean} Indica se o localStorage pode ser utilizado.
 */
function armazenamentoDisponivel() {
  try {
    const chaveTeste = '__trama_teste__';
    window.localStorage.setItem(chaveTeste, '1');
    window.localStorage.removeItem(chaveTeste);
    return true;
  } catch (erro) {
    console.warn('Armazenamento local indisponível. Usando fallback em memória.', erro);
    return false;
  }
}

/**
 * Ordena posts por data de publicação (mais recentes primeiro).
 * @param {object[]} posts - Lista de posts a ser ordenada.
 * @returns {object[]} Lista ordenada.
 */
function ordenarPostsPorData(posts) {
  return posts.slice().sort((a, b) => Date.parse(b.dataPublicacao) - Date.parse(a.dataPublicacao));
}

/**
 * Gera um identificador único baseado em data e número aleatório.
 * @returns {string} Identificador único.
 */
function gerarIdentificadorUnico() {
  return `post-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

/**
 * Formata uma data no padrão brasileiro.
 * @param {string} data - Data em formato ISO ou similar.
 * @returns {string} Data formatada.
 */
function formatarData(data) {
  const dataObjeto = new Date(data);

  if (Number.isNaN(dataObjeto.getTime())) {
    return 'Data não informada';
  }

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(dataObjeto);
}

/**
 * Resolve o caminho de imagens e vídeos respeitando a estrutura de diretórios.
 * @param {string} caminho - Caminho relativo ou absoluto informado no cadastro.
 * @returns {string} Caminho pronto para uso no atributo src.
 */
function resolverCaminhoDeMidia(caminho) {
  if (!caminho || typeof caminho !== 'string') {
    return '';
  }

  const caminhoNormalizado = caminho.trim();

  if (/^https?:\/\//i.test(caminhoNormalizado) || caminhoNormalizado.startsWith('data:')) {
    return caminhoNormalizado;
  }

  if (urlBaseRecursos instanceof URL) {
    try {
      const url = new URL(caminhoNormalizado.replace(/^\//, ''), urlBaseRecursos);
      return url.href;
    } catch (erro) {
      console.warn('Não foi possível resolver o caminho informado.', erro);
      return caminhoNormalizado;
    }
  }

  return caminhoNormalizado;
}

/**
 * Remove possíveis caracteres inseguros de textos exibidos via innerHTML.
 * @param {string} texto - Texto a ser sanitizado.
 * @returns {string} Texto sanitizado.
 */
function sanitizarTexto(texto) {
  return texto.replace(/[&<>"]/g, (caractere) => {
    switch (caractere) {
      case '&':
        return '&amp;';
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '"':
        return '&quot;';
      default:
        return caractere;
    }
  });
}

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
