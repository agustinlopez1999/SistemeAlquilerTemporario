const express = require("express");
const {
  getGastos,
  getGastosByPropiedad,
  createGasto,
  updateGasto,
  deleteGasto,
} = require("../controllers/gastosController");

const router = express.Router();

// Rutas para gastos
router.get("/", getGastos); // Obtener todos los gastos
router.get("/:id_propiedad", getGastosByPropiedad); // Obtener gastos por propiedad
router.post("/", createGasto); // Crear un nuevo gasto
router.put("/:id", updateGasto); // Actualizar un gasto existente
router.delete("/:id", deleteGasto); // Eliminar un gasto existente

module.exports = router;
