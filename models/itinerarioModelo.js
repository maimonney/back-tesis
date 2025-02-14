const mongoose = require('mongoose');

const reservaSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    vueloIda: {
        type: Object,
        required: true,
    },
    vueloVuelta: {
        type: Object,
        required: true,
    }, 
    hotel: {
        type: Object,
        required: false,
    },
    destino: {
        type: String,
        required: true,
    },
    checklist: [
        {
            titulo: {
                type: String,
                required: true,
            },
            estado: {
                type: String,
                enum: ['pendiente', 'realizado'],
                default: 'pendiente',
            }
        }]
});

const Reserva = mongoose.model('Reserva', reservaSchema);
module.exports = Reserva;
