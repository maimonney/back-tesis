const cloudinary = require('cloudinary').v2;
const User = require('../models/usuarioModelo');
const dotenv = require('dotenv');
const multer = require('multer');
dotenv.config();

// Configuración de Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

// Función para subir imágenes a Cloudinary
const uploadToCloudinary = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'perfil', resource_type: 'auto' },
            (error, result) => {
                if (error) {
                    console.error('Error al subir imagen a Cloudinary:', error);
                    return reject(error); // Asegúrate de rechazar la promesa correctamente
                }
                resolve(result);
            }
        );
        uploadStream.end(fileBuffer);
    });
};

// Subir imagen
const subirImagen = async (req, res) => {
    try {
        const { id } = req.params;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ msg: 'No se ha subido ninguna imagen.' });
        }

        console.log('Subiendo imagen a Cloudinary...');
        const result = await uploadToCloudinary(file.buffer);

        console.log('Imagen subida correctamente a Cloudinary:', result);

        const user = await User.findByIdAndUpdate(
            id,
            { fotoPerfil: result.secure_url },
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
        console.error('Error al subir la imagen:', error);
        res.status(500).json({ msg: 'Error al subir la imagen', error: error.message });
    }
};

// Eliminar imagen
const eliminarImagen = async (req, res) => {
    try {
        const { public_id } = req.body;

        if (!public_id) {
            return res.status(400).json({ msg: 'No se ha proporcionado el public_id de la imagen.' });
        }

        console.log('Eliminando imagen de Cloudinary...');
        await cloudinary.uploader.destroy(public_id);

        res.status(200).json({ msg: 'Imagen eliminada con éxito' });
    } catch (error) {
        console.error('Error al eliminar la imagen:', error);
        res.status(500).json({ msg: 'Error al eliminar la imagen', error: error.message });
    }
};

// Actualizar imagen
const actualizarPerfil = async (req, res) => {
    try {
        const { id } = req.params;
        const { public_id } = req.body; // Este campo debe enviarse en el cuerpo de la solicitud
        const file = req.file; // El archivo que sube el usuario

        if (!file) {
            return res.status(400).json({ msg: 'No se ha subido ninguna imagen.' });
        }

        // Imprimir el nombre del archivo subido
        console.log('Nombre del archivo subido:', file.originalname);

        console.log('Actualizando imagen en Cloudinary...');
        if (public_id) {
            console.log('Eliminando imagen anterior...');
            await cloudinary.uploader.destroy(public_id); // Eliminar la imagen anterior en Cloudinary
        }

        const result = await uploadToCloudinary(file.buffer); // Subir la nueva imagen a Cloudinary

        console.log('Imagen actualizada correctamente en Cloudinary:', result);

        const user = await User.findByIdAndUpdate(
            id,
            { fotoPerfil: result.secure_url }, // Actualizar la URL de la foto de perfil del usuario
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
        console.error('Error al actualizar la imagen:', error);
        res.status(500).json({ msg: 'Error al actualizar la imagen', error: error.message });
    }
};


const actualizarPortada = async (req, res) => {
    try {
        const { id } = req.params;
        const { public_id } = req.body; // Este campo debe enviarse en el cuerpo de la solicitud
        const file = req.file; // El archivo que sube el usuario

        if (!file) {
            return res.status(400).json({ msg: 'No se ha subido ninguna imagen.' });
        }

        console.log('Nombre del archivo subido:', file.originalname);

        console.log('Actualizando imagen en Cloudinary...');
        if (public_id) {
            console.log('Eliminando imagen anterior...');
            await cloudinary.uploader.destroy(public_id); 
        }

        const result = await uploadToCloudinary(file.buffer);

        console.log('Imagen actualizada correctamente en Cloudinary:', result);

        const user = await User.findByIdAndUpdate(
            id,
            { fotoPortada: result.secure_url },
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
        console.error('Error al actualizar la imagen:', error);
        res.status(500).json({ msg: 'Error al actualizar la imagen', error: error.message });
    }
};


module.exports = {
    subirImagen,
    eliminarImagen,
    actualizarPortada,
    actualizarPerfil,
};
