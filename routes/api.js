// TRAMA Portal - routes/api.js v2.2.0
const express = require('express');
const router = express.Router();

const Editoria = require('../models/Editoria');
const Article = require('../models/Article');
const User = require('../models/User');

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

// Rota para buscar o conteúdo da página inicial
router.get('/home', async (req, res) => {
    try {
        const ultimasPostagens = await Article.find({ status: 'publicado' })
            .sort({ publishedAt: -1 })
            .limit(6) // Aumentado para 6 para preencher mais a grelha
            .populate('editoriaId', 'title slug'); // Popula com dados da editoria

        res.json({
            ultimasPostagens: ultimasPostagens
        });
    } catch (err) {
        console.error('Erro ao buscar conteúdo da home:', err.message);
        res.status(500).json({ message: 'Erro no servidor ao buscar postagens.' });
    }
});


// Rota para buscar uma PÁGINA de editoria
router.get('/editorias/:slug', async (req, res) => {
    try {
        const editoria = await Editoria.findOne({ slug: req.params.slug, isActive: true });
        if (!editoria) {
            return res.status(404).json({ msg: 'Página não encontrada' });
        }

        const articles = await Article.find({ editoriaId: editoria._id, status: 'publicado' })
            .sort({ publishedAt: -1 });

        res.json({
            _id: editoria._id,
            title: editoria.title,
            description: editoria.description,
            coverImage: `/uploads/${editoria.coverImage}`,
            articles: articles
        });

    } catch (err) {
        console.error(`Erro ao buscar página de editoria:`, err.message);
        res.status(500).send('Erro no servidor');
    }
});


// Rota para a página "Quem Somos"
router.get('/quem-somos', (req, res) => {
    res.json({
        title: 'Quem Somos?',
        content: `
            <div class="bg-white rounded-lg shadow-md p-8 md:p-12 text-center">
                <h1 class="text-4xl font-bold font-serif mb-6">Quem Somos?</h1>
                <div class="max-w-3xl mx-auto">
                    <p class="text-lg leading-relaxed text-gray-700">
                        Somos o Trama, um portal de cinema e comunicação, criado por estudantes de Relações Públicas da UFAM, para amantes do cinema!
                    </p>
                    <p class="mt-4 text-lg leading-relaxed text-gray-700">
                        O nosso objetivo é apresentar as estratégias de comunicação presentes no mundo cinematográfico, indo além da crítica tradicional.
                    </p>
                </div>
            </div>
        `
    });
});


// Rota para buscar um ARTIGO específico pelo seu slug e o slug da editoria
router.get('/articles/:editoriaSlug/:articleSlug', async (req, res) => {
    try {
        const { editoriaSlug, articleSlug } = req.params;

        const editoria = await Editoria.findOne({ slug: editoriaSlug });
        if (!editoria) {
            return res.status(404).json({ msg: 'Editoria não encontrada.' });
        }

        const article = await Article.findOne({
            slug: articleSlug,
            editoriaId: editoria._id,
            status: 'publicado'
        })
        .populate('authorId', 'displayName')
        .populate('editoriaId', 'title slug');

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
