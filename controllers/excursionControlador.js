const Excursion = require('../models/excursionModelo');

const crearExcursion = async (req, res) => {
    const { titulo, descripcion, duracion, precio, fecha, guia, imagenes } = req.body;

    if (!titulo || !descripcion || !duracion || !precio || !fecha || !guia) {
        return res.status(400).json({ msg: 'Faltan parámetros obligatorios' });
    }

    try {
        // Crear una nueva excursión
        const nuevaExcursion = new Excursion({
            titulo,
            descripcion,
            duracion,
            precio,
            fecha,
            guia,
            imagenes
        });

        // Guardar la excursión en la base de datos
        await nuevaExcursion.save();

        res.status(201).json({ msg: 'Excursión creada', data: nuevaExcursion });
    } catch (error) {
        res.status(500).json({ msg: 'Error al crear la excursión', error: error.message });
    }
};

const obtenerExcursiones = async (req, res) => {
    try {
        const excursiones = await Excursion.find().populate('guia', 'nombre email'); // Poblamos el campo 'guia' con los detalles del usuario

        res.status(200).json({ data: excursiones });
    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener las excursiones', error: error.message });
    }
};

const obtenerExcursionId = async (req, res) => {
    try {
        const excursion = await Excursion.findById(req.params.id).populate('guia', 'nombre email');
        
        if (!excursion) {
            return res.status(404).json({ msg: 'Excursión no encontrada' });
        }

        res.status(200).json({ data: excursion });
    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener la excursión', error: error.message });
    }
};

const actualizarExcursionId = async (req, res) => {
    const { titulo, descripcion, duracion, precio, fecha, guia, imagenes } = req.body;

    try {
        const updateData = { titulo, descripcion, duracion, precio, fecha, guia, imagenes };

        const excursion = await Excursion.findByIdAndUpdate(req.params.id, updateData, { new: true });
        
        if (!excursion) {
            return res.status(404).json({ msg: 'Excursión no encontrada' });
        }

        res.status(200).json({ msg: 'Excursión actualizada', data: excursion });
    } catch (error) {
        res.status(500).json({ msg: 'Error al actualizar la excursión', error: error.message });
    }
};

const eliminarExcursionId = async (req, res) => {
    try {
        const excursion = await Excursion.findByIdAndDelete(req.params.id);

        if (!excursion) {
            return res.status(404).json({ msg: 'Excursión no encontrada' });
        }

        res.status(200).json({ msg: 'Excursión eliminada', data: excursion });
    } catch (error) {
        res.status(500).json({ msg: 'Error al eliminar la excursión', error: error.message });
    }
};

module.exports = {
    crearExcursion,
    obtenerExcursiones,
    obtenerExcursionId,
    actualizarExcursionId,
    eliminarExcursionId
};
