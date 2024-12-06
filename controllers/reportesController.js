const pool = require("../db");

exports.getReportesFinancieros = async (req, res) => {
  const { id_usuario, fecha_inicio, fecha_fin } = req.query;

  if (!id_usuario) {
    return res.status(400).json({
      error: "Faltan parámetros obligatorios: id_usuario",
    });
  }

  try {
    // Verificar si el usuario existe
    const [usuarioRows] = await pool.query(
      "SELECT nombre FROM Usuario WHERE id_usuario = ?",
      [id_usuario]
    );

    if (usuarioRows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const usuario = usuarioRows[0].nombre;

    // Consultas base
    let ingresosQuery = `
      SELECT SUM(a.monto) AS ingresos_alquileres
      FROM Alquiler a
      JOIN Propiedad p ON a.id_propiedad = p.id_propiedad
      WHERE p.id_usuario = ?
    `;

    let gastosQuery = `
      SELECT SUM(g.monto) AS total_gastos
      FROM Gasto g
      JOIN Propiedad p ON g.id_propiedad = p.id_propiedad
      WHERE p.id_usuario = ?
    `;

    let impuestosQuery = `
      SELECT SUM(i.monto) AS total_impuestos
      FROM Impuesto i
      JOIN Propiedad p ON i.id_propiedad = p.id_propiedad
      WHERE p.id_usuario = ?
    `;

    const params = [id_usuario];

    // Agregar filtros de fecha si se proporcionan
    if (fecha_inicio && fecha_fin) {
      ingresosQuery += " AND a.fecha_inicio >= ? AND a.fecha_fin <= ?";
      gastosQuery += " AND g.fecha BETWEEN ? AND ?";
      impuestosQuery += " AND i.frecuencia_pago BETWEEN ? AND ?";

      params.push(fecha_inicio, fecha_fin);
    }

    // Ejecutar consultas
    const [[ingresosRow]] = await pool.query(ingresosQuery, params);
    const [[gastosRow]] = await pool.query(gastosQuery, params);
    const [[impuestosRow]] = await pool.query(impuestosQuery, params);

    // Extraer datos y manejar valores null
    const ingresos_alquileres = ingresosRow.ingresos_alquileres || 0;
    const total_gastos = gastosRow.total_gastos || 0;
    const total_impuestos = impuestosRow.total_impuestos || 0;

    // Calcular el balance final
    const balance_final = (
      parseFloat(ingresos_alquileres) -
      parseFloat(total_gastos) -
      parseFloat(total_impuestos)
    ).toFixed(2);

    // Enviar la respuesta
    res.json({
      usuario,
      ingresos_alquileres: parseFloat(ingresos_alquileres).toFixed(2),
      total_gastos: parseFloat(total_gastos).toFixed(2),
      total_impuestos: parseFloat(total_impuestos).toFixed(2),
      balance_final,
    });
  } catch (error) {
    console.error("Error al generar el reporte financiero:", error);
    res.status(500).json({ error: "Error al generar el reporte financiero" });
  }
};
