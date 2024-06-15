const { Router } = require('express');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const { validarJWT } = require('../middleware/validar-jwt');
const validarRolAdmin = require('../middleware/validar-rol-admin');

const router = Router();

router.get('/', validarJWT, validarRolAdmin, async (req, res) => {
  try {
    const usuarios = await Usuario.find().select('-password');
    res.send(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// POST a new usuario - Proteger esta ruta con el middleware validarJWT y validarRolAdmin
router.post('/', validarJWT, validarRolAdmin, [
  check('nombre', 'Nombre is required').not().isEmpty(),
  check('email', 'Invalid email').isEmail(),
  check('estado', 'Invalid estado').isIn(['Activo', 'Inactivo']),
  check('password', 'Password is required').not().isEmpty(),
  check('rol', 'Invalid rol').isIn(['Administrador', 'Docente'])
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { nombre, email, estado, password, rol } = req.body;

  try {
    const existeUsuario = await Usuario.findOne({ email });
    if (existeUsuario) {
      return res.status(400).send('Email ya existe');
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const usuario = new Usuario({
      nombre,
      email,
      estado,
      password: hashedPassword,
      rol,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date()
    });

    await usuario.save();

    res.status(201).send(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// PUT method to update an existing usuario - Proteger esta ruta con el middleware validarJWT y validarRolAdmin
router.put('/:id', validarJWT, validarRolAdmin, [
  check('nombre', 'Nombre is required').optional().not().isEmpty(),
  check('email', 'Invalid email').optional().isEmail(),
  check('estado', 'Invalid estado').optional().isIn(['Activo', 'Inactivo']),
  check('password', 'Password is required').optional().not().isEmpty(),
  check('rol', 'Invalid rol').optional().isIn(['Administrador', 'Docente'])
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { nombre, email, estado, password, rol } = req.body;

  const updateFields = {};

  if (nombre) updateFields.nombre = nombre;
  if (email) updateFields.email = email;
  if (estado) updateFields.estado = estado;
  if (rol) updateFields.rol = rol;
  if (password) {
    const salt = bcrypt.genSaltSync(10);
    updateFields.password = bcrypt.hashSync(password, salt);
  }
  updateFields.fechaActualizacion = new Date();

  try {
    const usuario = await Usuario.findByIdAndUpdate(id, { $set: updateFields }, { new: true });

    if (!usuario) {
      return res.status(404).send('Usuario no encontrado');
    }

    res.send(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
