// routes/tipoEquipo.js

const { Router } = require('express');
const { check, validationResult } = require('express-validator');
const TipoEquipo = require('../models/TipoEquipo');
const { validarJWT } = require('../middleware/validar-jwt');
const validarRolAdmin = require('../middleware/validar-rol-admin'); // Importar middleware validarRolAdmin

const router = Router();

// GET all tipoEquipos - Proteger esta ruta con el middleware validarJWT y validarRolAdmin
router.get('/', validarJWT, validarRolAdmin, async (req, res) => {
  try {
    const tipoEquipos = await TipoEquipo.find();
    res.send(tipoEquipos);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// POST a new tipoEquipo - Proteger esta ruta con el middleware validarJWT y validarRolAdmin
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
    const tipoEquipo = new TipoEquipo({
      nombre,
      estado,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date()
    });

    await tipoEquipo.save();
    res.status(201).send(tipoEquipo);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

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
    const tipoEquipo = await TipoEquipo.findByIdAndUpdate(id, { $set: updateFields }, { new: true });

    if (!tipoEquipo) {
      return res.status(404).send('Tipo de equipo no encontrado');
    }

    res.send(tipoEquipo);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// DELETE a tipoEquipo - Proteger esta ruta con el middleware validarJWT y validarRolAdmin
router.delete('/:id', validarJWT, validarRolAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const tipoEquipo = await TipoEquipo.findByIdAndDelete(id);

    if (!tipoEquipo) {
      return res.status(404).send('Tipo de equipo no encontrado');
    }

    res.send('Tipo de equipo eliminado');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
