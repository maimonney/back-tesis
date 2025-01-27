const mongoose = require('mongoose');

const reservaTurSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }, // Usuario que hace la reserva
    tourId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Tur' }, // Tour reservado
    fechaReserva: { type: Date, default: Date.now }, // Fecha en que se hizo la reserva
    estado: { type: String, enum: ['pendiente', 'confirmada', 'cancelada'], default: 'pendiente' }, // Estado de la reserva
    cantidadPersonas: { type: Number, required: true }, // Cantidad de personas para el tour
    fechaTour: { type: Date, required: true }, // Fecha seleccionada para el tour
});

const ReservaTur = mongoose.model('ReservaTur', reservaTurSchema);
module.exports = ReservaTur;