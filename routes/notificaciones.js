const express = require("express");
const {
  getNotificaciones,
  getNotificacionById,
  createNotificacion,
  updateNotificacion,
  deleteNotificacion,
} = require("../controllers/notificacionesController");

const router = express.Router();

// Rutas para notificaciones
router.get("/", getNotificaciones); // Obtener todas las notificaciones
router.get("/:id", getNotificacionById); // Obtener una notificación por ID
router.post("/", createNotificacion); // Crear una nueva notificación
router.put("/:id", updateNotificacion); // Actualizar una notificación existente
router.delete("/:id", deleteNotificacion); // Eliminar una notificación

module.exports = router;
