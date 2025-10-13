// models/User.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    passwordHash: {
        type: String,
        required: true,
        select: false // Não retorna o hash da senha por padrão nas queries
    },
    role: {
        type: String,
        enum: ['admin', 'editor', 'leitor'],
        default: 'leitor'
    },
    displayName: { type: String },
    avatarUrl: { type: String },
    bio: { type: String },
    isActive: {
        type: Boolean,
        default: true
    },
    lastLoginAt: { type: Date }
}, {
    timestamps: true // Adiciona os campos createdAt e updatedAt automaticamente
});

module.exports = mongoose.model('User', userSchema);
