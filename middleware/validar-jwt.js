const jwt = require('jsonwebtoken');

const validarJWT = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ mensaje: 'Error unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, '123456');
    req.payload = decoded;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ mensaje: 'Error unauthorized' });
  }
};

module.exports = {
  validarJWT,
};
