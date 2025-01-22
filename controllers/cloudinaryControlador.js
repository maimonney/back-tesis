const cloudinary = require('cloudinary').v2;
const User = require('../models/usuarioModelo'); // Asegúrate de que la ruta sea correcta
const dotenv = require('dotenv');
dotenv.config(); // Cargar las variables de entorno

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
        const { id } = req.params; // ID del usuario
        const { path } = req.file; // Path del archivo cargado

        const resultado = await cloudinary.uploader.upload(path, {
            folder: 'perfil' // Cambiar según la carpeta deseada
        });

        // Actualizar el usuario con la URL de la imagen subida
        const user = await User.findByIdAndUpdate(
            id,
            { fotoPerfil: resultado.secure_url },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        res.status(200).json({
            msg: 'Imagen subida y usuario actualizado',
            data: user,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al subir la imagen', error: error.message });
    }
};

// Eliminar imagen
const eliminarImagen = async (req, res) => {
    try {
        const { public_id } = req.body; // Public ID de la imagen en Cloudinary

        await cloudinary.uploader.destroy(public_id);

        res.status(200).json({ msg: 'Imagen eliminada con éxito' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al eliminar la imagen', error: error.message });
    }
};

// Actualizar imagen (eliminar la anterior y subir una nueva)
const actualizarImagen = async (req, res) => {
    try {
        const { id } = req.params; // ID del usuario
        const { public_id } = req.body; // Public ID de la imagen actual
        const { path } = req.file; // Path del archivo cargado

        // Eliminar la imagen anterior
        if (public_id) {
            await cloudinary.uploader.destroy(public_id);
        }

        // Subir la nueva imagen
        const resultado = await cloudinary.uploader.upload(path, {
            folder: 'perfil' // Cambiar según la carpeta deseada
        });

        // Actualizar el usuario con la URL de la nueva imagen
        const user = await User.findByIdAndUpdate(
            id,
            { fotoPerfil: resultado.secure_url },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        res.status(200).json({
            msg: 'Imagen actualizada con éxito',
            data: user,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al actualizar la imagen', error: error.message });
    }
};

module.exports = {
    subirImagen,
    eliminarImagen,
    actualizarImagen,
};
