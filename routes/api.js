// TRAMA Portal - routes/api.js v2.1.0
const express = require('express');
const router = express.Router();

// Importar os modelos do banco de dados
const Editoria = require('../models/Editoria');
const Article = require('../models/Article');
const User = require('../models/User'); // Importar o modelo User para popular o autor

// Rota para buscar todas as editorias ativas (para o menu de navegação)
router.get('/editorias', async (req, res) => {
    try {
        const editorias = await Editoria.find({ isActive: true }).sort({ priority: 1 });
        res.json(editorias);
    } catch (err) {
        console.error('Erro ao buscar editorias:', err.message);
        res.status(500).send('Erro no servidor');
    }
});

// Rota principal para buscar o conteúdo das páginas dinamicamente
router.get('/pages/:id', async (req, res) => {
    const pageId = req.params.id; // O ID pode ser 'home' ou o slug de uma editoria

    try {
        if (pageId === 'home') {
            // Lógica para a página inicial
            const featuredArticles = await Article.find({ isFeatured: true, status: 'publicado' })
                .sort({ publishedAt: -1 })
                .limit(3)
                .populate('editoriaId', 'title slug'); // Popula com dados da editoria

            res.json({
                type: 'home',
                hero: {
                    title: 'Clube da Notícia',
                    subtitle: 'CONFIRA O NOVO EPISÓDIO DO NOSSO VÍDEOCAST!',
                    image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2525&auto=format&fit=crop',
                    ctaLink: '#clube-da-noticia'
                },
                ultimasPostagens: featuredArticles
            });
        } else if (pageId === 'quem-somos') {
            // Lógica para a página "Quem Somos"
            res.json({
                type: 'static',
                title: 'Quem Somos',
                // Conteúdo baseado no PDF de briefing
                content: `
                    <div class="bg-white rounded-lg shadow-md p-8 md:p-12 text-center animate-fade-in">
                        <h1 class="page-title">Quem Somos?</h1>
                        <div class="max-w-3xl mx-auto mt-6">
                            <p class="text-lg leading-relaxed text-text-main">
                                Somos o Trama, um portal de cinema e comunicação, criado por estudantes de Relações Públicas da UFAM, para amantes do cinema!
                            </p>
                            <p class="mt-4 text-lg leading-relaxed text-text-main">
                                Com o objetivo de apresentar as estratégias de comunicação presentes no mundo cinematográfico.
                            </p>
                            <div class="border-t my-12"></div>
                            <h2 class="text-2xl font-bold font-playfair text-text-dark mb-6">A Nossa Equipa</h2>
                            <p class="text-text-light">Em breve, conhecerá os rostos por trás do TRAMA.</p>
                        </div>
                    </div>
                `
            });
        } else {
            // Lógica para páginas de editoria
            const editoria = await Editoria.findOne({ slug: pageId, isActive: true });
            if (!editoria) {
                return res.status(404).json({ msg: 'Página não encontrada' });
            }

            const articles = await Article.find({ editoriaId: editoria._id, status: 'publicado' })
                .sort({ publishedAt: -1 });

            res.json({
                type: 'editoria',
                title: editoria.title,
                description: editoria.description,
                articles: articles
            });
        }
    } catch (err) {
        console.error(`Erro ao buscar página ${pageId}:`, err.message);
        res.status(500).send('Erro no servidor');
    }
});

// Rota para buscar um artigo específico pelo seu slug e o slug da editoria
router.get('/articles/:editoriaSlug/:articleSlug', async (req, res) => {
    try {
        const { editoriaSlug, articleSlug } = req.params;

        // Encontra a editoria primeiro para garantir a consistência do URL
        const editoria = await Editoria.findOne({ slug: editoriaSlug });
        if (!editoria) {
            return res.status(404).json({ msg: 'Editoria não encontrada.' });
        }

        // Encontra o artigo que corresponde aos slugs e ao ID da editoria
        const article = await Article.findOne({
            slug: articleSlug,
            editoriaId: editoria._id,
            status: 'publicado'
        }).populate('authorId', 'displayName'); // Adiciona o nome do autor ao resultado

        if (!article) {
            return res.status(404).json({ msg: 'Artigo não encontrado.' });
        }

        res.json(article);

    } catch (err) {
        console.error(`Erro ao buscar o artigo:`, err.message);
        res.status(500).send('Erro no servidor');
    }
});


module.exports = router;

