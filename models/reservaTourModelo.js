const mongoose = require('mongoose');

const reservaTurSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    }, // Usuario que hace la reserva
    tourId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Tur', 
        required: true 
    }, // Tour que se reserva
    fechaReserva: { 
        type: Date, 
        default: Date.now 
    }, // Fecha en que se hizo la reserva
    fechaTour: { 
        type: Date, 
        required: true 
    }, // Fecha seleccionada para el tour
    cantidadPersonas: { 
        type: Number, 
        required: true 
    }, // Cantidad de personas
    estado: { 
        type: String, 
        enum: ['pendiente', 'confirmada', 'cancelada'], 
        default: 'pendiente' 
    }, // Estado de la reserva
});

const ReservaTur = mongoose.model('ReservaTur', reservaTurSchema);
module.exports = ReservaTur;