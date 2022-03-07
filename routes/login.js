const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const config = require('config')
const jwt = require('jsonwebtoken')
const auth = require('../middleware/auth')
const { check, validationResult } = require('express-validator')

const User = require('../models/User')

// @route   GET api/login/:id
// @desc    Obtener el usuario logueado
// @access  Privado
router.get('/', auth, (req, res) => {


})






// @route   POST api/login/
// @desc    Autentificar el usuario y generar un token
// @access  Public
router.post(
  '/',
  [
    check('email', 'Inserta un email válido').isEmail(),
    check('password', 'contraseña requerida').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(200).json(errors)
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(200).json({ msg: "credenciales no válidas" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(200).json({ msg: "las contraseñas no coinciden" });
      }

      // para generar un token reutilizamos el código de users en registrarse
      const payload = { user: { id: user.id } };
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
  },
)

module.exports = router
