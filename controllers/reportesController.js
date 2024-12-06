const pool = require("../db");

exports.getReporteFinanciero = async (req, res) => {
  const { id_usuario, fecha_inicio, fecha_fin } = req.query;

  try {
    // Verificar que se envíen los parámetros necesarios
    if (!id_usuario || !fecha_inicio || !fecha_fin) {
      return res.status(400).json({
        error:
          "Faltan parámetros obligatorios: id_usuario, fecha_inicio o fecha_fin",
      });
    }

    // Obtener el nombre del usuario
    const [usuario] = await pool.query(
      "SELECT nombre FROM Usuario WHERE id_usuario = ?",
      [id_usuario]
    );

    if (usuario.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const nombreUsuario = usuario[0].nombre;

    // Calcular ingresos por alquileres
    const [ingresos] = await pool.query(
      `SELECT COALESCE(SUM(monto), 0) AS total 
       FROM Alquiler 
       WHERE id_propiedad IN (SELECT id_propiedad FROM Propiedad WHERE id_usuario = ?)
       AND fecha_inicio >= ? AND fecha_fin <= ?`,
      [id_usuario, fecha_inicio, fecha_fin]
    );

    const ingresos_alquileres = parseFloat(ingresos[0].total) || 0;

    // Calcular total de gastos
    const [gastos] = await pool.query(
      `SELECT COALESCE(SUM(monto), 0) AS total 
       FROM Gasto 
       WHERE id_propiedad IN (SELECT id_propiedad FROM Propiedad WHERE id_usuario = ?)
       AND fecha >= ? AND fecha <= ?`,
      [id_usuario, fecha_inicio, fecha_fin]
    );

    const total_gastos = parseFloat(gastos[0].total) || 0;

    // Calcular total de impuestos
    const [impuestos] = await pool.query(
      `SELECT COALESCE(SUM(monto), 0) AS total 
       FROM Impuesto 
       WHERE id_propiedad IN (SELECT id_propiedad FROM Propiedad WHERE id_usuario = ?)`,
      [id_usuario]
    );

    const total_impuestos = parseFloat(impuestos[0].total) || 0;

    // Calcular el balance final
    const balance_final =
      ingresos_alquileres - (total_gastos + total_impuestos);

    // Responder con los datos del reporte financiero
    res.json({
      usuario: nombreUsuario,
      ingresos_alquileres: ingresos_alquileres.toFixed(2),
      total_gastos: total_gastos.toFixed(2),
      total_impuestos: total_impuestos.toFixed(2),
      balance_final: balance_final.toFixed(2),
    });
  } catch (error) {
    console.error("Error al generar el reporte financiero:", error);
    res.status(500).json({ error: "Error al generar el reporte financiero" });
  }
};
