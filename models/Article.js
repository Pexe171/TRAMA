// models/Article.js

const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    summary: { type: String },
    content: { type: String, required: true },
    format: {
        type: String,
        enum: ['texto', 'video', 'videocast'],
        default: 'texto'
    },
    coverImage: { type: String },
    videoUrl: { type: String },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    editoriaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Editoria'
        // a obrigatoriedade (required: true) foi removida para simplificar
    },
    tags: [String],
    status: {
        type: String,
        enum: ['rascunho', 'publicado', 'arquivado'],
        default: 'publicado' // Alterado para 'publicado' por defeito
    },
    publishedAt: { type: Date },
    stats: {
        views: { type: Number, default: 0 },
        commentsCount: { type: Number, default: 0 },
        ratingsCount: { type: Number, default: 0 },
        ratingsAvg: { type: Number, default: 0 }
    },
    isFeatured: { type: Boolean, default: false }
}, {
    timestamps: true
});

// Índice de texto para otimizar buscas por conteúdo
articleSchema.index({ title: 'text', summary: 'text', content: 'text', tags: 'text' });

module.exports = mongoose.model('Article', articleSchema);

