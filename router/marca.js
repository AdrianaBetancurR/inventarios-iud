// routes/marca.js
const { Router } = require('express');
const { check, validationResult } = require('express-validator');
const Marca = require('../models/Marca');
const { validarJWT } = require('../middleware/validar-jwt');
const validarRolAdmin = require('../middleware/validar-rol-admin');

const router = Router();

// GET all marcas - Proteger esta ruta con el middleware validarJWT
router.get('/', validarJWT, async (req, res) => {
  try {
    const marcas = await Marca.find();
    res.send(marcas);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// POST a new marca - Proteger esta ruta con el middleware validarJWT y validarRolAdmin
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
    const marca = new Marca({
      nombre,
      estado,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date()
    });

    await marca.save();
    res.status(201).send(marca);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// PUT to update a marca - Proteger esta ruta con el middleware validarJWT y validarRolAdmin
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
    const marca = await Marca.findByIdAndUpdate(id, { $set: updateFields }, { new: true });

    if (!marca) {
      return res.status(404).send('Marca no encontrada');
    }

    res.send(marca);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
