const cloudinary = require('cloudinary').v2;
const User = require('../models/usuarioModelo');
const dotenv = require('dotenv');
dotenv.config();

// Configuración de Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

const uploadToCloudinary = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'perfil', resource_type: 'auto' },
            (error, result) => {
                if (error) {
                    console.error('Error al subir imagen a Cloudinary:', error);
                    return reject(error);
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

// Eliminar imagen de perfil
const eliminarImagen = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        if (user.fotoPerfil) {
            const public_id = user.fotoPerfil.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(public_id);
        }

        user.fotoPerfil = null;
        await user.save();

        res.status(200).json({ msg: 'Foto de perfil eliminada con éxito', data: user });
    } catch (error) {
        console.error('Error al eliminar la imagen:', error);
        res.status(500).json({ msg: 'Error al eliminar la imagen', error: error.message });
    }
};

// Eliminar imagen de portada
const eliminarPortada = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        if (user.fotoPortada) {
            const public_id = user.fotoPortada.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(public_id);
        }

        user.fotoPortada = null;
        await user.save();

        res.status(200).json({ msg: 'Foto de portada eliminada con éxito', data: user });
    } catch (error) {
        console.error('Error al eliminar la foto de portada:', error);
        res.status(500).json({ msg: 'Error al eliminar la foto de portada', error: error.message });
    }
};

// Actualizar imagen de perfil
const actualizarPerfil = async (req, res) => {
    try {
        const { id } = req.params;
        const file = req.file; 

        if (!file) {
            return res.status(400).json({ msg: 'No se ha subido ninguna imagen.' });
        }
        const result = await uploadToCloudinary(file.buffer);
        const user = await User.findByIdAndUpdate(
            id,
            { fotoPerfil: result.secure_url },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        res.status(200).json({
            msg: 'Foto de perfil actualizada con éxito',
            data: user,
        });
    } catch (error) {
        console.error('Error al actualizar la foto de perfil:', error);
        res.status(500).json({ msg: 'Error al actualizar la foto de perfil', error: error.message });
    }
};

const actualizarPortada = async (req, res) => {
    try {
        const { id } = req.params;
        const file = req.file; 

        if (!file) {
            return res.status(400).json({ msg: 'No se ha subido ninguna imagen.' });
        }

        
        const result = await uploadToCloudinary(file.buffer);
        const user = await User.findByIdAndUpdate(
            id,
            { fotoPortada: result.secure_url },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        res.status(200).json({
            msg: 'Foto de portada actualizada con éxito',
            data: user,
        });
    } catch (error) {
        console.error('Error al actualizar la foto de portada:', error);
        res.status(500).json({ msg: 'Error al actualizar la foto de portada', error: error.message });
    }
};

module.exports = {
    subirImagen,
    eliminarImagen,
    eliminarPortada,
    actualizarPerfil,
    actualizarPortada,
};