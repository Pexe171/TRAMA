// TRAMA Portal - routes/adminRoutes.js v2.9.1 (Editorias CRUD)
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
// Aceita uploads para artigos e editorias (usando o mesmo upload)
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


// --- ROTAS DE GESTÃO DE EDITORIAS (NOVO) ---

// @desc    Obter todas as editorias para o painel (Admin)
// @route   GET /api/admin/editorias
// @access  Admin
router.get('/editorias', protect, admin, async (req, res) => {
    try {
        const editorias = await Editoria.find().sort({ priority: 1, createdAt: -1 });
        res.json(editorias);
    } catch (error) {
        res.status(500).json({ message: 'Erro do servidor ao buscar editorias.' });
    }
});

// @desc    Criar uma nova editoria
// @route   POST /api/admin/editorias
// @access  Admin
router.post('/editorias', protect, admin, upload.single('coverImage'), async (req, res) => {
    const { title, description, priority, isActive } = req.body;
    try {
        const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
        const newEditoria = new Editoria({
            title,
            description,
            slug,
            priority: priority || 0,
            // Converter a string 'true'/'false' ou booleano em booleano
            isActive: isActive === 'true' || isActive === true, 
            coverImage: req.file ? req.file.filename : 'default-editoria.jpg', 
        });

        const createdEditoria = await newEditoria.save();
        res.status(201).json(createdEditoria);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Já existe uma editoria com este título.' });
        }
        console.error(error);
        res.status(400).json({ message: 'Dados inválidos ao criar editoria.' });
    }
});

// @desc    Atualizar uma editoria existente
// @route   PUT /api/admin/editorias/:id
// @access  Admin
router.put('/editorias/:id', protect, admin, upload.single('coverImage'), async (req, res) => {
    const { title, description, priority, isActive } = req.body;
    try {
        const editoria = await Editoria.findById(req.params.id);

        if (!editoria) {
            return res.status(404).json({ message: 'Editoria não encontrada' });
        }

        editoria.title = title || editoria.title;
        editoria.description = description || editoria.description;
        // Garante que a prioridade é atualizada se for 0 ou qualquer outro valor
        editoria.priority = priority !== undefined ? priority : editoria.priority; 
        // Garante a conversão correta do estado do checkbox
        editoria.isActive = isActive === 'true' || isActive === true; 
        
        if (title) {
            editoria.slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
        }

        if (req.file) {
            editoria.coverImage = req.file.filename;
        }

        const updatedEditoria = await editoria.save();
        res.json(updatedEditoria);

    } catch (error) {
        console.error(error);
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Já existe uma editoria com este slug.' });
        }
        res.status(400).json({ message: 'Dados inválidos ao atualizar editoria.' });
    }
});

// @desc    Apagar uma editoria
// @route   DELETE /api/admin/editorias/:id
// @access  Admin
router.delete('/editorias/:id', protect, admin, async (req, res) => {
    try {
        const editoria = await Editoria.findByIdAndDelete(req.params.id);
        if (editoria) {
            // Recomenda-se também atualizar todos os artigos que usam esta editoria para evitar erros.
            // Aqui, apenas apagamos a editoria.
            res.json({ message: 'Editoria removida com sucesso' });
        } else {
            res.status(404).json({ message: 'Editoria não encontrada' });
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
