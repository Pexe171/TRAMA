// TRAMA Portal - middleware/authMiddleware.js v1.7.0
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware para proteger rotas (requer login)
const protect = async (req, res, next) => {
    let token;

    if (req.cookies.token) {
        try {
            token = req.cookies.token;
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-passwordHash');
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Não autorizado, token falhou.' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Não autorizado, sem token.' });
    }
};

// Middleware para restringir acesso a Admins e Editores
const admin = (req, res, next) => {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'editor')) {
        next();
    } else {
        res.status(403).json({ message: 'Acesso negado. Requer permissão de Administrador ou Editor.' });
    }
};


module.exports = { protect, admin };

