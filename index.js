const express = require("express");
const cors = require("cors");
const usuariosRoutes = require("./routes/usuarios");
const propiedadesRoutes = require("./routes/propiedades");
const alquileresRoutes = require("./routes/alquileres");
const gastosRoutes = require("./routes/gastos");
const impuestosRoutes = require("./routes/impuestos");
const notificacionesRoutes = require("./routes/notificaciones");
const reportesRoutes = require("./routes/reportes");
const cron = require("node-cron");
const updateAlquilerStatus = require("./jobs/updateAlquilerStatus");
const app = express();

// Middleware para procesar JSON
app.use(express.json());
app.use(cors());

// Rutas
app.use("/usuarios", usuariosRoutes);
app.use("/propiedades", propiedadesRoutes);
app.use("/alquileres", alquileresRoutes);
app.use("/gastos", gastosRoutes);
app.use("/impuestos", impuestosRoutes);
app.use("/notificaciones", notificacionesRoutes);
app.use("/reportes-financieros", reportesRoutes);

// Tareas automatizadas
// Configurar el cron job para ejecutarse cada hora
cron.schedule("*/10 * * * *", () => {
  console.log("Ejecutando actualización de estados de alquiler...");
  updateAlquilerStatus();
});

// Servidor en ejecución
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
