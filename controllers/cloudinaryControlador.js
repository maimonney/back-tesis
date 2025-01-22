const cloudinary = require('cloudinary').v2;
const User = require('../models/usuarioModelo');
const dotenv = require('dotenv');
const multer = require('multer');
dotenv.config();

// Configurar Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

// Configuración de Multer para almacenar imágenes en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Subir imagen
const subirImagen = async (req, res) => {
    try {
        console.log('Inicio del proceso de subida de imagen.');

        const { id } = req.params; // ID del usuario a actualizar
        const file = req.file; // Archivo subido por el cliente

        console.log('Datos del archivo recibido:', file);

        if (!file) {
            console.log('No se recibió ninguna imagen.');
            return res.status(400).json({ msg: 'No se ha subido ninguna imagen.' });
        }

        console.log('Subiendo imagen a Cloudinary...');

        // Subir la imagen a Cloudinary desde la memoria
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: 'perfil', resource_type: 'auto' },
                (error, result) => {
                    if (error) {
                        console.error('Error al subir la imagen a Cloudinary:', error);
                        reject(error);
                    } else {
                        console.log('Resultado de la subida a Cloudinary:', result);
                        resolve(result);
                    }
                }
            );
            file.stream.pipe(uploadStream);
        });

        console.log('Imagen subida correctamente a Cloudinary:', result);

        // Actualizar el usuario con la URL de la imagen subida
        const user = await User.findByIdAndUpdate(
            id,
            { fotoPerfil: result.secure_url },
            { new: true }
        );

        if (!user) {
            console.log('Usuario no encontrado.');
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        console.log('Usuario actualizado con nueva imagen:', user);

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
        console.log('Inicio del proceso de eliminación de imagen.');

        const { public_id } = req.body;

        console.log('Public ID recibido:', public_id);

        if (!public_id) {
            console.log('No se proporcionó el public_id.');
            return res.status(400).json({ msg: 'No se ha proporcionado el public_id de la imagen.' });
        }

        console.log('Eliminando imagen de Cloudinary...');

        // Eliminar la imagen de Cloudinary
        await cloudinary.uploader.destroy(public_id);

        console.log('Imagen eliminada correctamente de Cloudinary.');

        res.status(200).json({ msg: 'Imagen eliminada con éxito' });
    } catch (error) {
        console.error('Error al eliminar la imagen:', error);
        res.status(500).json({ msg: 'Error al eliminar la imagen', error: error.message });
    }
};

// Actualizar imagen
const actualizarImagen = async (req, res) => {
    try {
        console.log('Inicio del proceso de actualización de imagen.');

        const { id } = req.params;
        const { public_id } = req.body;
        const file = req.file;

        console.log('Datos del archivo recibido para actualizar:', file);
        console.log('Public ID de la imagen anterior:', public_id);

        if (!file) {
            console.log('No se recibió ninguna imagen para actualizar.');
            return res.status(400).json({ msg: 'No se ha subido ninguna imagen.' });
        }

        console.log('Eliminando imagen anterior, si existe...');
        if (public_id) {
            await cloudinary.uploader.destroy(public_id);
            console.log('Imagen anterior eliminada correctamente.');
        }

        console.log('Subiendo nueva imagen a Cloudinary...');
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: 'perfil', resource_type: 'auto' },
                (error, result) => {
                    if (error) {
                        console.error('Error al subir la nueva imagen:', error);
                        reject(error);
                    } else {
                        console.log('Nueva imagen subida correctamente a Cloudinary:', result);
                        resolve(result);
                    }
                }
            );
            file.stream.pipe(uploadStream);
        });

        console.log('Actualizando el perfil del usuario con la nueva imagen...');
        const user = await User.findByIdAndUpdate(
            id,
            { fotoPerfil: result.secure_url },
            { new: true }
        );

        if (!user) {
            console.log('Usuario no encontrado.');
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        console.log('Usuario actualizado con la nueva imagen:', user);

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
    upload,
};
