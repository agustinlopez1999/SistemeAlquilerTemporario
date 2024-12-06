const express = require("express");
const { getReportesFinancieros } = require("../controllers/reportesController");

const router = express.Router();

// Ruta para obtener reportes financieros
router.get("/", getReportesFinancieros);

module.exports = router;
