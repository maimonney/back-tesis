const mongoose = require('mongoose');

const reservaTurSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    }, 
    tourId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Tur', 
        required: true 
    }, 
    fechaReserva: { 
        type: Date, 
        default: Date.now 
    },
    fechaTour: { 
        type: Date, 
        required: true 
    }, 
    destino: { 
        type: String, 
        required: true 
    },
    cantidadPersonas: { 
        type: Number, 
        required: true 
    }, 
    estado: { 
        type: String, 
        enum: ['pendiente', 'confirmada', 'cancelada'], 
        default: 'pendiente' 
    }, 
});

const ReservaTur = mongoose.model('ReservaTur', reservaTurSchema);
module.exports = ReservaTur;