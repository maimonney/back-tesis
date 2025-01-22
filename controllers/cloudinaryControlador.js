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
const imageUpload = multer({ storage: storage }); // Renombrado para evitar conflicto

// Subir imagen
const subirImagen = async (req, res) => {
    try {
        const { id } = req.params;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ msg: 'No se ha subido ninguna imagen.' });
        }

        console.log('Subiendo imagen a Cloudinary...');

        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: 'perfil', resource_type: 'auto' },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            file.stream.pipe(uploadStream);
        });

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
const actualizarImagen = async (req, res) => {
    try {
        const { id } = req.params;
        const { public_id } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ msg: 'No se ha subido ninguna imagen.' });
        }

        console.log('Actualizando imagen a Cloudinary...');

        if (public_id) {
            console.log('Eliminando imagen anterior de Cloudinary...');
            await cloudinary.uploader.destroy(public_id);
        }

        const resultado = await cloudinary.uploader.upload_stream(
            {
                folder: 'perfil',
                resource_type: 'auto',
            },
            async (error, result) => {
                if (error) {
                    console.error('Error al subir la imagen a Cloudinary:', error);
                    return res.status(500).json({ msg: 'Error al subir la imagen', error: error.message });
                }

                console.log('Imagen actualizada correctamente en Cloudinary:', result);

                const user = await User.findByIdAndUpdate(
                    id,
                    { fotoPerfil: result.secure_url },
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
            }
        );

        file.stream.pipe(resultado);
    } catch (error) {
        console.error('Error al actualizar la imagen:', error);
        res.status(500).json({ msg: 'Error al actualizar la imagen', error: error.message });
    }
};

module.exports = {
    subirImagen,
    eliminarImagen,
    actualizarImagen,
    upload: imageUpload, // Exportar con el nuevo nombre
};
