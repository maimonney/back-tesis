const mongoose = require('mongoose');

const reservaSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    vueloIda: { type: Object, required: true },
    vueloVuelta: { type: [Object], required: true },
    hotel: { type: Object, required: true },
    excursionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Excursion', required: false } // Nuevo campo
});

const Reserva = mongoose.model('Reserva', reservaSchema);
module.exports = Reserva;