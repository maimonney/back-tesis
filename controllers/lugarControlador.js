const Lugar = require('../models/lugarModelo');

const crearLugar = async (req, res) => {
    const { nombre, descripcion, ubicacion, categoria, imagen, video } = req.body;

    if (!nombre || !ubicacion) {
        return res.status(400).json({ msg: 'Faltan parámetros obligatorios: nombre y ubicacion' });
    }

    try {
        const nuevoLugar = new Lugar({
            nombre,
            descripcion,
            ubicacion,
            categoria,
            imagen,
            video,
            categoria
        });

        await nuevoLugar.save();
        res.status(201).json({ msg: 'Lugar creado', data: nuevoLugar });
    } catch (error) {
        res.status(500).json({ msg: 'Error al crear el lugar', error: error.message });
    }
};

const obtenerLugares = async (req, res) => {
    try {
        const lugares = await Lugar.find();
        res.status(200).json({ data: lugares });
    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener lugares', error: error.message });
    }
};

const obtenerLugarId = async (req, res) => {
    try {
        const lugar = await Lugar.findById(req.params.id);
        if (!lugar) {
            return res.status(404).json({ msg: 'Lugar no encontrado' });
        }
        console.log(lugar);
        res.status(200).json({ data: lugar });
    } catch (error) {
        console.error(error); 
        res.status(500).json({ msg: 'Error al obtener lugar', error: error.message });
    }
};


const actualizarLugarId = async (req, res) => {
    const { nombre, descripcion, ubicacion, categoria, imagen, video } = req.body;

    try {
        const updateData = { nombre, descripcion, ubicacion, categoria, imagen, video };
        const lugar = await Lugar.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!lugar) {
            return res.status(404).json({ msg: 'Lugar no encontrado' });
        }
        res.status(200).json({ msg: 'Lugar actualizado', data: lugar });
    } catch (error) {
        res.status(500).json({ msg: 'Error al actualizar lugar', error: error.message });
    }
};

const eliminarLugarId = async (req, res) => {
    try {
        const lugar = await Lugar.findByIdAndDelete(req.params.id);
        if (!lugar) {
            return res.status(404).json({ msg: 'Lugar no encontrado' });
        }
        res.status(200).json({ msg: 'Lugar eliminado', data: lugar });
    } catch (error) {
        res.status(500).json({ msg: 'Error al eliminar lugar', error: error.message });
    }
};

module.exports = {
    crearLugar,
    obtenerLugares,
    obtenerLugarId,
    actualizarLugarId,
    eliminarLugarId
};
