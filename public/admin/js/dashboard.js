// TRAMA Portal - public/admin/js/dashboard.js v2.12.0 (Implementando Edição de Artigos)

document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTOS GERAIS ---
    const logoutButton = document.getElementById('logout-button');
    const articlesList = document.getElementById('articles-list');
    const usersList = document.getElementById('users-list');
    const toggleDarkModeButton = document.getElementById('toggle-dark-mode'); 
    const themeIcon = document.getElementById('theme-icon'); 
    
    // --- ABAS DE NAVEGAÇÃO ---
    const tabArticles = document.getElementById('tab-articles');
    const tabEditorias = document.getElementById('tab-editorias');
    const tabUsers = document.getElementById('tab-users');
    const contentArticles = document.getElementById('content-articles');
    const contentEditorias = document.getElementById('content-editorias');
    const contentUsers = document.getElementById('content-users');
    
    // --- FORMULÁRIO DE ARTIGO ---
    const articleForm = document.getElementById('article-form');
    const editoriaSelect = document.getElementById('editoria');
    const articleSubmitBtn = articleForm.querySelector('button[type="submit"]'); // Botão de submissão do artigo
    const articleIdInput = document.createElement('input'); // Cria um campo escondido para o ID do artigo
    articleIdInput.type = 'hidden';
    articleIdInput.id = 'article-id';
    articleIdInput.name = 'id';
    articleForm.prepend(articleIdInput); // Adiciona o campo escondido ao formulário
    
    // --- FORMULÁRIO DE EDITORIA ---
    const editoriaForm = document.getElementById('editoria-form');
    const editoriasList = document.getElementById('editorias-list');
    const editoriaSubmitBtn = document.getElementById('editoria-submit-btn');
    
    // Função para obter o cabeçalho de autorização (Centralizada para reuso)
    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        if (!token || token === 'undefined' || token === 'null') {
            // Se não houver token, o usuário deve ser redirecionado
            console.error("Token não encontrado ou inválido. Redirecionando para login.");
            // Impedir redirecionamento durante o desenvolvimento (opcional, pode ser removido em produção)
            // window.location.href = '/acesso/admin'; 
            return {}; 
        }
        // Para a maioria das chamadas (exceto FormData, que não deve ter Content-Type)
        return { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        };
    };

    // Função para obter apenas o cabeçalho de Autorização (Para uso com FormData)
    const getAuthHeaderOnly = () => {
         const token = localStorage.getItem('token');
         if (!token || token === 'undefined' || token === 'null') {
            return {};
         }
         return {
            'Authorization': `Bearer ${token}`
         };
    };


    // --- LÓGICA DO TEMA ESCURO ---
    const toggleDarkMode = () => {
        const isDark = document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
        themeIcon.textContent = isDark ? '🌙' : '☀️';
    };
    
    const applyInitialTheme = () => {
        if (localStorage.getItem('darkMode') === 'enabled') {
            document.body.classList.add('dark-mode');
            themeIcon.textContent = '🌙';
        } else {
             themeIcon.textContent = '☀️';
        }
    };
    applyInitialTheme();
    toggleDarkModeButton.addEventListener('click', toggleDarkMode);


    // --- LÓGICA DAS ABAS ---
    const switchToTab = (activeTab) => {
        [contentArticles, contentEditorias, contentUsers].forEach(c => c.classList.add('hidden'));
        [tabArticles, tabEditorias, tabUsers].forEach(t => {
            t.classList.remove('border-trama-red', 'text-trama-red');
            t.classList.add('border-transparent', 'text-gray-500');
        });

        if (activeTab === 'articles') {
            contentArticles.classList.remove('hidden');
            tabArticles.classList.add('border-trama-red', 'text-trama-red');
            loadArticles();
        } else if (activeTab === 'editorias') {
            contentEditorias.classList.remove('hidden');
            tabEditorias.classList.add('border-trama-red', 'text-trama-red');
            loadEditoriasList(); 
        } else if (activeTab === 'users') {
            contentUsers.classList.remove('hidden');
            tabUsers.classList.add('border-trama-red', 'text-trama-red');
            loadUsers();
        }
    };
    tabArticles.addEventListener('click', () => switchToTab('articles'));
    tabEditorias.addEventListener('click', () => switchToTab('editorias'));
    tabUsers.addEventListener('click', () => switchToTab('users'));
    
    // --- LÓGICA DE LOGOUT ---
    logoutButton.addEventListener('click', async () => {
        localStorage.removeItem('token'); 
        await fetch('/api/auth/logout', { method: 'POST' });
        window.location.href = '/acesso/admin';
    });
    
    // --- FUNÇÃO AUXILIAR: Resetar Formulário de Artigos (NOVO) ---
    const resetArticleForm = () => {
        articleForm.reset();
        articleIdInput.value = '';
        articleSubmitBtn.textContent = 'Criar Postagem';
        articleForm.title.focus();
    };

    // --- CARREGAR DADOS ---

    // Carregar editorias para o <select> de artigos (Usa rota pública)
    const loadEditorias = async () => { 
        try {
            const res = await fetch('/api/editorias');
            if (!res.ok) throw new Error('Falha ao carregar editorias para o dropdown.');
            const editorias = await res.json();
            editoriaSelect.innerHTML = editorias.map(e => `<option value="${e._id}">${e.title}</option>`).join('');
        } catch (error) {
            console.error("Erro no loadEditorias do dropdown:", error);
            editoriaSelect.innerHTML = '<option value="">Erro ao carregar</option>';
        }
    };
    
    // Carregar a lista de editorias para a aba "Gerir Editorias"
    const loadEditoriasList = async () => {
        editoriasList.innerHTML = '<p class="text-gray-400">Carregando editorias...</p>';
        try {
            const res = await fetch('/api/admin/editorias', { 
                headers: getAuthHeaders() 
            });

            if (res.status === 401) { window.location.href = '/acesso/admin'; return; }
            if (!res.ok) throw new Error('Falha ao carregar lista de editorias. Verifique a consola para detalhes.');
            
            const editorias = await res.json();
            
            editoriasList.innerHTML = editorias.length > 0 ? editorias.map(e => `
                <div class="p-4 border-b flex justify-between items-center bg-white dark:bg-gray-700">
                    <div>
                        <h4 class="font-bold">${e.title}</h4>
                        <p class="text-sm text-gray-500 dark:text-gray-400">Slug: ${e.slug} | Ativa: ${e.isActive ? 'Sim' : 'Não'} | Prioridade: ${e.priority}</p>
                    </div>
                    <div class="flex gap-2">
                         <button data-id="${e._id}" data-editoria='${JSON.stringify(e)}' class="edit-editoria-btn bg-gray-200 text-gray-700 py-1 px-3 rounded-md hover:bg-gray-300 text-sm">Editar</button>
                         <button data-id="${e._id}" class="delete-editoria-btn bg-trama-red text-white py-1 px-3 rounded-md hover:opacity-90 text-sm">Apagar</button>
                    </div>
                </div>
            `).join('') : '<p>Nenhuma editoria encontrada.</p>';
        } catch (error) {
             console.error("Erro no loadEditoriasList:", error);
             editoriasList.innerHTML = `<p class="text-trama-red">Erro ao carregar editorias. ${error.message}</p>`;
        }
    };

    // Carregar a lista de artigos (USA ROTA PROTEGIDA)
    const loadArticles = async () => {
        articlesList.innerHTML = '<p class="text-gray-400">Carregando artigos...</p>';
        try {
            const res = await fetch('/api/admin/articles', { 
                headers: getAuthHeaders() 
            });
            
            if (res.status === 401) { window.location.href = '/acesso/admin'; return; }
            if (!res.ok) throw new Error('Falha ao carregar artigos. Verifique a consola para detalhes.');
            
            const articles = await res.json();
            articlesList.innerHTML = articles.length > 0 ? articles.map(a => `
                <div class="p-4 border-b flex justify-between items-center bg-white dark:bg-gray-700">
                    <div>
                        <h4 class="font-bold">${a.title}</h4>
                        <p class="text-sm text-gray-500 dark:text-gray-400">Editoria: ${a.editoriaId?.title || 'N/A'} | Status: ${a.status}</p>
                    </div>
                    <div class="flex gap-2">
                         <!-- Adicionado data-article para carregar todos os dados no clique -->
                         <button data-id="${a._id}" data-article='${JSON.stringify(a)}' class="edit-article-btn bg-gray-200 text-gray-700 py-1 px-3 rounded-md hover:bg-gray-300 text-sm">Editar</button>
                         <button data-id="${a._id}" class="delete-article-btn bg-trama-red text-white py-1 px-3 rounded-md hover:opacity-90 text-sm">Apagar</button>
                    </div>
                </div>
            `).join('') : '<p>Nenhum artigo encontrado.</p>';
        } catch (error) {
            console.error("Erro no loadArticles:", error);
            articlesList.innerHTML = `<p class="text-trama-red">Erro ao carregar artigos. ${error.message}</p>`;
        }
    };

    // Carregar a lista de utilizadores (USA ROTA PROTEGIDA)
    const loadUsers = async () => {
        usersList.innerHTML = '<p class="text-gray-400">Carregando utilizadores...</p>';
        try {
            const res = await fetch('/api/admin/users', { 
                headers: getAuthHeaders() 
            });

            if (res.status === 401) { window.location.href = '/acesso/admin'; return; }
            if (!res.ok) throw new Error('Falha ao carregar utilizadores. Verifique a consola para detalhes.');
            
            const users = await res.json();
            usersList.innerHTML = users.length > 0 ? users.map(u => `
                <div class="p-4 border-b bg-white dark:bg-gray-700">
                    <h4 class="font-bold">${u.displayName} (@${u.username})</h4>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Email: ${u.email} | Cargo: <span class="font-semibold capitalize">${u.role}</span></p>
                    <p class="text-xs text-gray-400">Registado em: ${new Date(u.createdAt).toLocaleDateString()}</p>
                </div>
            `).join('') : '<p>Nenhum utilizador encontrado.</p>';
        } catch (error) {
            console.error("Erro no loadUsers:", error);
            usersList.innerHTML = `<p class="text-trama-red">Erro ao carregar utilizadores. ${error.message}</p>`;
        }
    };
    
    // --- SUBMISSÃO DO FORMULÁRIO DE ARTIGO (Agora suporta Edição) ---
    articleForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = articleIdInput.value; 
        const method = id ? 'PUT' : 'POST';
        const url = id ? `/api/admin/articles/${id}` : '/api/admin/articles';
        
        const formData = new FormData(articleForm);
        // Garante que o ID é incluído no FormData para PUT, caso o input hidden não esteja a funcionar
        if (id) formData.append('id', id);

        try {
            const res = await fetch(url, { 
                method: method, 
                body: formData,
                headers: getAuthHeaderOnly() // Usa a função que só retorna o cabeçalho Auth
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Falha ao processar postagem');

            alert(id ? 'Postagem atualizada com sucesso!' : 'Postagem criada com sucesso!');
            resetArticleForm(); // Usa a função de reset
            loadArticles();
        } catch (error) { 
            alert(error.message); 
        }
    });
    
    // --- SUBMISSÃO DO FORMULÁRIO DE EDITORIA (Suporta Edição) ---
    editoriaForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('editoria-id').value;
        const method = id ? 'PUT' : 'POST';
        const url = id ? `/api/admin/editorias/${id}` : '/api/admin/editorias';
        
        const formData = new FormData(editoriaForm);
        formData.set('isActive', document.getElementById('editoria-is-active').checked);

        try {
            const res = await fetch(url, { 
                method: method, 
                body: formData,
                headers: getAuthHeaderOnly() 
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.message || 'Falha ao processar editoria.');

            alert(id ? 'Editoria atualizada com sucesso!' : 'Editoria criada com sucesso!');
            editoriaForm.reset();
            document.getElementById('editoria-id').value = '';
            editoriaSubmitBtn.textContent = 'Criar Editoria';
            document.getElementById('editoria-current-image').classList.add('hidden');
            
            await loadEditorias();      
            await loadEditoriasList();  
        } catch (error) { 
            alert(error.message); 
        }
    });

    // --- EVENT LISTENERS (DELEGAÇÃO) ---
    document.body.addEventListener('click', async (e) => {
        
        // NOVO: Editar Artigo (Popula o formulário)
        if (e.target.classList.contains('edit-article-btn')) {
            const articleData = JSON.parse(e.target.dataset.article);

            // 1. Popular o formulário
            articleIdInput.value = articleData._id;
            articleForm.title.value = articleData.title;
            articleForm.summary.value = articleData.summary;
            articleForm.content.value = articleData.content;
            articleForm.editoria.value = articleData.editoriaId._id; // Usa o ID da editoria
            articleForm.status.value = articleData.status;

            // 2. Mudar o UI do botão
            articleSubmitBtn.textContent = 'Guardar Alterações do Artigo';
            
            // 3. Rola para o topo do formulário
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        
        // Apagar Artigo
        if (e.target.classList.contains('delete-article-btn')) {
             const id = e.target.dataset.id;
             if (confirm('Tem a certeza que quer apagar este artigo?')) {
                 try {
                     const res = await fetch(`/api/admin/articles/${id}`, { 
                        method: 'DELETE',
                        headers: getAuthHeaders()
                      });
                     if (!res.ok) throw new Error('Falha ao apagar artigo.');
                     alert('Artigo apagado com sucesso!');
                     loadArticles();
                 } catch (error) { alert(error.message); }
             }
        }
        
        // Editar Editoria (Popula o formulário)
        if (e.target.classList.contains('edit-editoria-btn')) {
            const editoriaData = JSON.parse(e.target.dataset.editoria);
            
            document.getElementById('editoria-id').value = editoriaData._id;
            document.getElementById('editoria-title').value = editoriaData.title;
            document.getElementById('editoria-description').value = editoriaData.description || '';
            document.getElementById('editoria-priority').value = editoriaData.priority || 0;
            document.getElementById('editoria-is-active').checked = editoriaData.isActive;
            
            const currentImageDisplay = document.getElementById('editoria-current-image');
            const imageInput = document.getElementById('editoria-coverImage');
            
            if(editoriaData.coverImage) {
                document.getElementById('editoria-image-name').textContent = editoriaData.coverImage;
                currentImageDisplay.classList.remove('hidden');
            } else {
                 currentImageDisplay.classList.add('hidden');
            }
            
            imageInput.value = null; 

            editoriaSubmitBtn.textContent = 'Guardar Alterações';
            switchToTab('editorias');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        
        // Apagar Editoria
        if (e.target.classList.contains('delete-editoria-btn')) {
            const id = e.target.dataset.id;
            if (confirm('Tem a certeza que quer apagar esta editoria?')) {
                try {
                    const res = await fetch(`/api/admin/editorias/${id}`, { 
                        method: 'DELETE',
                        headers: getAuthHeaders()
                    });
                    if (!res.ok) throw new Error('Falha ao apagar editoria.');
                    alert('Editoria apagada com sucesso!');
                    await loadEditorias();
                    await loadEditoriasList();
                    loadArticles();
                } catch (error) { alert(error.message); }
            }
        }
    });

    // --- INICIALIZAÇÃO ---
    const initDashboard = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
             window.location.href = '/acesso/admin';
             return; 
        }

        await loadEditorias(); 
        switchToTab('articles');
    };
    
    initDashboard();
});
