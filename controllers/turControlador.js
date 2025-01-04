const Tur = require('../models/turModelo');

const obtenerTurs = async (req, res) => {
    try {
        const tours = await Tur.find().populate('guia');
        res.status(200).json(tours);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los tours', error });
    }
};

const TurId = async (req, res) => {
    try {
        const { id } = req.params;
        const tour = await Tur.findById(id).populate('guia');
        if (!tour) {
            return res.status(404).json({ message: 'Tour no encontrado' });
        }
        res.status(200).json(tour);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el tour', error });
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
    TurId,
    crearTur,
    actualizarTur,
    deleteTur,
};