const mongoose = require('mongoose');
const Tur = require('../models/turModelo');
const User = require('../models/usuarioModelo');

const obtenerTurs = async (req, res) => {
    try {
        const tours = await Tur.find().populate('guia'); 
        res.status(200).json(tours);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los tours', error });
    }
};

const obtenerTursPorGuia = async (req, res) => {
    try {
        const guiaId = req.query.id;

        console.log('ID del guía recibido:', guiaId);

        if (!guiaId) {
            return res.status(400).json({ message: 'ID de guía no proporcionado' });
        }

        if (!mongoose.Types.ObjectId.isValid(guiaId)) {
            return res.status(400).json({ message: 'ID de guía inválido' });
        }

        const guia = await User.findOne({ _id: guiaId, rols: 'guia' });

        if (!guia) {
            return res.status(404).json({ message: 'Guía no encontrado' });
        }

        const tours = await Tur.find({ guia: guiaId }).populate('guia', 'nombre provincia descripcion fotoPerfil');

        if (!tours.length) {
            return res.status(404).json({ message: 'No se encontraron tours para este guía' });
        }

        res.status(200).json(tours);
    } catch (error) {
        console.error('Error al obtener los tours del guía:', error);
        res.status(500).json({ message: 'Error al obtener los tours de este guía', error: error.message });
    }
};

const TurId = async (req, res) => {
    try {
        const tourId = req.params.id;
        const tour = await Tur.findById(tourId); 
    
        if (!tour) {
          return res.status(404).json({ message: 'Tour no encontrado' });
        }
    
        res.json(tour);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener el tour', error: error.message });
      }
};


const crearTur = async (req, res) => {
    try {
        const tour = new Tur(req.body); 
        await tour.save();
        res.status(201).json({ message: 'Tour creado exitosamente', tour });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el tour', error });
    }
};

const actualizarTur = async (req, res) => {
    try {
        const { id } = req.params;

        console.log(req.body);
        
        const updatedTour = await Tur.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedTour) {
            return res.status(404).json({ message: 'Tour no encontrado' });
        }
        res.status(200).json({ message: 'Tour actualizado exitosamente', updatedTour });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el tour', error });
    }
};

const deleteTur = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTour = await Tur.findByIdAndDelete(id);
        if (!deletedTour) {
            return res.status(404).json({ message: 'Tour no encontrado' });
        }
        res.status(200).json({ message: 'Tour eliminado exitosamente', deletedTour });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el tour', error });
    }
};

module.exports = {
    obtenerTurs,
    obtenerTursPorGuia,
    TurId,
    crearTur,
    actualizarTur,
    deleteTur,
}; 
