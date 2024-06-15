const { Router } = require('express');
const { check, validationResult } = require('express-validator');
const Inventario = require('../models/Inventario');
const { validarJWT } = require('../middleware/validar-jwt');
const validarRolAdmin = require('../middleware/validar-rol-admin');
const validarRolDocente = require('../middleware/validar-rol-docente'); 

const router = Router();

// GET all inventarios - Proteger esta ruta con el middleware validarJWT y validarRolDocente
router.get('/', validarJWT, validarRolDocente, async (req, res) => {
  try {
    const inventarios = await Inventario.find()
      .populate('usuario', 'nombre email')
      .populate('marca', 'nombre')
      .populate('estadoEquipo', 'nombre');
    res.send(inventarios);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});


// POST a new inventario - Proteger esta ruta con el middleware validarJWT y validarRolAdmin
router.post('/', validarJWT, validarRolAdmin, [
  check('serial', 'Serial is required').not().isEmpty(),
  check('modelo', 'Modelo is required').not().isEmpty(),
  check('fechaCompra', 'Fecha de compra is required').not().isEmpty(),
  check('precio', 'Precio is required').isNumeric(),
  check('usuario', 'Usuario is required').not().isEmpty(),
  check('marca', 'Marca is required').not().isEmpty(),
  check('estadoEquipo', 'Estado de equipo is required').not().isEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { serial, modelo, descripcion, foto, color, fechaCompra, precio, usuario, marca, estadoEquipo } = req.body;

  try {
    const inventario = new Inventario({
      serial,
      modelo,
      descripcion,
      foto,
      color,
      fechaCompra,
      precio,
      usuario,
      marca,
      estadoEquipo,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date()
    });

    await inventario.save();
    res.status(201).send(inventario);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// PUT to update an inventario - Proteger esta ruta con el middleware validarJWT y validarRolAdmin
router.put('/:id', validarJWT, validarRolAdmin, [
  check('serial', 'Serial is required').optional().not().isEmpty(),
  check('modelo', 'Modelo is required').optional().not().isEmpty(),
  check('fechaCompra', 'Fecha de compra is required').optional().not().isEmpty(),
  check('precio', 'Precio is required').optional().isNumeric(),
  check('usuario', 'Usuario is required').optional().not().isEmpty(),
  check('marca', 'Marca is required').optional().not().isEmpty(),
  check('estadoEquipo', 'Estado de equipo is required').optional().not().isEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { serial, modelo, descripcion, foto, color, fechaCompra, precio, usuario, marca, estadoEquipo } = req.body;

  const updateFields = {};
  if (serial) updateFields.serial = serial;
  if (modelo) updateFields.modelo = modelo;
  if (descripcion) updateFields.descripcion = descripcion;
  if (foto) updateFields.foto = foto;
  if (color) updateFields.color = color;
  if (fechaCompra) updateFields.fechaCompra = fechaCompra;
  if (precio) updateFields.precio = precio;
  if (usuario) updateFields.usuario = usuario;
  if (marca) updateFields.marca = marca;
  if (estadoEquipo) updateFields.estadoEquipo = estadoEquipo;
  updateFields.fechaActualizacion = new Date();

  try {
    const inventario = await Inventario.findByIdAndUpdate(id, { $set: updateFields }, { new: true })
      .populate('usuario', 'nombre email')
      .populate('marca', 'nombre')
      .populate('estadoEquipo', 'nombre');

    if (!inventario) {
      return res.status(404).send('Inventario no encontrado');
    }

    res.send(inventario);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// DELETE an inventario - Proteger esta ruta con el middleware validarJWT y validarRolAdmin
router.delete('/:id', validarJWT, validarRolAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const inventario = await Inventario.findByIdAndDelete(id);

    if (!inventario) {
      return res.status(404).send('Inventario no encontrado');
    }

    res.send('Inventario eliminado');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
