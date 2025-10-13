// TRAMA Portal - routes/authRoutes.js v1.7.1
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @route   POST /api/auth/register
// @desc    Registrar um novo usuário (leitor)
// @access  Public
router.post('/register', async (req, res) => {
    const { username, email, password, displayName } = req.body;

    try {
        // Verificar se usuário já existe
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'Usuário já existe com este e-mail.' });
        }

        // Criptografar a senha
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Criar usuário
        const user = await User.create({
            username,
            email,
            passwordHash,
            displayName: displayName || username,
            role: 'leitor' // Novos registros são sempre leitores
        });

        if (user) {
            res.status(201).json({
                _id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                message: 'Usuário registrado com sucesso!'
            });
        } else {
            res.status(400).json({ message: 'Dados de usuário inválidos.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro no servidor.' });
    }
});

// @route   POST /api/auth/login
// @desc    Autenticar usuário (qualquer role) e obter token
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Procura o usuário e INCLUI explicitamente o passwordHash na busca
        const user = await User.findOne({ email }).select('+passwordHash');

        if (user && (await bcrypt.compare(password, user.passwordHash))) {
            const token = generateToken(user._id);

            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== 'development',
                sameSite: 'strict',
                maxAge: 30 * 24 * 60 * 60 * 1000 // 30 dias
            });

            res.json({
                _id: user.id,
                username: user.username,
                displayName: user.displayName, // Adicionado para consistência
                email: user.email,
                role: user.role,
                token: token // Enviando o token também no corpo da resposta para o frontend
            });
        } else {
            res.status(401).json({ message: 'E-mail ou senha inválidos.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro no servidor.' });
    }
});


// @route   POST /api/auth/login/admin
// @desc    Autenticar um admin/editor
// @access  Public
router.post('/login/admin', async (req, res) => {
    const { email, password } = req.body;
    try {
         // Procura o usuário e INCLUI explicitamente o passwordHash na busca
        const user = await User.findOne({ email }).select('+passwordHash');

        if (user && (user.role === 'admin' || user.role === 'editor') && (await bcrypt.compare(password, user.passwordHash))) {
            const token = generateToken(user._id);

            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== 'development',
                sameSite: 'strict',
                maxAge: 30 * 24 * 60 * 60 * 1000 // 30 dias
            });

            res.json({
                message: "Login de admin bem-sucedido!",
                role: user.role,
                token: token
            });

        } else {
            res.status(401).json({ message: 'Credenciais inválidas ou sem permissão de acesso.' });
        }
    } catch (error) {
         console.error(error);
        res.status(500).json({ message: 'Erro no servidor' });
    }
});

// @route   POST /api/auth/logout
// @desc    Fazer logout do usuário
// @access  Private
router.post('/logout', (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0)
    });
    res.status(200).json({ message: 'Logout bem-sucedido.' });
});

module.exports = router;
