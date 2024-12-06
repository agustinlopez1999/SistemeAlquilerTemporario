const express = require("express");
const {
  getPropiedades,
  getPropiedadById,
  createPropiedad,
  updatePropiedad,
  deletePropiedad,
} = require("../controllers/propiedadesController");

const router = express.Router();

// Rutas para propiedades
router.get("/", getPropiedades);
router.get("/:id", getPropiedadById);
router.post("/", createPropiedad);
router.put("/:id", updatePropiedad);
router.delete("/:id", deletePropiedad);

module.exports = router;
