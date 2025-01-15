const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const secretKey = process.env.SECRETKEY;

const autenticar = async (req, res, next) => {
    try {
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'No se proporcionó un token', data: [] });
        }

        jwt.verify(token, secretKey, (error, decoded) => {
            if (error) {
                return res.status(403).json({ message: 'El token proporcionado es inválido o ha expirado', data: [] });
            }

            req.user = decoded; 
            next(); 
        });
    } catch (error) {
        console.error('Error en el middleware de autenticación:', error);
        res.status(500).json({ message: 'Error interno en la autenticación', data: [] });
    }
};

module.exports = { autenticar };
