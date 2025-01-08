// const cloudinary = require('cloudinary').v2;
const Lugar = require('../models/lugarModelo');

//Provincias
const provinciasArgentinas = [
  'Buenos Aires',
  'Córdoba',
  'Chubut',
  'Neuquén',
  'Misiones',
  'Mendoza',
  'San Juan',
  'Salta',
  'San Luis',
  'Santa Cruz',
  'Chaco',
  'Santa Fe',
  'Río Negro',
  'Tucumán',
  'La Pampa',
  'La Rioja',
  'Santiago del Estero',
  'Formosa',
  'Corrientes',
  'Entre Ríos',
  'Catamarca',
  'Jujuy',
  'Tierra del Fuego',
  'San Juan',
  ];

  const crearLugar = async (req, res) => {
    const { nombre, descripcion, ubicacion, categoria, video } = req.body;
    const imagenes = [];

    if (!nombre || !ubicacion) {
        return res.status(400).json({ msg: 'Faltan parámetros obligatorios: nombre y ubicacion' });
    }

    if (!provinciasArgentinas.includes(ubicacion)) {
        return res.status(400).json({ msg: 'Ubicación no válida. Debe estar en la lista de lugares argentinos.' });
    }

     // Subir imágenes a Cloudinary 
    //  if (req.files && req.files.imagen) {
    //     try {

    //         for (let i = 0; i < req.files.imagen.length; i++) {
    //             const image = req.files.imagen[i];
    //             const result = await cloudinary.uploader.upload(image.path); 

    //             imagenes.push(result.secure_url);
    //         }
    //     } catch (error) {
    //         return res.status(500).json({ msg: 'Error al subir las imágenes', error: error.message });
    //     }
    // }

    try {
        const nuevoLugar = new Lugar({
            nombre,
            descripcion,
            ubicacion,
            categoria,
            imagen: imagenes,
            video
        });

        await nuevoLugar.save();
        res.status(201).json({ msg: 'Lugar creado', data: nuevoLugar });
    } catch (error) {
        console.error(error); 
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
        lugar.id = lugar._id.toString();
        delete lugar._id;
        res.status(200).json({ data: lugar });
    } catch (error) {
        console.error(error); 
        res.status(500).json({ msg: 'Error al obtener lugar', error: error.message });
    }
};

const actualizarLugarId = async (req, res) => {
    const { nombre, descripcion, ubicacion, categoria, imagen, video } = req.body;

    if (ubicacion && !provinciasArgentinas.includes(ubicacion)) {
        return res.status(400).json({ msg: 'Ubicación no válida. Debe estar en la lista de lugares argentinos.' });
    }

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

const obtenerCategoria = async (req, res) => {
    try {
        const categorias = await Lugar.distinct('categoria');  

        if (categorias.length === 0) {
            return res.status(404).json({ msg: 'No se encontraron categorías' });
        }

        res.status(200).json({ data: categorias });
    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener categorías', error: error.message });
    }
};

const obtenerPorCategoria = async (req, res) => {
    const { categoria } = req.params; 

    try {
        const lugares = await Lugar.find({ categoria: categoria });  

        if (lugares.length === 0) {
            return res.status(404).json({ msg: 'No se encontraron lugares para esta categoría' });
        }

        res.status(200).json({ data: lugares });
    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener lugares', error: error.message });
    }
};

module.exports = {
    crearLugar,
    obtenerLugares,
    obtenerLugarId,
    actualizarLugarId,
    eliminarLugarId,
    obtenerCategoria,
    obtenerPorCategoria
};
