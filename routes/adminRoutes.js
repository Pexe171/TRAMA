// TRAMA Portal - routes/adminRoutes.js v2.7.0
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect, admin } = require('../middleware/authMiddleware');

const Article = require('../models/Article');
const Editoria = require('../models/Editoria');

// --- CONFIGURAÇÃO DO UPLOAD DE IMAGENS ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
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

// @desc    Obter um único artigo pelo ID para edição
router.get('/articles/:id', protect, admin, async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (article) {
            res.json(article);
        } else {
            res.status(404).json({ message: 'Artigo não encontrado' });
        }
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
            slug: title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
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
            article.slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

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
        const article = await Article.findById(req.params.id);
        if (article) {
            await article.deleteOne();
            res.json({ message: 'Artigo removido com sucesso' });
        } else {
            res.status(404).json({ message: 'Artigo não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro do servidor' });
    }
});


// --- ROTAS DE GESTÃO DE EDITORIAS ---

// @desc    Criar uma nova editoria
// @route   POST /api/admin/editorias
// @access  Admin
router.post('/editorias', protect, admin, upload.single('coverImage'), async (req, res) => {
    const { title, description } = req.body;
    try {
        const newEditoria = new Editoria({
            title,
            description,
            slug: title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
            coverImage: req.file ? req.file.filename : 'default.jpg'
        });
        const createdEditoria = await newEditoria.save();
        res.status(201).json(createdEditoria);
    } catch (error) {
        res.status(400).json({ message: 'Dados inválidos' });
    }
});

// @desc    Atualizar uma editoria
// @route   PUT /api/admin/editorias/:id
// @access  Admin
router.put('/editorias/:id', protect, admin, upload.single('coverImage'), async (req, res) => {
    const { title, description } = req.body;
    try {
        const editoria = await Editoria.findById(req.params.id);
        if (editoria) {
            editoria.title = title || editoria.title;
            editoria.description = description || editoria.description;
            editoria.slug = (title || editoria.title).toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
            if (req.file) {
                editoria.coverImage = req.file.filename;
            }
            const updatedEditoria = await editoria.save();
            res.json(updatedEditoria);
        } else {
            res.status(404).json({ message: 'Editoria não encontrada' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Dados inválidos' });
    }
});

// @desc    Apagar uma editoria
// @route   DELETE /api/admin/editorias/:id
// @access  Admin
router.delete('/editorias/:id', protect, admin, async (req, res) => {
    try {
        const editoria = await Editoria.findById(req.params.id);
        if (editoria) {
            // Futuramente: adicionar uma verificação se existem artigos nesta editoria antes de apagar.
            await editoria.deleteOne();
            res.json({ message: 'Editoria removida com sucesso' });
        } else {
            res.status(404).json({ message: 'Editoria não encontrada' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro do servidor' });
    }
});


module.exports = router;

