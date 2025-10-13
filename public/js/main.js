// TRAMA Portal - public/js/main.js v2.7.3

document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.getElementById('main-content');
    const navLinksContainer = document.getElementById('nav-links');
    const authButtonsContainer = document.getElementById('auth-buttons');

    // VERIFICAÇÃO DE SEGURANÇA: Se os elementos principais não existirem,
    // significa que não estamos na página principal. Interrompe a execução do script.
    if (!mainContent || !navLinksContainer || !authButtonsContainer) {
        console.log("Script principal (main.js) não executado: elementos essenciais não encontrados. Isto é normal em páginas como login ou registo.");
        return;
    }

    // Função para verificar o estado de autenticação e atualizar o UI
    const checkAuthStatus = () => {
        const token = localStorage.getItem('token');
        if (token) {
            // Utilizador está logado
            authButtonsContainer.innerHTML = `
                <button id="logout-button" class="bg-trama-red text-white py-2 px-4 rounded-md hover:opacity-90">Sair</button>
            `;
            document.getElementById('logout-button').addEventListener('click', () => {
                localStorage.removeItem('token');
                window.location.hash = ''; // Volta para a página inicial
                location.reload(); // Recarrega a página para atualizar o estado
            });
        } else {
            // Utilizador não está logado
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
    
    // Função para renderizar a página inicial
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
                <div class="text-center py-12 bg-gray-50">
                     <h1 class="text-4xl font-bold font-serif">Onde o cinema encontra a estratégia</h1>
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

    // Função para renderizar uma página de editoria
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
                            <h3 class="text-2xl font-bold font-serif">${article.title}</h3>
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
                        <h1 class="text-5xl font-serif font-bold">${editoria.title}</h1>
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
    
    // Função para renderizar a página "Quem Somos"
    const renderQuemSomos = async () => {
        try {
            const res = await fetch('/api/quem-somos');
             if (!res.ok) throw new Error('Erro ao carregar conteúdo.');
             const data = await res.json();
             mainContent.innerHTML = `
                <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <h1 class="text-5xl font-bold font-serif text-center mb-4">${data.title}</h1>
                    <div class="prose max-w-none mx-auto text-lg text-center">
                         ${data.content}
                    </div>
                </div>
             `;
        } catch (error) {
             console.error(error);
            mainContent.innerHTML = `<div class="text-center py-10"><p class="text-trama-red">Não foi possível carregar a página.</p></div>`;
        }
    };

    const renderArticle = async (editoriaSlug, articleSlug) => {
        try {
            const res = await fetch(`/api/articles/${editoriaSlug}/${articleSlug}`);
            if (!res.ok) throw new Error('Artigo não encontrado.');
            
            const article = await res.json();
            
            let contentHtml = `
                <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <a href="#${editoriaSlug}" class="text-trama-red hover:underline mb-4 inline-block">&larr; Voltar para ${article.editoriaId.title}</a>
                    <h1 class="text-4xl font-bold font-serif text-gray-900 mb-2">${article.title}</h1>
                    <p class="text-gray-500 mb-4">Por ${article.authorId.displayName || 'Equipa TRAMA'} em ${new Date(article.publishedAt).toLocaleDateString()}</p>
                    
                    <!-- Secção de Avaliação -->
                    <div id="ratings-section" class="flex items-center gap-4 my-6 bg-gray-50 p-4 rounded-lg">
                        <!-- Estrelas para avaliação -->
                    </div>

                    <img src="/uploads/${article.coverImage}" alt="Imagem de capa do artigo" class="w-full h-auto object-cover rounded-lg mb-6">
                    
                    <div class="prose max-w-none">
                        ${article.content}
                    </div>

                    <!-- Secção de Comentários -->
                    <div id="comments-section" class="mt-12">
                        <h2 class="text-2xl font-bold mb-4">Comentários</h2>
                        <div id="comment-form-container"></div>
                        <div id="comments-list" class="mt-6 space-y-4"></div>
                    </div>
                </div>
            `;
            mainContent.innerHTML = contentHtml;

            // Carrega as interações do artigo
            loadAndRenderRatings(article);
            loadAndRenderComments(article.slug);

        } catch (error) {
            console.error(error);
            mainContent.innerHTML = `<div class="text-center py-10"><p class="text-trama-red">Não foi possível carregar o artigo.</p></div>`;
        }
    };
    
    // Função para carregar e renderizar as AVALIAÇÕES
    const loadAndRenderRatings = async (article) => {
        const ratingsSection = document.getElementById('ratings-section');
        const token = localStorage.getItem('token');
        let userRating = 0;

        if (token) {
            try {
                const res = await fetch(`/api/interact/articles/${article.slug}/ratings/my-rating`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    userRating = data.value;
                }
            } catch (error) {
                console.error("Erro ao buscar a avaliação do utilizador", error);
            }
        }

        const renderStars = (currentRating, avgRating, count) => {
            let starsHtml = '<div class="flex items-center gap-1">';
            for (let i = 1; i <= 5; i++) {
                const isChecked = i <= currentRating;
                starsHtml += `
                    <svg class="w-6 h-6 ${isChecked ? 'text-yellow-400' : 'text-gray-300'} ${token ? 'cursor-pointer' : ''}" 
                         data-value="${i}" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                `;
            }
            starsHtml += '</div>';

            const avgText = `
                <div class="text-sm text-gray-600 ml-2">
                    <strong>${avgRating.toFixed(1)}</strong>/5.0 (${count} ${count === 1 ? 'voto' : 'votos'})
                </div>
            `;
            ratingsSection.innerHTML = starsHtml + avgText;

            if (token) {
                ratingsSection.querySelectorAll('svg').forEach(star => {
                    star.addEventListener('click', async () => {
                        const value = parseInt(star.dataset.value);
                        try {
                            const res = await fetch(`/api/interact/articles/${article.slug}/ratings`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${token}`
                                },
                                body: JSON.stringify({ value })
                            });
                             if (!res.ok) throw new Error('Falha ao enviar avaliação.');
                             const data = await res.json();
                             // Re-renderiza as estrelas com os novos dados
                             renderStars(value, data.stats.ratingsAvg, data.stats.ratingsCount);
                        } catch (error) {
                            console.error(error);
                            alert('Não foi possível submeter a sua avaliação.');
                        }
                    });
                });
            }
        };

        renderStars(userRating, article.stats.ratingsAvg, article.stats.ratingsCount);
    };


    // Função para carregar e renderizar os comentários
    const loadAndRenderComments = async (articleSlug) => {
        const commentsList = document.getElementById('comments-list');
        const commentFormContainer = document.getElementById('comment-form-container');
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
                    alert(error.message);
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
                        <p class="text-gray-700">${comment.content}</p>
                    </div>
                `).join('');
            }
        } catch (error) {
            commentsList.innerHTML = '<p>Erro ao carregar os comentários.</p>';
        }
    };

    // Roteador simples
    const router = async () => {
        const hash = window.location.hash.replace('#', '');
        const [page, slug] = hash.split('/');
        
        mainContent.innerHTML = `<div class="text-center py-10"><p>Carregando conteúdo...</p></div>`;

        if (navLinksContainer.innerHTML.includes('a')) { // Só altera o estilo se o menu já foi carregado
             document.querySelectorAll('#nav-links a').forEach(link => {
                link.classList.remove('text-trama-red', 'font-bold');
                if (link.hash === `#${page || ''}`) {
                    link.classList.add('text-trama-red', 'font-bold');
                }
            });
        }
        
        if (page && slug) {
            await renderArticle(page, slug);
        } else if (page === 'quem-somos') {
            await renderQuemSomos();
        } else if (page) {
            await renderEditoria(page);
        } else {
            await renderHome();
        }
    };

    // Função de inicialização
    const initApp = async () => {
        // Executa a verificação de autenticação primeiro e de forma independente
        checkAuthStatus();

        try {
            const res = await fetch('/api/editorias');
            if (!res.ok) throw new Error('Erro ao carregar menu.');
            const editorias = await res.json();
            
            navLinksContainer.innerHTML = `
                <a href="#" class="text-gray-700 hover:text-trama-red px-3 py-2 rounded-md text-sm font-medium">Início</a>
                ${editorias.map(e => `<a href="#${e.slug}" class="text-gray-700 hover:text-trama-red px-3 py-2 rounded-md text-sm font--medium">${e.title}</a>`).join('')}
                <a href="#quem-somos" class="text-gray-700 hover:text-trama-red px-3 py-2 rounded-md text-sm font-medium">Quem Somos</a>
            `;
        } catch (error) {
            console.error(error);
            navLinksContainer.innerHTML = `<p class="text-trama-red">Erro ao carregar menu.</p>`;
        }
        
        // Executa sempre o router para carregar o conteúdo da página, mesmo que o menu falhe
        await router();
    };

    window.addEventListener('hashchange', router);
    document.body.addEventListener('click', (e) => {
        const dropdown = document.getElementById('auth-dropdown');
        if (dropdown && !dropdown.contains(e.target) && e.target.id !== 'access-button') {
            dropdown.classList.add('hidden');
        }
    });
    
    initApp();
});

