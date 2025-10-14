// TRAMA Portal - public/admin/js/dashboard.js v2.8.0

document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTOS GERAIS ---
    const logoutButton = document.getElementById('logout-button');
    const articlesList = document.getElementById('articles-list');
    const usersList = document.getElementById('users-list');

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
        } else if (activeTab === 'editorias') {
            contentEditorias.classList.remove('hidden');
            tabEditorias.classList.add('border-trama-red', 'text-trama-red');
        } else if (activeTab === 'users') {
            contentUsers.classList.remove('hidden');
            tabUsers.classList.add('border-trama-red', 'text-trama-red');
        }
    };
    tabArticles.addEventListener('click', () => switchToTab('articles'));
    tabEditorias.addEventListener('click', () => switchToTab('editorias'));
    tabUsers.addEventListener('click', () => switchToTab('users'));

    // --- LÓGICA DE LOGOUT ---
    logoutButton.addEventListener('click', async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        window.location.href = '/acesso/admin';
    });
    
    // --- CARREGAR DADOS ---
    const loadEditorias = async () => {
        try {
            const res = await fetch('/api/editorias');
            if (!res.ok) throw new Error('Falha ao carregar editorias');
            const editorias = await res.json();
            editoriaSelect.innerHTML = editorias.map(e => `<option value="${e._id}">${e.title}</option>`).join('');
        } catch (error) {
            console.error(error);
            alert('Não foi possível carregar as editorias.');
        }
    };

    const loadArticles = async () => {
        try {
            const res = await fetch('/api/admin/articles');
            if (!res.ok) throw new Error('Falha ao carregar artigos');
            const articles = await res.json();
            articlesList.innerHTML = articles.length > 0 ? articles.map(a => `
                <div class="p-4 border-b flex justify-between items-center">
                    <div>
                        <h4 class="font-bold">${a.title}</h4>
                        <p class="text-sm text-gray-500">Editoria: ${a.editoriaId?.title || 'N/A'} | Status: ${a.status}</p>
                    </div>
                    <div class="flex gap-2">
                         <button data-id="${a._id}" class="delete-article-btn bg-trama-red text-white py-1 px-3 rounded-md hover:opacity-90 text-sm">Apagar</button>
                    </div>
                </div>
            `).join('') : '<p>Nenhum artigo encontrado.</p>';
        } catch (error) {
            console.error(error);
            articlesList.innerHTML = '<p>Erro ao carregar artigos.</p>';
        }
    };

    const loadUsers = async () => {
        try {
            const res = await fetch('/api/admin/users');
            if (!res.ok) throw new Error('Falha ao carregar utilizadores');
            const users = await res.json();
            usersList.innerHTML = users.length > 0 ? users.map(u => `
                <div class="p-4 border-b">
                    <h4 class="font-bold">${u.displayName} (@${u.username})</h4>
                    <p class="text-sm text-gray-600">Email: ${u.email} | Cargo: <span class="font-semibold capitalize">${u.role}</span></p>
                    <p class="text-xs text-gray-400">Registado em: ${new Date(u.createdAt).toLocaleDateString()}</p>
                </div>
            `).join('') : '<p>Nenhum utilizador encontrado.</p>';
        } catch (error) {
            console.error(error);
            usersList.innerHTML = '<p>Erro ao carregar utilizadores.</p>';
        }
    };
    
    // --- EVENT LISTENERS (DELEGAÇÃO) ---
    document.body.addEventListener('click', async (e) => {
        if (e.target.classList.contains('delete-article-btn')) {
            const id = e.target.dataset.id;
            if (confirm('Tem a certeza que quer apagar este artigo?')) {
                try {
                    const res = await fetch(`/api/admin/articles/${id}`, { method: 'DELETE' });
                    if (!res.ok) throw new Error('Falha ao apagar artigo.');
                    alert('Artigo apagado com sucesso!');
                    loadArticles();
                } catch (error) { alert(error.message); }
            }
        }
    });

    // --- SUBMISSÃO DO FORMULÁRIO DE ARTIGO ---
    articleForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(articleForm);
        // Os campos do formulário precisam ter o atributo 'name' para o FormData funcionar.
        // Adicionando manualmente como fallback.
        formData.append('title', document.getElementById('title').value);
        formData.append('summary', document.getElementById('summary').value);
        formData.append('content', document.getElementById('content').value);
        formData.append('editoriaId', document.getElementById('editoria').value);
        formData.append('status', document.getElementById('status').value);
        formData.append('coverImage', document.getElementById('coverImage').files[0]);

        try {
            const res = await fetch('/api/admin/articles', { method: 'POST', body: formData });
            if (!res.ok) throw new Error('Falha ao criar postagem');
            alert('Postagem criada com sucesso!');
            articleForm.reset();
            loadArticles();
        } catch (error) { alert(error.message); }
    });
    
    // --- INICIALIZAÇÃO ---
    const initDashboard = async () => {
        await loadEditorias();
        await loadArticles();
        await loadUsers();
    };
    
    initDashboard();
});
