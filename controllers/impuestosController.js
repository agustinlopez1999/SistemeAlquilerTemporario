const pool = require("../db");

// Obtener todos los impuestos
exports.getImpuestos = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM Impuesto");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los impuestos" });
  }
};

// Obtener impuestos por propiedad
exports.getImpuestosByPropiedad = async (req, res) => {
  const { id_propiedad } = req.params;
  try {
    const [rows] = await pool.query(
      "SELECT * FROM Impuesto WHERE id_propiedad = ?",
      [id_propiedad]
    );
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ error: "No se encontraron impuestos para esta propiedad" });
    }
    res.json(rows);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al obtener los impuestos de la propiedad" });
  }
};

// Crear un nuevo impuesto
exports.createImpuesto = async (req, res) => {
  const { nombre_impuesto, frecuencia_pago, monto, id_propiedad } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO Impuesto (nombre_impuesto, frecuencia_pago, monto, id_propiedad) VALUES (?, ?, ?, ?)",
      [nombre_impuesto, frecuencia_pago, monto, id_propiedad]
    );
    res.status(201).json({
      id: result.insertId,
      nombre_impuesto,
      frecuencia_pago,
      monto,
      id_propiedad,
    });
  } catch (error) {
    res.status(500).json({ error: "Error al crear el impuesto" });
  }
};

// Actualizar un impuesto existente
exports.updateImpuesto = async (req, res) => {
  const { id } = req.params;
  const { nombre_impuesto, frecuencia_pago, monto } = req.body;
  try {
    const [result] = await pool.query(
      "UPDATE Impuesto SET nombre_impuesto = ?, frecuencia_pago = ?, monto = ? WHERE id_impuesto = ?",
      [nombre_impuesto, frecuencia_pago, monto, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Impuesto no encontrado" });
    }

    res.json({ message: "Impuesto actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el impuesto" });
  }
};

// Eliminar un impuesto
exports.deleteImpuesto = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query(
      "DELETE FROM Impuesto WHERE id_impuesto = ?",
      [id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Impuesto no encontrado" });
    }
    res.json({ message: "Impuesto eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el impuesto" });
  }
};
