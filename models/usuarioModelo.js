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
    created: {
        type: Date,
        default: Date.now,
    }
});


const User = mongoose.model('User', usuarioSchema);
module.exports = User;


