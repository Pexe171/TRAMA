// TRAMA Portal - server.js v2.3.2
const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

// Carregar variáveis de ambiente
dotenv.config();

// Conectar ao banco de dados
connectDB();

const app = express();

// Middlewares
app.use(express.json()); // Para aceitar dados JSON no corpo das requisições
app.use(express.urlencoded({ extended: false })); // Para aceitar dados de formulários
app.use(cookieParser()); // Para ler cookies (necessário para o token de autenticação)

// --- ROTAS ---

// Rotas da API pública (conteúdo do site)
app.use('/api', require('./routes/api'));

// Rotas de Autenticação (login, registro, logout)
app.use('/api/auth', require('./routes/authRoutes'));

// Rotas da API de Administração (criar posts, etc.)
app.use('/api/admin', require('./routes/adminRoutes'));

// Rotas de Interação (Comentários, Avaliações)
app.use('/api/interact', require('./routes/interactionRoutes'));

// Rotas para servir PÁGINAS PROTEGIDAS (como o dashboard)
app.use('/', require('./routes/pageRoutes'));


// --- SERVIR FICHEIROS ESTÁTICOS ---

// Servir os ficheiros estáticos da pasta 'public' (CSS, JS, imagens do frontend)
app.use(express.static(path.join(__dirname, 'public')));

// Servir os ficheiros de upload (imagens dos artigos)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rota para a página principal (SPA - Single Page Application)
// Qualquer rota que não foi apanhada pelas APIs ou ficheiros estáticos, serve o index.html
app.get('*', (req, res) => {
    // Excluir as rotas de admin desta regra para não interferir
    if (req.originalUrl.startsWith('/dashboard') || req.originalUrl.startsWith('/acesso')) {
        return res.status(404).send('Página não encontrada.');
    }
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

