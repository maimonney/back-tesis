const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usuarioSchema = new Schema({
    nombre: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    contrasenia: {
        type: String,
        required: true,
    },
    rols: {
        type: String,
        enum: ['user', 'admin', 'guia'],
        default: 'user'
    },
    provincia: {
        type: String,
        required: false,
    },
    fotoPerfil: {
        type: String,
        default: 'img/default_perfil.png'
    },
    fotoPortada: {
        type: String,
        default: 'img/default_portada.png' 
    },
    created: {
        type: Date,
        default: Date.now,
    }
});


const User = mongoose.model('User', usuarioSchema);
module.exports = User;


