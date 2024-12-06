const pool = require("../db");

exports.getUsuarios = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM Usuario");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
};

exports.getUsuarioById = async (req, res) => {
  const { id } = req.params; // Extraemos el ID de los parámetros de la URL
  try {
    const [rows] = await pool.query(
      "SELECT * FROM Usuario WHERE id_usuario = ?",
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" }); // Si no encuentra el usuario, retorna un 404
    }
    res.json(rows[0]); // Retorna el usuario encontrado
  } catch (error) {
    console.error("Error al obtener el usuario:", error);
    res.status(500).json({ error: "Error al obtener el usuario" }); // Maneja errores internos del servidor
  }
};

exports.getPropiedadesByUsuario = async (req, res) => {
  const { id } = req.params; // Obtener el ID del usuario desde los parámetros
  try {
    const [rows] = await pool.query(
      "SELECT * FROM Propiedad WHERE id_usuario = ?",
      [id]
    );
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ error: "No se encontraron propiedades para este usuario" });
    }
    res.json(rows); // Enviar todas las propiedades asociadas al usuario
  } catch (error) {
    console.error("Error al obtener las propiedades del usuario:", error);
    res
      .status(500)
      .json({ error: "Error al obtener las propiedades del usuario" });
  }
};

exports.createUsuario = async (req, res) => {
  const { nombre, correo_electronico, contrasena } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO Usuario (nombre, correo_electronico, contrasena) VALUES (?, ?, ?)",
      [nombre, correo_electronico, contrasena]
    );
    res.status(201).json({
      id: result.insertId,
      nombre,
      correo_electronico,
    });
  } catch (error) {
    console.error("Error al agregar el usuario:", error);
    res.status(500).json({ error: "Error al agregar el usuario" });
  }
};

exports.updateUsuario = async (req, res) => {
  const { id } = req.params;
  const { nombre, correo_electronico, contrasena } = req.body;
  try {
    const [result] = await pool.query(
      "UPDATE Usuario SET nombre = ?, correo_electronico = ?, contrasena = ? WHERE id_usuario = ?",
      [nombre, correo_electronico, contrasena, id]
    );
    res.json({ message: "Usuario actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el usuario" });
  }
};

exports.deleteUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM Usuario WHERE id_usuario = ?", [id]);
    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el usuario" });
  }
};
