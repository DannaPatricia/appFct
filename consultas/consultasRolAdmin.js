
  function insertarProfesor(db, data) {
    return new Promise((resolve, reject) => {
        const query = "INSERT INTO profesores(`nombre_usuario`, `clave`, `nombre`, `dni`, `email`, `telefono`, `rol`, `centro`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        const values = Object.values(data);
        db.query(query, values, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve({ message: "Profesor insertado con éxito", insertId: result.insertId });
            }
        });
    });
  }

function obtenerDatosListaAdmin(connection, tabla) {
  return new Promise((resolve, reject) => {
      // El limit es PROVISIONAL solo para tener los nuevos insertados al princpio para  probar borrado y editado, sobre todo en el inicisl
      let query = `SELECT * FROM ${tabla} WHERE rol <> "admin"`;
      connection.query(query, (err, results) => {
          if (err) {
              reject(err); // Si hay error, rechazamos la promesa
          } else if (results.length === 0) {
              reject({ message: "Datos no encontrados" });
          } else {
              resolve(results); // Si hay datos, los resolvemos
          }
      });
  });
}
function eliminarDatoRolAdmin(db, tabla, id) {
    return new Promise((resolve, reject) => {
        // Lista de tablas permitidas para evitar inyecciones SQL
        const tablasPermitidas = ["profesores"];
        // Verificar si la tabla NO está en la lista permitida
        if (!tablasPermitidas.includes(tabla)) {
            return reject(new Error(`❌ Tabla no permitida: ${tabla}`));
        }
        // Si la tabla es válida, proceder con la eliminación
        const query = `DELETE FROM ?? WHERE id = ?`; // Usar ?? para proteger la tabla
        db.query(query, [tabla, id], (err, result) => {
            if (err) {
                reject(err); // Si hay error, rechazar la promesa
            } else {
                resolve(result); // Resolución exitosa si se elimina el registro
            }
        });
    });
}
  

module.exports = { obtenerDatosListaAdmin, insertarProfesor, eliminarDatoRolAdmin};
