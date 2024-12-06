const pool = require("../db");

exports.getNotificaciones = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM Notificacion");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las notificaciones" });
  }
};

exports.getNotificacionById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      "SELECT * FROM Notificacion WHERE id_notificacion = ?",
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Notificación no encontrada" });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener la notificación" });
  }
};

exports.createNotificacion = async (req, res) => {
  const { fecha_notificacion, descripcion, id_usuario } = req.body;
  try {
    const [result] = await pool.query(
      `INSERT INTO Notificacion (fecha_notificacion, descripcion, id_usuario) VALUES (?, ?, ?)`,
      [fecha_notificacion, descripcion, id_usuario]
    );
    res.status(201).json({
      id: result.insertId,
      fecha_notificacion,
      descripcion,
      id_usuario,
    });
  } catch (error) {
    res.status(500).json({ error: "Error al crear la notificación" });
  }
};

exports.updateNotificacion = async (req, res) => {
  const { id } = req.params;
  const { fecha_notificacion, descripcion } = req.body;
  try {
    const [result] = await pool.query(
      `UPDATE Notificacion SET fecha_notificacion = ?, descripcion = ? WHERE id_notificacion = ?`,
      [fecha_notificacion, descripcion, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Notificación no encontrada" });
    }
    res.json({ message: "Notificación actualizada correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar la notificación" });
  }
};

exports.deleteNotificacion = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query(
      "DELETE FROM Notificacion WHERE id_notificacion = ?",
      [id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Notificación no encontrada" });
    }
    res.json({ message: "Notificación eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar la notificación" });
  }
};
