// TRAMA Portal - public/js/main.js v3.2.3 (Final)

document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.getElementById('main-content');
    const navLinksContainer = document.getElementById('nav-links');
    const authButtonsContainer = document.getElementById('auth-buttons');

    if (!mainContent || !navLinksContainer || !authButtonsContainer) {
        console.log("Script principal (main.js) não executado: elementos essenciais não encontrados.");
        return;
    }

    const checkAuthStatus = () => {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));

        if (token && user) {
            authButtonsContainer.innerHTML = `
                <div class="flex items-center gap-4">
                    <span class="text-sm">Olá, ${user.displayName || user.username}!</span>
                    <button id="logout-button" class="bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 text-sm">Sair</button>
                </div>
            `;
            document.getElementById('logout-button').addEventListener('click', async () => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                try {
                    await fetch('/api/auth/logout', { method: 'POST' });
                } finally {
                    window.location.hash = '';
                    location.reload();
                }
            });
        } else {
            authButtonsContainer.innerHTML = `
                <a href="/login" class="bg-trama-red text-white py-2 px-4 rounded-md hover:opacity-90">Acessar</a>
            `;
        }
    };
    
    const renderHome = async () => {
         try {
            const [editoriasRes, articlesRes] = await Promise.all([
                fetch('/api/editorias'),
                fetch('/api/home')
            ]);

            if (!editoriasRes.ok) throw new Error('Erro ao carregar editorias.');
            if (!articlesRes.ok) throw new Error('Erro ao carregar artigos.');

            const editorias = await editoriasRes.json();
            const data = await articlesRes.json();
            
            let editoriasHtml = '<p class="text-center text-gray-500 col-span-full">Nenhuma editoria para exibir.</p>';
            if (editorias && editorias.length > 0) {
                editoriasHtml = editorias.map(e => `
                    <a href="#${e.slug}" class="editoria-card">
                        <img src="/uploads/${e.coverImage}" alt="${e.title}" class="editoria-card-img">
                        <div class="editoria-card-overlay">
                            <h3 class="editoria-card-title">${e.title}</h3>
                        </div>
                    </a>
                `).join('');
            }
            
            let postagensHtml = '<p class="text-center text-gray-500">Em breve, novas postagens!</p>';
            if (data.ultimasPostagens && data.ultimasPostagens.length > 0) {
                postagensHtml = data.ultimasPostagens.map(post => `
                    <div class="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
                        <a href="#${post.editoriaId.slug}/${post.slug}">
                            <img src="/uploads/${post.coverImage}" alt="Imagem de capa" class="w-full h-48 object-cover">
                            <div class="p-4">
                                <span class="text-sm text-trama-red font-semibold">${post.editoriaId.title}</span>
                                <h3 class="text-lg font-bold mt-1">${post.title}</h3>
                                <p class="text-gray-600 text-sm mt-2">${post.summary}</p>
                            </div>
                        </a>
                    </div>
                `).join('');
            }

            mainContent.innerHTML = `
                <div class="text-center py-12">
                     <h1 class="text-4xl font-bold font-playfair">Onde o cinema encontra a estratégia</h1>
                     <p class="text-lg text-gray-600 mt-2">Análises, bastidores e tudo sobre o universo cinematográfico.</p>
                </div>

                <!-- Secção de Editorias -->
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <h2 class="text-3xl font-bold font-playfair text-center mb-8">Nossas Editorias</h2>
                    <div class="editoria-grid">
                        ${editoriasHtml}
                    </div>
                </div>

                <!-- Secção de Últimas Postagens -->
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <h2 class="text-2xl font-bold mb-6">Últimas Postagens</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        ${postagensHtml}
                    </div>
                </div>
            `;
        } catch (error) {
            console.error(error);
            mainContent.innerHTML = `<div class="text-center py-10"><h2 class="text-2xl font-bold text-trama-red">Oops! Algo deu errado.</h2><p class="text-gray-600 mt-2">Não foi possível carregar o conteúdo. Tente novamente mais tarde.</p></div>`;
        }
    };

    const renderEditoria = async (slug) => {
        try {
            const res = await fetch(`/api/editorias/${slug}`);
            if (!res.ok) throw new Error('Editoria não encontrada.');
            const editoria = await res.json();
            
            let articlesHtml = '<p class="text-center text-gray-500">Em breve, postagens nesta editoria!</p>';
            if (editoria.articles && editoria.articles.length > 0) {
                articlesHtml = editoria.articles.map(article => `
                    <div class="bg-white p-6 rounded-lg shadow-md flex flex-col md:flex-row gap-6">
                        <img src="/uploads/${article.coverImage}" alt="${article.title}" class="w-full md:w-1/3 h-auto object-cover rounded-md">
                        <div class="flex-1">
                            <h3 class="text-2xl font-bold font-playfair">${article.title}</h3>
                            <p class="text-sm text-gray-500 my-2">Publicado em ${new Date(article.publishedAt).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                            <p class="text-gray-700">${article.summary}</p>
                            <a href="#${slug}/${article.slug}" class="text-trama-red font-semibold hover:underline mt-4 inline-block">Ler mais &rarr;</a>
                        </div>
                    </div>
                `).join('');
            }

            mainContent.innerHTML = `
                 <div class="relative text-white py-24 text-center bg-cover bg-center" style="background-image: url('/uploads/${editoria.coverImage}');">
                    <div class="absolute inset-0 bg-black bg-opacity-60"></div>
                    <div class="relative z-10">
                        <h1 class="text-5xl font-playfair font-bold">${editoria.title}</h1>
                        <p class="max-w-2xl mx-auto mt-4 text-lg">${editoria.description}</p>
                    </div>
                </div>
                <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
                    ${articlesHtml}
                </div>
            `;
        } catch (error) {
            console.error(error);
            mainContent.innerHTML = `<div class="text-center py-10"><p class="text-trama-red">Não foi possível carregar a editoria.</p></div>`;
        }
    };
    
    const renderQuemSomos = async () => {
        mainContent.innerHTML = `
            <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                <h1 class="text-5xl font-bold font-playfair mb-6">Quem Somos?</h1>
                <div class="prose max-w-none mx-auto text-lg text-gray-700 leading-loose">
                    <p>Somos o Trama, um portal de cinema e comunicação, criado por estudantes de Relações Públicas da UFAM, para amantes do cinema!</p>
                    <p>Com o objetivo de apresentar as estratégias de comunicação presentes no mundo cinematográfico.</p>
                </div>
            </div>
        `;
    };

    const renderArticle = async (editoriaSlug, articleSlug) => {
        try {
            const res = await fetch(`/api/articles/${editoriaSlug}/${articleSlug}`);
            if (!res.ok) throw new Error('Artigo não encontrado.');
            const article = await res.json();

            const articleHtml = `
                <div class="article-frame ${'frame-' + article.frameStyle}">
                    <div class="article-header" style="background-image: url('/uploads/${article.coverImage}')">
                        <div class="article-header-overlay">
                            <h1 class="article-title">${article.title}</h1>
                        </div>
                    </div>
                    <div class="article-body">
                        <div class="prose max-w-none">
                            ${article.content}
                        </div>
                        <div class="article-meta">
                             <p>Por ${article.authorId.displayName || 'Equipa TRAMA'} em ${new Date(article.publishedAt).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                        </div>
                    </div>
                </div>`;

            mainContent.innerHTML = `
                <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <a href="#${editoriaSlug}" class="text-trama-red hover:underline mb-6 inline-block">&larr; Voltar para ${article.editoriaId.title}</a>
                    ${articleHtml}
                    <!-- Interações -->
                    <div id="ratings-section" class="my-8"></div>
                    <div id="comments-section" class="mt-12"></div>
                </div>
            `;
            
            loadAndRenderRatings(article);
            loadAndRenderComments(article.slug);

        } catch (error) {
            console.error(error);
            mainContent.innerHTML = `<div class="error-container"><p>Não foi possível carregar o artigo.</p></div>`;
        }
    };
    
    const loadAndRenderRatings = async (article) => { /* ... (código existente sem alterações) ... */ };
    const loadAndRenderComments = async (articleSlug) => { /* ... (código existente sem alterações) ... */ };

    const router = async () => {
        const hash = window.location.hash.replace('#', '');
        const [page, slug] = hash.split('/');
        mainContent.innerHTML = `<div class="text-center py-16"><p>Carregando conteúdo...</p></div>`;

        document.querySelectorAll('#nav-links a, #mobile-nav-links a').forEach(link => {
            link.classList.remove('active');
            if (link.hash === `#${page || ''}`) {
                link.classList.add('active');
            }
        });
        
        if (page && slug) await renderArticle(page, slug);
        else if (page === 'quem-somos') await renderQuemSomos();
        else if (page) await renderEditoria(page);
        else await renderHome();
    };

    const initApp = async () => {
        checkAuthStatus();
        try {
            const res = await fetch('/api/editorias');
            if (!res.ok) throw new Error('Erro ao carregar menu.');
            const editorias = await res.json();
            
            const linksHtml = `
                <a href="#" class="nav-link active">Início</a>
                ${editorias.map(e => `<a href="#${e.slug}" class="nav-link">${e.title}</a>`).join('')}
                <a href="#quem-somos" class="nav-link">Quem Somos</a>
            `;
            navLinksContainer.innerHTML = linksHtml;
            document.getElementById('mobile-nav-links').innerHTML = linksHtml.replaceAll('nav-link', 'block py-2 px-3 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-trama-red');

        } catch (error) {
            console.error(error);
            navLinksContainer.innerHTML = `<p class="text-sm text-red-500">Menu indisponível</p>`;
        }
        await router();
    };
    
    // --- EVENT LISTENERS ---
    window.addEventListener('hashchange', router);
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    initApp();
});

