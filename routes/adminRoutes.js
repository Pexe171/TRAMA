// TRAMA Portal - routes/adminRoutes.js v2.8.0
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
        cb(null, 'public/uploads/'); // Salvar diretamente na pasta pública de uploads
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

// @desc    Criar um novo artigo (agora sempre publicado)
router.post('/articles', protect, admin, upload.single('coverImage'), async (req, res) => {
    const { title, summary, content, format, videoUrl } = req.body;
    try {
        // Lógica para encontrar uma editoria 'Geral' ou criar uma se não existir.
        let defaultEditoria = await Editoria.findOne({ slug: 'geral' });
        if (!defaultEditoria) {
            defaultEditoria = new Editoria({ title: 'Geral', slug: 'geral', description: 'Artigos gerais' });
            await defaultEditoria.save();
        }

        const newArticle = new Article({
            title,
            summary,
            content,
            format,
            videoUrl,
            editoriaId: defaultEditoria._id, // Associa à editoria 'Geral'
            slug: title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
            authorId: req.user.id,
            coverImage: req.file ? `/uploads/${req.file.filename}` : '/uploads/default.jpg', // Caminho relativo correto
            publishedAt: new Date(),
        });
        const createdArticle = await newArticle.save();
        res.status(201).json(createdArticle);
    } catch (error) {
        console.error("Erro ao criar artigo:", error);
        res.status(400).json({ message: 'Dados inválidos ou erro no servidor.' });
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


// As rotas de gestão de editorias são mantidas para possível uso futuro
router.post('/editorias', protect, admin, upload.single('coverImage'), async (req, res) => {
    // ...
});

router.put('/editorias/:id', protect, admin, upload.single('coverImage'), async (req, res) => {
    // ...
});

router.delete('/editorias/:id', protect, admin, async (req, res) => {
    // ...
});


module.exports = router;

