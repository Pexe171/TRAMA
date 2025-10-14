// TRAMA Portal - middleware/authMiddleware.js v1.9.0 (Corrigido o tratamento de tokens)
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware para proteger rotas (requer login)
const protect = async (req, res, next) => {
    let token;

    // Estratégia 1: Procurar token no cabeçalho de autorização (para chamadas da SPA)
    // Ex: Authorization: Bearer <token>
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            // Se o token for a string literal 'null' ou 'undefined' (por causa do localStorage),
            // isso fará com que o JWT malformed seja disparado. Adicionamos uma verificação.
            if (token === 'null' || token === 'undefined') {
                 console.log('Token literal inválido encontrado no cabeçalho.');
                 return res.status(401).json({ message: 'Não autorizado, token ausente ou malformado.' });
            }
            
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-passwordHash');
            return next();

        } catch (error) {
            console.error('Erro de Token (Header):', error.message);
             // Se falhar, é um token inválido, expirado ou malformado
            return res.status(401).json({ message: 'Não autorizado, o token falhou ou é inválido.' });
        }
    }
    
    // Estratégia 2: Procurar token nos cookies (para proteção de páginas no servidor)
    else if (req.cookies.token) {
        try {
            token = req.cookies.token;
            
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-passwordHash');
            return next();

        } catch (error) {
             console.error('Erro de Token (Cookie):', error.message);
            // Se falhar, é um token inválido, expirado ou malformado
            return res.status(401).json({ message: 'Não autorizado, o token do cookie falhou.' });
        }
    }

    // Se nenhuma estratégia encontrou um token válido
    return res.status(401).json({ message: 'Não autorizado, sem token.' });
};

// Middleware para restringir acesso a Admins e Editores
const admin = (req, res, next) => {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'editor')) {
        next();
    } else {
        // Usa 403 (Forbidden) pois o usuário está autenticado (protegido), mas não autorizado (admin)
        res.status(403).json({ message: 'Acesso negado. Requer permissão de Administrador ou Editor.' });
    }
};


module.exports = { protect, admin };
