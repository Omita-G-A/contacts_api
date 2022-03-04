const express = require('express');
const { check, validationResult } = require('express-validator');
const Contact = require('../models/Contact');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { findOneAndDelete, findById } = require('../models/User');
const router = express.Router();

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjIyMGFmOTBkYWU0ZDIxMGNlZjUzMWIyIn0sImlhdCI6MTY0NjMwOTI2NCwiZXhwIjoxNjQ2MzEyODY0fQ.H-XC8GXGei8ZpsxLf4p1ene4lH0ddZ1bWPWYKoOdsOA


// @route   GET api/contacts
// @desc    Obtener todos los contactos
// @access  Privado (si es usuario no está autentificado no podrá acceder a los contactos)
router.get('/', auth, async (req, res) => {
    try {
        // guardamos los contactos en la constante contacts mediante el método
        // find del modelo Contact pasándole el filtro de que el usuario
        // sea el mismo que el del usuario que le pasamos por req. Sort no es 
        // esencial, pero bueno, lo ponemos para que ordene los contactos por
        // orden de creación.
        const contacts = await Contact.find({ user: req.user.id }).sort({ date: -1 });
        res.json(contacts)
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error en el servidor');
    }
});


// @route   POST api/contacts
// @desc    Crear un nuevo contacto
// @access  Privado
router.post('/', auth, [    // validar los datos que tenemos como obligatorios en Contact
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('type', 'Tiene que ser Personal o Profesional').isIn(['Personal', 'Profesional']),
],
    async (req, res) => {
        // Cómo recogemos los errores del middleware validator? Creamos una constante
        // que sea el resultado de la función validtionResult (propia de express-validator)
        const errors = validationResult(req);
        // si errors no es empty (o sea, que hay errores) le decimos que nos devuelva
        if (!errors.isEmpty()) {
            return res.status(400).json(errors);
        }
        const { name, email, phone, type } = req.body;
        try {

            const newContact = new Contact({
                name,
                email,
                phone,
                type,
                user: req.user.id
            })

            const contact = await newContact.save();
            res.send('contacto añadido');

        } catch (error) {
            console.error(error.message);
            res.status(500).send('error en el servidor');
        }
    });

// @route   PUT api/contacts/:id
// @desc    Actualiza un contacto
// @access  Privado (si es usuario no está autentificado no podrá acceder a los contactos)
router.put('/:id', auth, [
    // añadiendo optional() hacemos que si metemos name o type para actualizar, comprueba 
    // sean correctos los datos (el not, isEmpty, isIn) y su no llegan no pasa nada.
    check('name', 'El nombre es obligatorio').optional().not().isEmpty(),
    check('type', 'Tiene que ser Personal o Profesional').optional().isIn(['Personal', 'Profesional']),
],async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors);
    }

    // desestructuramos el objeto documento para tener 
    // las variables
    const { name, email, phone, type } = req.body;

    // creamos un objeto contacto
    const contactFields = {};
    if (name) contactFields.name = name;
    if (email) contactFields.email = email;
    if (phone) contactFields.phone = phone;
    if (type) contactFields.type = type;

    try {

        // comprobamos que el contacto existe
        let contact = await findById(req.params.id);
        if (!contact) return res.status(404).send({ msg: "contacto no encontrado" });

        // comprobamos que el contacto pertenece al usuario
        if (contact.user.toString() !== req.user.id)
            return res.status(401).send({ msg: 'No tienes permisos para borrar' });

        // método para el update
        contact = await Contact.findByIdAndUpdate(req.params.id, { $set: contactFields },
            { new: true }); // este parámetro hará que se nos devuelva el contacto actualizado

    } catch (error) {
        console.error(error.message);
        res.status(500).send('error en el servidor');
    }


});



// @route   DELETE api/contacts/:id
// @desc    Elimina un contacto
// @access  Privado (si es usuario no está autentificado no podrá acceder a los contactos)
router.delete('/:id', auth, async (req, res) => {

    try {

        // comprobamos que el contacto existe
        let contact = await findById(req.params.id);
        if (!contact) return res.status(404).send({ msg: "contacto no encontrado" });

        // comprobamos que el contacto pertenece al usuario
        if (contact.user.toString() !== req.user.id)
            return res.status(401).send({ msg: 'No tienes permisos para borrar' })

        contact = Contact.findByIdAndDelete(req.params.id);
        res.json(contact)

    } catch (error) {
        console.error(error.message);
        res.status(500).send('error en el servidor');
    }
});

module.exports = router;
