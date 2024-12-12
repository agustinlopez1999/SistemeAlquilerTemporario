const pool = require("../db");

exports.createAlquiler = async (req, res) => {
  const { fecha_inicio, fecha_fin, monto, id_propiedad } = req.body;

  try {
    // Verificar que la propiedad exista
    const [propiedad] = await pool.query(
      "SELECT * FROM Propiedad WHERE id_propiedad = ?",
      [id_propiedad]
    );

    if (propiedad.length === 0) {
      return res.status(404).json({ error: "La propiedad no existe" });
    }

    // Verificar disponibilidad de fechas
    const [conflictos] = await pool.query(
      `SELECT * FROM Alquiler 
         WHERE id_propiedad = ? 
         AND (
           (fecha_inicio <= ? AND fecha_fin >= ?) OR 
           (fecha_inicio <= ? AND fecha_fin >= ?) OR 
           (fecha_inicio >= ? AND fecha_fin <= ?)
         )`,
      [
        id_propiedad,
        fecha_inicio,
        fecha_inicio,
        fecha_fin,
        fecha_fin,
        fecha_inicio,
        fecha_fin,
      ]
    );

    if (conflictos.length > 0) {
      return res.status(409).json({
        error: "Las fechas ingresadas se solapan con un alquiler existente",
      });
    }

    // Insertar el nuevo alquiler
    const [result] = await pool.query(
      "INSERT INTO Alquiler (fecha_inicio, fecha_fin, monto, id_propiedad, status) VALUES (?, ?, ?, ?, ?)",
      [fecha_inicio, fecha_fin, monto, id_propiedad, "pendiente"]
    );

    // Retornar la respuesta con los datos del alquiler creado
    res.status(201).json({
      id_alquiler: result.insertId,
      fecha_inicio,
      fecha_fin,
      monto,
      id_propiedad,
    });
  } catch (error) {
    console.error("Error al crear el alquiler:", error);
    res.status(500).json({ error: "Error al crear el alquiler" });
  }
};

// Obtener todos los alquileres registrados
exports.getAlquileres = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM Alquiler");
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener los alquileres:", error);
    res.status(500).json({ error: "Error al obtener los alquileres" });
  }
};

// Filtrar alquileres por una propiedad específica
exports.getAlquileresByPropiedad = async (req, res) => {
  const { id_propiedad } = req.params;
  try {
    const [rows] = await pool.query(
      "SELECT * FROM Alquiler WHERE id_propiedad = ?",
      [id_propiedad]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        error: `No hay alquileres registrados para la propiedad con ID ${id_propiedad}`,
      });
    }

    res.json(rows);
  } catch (error) {
    console.error("Error al obtener los alquileres por propiedad:", error);
    res
      .status(500)
      .json({ error: "Error al obtener los alquileres por propiedad" });
  }
};

//Actualizar alquileres
exports.updateAlquiler = async (req, res) => {
  const { id } = req.params;
  const { fecha_inicio, fecha_fin, monto, id_propiedad, status } = req.body;

  try {
    // Validar que no haya solapamientos de fechas
    const [overlappingAlquileres] = await pool.query(
      `SELECT * FROM Alquiler 
       WHERE id_propiedad = ? AND id_alquiler != ? 
       AND ((fecha_inicio BETWEEN ? AND ?) OR (fecha_fin BETWEEN ? AND ?))`,
      [id_propiedad, id, fecha_inicio, fecha_fin, fecha_inicio, fecha_fin]
    );

    if (overlappingAlquileres.length > 0) {
      return res.status(400).json({
        error: "Las fechas ingresadas se solapan con un alquiler existente",
      });
    }

    // Actualizar el alquiler
    const [result] = await pool.query(
      `UPDATE Alquiler 
       SET fecha_inicio = ?, fecha_fin = ?, monto = ?, id_propiedad = ?, status = ?
       WHERE id_alquiler = ?`,
      [fecha_inicio, fecha_fin, monto, id_propiedad, status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Alquiler no encontrado" });
    }

    res.json({ message: "Alquiler actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar el alquiler:", error);
    res.status(500).json({ error: "Error al actualizar el alquiler" });
  }
};

//Eliminar Alquiler
exports.deleteAlquiler = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query(
      "DELETE FROM Alquiler WHERE id_alquiler = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Alquiler no encontrado" });
    }

    res.json({ message: "Alquiler eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar el alquiler:", error);
    res.status(500).json({ error: "Error al eliminar el alquiler" });
  }
};

//Obtener alquileres por usuario
exports.getAlquileresByUsuario = async (req, res) => {
  const { id_usuario } = req.params;
  try {
    const [rows] = await pool.query(
      `SELECT a.id_alquiler, a.fecha_inicio, a.fecha_fin, a.monto, a.status, 
              p.nombre AS propiedad 
       FROM Alquiler a
       JOIN Propiedad p ON a.id_propiedad = p.id_propiedad
       WHERE p.id_usuario = ?`,
      [id_usuario]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        error: `No hay alquileres registrados para el usuario con ID ${id_usuario}`,
      });
    }

    res.json(rows);
  } catch (error) {
    console.error("Error al obtener los alquileres por usuario:", error);
    res
      .status(500)
      .json({ error: "Error al obtener los alquileres por usuario" });
  }
};
