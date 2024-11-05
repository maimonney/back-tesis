const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const habitacionSchema = new Schema({
    tipo: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
    },
    capacidad: {
        type: Number,
        required: true
    },
    precioPorNoche: {
        type: Number,
        required: true
    },
    disponibilidad: {
        desde: { type: Date },
        hasta: { type: Date }
    }
});

const hotelSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    ubicacion: {
        direccion: { type: String },
        ciudad: { type: String },
        pais: { type: String },
        latitud: { type: Number },
        longitud: { type: Number }
    },
    descripcion: {
        type: String,
    },
    calificacion: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    amenidades: [
        { type: String }
    ],
    politicas: {
        cancelacion: { type: String },
        checkIn: { type: String },
        checkOut: { type: String },
        mascotasPermitidas: { type: Boolean, default: false }
    },
    habitaciones: [habitacionSchema],
    imagenes: [
        { type: String }
    ],
    creado: {
        type: Date,
        default: Date.now
    }
});

const Hotel = mongoose.model('Hotel', hotelSchema);
module.exports = Hotel;
