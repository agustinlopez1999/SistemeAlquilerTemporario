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

exports.getPropiedadesByUsuario = async (req, res) => {
  const { id_usuario } = req.params;
  try {
    const [rows] = await pool.query(
      "SELECT * FROM Propiedad WHERE id_usuario = ?",
      [id_usuario]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener propiedades del usuario" });
  }
};

// Actualizar el método de creación para asegurar que el id_usuario sea obligatorio
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

  if (!id_usuario) {
    return res.status(400).json({ error: "El id_usuario es obligatorio" });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO Propiedad 
       (nombre, direccion, descripcion, precio_alquiler_diario, valor_propiedad, cantidad_habitaciones, cantidad_ambientes, cantidad_banos, capacidad_maxima, id_usuario, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
        "activo",
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
    status,
  } = req.body;

  try {
    const [result] = await pool.query(
      `UPDATE Propiedad 
       SET nombre = ?, direccion = ?, descripcion = ?, precio_alquiler_diario = ?, valor_propiedad = ?, cantidad_habitaciones = ?, cantidad_ambientes = ?, cantidad_banos = ?, capacidad_maxima = ?, status = ?
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
        status,
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
  const connection = await pool.getConnection(); // Obtén una conexión transaccional
  try {
    await connection.beginTransaction(); // Inicia la transacción

    // Eliminar primero los alquileres relacionados
    await connection.query("DELETE FROM Alquiler WHERE id_propiedad = ?", [id]);

    // Luego eliminar la propiedad
    const [result] = await connection.query(
      "DELETE FROM Propiedad WHERE id_propiedad = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      await connection.rollback(); // Revertir si no se encuentra la propiedad
      return res.status(404).json({ error: "Propiedad no encontrada" });
    }

    await connection.commit(); // Confirma la transacción
    res.json({ message: "Propiedad eliminada correctamente" });
  } catch (error) {
    await connection.rollback(); // Revertir en caso de error
    res.status(500).json({ error: "Error al eliminar la propiedad" });
  } finally {
    connection.release(); // Libera la conexión
  }
};
