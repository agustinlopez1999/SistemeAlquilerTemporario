const pool = require("../db");

// Obtener todos los gastos
exports.getGastos = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM Gasto");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los gastos" });
  }
};

// Obtener los gastos de una propiedad específica
exports.getGastosByPropiedad = async (req, res) => {
  const { id_propiedad } = req.params;
  try {
    const [rows] = await pool.query(
      "SELECT * FROM Gasto WHERE id_propiedad = ?",
      [id_propiedad]
    );
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ error: "No se encontraron gastos para esta propiedad" });
    }
    res.json(rows);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al obtener los gastos de la propiedad" });
  }
};

// Crear un nuevo gasto
exports.createGasto = async (req, res) => {
  const { fecha, descripcion, monto, id_propiedad } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO Gasto (fecha, descripcion, monto, id_propiedad) VALUES (?, ?, ?, ?)",
      [fecha, descripcion, monto, id_propiedad]
    );
    res.status(201).json({
      id: result.insertId,
      fecha,
      descripcion,
      monto,
      id_propiedad,
    });
  } catch (error) {
    res.status(500).json({ error: "Error al crear el gasto" });
  }
};

// Actualizar un gasto existente
exports.updateGasto = async (req, res) => {
  const { id } = req.params;
  const { fecha, descripcion, monto } = req.body;
  try {
    const [result] = await pool.query(
      "UPDATE Gasto SET fecha = ?, descripcion = ?, monto = ? WHERE id_gasto = ?",
      [fecha, descripcion, monto, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Gasto no encontrado" });
    }

    res.json({ message: "Gasto actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el gasto" });
  }
};

// Eliminar un gasto
exports.deleteGasto = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query("DELETE FROM Gasto WHERE id_gasto = ?", [
      id,
    ]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Gasto no encontrado" });
    }
    res.json({ message: "Gasto eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el gasto" });
  }
};
