const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const turSchema = new Schema({
    guia: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true,
    },
    titulo:{
        type: String,
        require: true,
    },
    descripcion:{
        type: String,
        required: true,
    },
    precio:{
        type: Number,
        required: true,
    },
    provincia:{
        type: String,
        required: true,
    },
    duracion: {
        type: String, 
        required: true,
        match: /^[0-9]+ (minutos|hora|horas)( [0-9]+ minutos)?$/,
    },    
    fechasDisponibles: {
        type: [Date],
        required: true,
    },
    fotoPortada: {
        type: String,
        default: '/img/default_portada.png' 
    },
    politicaCancelacion: {
        type: String,
    },
});

const Tur = mongoose.model('Tur', turSchema);
module.exports = Tur;
