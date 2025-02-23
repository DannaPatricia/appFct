function obtenerEstados(db, tabla) {
    return new Promise((resolve, reject) => {
        const query = `SHOW COLUMNS FROM ${tabla} LIKE 'estado'`;
        db.query(query, (err, result) => {
            if (err) {
                return reject(err);
            }
            const enumValues = result[0].Type.match(/'([^']+)'/g).map(v => v.replace(/'/g, ""));
            resolve(enumValues);
        });
    });
}

function obtenerEstadoSeleccionado(db, tabla, id) {
    return new Promise((resolve, reject) => {
        const query = `SELECT estado FROM ${tabla} WHERE id = ?`;
        db.query(query, [id], (err, result) => {
            if (err) {
                return reject(err);
            }
            if (result.length === 0) {
                return reject("No se encontró el registro");
            }
            resolve(result[0].estado);
        });
    });

}

function cambiarEstado(db, tabla, id, nuevoEstado) {
    return new Promise((resolve, reject) => {
        const query = `UPDATE ${tabla} SET estado = ? WHERE id = ?`;
        db.query(query, [nuevoEstado, id], (err, result) => {
            if (err) {
                console.error("Error al actualizar el estado:", err);
                return reject({ success: false, message: "Error al actualizar el estado", error: err });
            }
            if (result.affectedRows === 0) {
                return reject({ success: false, message: "Registro no encontrado" });
            }
            resolve({ success: true, message: "✅ Estado actualizado con éxito" });
        });
    });
}

function obtenerDatosListaTutor(connection, tabla) {
    return new Promise((resolve, reject) => {
        const tablasPermitidas = ["seguimiento"];
        if (!tablasPermitidas.includes(tabla)) {
            return reject(new Error("Tabla no permitida"));
        }
        let query = `SELECT * FROM ${tabla} ORDER BY fecha DESC`; // Ordenar por fecha descendente
        connection.query(query, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results.length ? results : []); // Devolver array vacío en lugar de error
            }
        });
    });
}

function obtenerListaAlumnos(connection) {
    return new Promise((resolve, reject) => {
        let query = `SELECT * FROM alumnos ORDER BY id DESC`;
        connection.query(query, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results.length ? results : []); // Devolver array vacío en lugar de error
            }
        });
    });
}

function eliminarDatoRolTutor(db, tabla, id) {
    return new Promise((resolve, reject) => {
        // Lista de tablas permitidas para evitar inyecciones SQL
        const tablasPermitidas = ["seguimiento"];
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

function insertarSeguimiento(db, empresa_id, tipo, detalle, prox_paso, fecha_prox_paso, observaciones) {
    return new Promise((resolve, reject) => {
        const query = `INSERT INTO seguimiento (empresa_id, tipo, detalle, prox_paso, fecha_prox_paso, observaciones) VALUES (?, ?, ?, ?, ?, ?)`;
        db.query(query, [empresa_id, tipo, detalle, prox_paso, fecha_prox_paso, observaciones], (err, result) => {
            if (err) {
                reject(err); // Si hay error, rechazar la promesa
            } else {
                resolve(result); // Resolución exitosa si se elimina el registro
            }
        });
    });
}


// FUNCION PARA ACTUALIZAR LA FCT
function actualizarFct(db, id, data){
    return new Promise((resolve, reject) => {
        const query = "UPDATE fct SET empresa_id = ?, fecha_inicio = ?, fecha_fin = ?, horario = ?, num_horas = ?, modalidad = ? WHERE alumno_id = ?";
        const values = [data.empresa_id, data.fecha_inicio, data.fecha_fin, data.horario, data.num_horas, data.modalidad, data.alumno_id, id];
        db.query(query, values, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

function actualizarConvenio(db, id, data){
    return new Promise((resolve, reject) => {
        const query = "UPDATE fct SET representante_id = ?, persona_contacto = ?, email_contacto = ?, telefono_contacto = ?, firma = ? WHERE alumno_id = ?";
        const values = [data.representante_id, data.persona_contacto, data.email_contacto, data.telefono_contacto, data.firma, id];
        db.query(query, values, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

function actualizarRelacionAlumno(db, id, data){
    return new Promise((resolve, reject) => {
        const query = "UPDATE fct SET localizacion = ? WHERE alumno_id = ?";
        const values = [data.lugar_practicas, id];
        db.query(query, values, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

function actualizarProgramaHorario(db, id, data){
    return new Promise((resolve, reject) => {
        const query = "UPDATE fct SET fecha_entrega_firmas = ?, lugar_firma = ? WHERE alumno_id = ?";
        const values = [data.fecha_entrega_firmas, data.lugar_firma,  id];
        db.query(query, values, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}


module.exports = { obtenerEstados, obtenerEstadoSeleccionado, cambiarEstado, obtenerDatosListaTutor, eliminarDatoRolTutor, insertarSeguimiento, obtenerListaAlumnos, actualizarFct, actualizarConvenio, actualizarRelacionAlumno, actualizarProgramaHorario };
