
function insertarEmpresa(db, data) {
    return new Promise((resolve, reject) => {
        const query = "INSERT INTO empresas (nombre, cif, direccion, telefono, email, tipo_entidad) VALUES (?, ?, ?, ?, ?, ?)";
        // Usar Object.values(data) para obtener los valores del data, que es del json
        const values = Object.values(data);
        db.query(query, values, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve({ message: "Empresa insertada con éxito", insertId: result.insertId });
            }
        });
    });
}

function insertarAlumno(db, data) {
    return new Promise((resolve, reject) => {
        const queryAlumno = "INSERT INTO alumnos (`nombre`, `email`, `telefono`, `dni`, `curso`, `centro`, `tutor_id`) VALUES (?, ?, ?, ?, ?, ?, ?)";
        const valuesAlumno = Object.values(data);
        db.query(queryAlumno, valuesAlumno, (err, result) => {
            if (err) {
                reject(err);
            // CREAMOS EL ALUMNO, SI LA INSERCCION ES EXITOSA CREAMOS UNA NUEVA FILA EN FCT PARA PODER MODIFICARLA POSTERIORMENTE
            } else {
                const alumnoId = result.insertId;
                const queryFct = "INSERT INTO fct (`alumno_id`) VALUES (?)";
                db.query(queryFct, [alumnoId], (errFct, resulFct) => {
                    if (errFct) {
                        reject(errFct);
                    } else {
                        resolve({
                            message: "Alumno insertado con éxito y disponoible para fct",
                            insertId: alumnoId
                        });
                    }
                });
            }
        });
    });
}


  function insertarRepresentante(db, data) {
    return new Promise((resolve, reject) => {
        const query = "INSERT INTO representantes (`nombre`, `dni`, `telefono`, `email`, `cargo_puesto`, `departamento`, `empresa_id`) VALUES (?, ?, ?, ?, ?, ?, ?)";
        const values = Object.values(data);
        db.query(query, values, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve({ message: "Representante insertado con éxito", insertId: result.insertId });
            }
        });
    });
  }

  function obtenerElementoId(db, tabla, consultaCondicion = ''){
    return new Promise((resolve, reject) => {
        let condicion = consultaCondicion;
        const query = `SELECT * FROM ${tabla} ${condicion}`;
        db.query(query, (err, results) => {
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

  function obtenerElementoPorId(db, tabla, id, campo = 'id'){
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM ${tabla} WHERE ${campo} = ?`;
        db.query(query, [id], (err, results) => {
            if (err) {
                reject(err); // Si hay error, rechazamos la promesa
            } else if (results.length === 0) {
                reject({ message: "Datos no encontrados" });
            } else {
                resolve(results[0]); // Si hay datos, los resolvemos
            }
        });
    });
  }


function obtenerDatosListaProfesor(connection, tabla, limite = false) {
  return new Promise((resolve, reject) => {
      const tablasPermitidas = ["alumnos", "empresas", "representantes"]; // Lista blanca de tablas
      if (!tablasPermitidas.includes(tabla)) {
          return reject(new Error("Tabla no permitida"));
      }
      // El limit es PROVISIONAL solo para tener los nuevos insertados al princpio para  probar borrado y editado, sobre todo en el inicisl
      let condicion = limite ? ' ORDER BY id DESC LIMIT 3' : '';
      let query = `SELECT * FROM ${tabla} ${condicion}`;
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
  
function eliminarDatoRolProfesor(db, tabla, id) {
    return new Promise((resolve, reject) => {
        // Lista de tablas permitidas para evitar inyecciones SQL
        const tablasPermitidas = ["alumnos", "empresas","representantes"];
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

// FUNCIONES PARA ACTUALIZAR DATOS DE LOS FORMULARIOS DE MODIFICAR
function actualizarAlumno(db, id, data) {
    return new Promise((resolve, reject) => {
        const query = "UPDATE alumnos SET nombre = ?, email = ?, telefono = ?, dni = ?, curso = ?, centro = ?, tutor_id = ? WHERE id = ?";
        const values = [data.nombre, data.email, data.telefono, data.dni, data.curso, data.centro, data.tutor_id, id];
        db.query(query, values, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

// CONSULTA PARA ACTUALIZAR UNA EMPRESA EN LA BASE DE DATOS
function actualizarEmpresa(db, id, datos) {
    return new Promise((resolve, reject) => {
        const query = `UPDATE empresas SET nombre = ?, cif = ?, direccion = ?, telefono = ?, email = ?, tipo_entidad = ?, estado = ?, representante_id = ? WHERE id = ?`;
        db.query(query, [datos.nombre, datos.cif, datos.direccion, datos.telefono, datos.email, datos.tipo_entidad, datos.estado, datos.representante_id, id], (err, result) => {
            if (err) {
                return reject(err);
            }
            if (result.affectedRows === 0) {
                return reject("No se encontró la empresa para actualizar.");
            }
            resolve();
        });
    });
}

// ACTUALIZA PROFESOR
function actualizarProfesor(db, id, datos) {
    return new Promise((resolve, reject) => {
        const query = `UPDATE profesores SET nombre_usuario = ?, nombre = ?, dni = ?, email = ?, telefono = ?, rol = ?, centro = ? WHERE id = ?`;
        db.query(query, [datos.nombre_usuario, datos.nombre, datos.dni, datos.email, datos.telefono, datos.rol, datos.centro, id], (err, result) => {
            if (err) return reject(err);
            if (result.affectedRows === 0) return reject("No se encontró el profesor para actualizar.");
            resolve();
        });
    });
}

// ACTUALIZA REPRESENTANER
function actualizarRepresentante(db, id, datos) {
    return new Promise((resolve, reject) => {
        const query = `UPDATE representantes 
                       SET nombre = ?, dni = ?, telefono = ?, email = ?, cargo_puesto = ?, departamento = ?, empresa_id = ? 
                       WHERE id = ?`;
        db.query(query, [datos.nombre, datos.dni, datos.telefono, datos.email, datos.cargo_puesto, datos.departamento, datos.empresa_id, id], 
            (err, result) => {
                if (err) return reject(err);
                if (result.affectedRows === 0) return reject("No se encontró el representante para actualizar.");
                resolve();
            }
        );
    });
}

function obtenerDatosEnum(db, tabla, campo) {
    return new Promise((resolve, reject) => {
        const query = `SHOW COLUMNS FROM ${tabla} LIKE '${campo}'`;
        db.query(query, (err, result) => {
            if (err) {
                return reject(err);
            }
            const enumValues = result[0].Type.match(/'([^']+)'/g).map(v => v.replace(/'/g, ""));
            resolve(enumValues);
        });
    });
}

module.exports = { obtenerDatosListaProfesor, eliminarDatoRolProfesor, insertarEmpresa, insertarAlumno, insertarRepresentante, obtenerElementoId, actualizarAlumno, obtenerDatosEnum, obtenerElementoPorId, actualizarEmpresa, actualizarProfesor, actualizarRepresentante};
