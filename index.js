const express = require("express");
const usuariosRoutes = require("./routes/usuarios");
const propiedadesRoutes = require("./routes/propiedades");
const alquileresRoutes = require("./routes/alquileres");
const pool = require("./db");

const app = express();

// Middleware para procesar JSON
app.use(express.json());

// Rutas
app.use("/usuarios", usuariosRoutes);
app.use("/propiedades", propiedadesRoutes);
app.use("/alquileres", alquileresRoutes);

// Servidor en ejecución
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
