const mongoose = require('mongoose');

const reservaSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }, // Usuario que hace la reserva
    tourId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tur', required: false }, // Tour reservado (opcional)
    vueloIda: { type: Object, required: false }, // Opcional
    vueloVuelta: { type: [Object], required: false }, // Opcional
    hotel: { type: Object, required: false }, // Opcional
    fechaReserva: { type: Date, default: Date.now }, // Fecha en que se hizo la reserva
});

const Reserva = mongoose.model('Reserva', reservaSchema);
module.exports = Reserva;