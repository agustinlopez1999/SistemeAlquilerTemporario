const pool = require("../db");

exports.getReportesFinancieros = async (req, res) => {
  const { id_usuario, fecha_inicio, fecha_fin } = req.query;

  if (!id_usuario) {
    return res.status(400).json({
      error: "El parámetro id_usuario es obligatorio",
    });
  }

  try {
    let query = `
        SELECT u.nombre AS usuario,
               COALESCE(SUM(a.monto), 0) AS ingresos_alquileres,
               COALESCE(SUM(g.monto), 0) AS total_gastos,
               COALESCE(SUM(i.monto), 0) AS total_impuestos
        FROM Usuario u
        LEFT JOIN Propiedad p ON u.id_usuario = p.id_usuario
        LEFT JOIN Alquiler a ON p.id_propiedad = a.id_propiedad
        LEFT JOIN Gasto g ON p.id_propiedad = g.id_propiedad
        LEFT JOIN Impuesto i ON p.id_propiedad = i.id_propiedad
        WHERE u.id_usuario = ?
      `;

    const params = [id_usuario];

    if (fecha_inicio && fecha_fin) {
      query += `
          AND ((a.fecha_inicio BETWEEN ? AND ?) OR (a.fecha_fin BETWEEN ? AND ?))
          AND (g.fecha BETWEEN ? AND ?)
          AND (i.fecha_pago BETWEEN ? AND ?)
        `;
      params.push(
        fecha_inicio,
        fecha_fin,
        fecha_inicio,
        fecha_fin,
        fecha_inicio,
        fecha_fin,
        fecha_inicio,
        fecha_fin
      );
    }

    query += ` GROUP BY u.id_usuario`;

    const [rows] = await pool.query(query, params);

    if (rows.length === 0) {
      return res.status(404).json({
        error: "No se encontraron reportes financieros para este usuario",
      });
    }

    const reporte = rows[0];
    const balance_final =
      Number(reporte.ingresos_alquileres) -
      Number(reporte.total_gastos) -
      Number(reporte.total_impuestos);

    res.json({
      usuario: reporte.usuario,
      ingresos_alquileres: Number(reporte.ingresos_alquileres).toFixed(2),
      total_gastos: Number(reporte.total_gastos).toFixed(2),
      total_impuestos: Number(reporte.total_impuestos).toFixed(2),
      balance_final: Number(balance_final).toFixed(2),
    });
  } catch (error) {
    console.error("Error al generar el reporte financiero:", error);
    res.status(500).json({ error: "Error al generar el reporte financiero" });
  }
};
