const pool = require("../db");

exports.getPropiedades = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM Propiedad");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener propiedades" });
  }
};

exports.getPropiedadById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      "SELECT * FROM Propiedad WHERE id_propiedad = ?",
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Propiedad no encontrada" });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener la propiedad" });
  }
};

exports.createPropiedad = async (req, res) => {
  const {
    nombre,
    direccion,
    descripcion,
    precio_alquiler_diario,
    valor_propiedad,
    cantidad_habitaciones,
    cantidad_ambientes,
    cantidad_banos,
    capacidad_maxima,
    id_usuario,
  } = req.body;

  try {
    const [result] = await pool.query(
      `INSERT INTO Propiedad 
       (nombre, direccion, descripcion, precio_alquiler_diario, valor_propiedad, cantidad_habitaciones, cantidad_ambientes, cantidad_banos, capacidad_maxima, id_usuario) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nombre,
        direccion,
        descripcion,
        precio_alquiler_diario,
        valor_propiedad,
        cantidad_habitaciones,
        cantidad_ambientes,
        cantidad_banos,
        capacidad_maxima,
        id_usuario,
      ]
    );

    res.status(201).json({
      id: result.insertId,
      nombre,
      direccion,
      descripcion,
    });
  } catch (error) {
    res.status(500).json({ error: "Error al agregar la propiedad" });
  }
};

exports.updatePropiedad = async (req, res) => {
  const { id } = req.params;
  const {
    nombre,
    direccion,
    descripcion,
    precio_alquiler_diario,
    valor_propiedad,
    cantidad_habitaciones,
    cantidad_ambientes,
    cantidad_banos,
    capacidad_maxima,
  } = req.body;

  try {
    const [result] = await pool.query(
      `UPDATE Propiedad 
       SET nombre = ?, direccion = ?, descripcion = ?, precio_alquiler_diario = ?, valor_propiedad = ?, cantidad_habitaciones = ?, cantidad_ambientes = ?, cantidad_banos = ?, capacidad_maxima = ?
       WHERE id_propiedad = ?`,
      [
        nombre,
        direccion,
        descripcion,
        precio_alquiler_diario,
        valor_propiedad,
        cantidad_habitaciones,
        cantidad_ambientes,
        cantidad_banos,
        capacidad_maxima,
        id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Propiedad no encontrada" });
    }

    res.json({ message: "Propiedad actualizada correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar la propiedad" });
  }
};

exports.deletePropiedad = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query(
      "DELETE FROM Propiedad WHERE id_propiedad = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Propiedad no encontrada" });
    }

    res.json({ message: "Propiedad eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar la propiedad" });
  }
};
