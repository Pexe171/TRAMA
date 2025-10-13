// TRAMA Portal - public/admin/js/dashboard.js v2.7.2

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');

    // --- VERIFICAÇÃO DE SEGURANÇA ---
    if (!token) {
        window.location.href = '/acesso/admin';
        return;
    }

    // --- ELEMENTOS GERAIS ---
    const logoutButton = document.getElementById('logout-button');
    const articlesList = document.getElementById('articles-list');
    const editoriasList = document.getElementById('editorias-list');

    // --- ABAS DE NAVEGAÇÃO ---
    const tabArticles = document.getElementById('tab-articles');
    const tabEditorias = document.getElementById('tab-editorias');
    const contentArticles = document.getElementById('content-articles');
    const contentEditorias = document.getElementById('content-editorias');
    
    // --- FORMULÁRIO DE CRIAÇÃO DE ARTIGO ---
    const articleForm = document.getElementById('article-form');
    const titleInput = document.getElementById('title');
    const summaryInput = document.getElementById('summary');
    const contentInput = document.getElementById('content');
    const editoriaSelect = document.getElementById('editoria');
    const statusSelect = document.getElementById('status');
    const coverImageInput = document.getElementById('coverImage');
    
    // --- FORMULÁRIO DE CRIAÇÃO DE EDITORIA ---
    const editoriaForm = document.getElementById('editoria-form');
    const editoriaTitleInput = document.getElementById('editoria-title');
    const editoriaDescriptionInput = document.getElementById('editoria-description');
    const editoriaCoverImageInput = document.getElementById('editoria-coverImage');
    
    // --- MODAL DE EDIÇÃO DE ARTIGO ---
    const editModal = document.getElementById('edit-modal');
    const editFormContainer = document.getElementById('edit-article-form');
    const closeModalButton = document.getElementById('close-modal-button');

    // --- LÓGICA DAS ABAS ---
    const switchToTab = (activeTab) => {
        if (activeTab === 'articles') {
            tabArticles.classList.add('border-trama-red', 'text-trama-red');
            tabArticles.classList.remove('border-transparent', 'text-gray-500');
            tabEditorias.classList.add('border-transparent', 'text-gray-500');
            tabEditorias.classList.remove('border-trama-red', 'text-trama-red');
            contentArticles.classList.remove('hidden');
            contentEditorias.classList.add('hidden');
        } else if (activeTab === 'editorias') {
            tabEditorias.classList.add('border-trama-red', 'text-trama-red');
            tabEditorias.classList.remove('border-transparent', 'text-gray-500');
            tabArticles.classList.add('border-transparent', 'text-gray-500');
            tabArticles.classList.remove('border-trama-red', 'text-trama-red');
            contentEditorias.classList.remove('hidden');
            contentArticles.classList.add('hidden');
        }
    };
    tabArticles.addEventListener('click', () => switchToTab('articles'));
    tabEditorias.addEventListener('click', () => switchToTab('editorias'));

    // --- LÓGICA DE LOGOUT ---
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = '/acesso/admin';
    });
    
    // --- FUNÇÕES DO MODAL ---
    const openEditModal = () => editModal.classList.remove('hidden');
    const closeEditModal = () => editModal.classList.add('hidden');
    closeModalButton.addEventListener('click', closeEditModal);

    // --- CARREGAR DADOS ---
    const loadEditorias = async () => {
        try {
            const res = await fetch('/api/editorias', { headers: { 'Authorization': `Bearer ${token}` } });
            if (!res.ok) throw new Error('Falha ao carregar editorias');
            const editorias = await res.json();
            
            // Preenche selects nos formulários de artigos
            const optionsHtml = editorias.map(e => `<option value="${e._id}">${e.title}</option>`).join('');
            editoriaSelect.innerHTML = optionsHtml;
            
            // Preenche a lista de editorias para gestão
            editoriasList.innerHTML = editorias.length > 0 ? editorias.map(e => `
                <div class="p-4 border-b flex justify-between items-center">
                    <h4 class="font-bold">${e.title}</h4>
                    <div class="flex gap-2">
                         <button data-id="${e._id}" class="edit-editoria-btn bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600 text-sm">Editar</button>
                         <button data-id="${e._id}" class="delete-editoria-btn bg-trama-red text-white py-1 px-3 rounded-md hover:opacity-90 text-sm">Apagar</button>
                    </div>
                </div>
            `).join('') : '<p>Nenhuma editoria encontrada.</p>';

        } catch (error) {
            console.error(error);
            alert('Não foi possível carregar as editorias.');
        }
    };

    const loadArticles = async () => {
        try {
            const res = await fetch('/api/admin/articles', { headers: { 'Authorization': `Bearer ${token}` } });
            if (!res.ok) throw new Error('Falha ao carregar artigos');
            const articles = await res.json();
            articlesList.innerHTML = articles.length > 0 ? articles.map(a => `
                <div class="p-4 border-b flex justify-between items-center">
                    <div>
                        <h4 class="font-bold">${a.title}</h4>
                        <p class="text-sm text-gray-500">Editoria: ${a.editoriaId.title} | Status: ${a.status}</p>
                    </div>
                    <div class="flex gap-2">
                         <button data-id="${a._id}" class="edit-article-btn bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600 text-sm">Editar</button>
                         <button data-id="${a._id}" class="delete-article-btn bg-trama-red text-white py-1 px-3 rounded-md hover:opacity-90 text-sm">Apagar</button>
                    </div>
                </div>
            `).join('') : '<p>Nenhum artigo encontrado.</p>';
        } catch (error) {
            console.error(error);
            articlesList.innerHTML = '<p>Erro ao carregar artigos.</p>';
        }
    };
    
    // --- EVENT LISTENERS (DELEGAÇÃO) ---
    document.body.addEventListener('click', async (e) => {
        const target = e.target;
        const id = target.dataset.id;

        // --- Ações para Artigos ---
        if (target.classList.contains('delete-article-btn')) {
            if (confirm('Tem a certeza que quer apagar este artigo?')) {
                try {
                    const res = await fetch(`/api/admin/articles/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
                    if (!res.ok) throw new Error('Falha ao apagar artigo.');
                    alert('Artigo apagado com sucesso!');
                    loadArticles();
                } catch (error) { alert(error.message); }
            }
        }
        if (target.classList.contains('edit-article-btn')) {
            // Lógica para abrir modal e preencher dados do artigo
        }

        // --- Ações para Editorias ---
        if (target.classList.contains('delete-editoria-btn')) {
            if (confirm('Tem a certeza que quer apagar esta editoria? Todos os artigos associados ficarão sem categoria.')) {
                 try {
                    const res = await fetch(`/api/admin/editorias/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
                    if (!res.ok) throw new Error('Falha ao apagar editoria.');
                    alert('Editoria apagada com sucesso!');
                    loadEditorias(); // Recarrega a lista
                } catch (error) { alert(error.message); }
            }
        }
        if (target.classList.contains('edit-editoria-btn')) {
            // Lógica para abrir modal e preencher dados da editoria (a implementar)
            alert(`Funcionalidade de editar editoria (ID: ${id}) a ser implementada.`);
        }
    });

    // --- SUBMISSÃO DOS FORMULÁRIOS ---
    
    // Submissão do formulário de CRIAÇÃO DE ARTIGO
    articleForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(articleForm);
        try {
            const res = await fetch('/api/admin/articles', { method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: formData });
            if (!res.ok) throw new Error('Falha ao criar postagem');
            alert('Postagem criada com sucesso!');
            articleForm.reset();
            loadArticles();
        } catch (error) { alert(error.message); }
    });

    // Submissão do formulário de CRIAÇÃO DE EDITORIA
    editoriaForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(editoriaForm);
        // O FormData não captura os nomes dos inputs corretamente se eles não tiverem o atributo 'name'
        // Por isso, vamos adicionar os nomes manualmente para o backend
        const data = {
            title: editoriaTitleInput.value,
            description: editoriaDescriptionInput.value,
            coverImage: editoriaCoverImageInput.files[0]
        };
        const finalFormData = new FormData();
        for (const key in data) {
            finalFormData.append(key, data[key]);
        }

        try {
            const res = await fetch('/api/admin/editorias', { method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: finalFormData });
            if (!res.ok) throw new Error('Falha ao criar editoria.');
            alert('Editoria criada com sucesso!');
            editoriaForm.reset();
            loadEditorias(); // Recarrega a lista e os selects
        } catch (error) { alert(error.message); }
    });
    
    
    // --- INICIALIZAÇÃO ---
    const initDashboard = async () => {
        await loadEditorias();
        await loadArticles();
    };
    
    initDashboard();
});

