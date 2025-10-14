// TRAMA Portal - routes/adminRoutes.js v2.8.0
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect, admin } = require('../middleware/authMiddleware');

const Article = require('../models/Article');
const Editoria = require('../models/Editoria');
const User = require('../models/User'); // Importar o modelo User

// --- CONFIGURAÇÃO DO UPLOAD DE IMAGENS ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/'); // Salvar na pasta public/uploads
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});
const upload = multer({ storage: storage });

// --- ROTAS DE GESTÃO DE ARTIGOS ---

// @desc    Obter todos os artigos para o painel
router.get('/articles', protect, admin, async (req, res) => {
    try {
        const articles = await Article.find().populate('editoriaId', 'title').sort({ createdAt: -1 });
        res.json(articles);
    } catch (error) {
        res.status(500).json({ message: 'Erro do servidor' });
    }
});

// @desc    Criar um novo artigo
router.post('/articles', protect, admin, upload.single('coverImage'), async (req, res) => {
    const { title, summary, content, editoriaId, status } = req.body;
    try {
        const newArticle = new Article({
            title,
            summary,
            content,
            editoriaId,
            status,
            slug: title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
            authorId: req.user.id,
            coverImage: req.file ? req.file.filename : 'default.jpg',
            publishedAt: status === 'publicado' ? new Date() : null,
        });
        const createdArticle = await newArticle.save();
        res.status(201).json(createdArticle);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Dados inválidos' });
    }
});

// @desc    Atualizar um artigo existente
router.put('/articles/:id', protect, admin, upload.single('coverImage'), async (req, res) => {
    const { title, summary, content, editoriaId, status } = req.body;
    try {
        const article = await Article.findById(req.params.id);

        if (article) {
            article.title = title || article.title;
            article.summary = summary || article.summary;
            article.content = content || article.content;
            article.editoriaId = editoriaId || article.editoriaId;
            article.status = status || article.status;
            article.slug = (title || article.title).toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

            if (req.file) {
                article.coverImage = req.file.filename;
            }

            if (status === 'publicado' && !article.publishedAt) {
                article.publishedAt = new Date();
            } else if (status === 'rascunho') {
                article.publishedAt = null;
            }

            const updatedArticle = await article.save();
            res.json(updatedArticle);

        } else {
            res.status(404).json({ message: 'Artigo não encontrado' });
        }
    } catch (error) {
         console.error(error);
        res.status(400).json({ message: 'Dados inválidos' });
    }
});

// @desc    Apagar um artigo
router.delete('/articles/:id', protect, admin, async (req, res) => {
    try {
        const article = await Article.findByIdAndDelete(req.params.id);
        if (article) {
            res.json({ message: 'Artigo removido com sucesso' });
        } else {
            res.status(404).json({ message: 'Artigo não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro do servidor' });
    }
});


// --- ROTAS DE GESTÃO DE USUÁRIOS ---

// @desc    Obter todos os usuários
// @route   GET /api/admin/users
// @access  Admin
router.get('/users', protect, admin, async (req, res) => {
    try {
        const users = await User.find({}).sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Erro do servidor' });
    }
});

module.exports = router;
