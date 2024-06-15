// routes/estadoEquipos.js
const { Router } = require('express');
const { check, validationResult } = require('express-validator');
const EstadoEquipo = require('../models/EstadoEquipo');
const { validarJWT } = require('../middleware/validar-jwt');
const validarRolAdmin = require('../middleware/validar-rol-admin');

const router = Router();

// GET all estadoEquipos - Proteger esta ruta con el middleware validarJWT y validarRolAdmin
router.get('/', validarJWT, validarRolAdmin, async (req, res) => {
  try {
    const estadoEquipos = await EstadoEquipo.find();
    res.send(estadoEquipos);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// POST a new estadoEquipo - Proteger esta ruta con el middleware validarJWT y validarRolAdmin
router.post('/', validarJWT, validarRolAdmin, [
  check('nombre', 'Nombre is required').not().isEmpty(),
  check('estado', 'Invalid estado').isIn(['Activo', 'Inactivo'])
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { nombre, estado } = req.body;

  try {
    const estadoEquipo = new EstadoEquipo({
      nombre,
      estado,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date()
    });

    await estadoEquipo.save();
    res.status(201).send(estadoEquipo);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// PUT to update an estadoEquipo - Proteger esta ruta con el middleware validarJWT y validarRolAdmin
router.put('/:id', validarJWT, validarRolAdmin, [
  check('nombre', 'Nombre is required').optional().not().isEmpty(),
  check('estado', 'Invalid estado').optional().isIn(['Activo', 'Inactivo'])
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { nombre, estado } = req.body;

  const updateFields = {};
  if (nombre) updateFields.nombre = nombre;
  if (estado) updateFields.estado = estado;
  updateFields.fechaActualizacion = new Date();

  try {
    const estadoEquipo = await EstadoEquipo.findByIdAndUpdate(id, { $set: updateFields }, { new: true });

    if (!estadoEquipo) {
      return res.status(404).send('Estado de equipo no encontrado');
    }

    res.send(estadoEquipo);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
