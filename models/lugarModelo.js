const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const lugarSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    categoria: {
        type: String,
        required: true
    },
    ubicacion: {
            type: String,
            required: true
    },
    imagen: {
        type: [String],
        required: false
    },
    video: {
        type: String, 
        required: false
    }
});

const Lugar = mongoose.model('Lugar', lugarSchema);
module.exports = Lugar;
