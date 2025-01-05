const Tur = require('../models/turModelo');

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
        const guiaId = req.params.id; 
        const tours = await Tur.find({ guia: guiaId }).populate('guia'); 

        if (!tours.length) {
            return res.status(404).json({ message: 'No se encontraron tours para este guía' });
        }

        res.status(200).json(tours);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los tours de este guía', error });
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