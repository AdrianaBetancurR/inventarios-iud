
const express = require('express');
const { getConnection } = require('./db/db-connection-mongo');
const app = express();
const port = 3000;

// Connect to MongoDB
getConnection();

// Middleware
app.use(express.json());

// Routes
app.use('/auth', require('./router/auth'));
app.use('/usuario', require('./router/usuario'));
app.use('/marca', require('./router/marca'));
app.use('/estadoEquipo', require('./router/estadoEquipo'));
app.use('/tipoEquipo', require('./router/tipoEquipo')); 
app.use('/inventario', require('./router/inventario'));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
