const express = require("express");
const {
  getImpuestos,
  getImpuestosByPropiedad,
  createImpuesto,
  updateImpuesto,
  deleteImpuesto,
} = require("../controllers/impuestosController");

const router = express.Router();

// Rutas para impuestos
router.get("/", getImpuestos); // Obtener todos los impuestos
router.get("/:id_propiedad", getImpuestosByPropiedad); // Obtener impuestos por propiedad
router.post("/", createImpuesto); // Crear un nuevo impuesto
router.put("/:id", updateImpuesto); // Actualizar un impuesto existente
router.delete("/:id", deleteImpuesto); // Eliminar un impuesto existente

module.exports = router;
