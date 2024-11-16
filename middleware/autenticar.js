const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config(); 

const secreyKey = process.env.SECRETKEY;

const autenticar = async (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1]; 

    if (!token) {
        return res.status(401).json({ message: 'No se pasó el JWT', data: [] });
    }

    jwt.verify(token, secreyKey, (error, decoded) => {
        if (error) {
            return res.status(403).json({ message: 'JWT inválido', data: [] });
        }

        req.user = decoded;  
        next(); 
    });
};

module.exports = { autenticar };
