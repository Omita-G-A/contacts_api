// librerías
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');


// usuario y rutas
const User = require('../models/User');
const router = express.Router();

// @route   POST api/users
// @desc    Registra  un nuevo usuario
// @access  Public
router.post('/', [    // validar los datos
                    check('name', 'El nombre es obligatorio').not().isEmpty(),
                    // esto marcará un error si el nombre está vacío
                    check('email', 'Por favor, inserta un email válido').isEmail(),
                    check('password', 'La contraseña debe tener más de 6 carácteres').isLength({min: 6})
                ], async (req, res) => {

    // Cómo recogemos los errores del middleware validator? Creamos una constante
    // que sea el resultado de la función validtionResult (propia de express-validator)
    const errors = validationResult(req);
    // si errors no es empty (o sea, que hay errores) le decimos que nos devuelva
    if(!errors.isEmpty()){
        return res.status(400).json(errors);
    }

    // desestructuramos el objeto que estamos enviando
    // y de paso, de esta manera automáticamente
    // se generan variables con las propiedades de lo que
    // pasamos por body.
    const { name, email, password } = req.body;

    // procedemos al try/catch para ver si registramos correctamente al usuario
    try {

        // para poder usar el esquema de User, tenemos que 
        // importar con require el model de User
        let user = await User.findOne({ email });

        // chequear si el usuario ya existe
        if (user) {
            res.status(400).json({ msg: 'el usuario ya existe' })
        }

        user = new User({
            name,
            email,
            password
        })

        // encriptar el password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // guardar el usuario con el password ya hasheado
        await user.save();

        // una vez registrado con éxito le pasamos
        // un token como si ya estuviese logueado

        const payload = { user: { id: user.id } };
        // en sign metemos el payload (que seria una especie de "pago" en forma 
        // d'objecte amb informació, en es nostre cas de s'usuari sa seva id), 
        // nuestra palabra secreta (que hemos guardado en el archivo default de 
        // la carpeta config), las opciones si es que queremos añadir alguna
        // (por ejemplo el tiempo de validez del token en segundos) y el
        // callback (si hay error lánzanos el error, si no, pásanos el tóken).
        jwt.sign(
            payload, 
            config.get('jwtSecret'), 
            { expiresIn: 3600 }, 
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            });

    } catch (error) {
        console.error(error.message);
        res.status(500).send('error en el servidor');
    }

});

module.exports = router;