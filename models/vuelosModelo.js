const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const vuelosSchema = new Schema({
    numeroVuelo: {
        type: String,
        required: true,
        unique: true
    },
    origen: {
        type: String,
        required: true
    },
    destino: {
        type: String,
        required: true
    },
    fechaSalida: {
        type: Date,
        required: true
    },
    fechaLlegada: {
        type: Date,
        required: true
    },
    duracion: {
        type: Number,
        required: true
    },
    aerolinea: {
        type: String,
        required: true
    },
    imgAerolinea: {
        type: String,
        required: true
    },
    precio: {
        type: Number,
        required: true
    },
    moneda: {
        type: String,
        required: true,
        default: 'ARS'
    },
    clase: {
        type: String,
        required: true
    },
    escala: {
        type: [String], 
        default: []      
    }
});

const Vuelos = mongoose.model('Vuelos', vuelosSchema);

module.exports = Vuelos;
