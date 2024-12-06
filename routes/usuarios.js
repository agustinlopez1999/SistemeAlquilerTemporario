const express = require("express");
const {
  getUsuarios,
  createUsuario,
  updateUsuario,
  deleteUsuario,
  getUsuarioById,
  getPropiedadesByUsuario,
} = require("../controllers/usuariosController");

const router = express.Router();

// Rutas para usuarios
router.get("/", getUsuarios);
router.get("/:id", getUsuarioById);
router.get("/:id/propiedades", getPropiedadesByUsuario);
router.post("/", createUsuario);
router.put("/:id", updateUsuario);
router.delete("/:id", deleteUsuario);

module.exports = router;
