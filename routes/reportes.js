const express = require("express");
const { getReporteFinanciero } = require("../controllers/reportesController"); // Asegúrate de que esta ruta sea correcta

const router = express.Router();

// Ruta para generar reportes financieros
router.get("/", getReporteFinanciero);

module.exports = router;
