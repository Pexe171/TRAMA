// TRAMA Portal - server.js v4.0.0 (Estrutura Simplificada)
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
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// --- ROTAS DE API ---
// Mantemos as rotas da API que já funcionam
app.use('/api', require('./routes/api'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/interact', require('./routes/interactionRoutes'));

// --- SERVIR ARQUIVOS ESTÁTICOS ---
// Servir a pasta 'client' que contém o frontend React
app.use(express.static(path.join(__dirname, 'client')));
// Servir a pasta de uploads para as imagens
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));


// --- ROTA "APANHA-TUDO" PARA A SPA ---
// Qualquer rota que não seja uma API, serve o frontend
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'index.html'));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Servidor a rodar na porta ${PORT}`));

