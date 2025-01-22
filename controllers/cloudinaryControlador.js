const cloudinary = require('cloudinary').v2;
const User = require('../models/usuarioModelo');
const dotenv = require('dotenv');
dotenv.config();

// Configurar Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true, 
});

// Subir imagen
const subirImagen = async (req, res) => {
    try {
        const { id } = req.params; 
        const { path } = req.file; 

        console.log('Subiendo imagen, ruta del archivo:', path);

        const resultado = await cloudinary.uploader.upload(path, {
            folder: 'perfil'
        });

        console.log('Imagen subida a Cloudinary:', resultado);

        const user = await User.findByIdAndUpdate(
            id,
            { fotoPerfil: resultado.secure_url },
            { new: true }
        );

        if (!user) {
            console.log('Usuario no encontrado');
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        res.status(200).json({
            msg: 'Imagen subida y usuario actualizado',
            data: user,
        });
    } catch (error) {
        console.error('Error al subir la imagen:', error);
        res.status(500).json({ msg: 'Error al subir la imagen', error: error.message });
    }
};

// Eliminar imagen
const eliminarImagen = async (req, res) => {
    try {
        const { public_id } = req.body; 

        console.log('Eliminando imagen de Cloudinary, public_id:', public_id);

        await cloudinary.uploader.destroy(public_id);

        res.status(200).json({ msg: 'Imagen eliminada con éxito' });
    } catch (error) {
        console.error('Error al eliminar la imagen:', error);
        res.status(500).json({ msg: 'Error al eliminar la imagen', error: error.message });
    }
};

const actualizarImagen = async (req, res) => {
    try {
        const { id } = req.params;
        const { public_id } = req.body;
        const { path } = req.file;

        console.log('Actualizando imagen, id:', id, 'public_id:', public_id, 'ruta del archivo:', path);

        if (public_id) {
            console.log('Eliminando imagen anterior de Cloudinary con public_id:', public_id);
            await cloudinary.uploader.destroy(public_id);
        }

        const resultado = await cloudinary.uploader.upload(path, {
            folder: 'perfil'
        });

        console.log('Imagen actualizada en Cloudinary:', resultado);

        const user = await User.findByIdAndUpdate(
            id,
            { fotoPerfil: resultado.secure_url },
            { new: true }
        );

        if (!user) {
            console.log('Usuario no encontrado');
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        res.status(200).json({
            msg: 'Imagen actualizada con éxito',
            data: user,
        });
    } catch (error) {
        console.error('Error al actualizar la imagen:', error);
        res.status(500).json({ msg: 'Error al actualizar la imagen', error: error.message });
    }
};

module.exports = {
    subirImagen,
    eliminarImagen,
    actualizarImagen,
};
