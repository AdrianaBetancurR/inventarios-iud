const jwt = require('jsonwebtoken');

// Function to generate a JWT
const generarJWT = (usuario) => {
  const payload = {
    id: usuario._id,
    nombre: usuario.nombre,
    email: usuario.email,
    rol: usuario.rol
  };

  try {
    const token = jwt.sign(payload, '123456', { expiresIn: '1h' });
    return token;
  } catch (error) {
    console.error('Error al generar el token:', error);
    return null;
  }
};

module.exports = generarJWT;
