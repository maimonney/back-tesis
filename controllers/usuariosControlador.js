const User = require('../models/usuarioModelo');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const claveSecreta = process.env.SECRETKEY;
const saltRounds = 10; 

const crearUsuario = async (req, res) => {
    const { nombre, email, contrasenia, rols, provincia } = req.body;

    if (!nombre || !email || !contrasenia) {
        return res.status(400).json({ msg: 'Faltan parámetros obligatorios' });
    }

    try {
        const usuarioExistente = await User.findOne({ email });
        if (usuarioExistente) {
            return res.status(400).json({ msg: 'El usuario ya existe con ese correo electrónico' });
        }

        const contraseniaHash = await bcrypt.hash(contrasenia, saltRounds);

        const newUser = new User({
            nombre,
            email,
            contrasenia: contraseniaHash,
            rols: rols || 'user',
            provincia  
        });

        await newUser.save();
        const token = jwt.sign({ 
            userId: newUser._id,  
            rols: newUser.rols, 
            email: newUser.email,  
            nombre: newUser.nombre 
        }, claveSecreta, { expiresIn: '1h' });

        res.status(201).json({ msg: 'Usuario creado con éxito', data: newUser, token });
    } catch (error) {
        console.error(error); 
        res.status(500).json({ msg: 'Error al crear el usuario', error: error.message });
    }
};

const crearGuias = async (req, res) => {
    const { nombre, email, contrasenia, provincia } = req.body;

    if (!nombre || !email || !contrasenia || !provincia) { 
        return res.status(400).json({ msg: 'Faltan parámetros obligatorios' });
    }

    try {
        const usuarioExistente = await User.findOne({ email });
        if (usuarioExistente) {
            return res.status(400).json({ msg: 'El usuario ya existe con ese correo electrónico' });
        }

        const contraseniaHash = await bcrypt.hash(contrasenia, saltRounds);

        const newUser = new User({
            nombre,
            email,
            contrasenia: contraseniaHash,
            rols: 'guia',
            provincia 
        });

        await newUser.save();
        const token = jwt.sign({ 
            userId: newUser._id,  
            rols: newUser.rols, 
            email: newUser.email,  
            nombre: newUser.nombre 
        }, claveSecreta, { expiresIn: '1h' });

        res.status(201).json({ msg: 'Usuario guía creado con éxito', data: newUser, token });
    } catch (error) {
        console.error(error); 
        res.status(500).json({ msg: 'Error al crear el usuario', error: error.message });
    }
};

const inicio = async (req, res) => {
    const { email, contrasenia } = req.body;

    try {
        console.log('Datos recibidos:', email, contrasenia); 
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ msg: 'Email no encontrado' });
        }

        const passwordMatch = await bcrypt.compare(contrasenia, user.contrasenia);
        console.log('Contraseña correcta:', passwordMatch);

        if (!passwordMatch) {
            return res.status(401).json({ msg: 'Contraseña incorrecta' });
        }

        const token = jwt.sign({ 
            userId: user._id, 
            rols: user.rols, 
            email: user.email, 
            nombre: user.nombre 
        }, claveSecreta, { expiresIn: '1h' });

      
        return res.status(200).json({
            msg: 'Inicio de sesión exitoso',
            user: { id: user._id, email: user.email, rols: user.rols, nombre: user.nombre },
            token: token 
        });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
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

const obtenerGuia = async (req, res) => {
    try {
        const users = await User.find({ rols: 'guia' }); 
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
    const { nombre, email, contrasenia, rols } = req.body;

    try {
        const updateData = { nombre, email, rols };
        if (contrasenia) {
            updateData.contrasenia = await bcrypt.hash(contrasenia, saltRounds);
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
    crearGuias,
    inicio,
    obtenerUsuario,
    obtenerGuia,
    obtenerUsuarioId,
    borrarUsuarioId,
    actualizarUsuarioId
};
