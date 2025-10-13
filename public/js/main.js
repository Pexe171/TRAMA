// TRAMA Portal - public/js/main.js v2.9.0

document.addEventListener('DOMContentLoaded', () => {
    // ... código existente ...
    const mainContent = document.getElementById('main-content');
    const navLinksContainer = document.getElementById('nav-links');
    const authButtonsContainer = document.getElementById('auth-buttons');

    // VERIFICAÇÃO DE SEGURANÇA
    if (!mainContent || !navLinksContainer || !authButtonsContainer) {
        console.log("Script principal (main.js) não executado: elementos essenciais não encontrados.");
        return;
    }

    const checkAuthStatus = () => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user'); // Assumindo que o nome do utilizador é guardado no login
        if (token && user) {
            authButtonsContainer.innerHTML = `
                <div class="flex items-center gap-4">
                    <span class="text-sm text-gray-600">Olá, ${user}</span>
                    <button id="logout-button" class="bg-trama-red text-white py-2 px-4 rounded-md hover:opacity-90">Sair</button>
                </div>
            `;
            document.getElementById('logout-button').addEventListener('click', async () => {
                // Tenta fazer o logout no servidor
                try {
                    await fetch('/api/auth/logout', { method: 'POST' });
                } catch (e) {
                    console.error("Logout no servidor falhou, mas continuará no cliente.", e);
                } finally {
                    // Limpa o armazenamento local independentemente do resultado do servidor
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    window.location.hash = '';
                    location.reload();
                }
            });
        } else {
            authButtonsContainer.innerHTML = `
                <div class="relative">
                    <button id="access-button" class="bg-trama-red text-white py-2 px-4 rounded-md hover:opacity-90">Acessar</button>
                    <div id="auth-dropdown" class="hidden absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                        <a href="/login" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Login</a>
                        <a href="/register" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Registrar-se</a>
                    </div>
                </div>
            `;
            const accessButton = document.getElementById('access-button');
            const authDropdown = document.getElementById('auth-dropdown');
            accessButton.addEventListener('click', (e) => {
                e.stopPropagation();
                authDropdown.classList.toggle('hidden');
            });
        }
    };
    
    // ... outras funções como renderHome, renderEditoria ...
    const renderHome = async () => {
         try {
            const res = await fetch('/api/home');
            if (!res.ok) throw new Error('Erro ao carregar conteúdo da página inicial.');
            const data = await res.json();
            
            let postagensHtml = '<p class="text-center text-gray-500">Em breve, novas postagens!</p>';
            if (data.ultimasPostagens && data.ultimasPostagens.length > 0) {
                postagensHtml = data.ultimasPostagens.map(post => `
                    <div class="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
                        <a href="#${post.editoriaId.slug}/${post.slug}">
                            <img src="${post.coverImage}" alt="Imagem de capa" class="w-full h-48 object-cover">
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
                <div class="text-center py-12 bg-gray-50">
                     <h1 class="text-4xl font-bold font-playfair">Onde o cinema encontra a estratégia</h1>
                     <p class="text-lg text-gray-600 mt-2">Análises, bastidores e tudo sobre o universo cinematográfico.</p>
                </div>
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
                        <img src="${article.coverImage}" alt="${article.title}" class="w-full md:w-1/3 h-auto object-cover rounded-md">
                        <div class="flex-1">
                            <h3 class="text-2xl font-bold font-playfair">${article.title}</h3>
                            <p class="text-sm text-gray-500 my-2">Publicado em ${new Date(article.publishedAt).toLocaleDateString()}</p>
                            <p class="text-gray-700">${article.summary}</p>
                            <a href="#${slug}/${article.slug}" class="text-trama-red font-semibold hover:underline mt-4 inline-block">Ler mais &rarr;</a>
                        </div>
                    </div>
                `).join('');
            }

            mainContent.innerHTML = `
                <div class="bg-gray-800 text-white py-16 text-center" style="background-image: url('${editoria.coverImage}'); background-size: cover; background-position: center;">
                    <div class="bg-black bg-opacity-50 py-16">
                        <h1 class="text-5xl font-playfair font-bold">${editoria.title}</h1>
                        <p class="max-w-2xl mx-auto mt-4">${editoria.description}</p>
                    </div>
                </div>
                <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                    ${articlesHtml}
                </div>
            `;
        } catch (error) {
            console.error(error);
            mainContent.innerHTML = `<div class="text-center py-10"><p class="text-trama-red">Não foi possível carregar a editoria.</p></div>`;
        }
    };

    const renderQuemSomos = async () => { /* ...código existente... */ };

    const renderArticle = async (editoriaSlug, articleSlug) => {
        try {
            const res = await fetch(`/api/articles/${editoriaSlug}/${articleSlug}`);
            if (!res.ok) throw new Error('Artigo não encontrado.');
            
            const article = await res.json();
            
            // Lógica para transformar URL do YouTube
            let videoEmbedUrl = '';
            if (article.videoUrl) {
                const videoId = article.videoUrl.split('v=')[1];
                if (videoId) {
                    const ampersandPosition = videoId.indexOf('&');
                    const cleanVideoId = ampersandPosition !== -1 ? videoId.substring(0, ampersandPosition) : videoId;
                    videoEmbedUrl = `https://www.youtube.com/embed/${cleanVideoId}`;
                }
            }

            let contentHtml = `
                <article>
                    <!-- HERO SECTION: IMAGEM OU VÍDEO DE CAPA -->
                    <header class="relative h-72 md:h-96 w-full mb-8">
                        <div class="absolute inset-0 bg-gray-900">
                            ${
                                (article.format === 'video' || article.format === 'videocast') && videoEmbedUrl
                                ? `<iframe class="w-full h-full" src="${videoEmbedUrl}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
                                : `<img src="${article.coverImage}" alt="Imagem de capa do artigo" class="w-full h-full object-cover opacity-50">`
                            }
                        </div>
                        <div class="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-center p-4">
                            <a href="#${editoriaSlug}" class="text-white text-sm uppercase tracking-widest font-semibold hover:underline mb-2">${article.editoriaId.title}</a>
                            <h1 class="text-3xl md:text-5xl font-bold font-playfair text-white">${article.title}</h1>
                        </div>
                    </header>

                    <!-- CONTEÚDO DO ARTIGO -->
                    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div class="prose max-w-none mb-12 text-lg leading-relaxed">
                            ${article.content}
                        </div>

                        <!-- INFORMAÇÕES DO AUTOR -->
                        <footer class="border-t pt-6 text-right mb-12">
                            <p class="text-gray-600">Por <strong>${article.authorId.displayName || 'Equipa TRAMA'}</strong></p>
                            <p class="text-sm text-gray-500">Publicado em ${new Date(article.publishedAt).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </footer>

                        <!-- SECÇÃO DE AVALIAÇÃO -->
                        <div id="ratings-section" class="flex flex-col items-center justify-center gap-2 my-8 bg-gray-50 p-6 rounded-lg">
                             <h3 class="text-lg font-bold text-gray-800">Avalie este artigo</h3>
                             <!-- Estrelas e contagem serão inseridas aqui -->
                        </div>

                        <!-- SECÇÃO DE COMENTÁRIOS -->
                        <div id="comments-section" class="mt-12">
                            <h2 class="text-2xl font-bold mb-4">Comentários</h2>
                            <div id="comment-form-container"></div>
                            <div id="comment-error" class="hidden text-red-500 mt-2"></div>
                            <div id="comments-list" class="mt-6 space-y-4"></div>
                        </div>
                    </div>
                </article>
            `;
            mainContent.innerHTML = contentHtml;
            document.title = `${article.title} - TRAMA`;

            // Carrega as interações do artigo
            loadAndRenderRatings(article);
            loadAndRenderComments(article.slug);

        } catch (error) {
            console.error(error);
            mainContent.innerHTML = `<div class="text-center py-10"><p class="text-trama-red">Não foi possível carregar o artigo.</p></div>`;
        }
    };
    
    // ... funções de interação como loadAndRenderRatings, loadAndRenderComments ...
    
    const loadAndRenderRatings = async (article) => { /* ...código existente sem alerts... */ };
    const loadAndRenderComments = async (articleSlug) => {
        const commentsList = document.getElementById('comments-list');
        const commentFormContainer = document.getElementById('comment-form-container');
        const commentError = document.getElementById('comment-error');
        const token = localStorage.getItem('token');

        if (token) {
            commentFormContainer.innerHTML = `
                <form id="comment-form" class="bg-gray-50 p-4 rounded-lg">
                    <textarea id="comment-content" class="w-full p-2 border rounded-md" rows="3" placeholder="Escreva o seu comentário..." required></textarea>
                    <button type="submit" class="mt-2 bg-trama-red text-white py-2 px-4 rounded-md hover:opacity-90">Enviar Comentário</button>
                </form>
            `;
            document.getElementById('comment-form').addEventListener('submit', async (e) => {
                e.preventDefault();
                commentError.classList.add('hidden');
                const content = document.getElementById('comment-content').value;
                try {
                    const res = await fetch(`/api/interact/articles/${articleSlug}/comments`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                        body: JSON.stringify({ content })
                    });
                    if (!res.ok) {
                        const errorData = await res.json();
                        throw new Error(errorData.message || 'Falha ao enviar comentário.');
                    }
                    document.getElementById('comment-content').value = '';
                    loadAndRenderComments(articleSlug);
                } catch (error) {
                    commentError.textContent = error.message;
                    commentError.classList.remove('hidden');
                }
            });
        } else {
            commentFormContainer.innerHTML = `<p class="bg-gray-100 p-4 rounded-md text-center">Você precisa <a href="/login" class="text-trama-red underline">iniciar sessão</a> para comentar.</p>`;
        }

        try {
            const res = await fetch(`/api/interact/articles/${articleSlug}/comments`);
            const comments = await res.json();
            
            if (comments.length === 0) {
                commentsList.innerHTML = '<p>Ainda não existem comentários. Seja o primeiro a comentar!</p>';
            } else {
                commentsList.innerHTML = comments.map(comment => `
                    <div class="bg-white p-4 rounded-lg border">
                        <div class="flex items-center mb-2">
                            <img src="${comment.authorId.avatarUrl || 'https://placehold.co/40x40/cccccc/ffffff?text=' + (comment.authorId.displayName || 'U')[0]}" alt="Avatar" class="w-10 h-10 rounded-full mr-3">
                            <div>
                                <p class="font-bold">${comment.authorId.displayName || comment.authorId.username}</p>
                                <p class="text-xs text-gray-500">${new Date(comment.createdAt).toLocaleString()}</p>
                            </div>
                        </div>
                        <p class="text-gray-700 whitespace-pre-wrap">${comment.content}</p>
                    </div>
                `).join('');
            }
        } catch (error) {
            commentsList.innerHTML = '<p>Erro ao carregar os comentários.</p>';
        }
    };
    
    // Roteador e inicialização
    const router = async () => { /* ...código existente... */ };
    const initApp = async () => { /* ...código existente... */ };

    window.addEventListener('hashchange', router);
    document.body.addEventListener('click', (e) => {
        const dropdown = document.getElementById('auth-dropdown');
        if (dropdown && !dropdown.contains(e.target) && e.target.id !== 'access-button') {
            dropdown.classList.add('hidden');
        }
    });
    
    initApp();
});

