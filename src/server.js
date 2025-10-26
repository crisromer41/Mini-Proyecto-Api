const app = require('./app'); // Si app.js está en la misma carpeta
const port = 3000;

// Inicia el servidor y guarda la instancia
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Exporta la instancia para que Jest pueda cerrarla
module.exports = server;