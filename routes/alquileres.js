const express = require("express");
const {
  getAlquileres,
  getAlquileresByPropiedad,
  createAlquiler,
  updateAlquiler,
  deleteAlquiler,
  getAlquileresByUsuario,
} = require("../controllers/alquileresController");

const router = express.Router();

// Rutas para alquileres
router.get("/", getAlquileres); // Obtener todos los alquileres
router.get("/:id_propiedad", getAlquileresByPropiedad); // Filtrar alquileres por propiedad
router.post("/", createAlquiler); // Crear un nuevo alquiler
router.put("/:id", updateAlquiler);
router.delete("/:id", deleteAlquiler);
router.get("/usuario/:id_usuario", getAlquileresByUsuario); // Filtrar alquileres por usuario

module.exports = router;
