const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const excursionSchema = new Schema({
    titulo: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    duracion: {
        type: String,
        required: true
    },
    precio: {
        type: Number,
        required: true
    },
    fecha: {
        type: Date,
        required: true
    },
    guia: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario', 
        required: true
    },
    imagenes: [
        { type: String }
    ],
    creado: {
        type: Date,
        default: Date.now
    }
});

const Excursion = mongoose.model('Excursion', excursionSchema);
module.exports = Excursion;
