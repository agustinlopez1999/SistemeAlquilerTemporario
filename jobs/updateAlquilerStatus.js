const pool = require("../db");

const updateAlquilerStatus = async () => {
  try {
    // Actualizar a 'confirmado' si estamos dentro del rango de fechas
    const [result] = await pool.query(
      `UPDATE Alquiler
       SET status = 'confirmado'
       WHERE NOW() BETWEEN fecha_inicio AND fecha_fin
       AND status = 'pendiente';`
    );

    console.log(`Estados actualizados: ${result.affectedRows} alquileres.`);
  } catch (error) {
    console.error("Error al actualizar los estados de alquiler:", error);
  }
};

module.exports = updateAlquilerStatus;
