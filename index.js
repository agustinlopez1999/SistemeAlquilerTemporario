const express = require("express");
const usuariosRoutes = require("./routes/usuarios");
const propiedadesRoutes = require("./routes/propiedades");
const alquileresRoutes = require("./routes/alquileres");
const gastosRoutes = require("./routes/gastos");
const impuestosRoutes = require("./routes/impuestos");
const notificacionesRoutes = require("./routes/notificaciones");
const reportesRoutes = require("./routes/reportes");
const pool = require("./db");

const app = express();

// Middleware para procesar JSON
app.use(express.json());

// Rutas
app.use("/usuarios", usuariosRoutes);
app.use("/propiedades", propiedadesRoutes);
app.use("/alquileres", alquileresRoutes);
app.use("/gastos", gastosRoutes);
app.use("/impuestos", impuestosRoutes);
app.use("/notificaciones", notificacionesRoutes);
app.use("/reportes-financieros", reportesRoutes);

// Servidor en ejecución
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
