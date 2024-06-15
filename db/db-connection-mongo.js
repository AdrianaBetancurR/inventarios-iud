const mongoose = require('mongoose');

const getConnection = async () => {
  try {
    const url = 'mongodb+srv://adriana:16adriana@cluster0.nkialw0.mongodb.net/';

    await mongoose.connect(url);
    
    console.log('Conexión exitosa con MongoDB');
  } catch (error) {
    console.error('Error al conectar con MongoDB:', error);
  }
};

module.exports = { getConnection };
