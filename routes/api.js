// TRAMA Portal - routes/api.js v2.8.0
const express = require('express');
const router = express.Router();

const Editoria = require('../models/Editoria');
const Article = require('../models/Article');

// @desc    Obter dados para a página inicial (Últimas Postagens)
// @route   GET /api/home
router.get('/home', async (req, res) => {
    try {
        const ultimasPostagens = await Article.find({ status: 'publicado' })
            .sort({ publishedAt: -1 })
            .limit(6)
            .populate('editoriaId', 'title slug'); // Adiciona o título e slug da editoria

        res.json({ ultimasPostagens });
    } catch (error) {
        console.error("Erro ao buscar dados da home:", error);
        res.status(500).json({ message: "Erro no servidor ao buscar postagens." });
    }
});


// @desc    Obter todas as editorias para o menu
// @route   GET /api/editorias
router.get('/editorias', async (req, res) => {
    try {
        const editorias = await Editoria.find({ isActive: true }).sort({ priority: 1 });
        res.json(editorias);
    } catch (err) {
        res.status(500).send('Erro no servidor ao buscar editorias.');
    }
});

// @desc    Obter detalhes de uma editoria e os seus artigos
// @route   GET /api/editorias/:slug
router.get('/editorias/:slug', async (req, res) => {
    try {
        const editoria = await Editoria.findOne({ slug: req.params.slug, isActive: true });
        if (!editoria) {
            return res.status(404).json({ msg: 'Editoria não encontrada' });
        }
        const articles = await Article.find({ editoriaId: editoria._id, status: 'publicado' })
            .sort({ publishedAt: -1 });
        res.json({ ...editoria.toObject(), articles });
    } catch (error) {
        res.status(500).send('Erro no servidor');
    }
});


// @desc    Obter a página "Quem Somos"
// @route   GET /api/quem-somos
router.get('/quem-somos', (req, res) => {
    res.json({
        title: 'Quem Somos?',
        content: `
            <p class="text-lg leading-relaxed">
                Somos o Trama, um portal de cinema e comunicação, criado por estudantes de Relações Públicas da UFAM, para amantes do cinema!
            </p>
            <p class="mt-4 text-lg leading-relaxed">
                Com o objetivo de apresentar as estratégias de comunicação presentes no mundo cinematográfico.
            </p>
        `
    });
});


// @desc    Obter um artigo específico
// @route   GET /api/articles/:editoriaSlug/:articleSlug
router.get('/articles/:editoriaSlug/:articleSlug', async (req, res) => {
    try {
        const article = await Article.findOne({ slug: req.params.articleSlug, status: 'publicado' })
            .populate('authorId', 'displayName')
            .populate('editoriaId', 'title slug');

        if (!article || article.editoriaId.slug !== req.params.editoriaSlug) {
            return res.status(404).json({ msg: 'Artigo não encontrado.' });
        }
        res.json(article);
    } catch (err) {
        res.status(500).send('Erro no servidor ao buscar o artigo.');
    }
});

module.exports = router;

