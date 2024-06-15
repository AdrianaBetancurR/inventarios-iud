const { Router } = require('express');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const generarJWT = require('../helpers/jwt'); // Importar la función generarJWT

const router = Router();

router.post('/', [
  check('email', 'El email es obligatorio').isEmail(),
  check('password', 'La contraseña es obligatoria').not().isEmpty(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Verificar si el usuario existe en la base de datos
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ mensaje: 'Usuario no encontrado' });
    }

    // Comparar la contraseña ingresada con la contraseña almacenada
    const esIgual = await bcrypt.compare(password, usuario.password);
    if (!esIgual) {
      return res.status(400).json({ mensaje: 'Contraseña incorrecta' });
    }

    // Generar token JWT
    const accessToken = generarJWT(usuario);

    // Datos del usuario a devolver en la respuesta
    const usuarioData = {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
      accessToken // Incluir el token JWT en la respuesta
    };

    // Enviar respuesta con los datos del usuario y el token JWT
    res.json({ usuario: usuarioData });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error en el servidor');
  }
});

module.exports = router;
