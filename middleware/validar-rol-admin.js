const jwt = require('jsonwebtoken');

const validarRolAdmin = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ mensaje: 'Acceso denegado. Token no proporcionado.' });
  }

  try {
    const decoded = jwt.verify(token, '123456');

    if (decoded.rol !== 'Administrador') {
      return res.status(403).json({ mensaje: 'Acceso no autorizado' });
    }

    req.payload = decoded;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Token no válido' });
  }
};

module.exports = validarRolAdmin;
