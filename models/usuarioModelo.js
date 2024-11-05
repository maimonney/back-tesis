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
    contraseña: {
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
    },
    ubicacion: {
        type: {
            type: String,
            enum: ['Point'], 
            required: true
        },
        coordinates: {
            type: [Number], 
            required: true
        }
    }
});


const User = mongoose.model('User', usuarioSchema);
module.exports = User;


