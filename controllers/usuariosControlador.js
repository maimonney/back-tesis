const User = require('../models/usuarioModelo');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const claveSecreta = process.env.SECRETKEY;
const saltRounds = 10; 

const crearUsuario = async (req, res) => {
    const { nombre, email, contraseña, rols, ubicacion } = req.body;

    if (!nombre || !email || !contraseña || !ubicacion) {
        return res.status(400).json({ msg: 'Faltan parámetros obligatorios' });
    }

    try {
        const contraseñaHash = await bcrypt.hash(contraseña, saltRounds);
        const newUser = new User({
            nombre,
            email,
            contraseña: contraseñaHash,
            rols: rols || 'user',
            ubicacion 
        });

        await newUser.save();
        res.status(201).json({ msg: 'Usuario creado', data: newUser });
    } catch (error) {
        res.status(500).json({ msg: 'Error al crear el usuario', error: error.message });
    }
};

const inicio = async (req, res) => {
    const { email, contraseña } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(contraseña, user.contraseña))) {
            return res.status(401).json({ msg: 'Email o contraseña incorrectos' });
        }

        const token = jwt.sign({ userId: user._id, rols: user.rols }, claveSecreta, { expiresIn: '1h' });
        res.status(200).json({ msg: 'Inicio de sesión exitoso', token });
    } catch (error) {
        res.status(500).json({ msg: 'Error al iniciar sesión' });
    }
};

const obtenerUsuario = async (req, res) => {
    try {
        const users = await User.find(); 
        res.status(200).json({ data: users });
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ message: 'Error al obtener usuarios' });
    }
};

const obtenerUsuarioId = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }
        res.status(200).json({ data: user });
    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener usuario' });
    }
};

const borrarUsuarioId = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }
        res.status(200).json({ msg: 'Usuario eliminado', data: user });
    } catch (error) {
        res.status(500).json({ msg: 'Error al eliminar usuario' });
    }
};

const actualizarUsuarioId = async (req, res) => {
    const { nombre, email, contraseña, rols } = req.body;

    try {
        const updateData = { nombre, email, rols };
        if (contraseña) {
            updateData.contraseña = await bcrypt.hash(contraseña, saltRounds);
        }

        const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!user) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }
        res.status(200).json({ msg: 'Usuario actualizado', data: user });
    } catch (error) {
        res.status(500).json({ msg: 'Error al actualizar usuario' });
    }
};

module.exports = {
    crearUsuario,
    inicio,
    obtenerUsuario,
    obtenerUsuarioId,
    borrarUsuarioId,
    actualizarUsuarioId
};