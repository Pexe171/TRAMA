// TRAMA Portal - routes/interactionRoutes.js v2.4.1
const express = require('express');
const router = express.Router();
const { protect, optionalAuth } = require('../middleware/authMiddleware');

const Article = require('../models/Article');
const Comment = require('../models/Comment');
const Rating = require('../models/Rating');

// --- ROTAS DE COMENTÁRIOS ---

// @desc    Obter todos os comentários de um artigo
// @route   GET /api/interact/articles/:slug/comments
// @access  Público
router.get('/articles/:slug/comments', async (req, res) => {
    try {
        const article = await Article.findOne({ slug: req.params.slug });
        if (!article) return res.status(404).json({ message: 'Artigo não encontrado.' });

        const comments = await Comment.find({ articleId: article._id })
            .populate('authorId', 'displayName username avatarUrl')
            .sort({ createdAt: -1 });

        res.json(comments);
    } catch (error) {
        console.error('Erro ao obter comentários:', error);
        res.status(500).json({ message: 'Erro do servidor ao obter comentários' });
    }
});

// @desc    Criar um novo comentário num artigo
// @route   POST /api/interact/articles/:slug/comments
// @access  Privado (requer login)
router.post('/articles/:slug/comments', protect, async (req, res) => {
    try {
        const { content } = req.body;
        if (!content || content.trim() === '') {
            return res.status(400).json({ message: 'O conteúdo do comentário não pode estar vazio.' });
        }

        const article = await Article.findOne({ slug: req.params.slug });
        if (!article) return res.status(404).json({ message: 'Artigo não encontrado.' });

        const comment = new Comment({
            articleId: article._id,
            authorId: req.user.id,
            content: content
        });
        await comment.save();

        await Article.updateOne({ _id: article._id }, { $inc: { 'stats.commentsCount': 1 } });

        const newComment = await Comment.findById(comment._id).populate('authorId', 'displayName username avatarUrl');
        res.status(201).json(newComment);
    } catch (error) {
        console.error('Erro ao criar comentário:', error);
        res.status(500).json({ message: 'Erro do servidor ao criar comentário' });
    }
});


// --- ROTAS DE AVALIAÇÃO ---

// Função auxiliar para recalcular a média de avaliações de um artigo
const updateArticleRatingStats = async (articleId) => {
    const stats = await Rating.aggregate([
        { $match: { articleId: articleId } },
        { $group: {
            _id: '$articleId',
            ratingsAvg: { $avg: '$value' },
            ratingsCount: { $sum: 1 }
        }}
    ]);

    if (stats.length > 0) {
        await Article.findByIdAndUpdate(articleId, {
            'stats.ratingsAvg': parseFloat(stats[0].ratingsAvg.toFixed(2)),
            'stats.ratingsCount': stats[0].ratingsCount,
        });
    } else {
         await Article.findByIdAndUpdate(articleId, {
            'stats.ratingsAvg': 0,
            'stats.ratingsCount': 0,
        });
    }
};

// @desc    Obter a avaliação do utilizador logado para um artigo
// @route   GET /api/interact/articles/:slug/ratings/my-rating
// @access  Privado (requer login)
router.get('/articles/:slug/ratings/my-rating', protect, async (req, res) => {
    try {
        const article = await Article.findOne({ slug: req.params.slug });
        if (!article) return res.status(404).json({ message: 'Artigo não encontrado.' });

        const rating = await Rating.findOne({
            articleId: article._id,
            userId: req.user.id
        });

        if (rating) {
            res.json({ value: rating.value });
        } else {
            res.json({ value: 0 }); // 0 significa que o utilizador ainda não avaliou
        }

    } catch (error) {
        console.error('Erro ao obter a avaliação do utilizador:', error);
        res.status(500).json({ message: 'Erro do servidor ao obter a avaliação' });
    }
});


// @desc    Submeter ou atualizar uma avaliação para um artigo
// @route   POST /api/interact/articles/:slug/ratings
// @access  Privado (requer login)
router.post('/articles/:slug/ratings', protect, async (req, res) => {
    const { value } = req.body;
    if (!value || value < 1 || value > 5) {
        return res.status(400).json({ message: 'A avaliação deve ser um número entre 1 e 5.' });
    }

    try {
        const article = await Article.findOne({ slug: req.params.slug });
        if (!article) return res.status(404).json({ message: 'Artigo não encontrado.' });

        // Procura por uma avaliação existente ou cria uma nova (upsert)
        await Rating.findOneAndUpdate(
            { articleId: article._id, userId: req.user.id },
            { value: value },
            { upsert: true, new: true }
        );

        // Após submeter, recalcula as estatísticas do artigo
        await updateArticleRatingStats(article._id);
        
        // Retorna a nova média para o frontend poder atualizar o UI
        const updatedArticle = await Article.findById(article._id, 'stats.ratingsAvg stats.ratingsCount');
        res.status(200).json({ 
            message: 'Avaliação submetida com sucesso.',
            stats: updatedArticle.stats
        });

    } catch (error) {
        console.error('Erro ao submeter avaliação:', error);
        res.status(500).json({ message: 'Erro do servidor ao submeter avaliação' });
    }
});


module.exports = router;

