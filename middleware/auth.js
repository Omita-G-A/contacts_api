// Para nuestro middleware de autentificación del tóken solo
// necesitamos traernos estas dos constantes
const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = (req, res, next) => {
    // recogemos el token de la cabecera (el header del req)
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).json({ msg: 'No hay tokens, autorización denegada' })
    }

    // verificar el token
    try {
        // en la constante decoded guardamos la verificación de si el token lo hemos creado nosotros
        // mirando que aparezca nuestro jwtSecret guardado en config (en el archivo default de la
        // carpeta config)
        const decoded = jwt.verify(token, config.get('jwtSecret'));
        req.user = decoded.user;
        next();
        
    } catch (error) {
        res.status(401).json({ msg: 'token no válido.' });
    }

};
