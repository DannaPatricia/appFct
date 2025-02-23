const express = require('express');
const session = require('express-session');
const path = require('path');
const mysql = require("mysql2");
const app = express();
const PORT = process.env.PORT || 3000;
const {generaHeader, generaFooter} = require('./headerFooter');
const {generaFormularioLogin} = require('./login');
const { obtenerDatosListaProfesor, eliminarDatoRolProfesor, insertarEmpresa, insertarAlumno, insertarRepresentante, obtenerElementoId, actualizarAlumno, actualizarEmpresa, actualizarProfesor, actualizarRepresentante, obtenerDatosEnum, obtenerElementoPorId } = require("./consultas/consultasRolProfesor");
const {obtenerDatosListaAdmin, eliminarDatoRolAdmin, insertarProfesor} = require("./consultas/consultasRolAdmin");
const {obtenerEstados, obtenerEstadoSeleccionado, cambiarEstado, obtenerDatosListaTutor, eliminarDatoRolTutor, insertarSeguimiento, obtenerListaAlumnos, actualizarFct, actualizarConvenio, actualizarRelacionAlumno, actualizarProgramaHorario} = require("./consultas/consultasRolTutor");


// Configurar la conexión a MySQL
const db = mysql.createConnection({
    host: "localhost", // Cambia esto si usas un servidor remoto
    user: "root", // Tu usuario de MySQL
    password: "root", // Tu contraseña de MySQL
    database: "gestionfct" // Nombre de la base de datos
});

// Configuración de la sesión
app.use(session({
    secret: 'tu-secreto',
    resave: false,
    saveUninitialized: true,
}));

app.use(express.urlencoded({ extended: true })); // Para manejar formularios

app.use(express.json());
// Servir archivos estáticos desde la carpeta "htdocs"
app.use(express.static(path.join(__dirname, "public")));

// FUNCIONES PARA MANEJAR EL INDEX Y SI NO HAY SESION ME REDIRIGE AL LOGIN
app.get('/', (req, res) =>{
    if(!req.session.nombre_usuario){
        res.redirect('/login');
    }
    if(req.session.rol === 'profesor'){
        res.redirect('/profesorDashboard/menuProfesor.html');  // Redirige al menu de profesor
    }else if(req.session.rol === 'tutor'){
        res.redirect('/tutorDashboard/menuTutor.html');  // Redirige al menu de tutor
    }else if(req.session.rol === 'admin'){
        res.redirect('/adminDashboard/menuAdmin.html');  // Redirige al menu de administrador
    }
});

app.get('/login', (req, res) =>{
    let html = generaHtml(generaFormularioLogin(), '');
    res.send(html);
});

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Error al cerrar sesión:", err);
            return res.status(500).send("Error al cerrar sesión.");
        }
        res.redirect('/login'); // Redirigir al login después de cerrar sesión
    });
});

app.post('/procesarLogin', (req, res) =>{
    const { nombre_usuario, clave } = req.body;
    // Llama a la función de validación de usuario
    db.query('SELECT * FROM profesores WHERE nombre_usuario = ? AND clave = ?', [nombre_usuario, clave], (err, results) => {
        if (err) {
            console.error("Error al realizar la consulta:", err);
            return res.json({ mensaje: 'Error en la base de datos' });
        }
        if (results.length > 0) {
            const user = results[0];
            // Guardar cosas de sesion (Ver para enviar el php si es posible tomar en cuenta que al momento de cerrar secion llamar a el php)
            req.session.nombre_usuario = user.nombre_usuario;
            req.session.rol = user.rol;
            req.session.mensaje = '';
            return res.json({ mensaje: 'Inicio de sesión exitoso.' });
        } else {
            return res.json({ mensaje: 'Nombre completo o contraseña incorrectos' });
        }
    });
});


// ESTO OBTIENE LOS DATOS DE LA SESION Y LOS PASA AL HTML PARA PINTAR EL NOMBRE EN EL NAV
// Ruta para obtener los datos de la sesión
app.get('/datosSesion', (req, res) => {
    if (req.session.nombre_usuario) {
        // Si hay sesión activa, devolver los datos de usuario y rol
        res.json({
            nombre_usuario: req.session.nombre_usuario,
            rol: req.session.rol
        });
    } else {
        // Si no hay sesión activa
        res.status(401).json({ message: 'No hay sesión activa' });
    }
});

app.get('/datosRolProfesorLimit/:tabla', (req, res)=>{
    const tablaSeleccionada = req.params.tabla;
    obtenerDatosListaProfesor(db, tablaSeleccionada, true)
    .then(datos => {
      res.json(datos);  // Enviar los alumnos al cliente en formato JSON
    })
    .catch(err => {
      res.status(500).json({ message: "Error al obtener los datos", error: err });
    });
});

// FUNCION PARA RECUPERAR DATOS PERO MUESTRA TODOS PARA LOS DIFERENTES ARCHIVOS HTML: ALUMNOS, EMPRESAS, REPRESENTANTES
app.get('/datosRolProfesor/:tabla', (req, res)=>{
    const tablaSeleccionada = req.params.tabla;
    obtenerDatosListaProfesor(db, tablaSeleccionada)
    .then(datos => {
      res.json(datos);  // Enviar los alumnos al cliente en formato JSON
    })
    .catch(err => {
      res.status(500).json({ message: "Error al obtener los datos", error: err });
    });
});

app.get('/datosRolAdmin/:tabla', (req, res)=>{
    const tablaSeleccionada = req.params.tabla;
    obtenerDatosListaAdmin(db, tablaSeleccionada)
    .then(datos => {res.json(datos)})
    .catch(err => {
      res.status(500).json({ message: "Error al obtener los datos", error: err });
    });
});

// FUNCRIONES PARA RECUPERAR DATOS EN EL TUTOR
app.get('/datosRolTutor/:tabla', (req, res) => {
    const tablaSeleccionada = req.params.tabla;
    obtenerDatosListaTutor(db, tablaSeleccionada)
        .then(datos => res.json(datos)) // Enviar datos en JSON
        .catch(err => res.status(500).json({ message: "Error al obtener los datos", error: err }));
});

app.get('/datosListadoAlumnos/', (req, res) => {
    obtenerListaAlumnos(db)
        .then(datos => res.json(datos)) // Enviar datos en JSON
        .catch(err => res.status(500).json({ message: "Error al obtener los datos", error: err }));
});

// Funciones delete-----------------------------------------------------------------------------------------------------------
// FUNCIONES DELETE `PARA CADA ROL POROFESOR Y AFDMIN, ESTAN SEPARADAS DEBIDO AL FRACASO DE REALIZAR FUNCIONES PARA CADA SCRIPT
// ESTAS TENDRIAN EL OBJETICVO DE VERICIAR EL ID Y LAS TABLAS PERMITIDSA, PERO NO SALIO :(
// LA UNICA ALTENATIVA FUE CREAR DOS FUNCIONES DIFERENTES AUQNEU TAMPCOO TIENE EL RESULTADO ESPERADO
// Ruta DELETE para eliminar un registro de una tabla específica
app.delete('/eliminarRolProfesor/:tabla/:id', (req, res) => {
    const { tabla, id } = req.params; // Obtenemos los parámetros 'tabla' e 'id' de la URL
    // Llamamos a la función eliminarDato, pasándole el id y el nombre de la tabla
    eliminarDatoRolProfesor(db, tabla, id)
        .then(result => {
            console.log('Resultado de eliminación:', result); // Ver el resultado
            res.status(200).json({ message: `Registro eliminado de la tabla ${tabla}`, result });
        })
        .catch(err => {
            console.error('Error al eliminar:', err); // Ver el error detallado
            res.status(500).json({ message: 'Error al eliminar el dato', error: err.message });
        });
});

app.delete('/eliminarRolAdmin/:tabla/:id', (req, res) => {
    const { tabla, id } = req.params; // Obtenemos los parámetros 'tabla' e 'id' de la URL
    // Llamamos a la función eliminarDato, pasándole el id y el nombre de la tabla
    eliminarDatoRolAdmin(db, tabla, id)
        .then(result => {
            console.log('Resultado de eliminación:', result); // Ver el resultado
            res.status(200).json({ message: `Registro eliminado de la tabla ${tabla}`, result });
        })
        .catch(err => {
            console.error('Error al eliminar:', err); // Ver el error detallado
            res.status(500).json({ message: 'Error al eliminar el dato', error: err.message });
        });
});

app.delete('/eliminarRolTutor/:tabla/:id', (req, res) => {
    const { tabla, id } = req.params; // Obtenemos los parámetros 'tabla' e 'id' de la URL
    // Llamamos a la función eliminarDato, pasándole el id y el nombre de la tabla
    eliminarDatoRolTutor(db, tabla, id)
        .then(result => {
            console.log('Resultado de eliminación:', result); // Ver el resultado
            res.status(200).json({ message: `Registro eliminado de la tabla ${tabla}`, result });
        })
        .catch(err => {
            console.error('Error al eliminar:', err); // Ver el error detallado
            res.status(500).json({ message: 'Error al eliminar el dato', error: err.message });
        });
});
// ----------------------------------------------------------------------------------------------
// FUNCIONES PARA HACER LAS DIFERENTES INSERCCIONES PARA EL ROL DE PROFESOR
app.post("/insertar_empresa", (req, res) => {
    const { nombre, cif, direccion, telefono, email, tipo_entidad } = req.body;
    // Verificar si todos los campos están presentes
    if (!nombre || !cif || !direccion || !telefono || !email || !tipo_entidad) {
        return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }
    // Llamar a la función insertarEmpresa, pasando req.body directamente
    insertarEmpresa(db, req.body)
        .then(response => {
            res.json({ success: true, message: "✅ Empresa registrado con éxito" }); // Solo devuelve mensaje
        })
        .catch(err => res.status(500).json({ message: "Error al insertar empresa", error: err }));
});

app.post("/insertar_alumno", (req, res) => {
    const { nombre, email, telefono, dni, centro, curso,  tutor_id} = req.body;
    if (!nombre || !email|| !telefono || !dni || !centro || !curso || !tutor_id ) {
        return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }
    insertarAlumno(db, req.body)
    .then(response => {
        res.json({ success: true, message: "✅ Alumno registrado con éxito" }); // Solo devuelve mensaje
    })
    .catch(err => res.status(500).json({ message: "Error al insertar el alumno", error: err }));
});

app.post("/insertar_representante", (req, res) => {
    const { nombre, dni, telefono, email, cargo_puesto, departamento, empresa_id} = req.body;
    if (!nombre || !dni|| !telefono|| !email || !cargo_puesto || !departamento || !empresa_id) {
        return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }
    insertarRepresentante(db, req.body)
    .then(response => {
        res.json({ success: true, message: "✅ Representante registrado con éxito" }); // Solo devuelve mensaje
    })
    .catch(err => res.status(500).json({ message: "Error al insertar el alumno", error: err }));
});

app.post("/insertar_profesor", (req, res) => {
    const { nombre_usuario, clave, nombre, dni, email, telefono, rol, centro } = req.body;
    if (!nombre_usuario || !clave || !nombre || !dni || !email || !telefono || !rol || !centro) {
        return res.status(400).json({ success: false, message: "Todos los campos son obligatorios" });
    }
    insertarProfesor(db, req.body)
        .then(() => {
            res.json({ success: true, message: "✅ Profesor registrado con éxito" }); // Solo devuelve mensaje
        })
        .catch(err => res.status(500).json({ success: false, message: "Error al insertar el profesor", error: err }));
});

app.post("/insertar_seguimiento", (req, res) => {
    const { empresa_id, tipo, detalle, prox_paso, fecha_prox_paso, observaciones } = req.body;
    if (!empresa_id || !tipo || !detalle || !prox_paso || !fecha_prox_paso) {
        return res.status(400).json({ success: false, message: "Todos los campos obligatorios deben completarse." });
    }
    insertarSeguimiento(db, empresa_id, tipo, detalle, prox_paso, fecha_prox_paso, observaciones)
        .then(() => res.json({ success: true, message: "✅ Seguimiento registrado con éxito." }))
        .catch(err => res.status(500).json({ success: false, message: "Error al registrar el seguimiento.", error: err }));
});

// FUNCIONES PARA HACER LAS MODIFICACIONES DE ALUMNOS, PROFESORES...
// ALUMNOS---
app.get("/obtenerAlumno/:id", (req, res) => {
    const id = req.params.id;
    obtenerElementoPorId(db, 'alumnos', id)
    // devolvemos el alumno en formato json
        .then(alumno => res.json({ success: true, alumno }))
        .catch(err => res.status(500).json({ success: false, message: "Error al obtener alumno", error: err }));
});

app.put("/actualizarAlumno/:id", (req, res) => {
    const id = req.params.id;
    actualizarAlumno(db, id, req.body)
        .then(() => res.json({ success: true, message: "✅ Alumno actualizado con éxito" }))
        .catch(err => res.status(500).json({ success: false, message: "Error al actualizar alumno", error: err }));
});

// EMPERSAS---
app.get("/obtenerEmpresa/:id", (req, res) => {
    const id = req.params.id;
    obtenerElementoPorId(db, 'empresas', id)
    // devolvemos el alumno en formato json
        .then(empresa => res.json({ success: true, empresa }))
        .catch(err => res.status(500).json({ success: false, message: "Error al obtener Emperesa", error: err }));
});

app.put("/actualizarEmpresa/:id", (req, res) => {
    const id = req.params.id;
    actualizarEmpresa(db, id, req.body)
        .then(() => res.json({ success: true, message: "✅ Emperesa actualizado con éxito" }))
        .catch(err => res.status(500).json({ success: false, message: "Error al actualizar Emperesa", error: err }));
});

// REPRESENTANTES---
app.get("/obtenerRepresentante/:id", (req, res) => {
    const id = req.params.id;
    obtenerElementoPorId(db, 'representantes', id)
        .then(representante => res.json({ success: true, representante }))
        .catch(err => res.status(500).json({ success: false, message: "Error al obtener profesor", error: err }));
});

app.put("/actualizarRepresentante/:id", (req, res) => {
    const id = req.params.id;
    actualizarRepresentante(db, id, req.body)
        .then(() => res.json({ success: true, message: "✅ Representante actualizado con éxito" }))
        .catch(err => res.status(500).json({ success: false, message: "Error al actualizar Representante", error: err }));
});

// PROFESORES-----
app.get("/obtenerProfesor/:id", (req, res) => {
    const id = req.params.id;
    obtenerElementoPorId(db, 'profesores', id)
        .then(profesor => res.json({ success: true, profesor }))
        .catch(err => res.status(500).json({ success: false, message: "Error al obtener profesor", error: err }));
});

app.put("/actualizarProfesor/:id", (req, res) => {
    const id = req.params.id;
    actualizarProfesor(db, id, req.body)
        .then(() => res.json({ success: true, message: "✅ Profesor actualizado con éxito" }))
        .catch(err => res.status(500).json({ success: false, message: "Error al actualizar profesor", error: err }));
});

// FUNCIONES PARA OBTENER Y MODIFICAR EL RESPECTIVO FCT DEL ALUMNO-------------------------------------------------
app.get("/obtenerFct/:id", (req, res) => {
    const id = req.params.id;
    obtenerElementoPorId(db, 'fct', id, 'alumno_id')
        .then(fct => res.json({ success: true, fct }))
        .catch(err => res.status(500).json({ success: false, message: "Error al obtener la fct", error: err }));
});

app.put("/actualizarFct/:id", (req, res) =>{
    const id = req.params.id;
    actualizarFct(db, id, req.body)
        .then(() => res.json({ success: true, message: "✅ Fct actualizado con éxito" }))
        .catch(err => res.status(500).json({ success: false, message: "Error al actualizar la fct", error: err }));
});

app.put("/actualizarConvenio/:id", (req, res) =>{
    const id = req.params.id;
    actualizarConvenio(db, id, req.body)
        .then(() => res.json({ success: true, message: "✅ Convenio actualizado con éxito" }))
        .catch(err => res.status(500).json({ success: false, message: "Error al actualizar el convenio", error: err }));
});

app.put("/actualizarRelacionAlumno/:id", (req, res) => {
    const id = req.params.id;
    console.log(id);
    console.log(req.body);
    actualizarRelacionAlumno(db, id, req.body)
        .then(() => res.json({ success: true, message: "✅ Relacion actualizado con éxito" }))
        .catch(err => res.status(500).json({ success: false, message: "Error al actualizar el Relacion", error: err }));
});

app.put("/actualizarProgramaHorario/:id", (req, res) => {
    const id = req.params.id;
    console.log(id);
    console.log(req.body);
    actualizarProgramaHorario(db, id, req.body)
        .then(() => res.json({ success: true, message: "✅ Relacion actualizado con éxito" }))
        .catch(err => res.status(500).json({ success: false, message: "Error al actualizar el Relacion", error: err }));
});

// FUNCIONES PARA SELECTS DIMANICOS---------------------------------------------------------------------------------
app.get("/selectTutor", (req, res) =>{
    // funcion para obtener los datos de los elementos sleccionados por tabla y condicion si hay
    obtenerElementoId(db, "profesores", "WHERE rol = 'tutor'")
    .then(datos => {
        res.json(datos);  // Enviar los alumnos al cliente en formato JSON
      })
      .catch(err => {
        res.status(500).json({ message: "Error al obtener los datos de select tutor", error: err });
      });
});

app.get("/selectRepresentante/:idEmpresa", (req, res) =>{
    const idEmpresa = req.params.idEmpresa;
    // funcion para obtener los datos de los elementos sleccionados por tabla y condicion si hay
    obtenerElementoId(db, "representantes", `WHERE empresa_id = ${idEmpresa}`)
    .then(datos => {
        res.json(datos);  // Enviar los alumnos al cliente en formato JSON
      })
      .catch(err => {
        res.status(500).json({ message: "Error al obtener los datos de select tutor", error: err });
      });
});

app.get("/obtenerRepresentantes/:tabla/:id", (req, res) => {
    const tabla = req.params.tabla;
    const id = req.params.id;
    obtenerElementoId(db, tabla, `WHERE id = ${id}`)
        .then(data => res.json({ success: true, data }))
        .catch(err => res.status(500).json({ success: false, message: "Error al obtener el tutor", error: err }));
}); 

app.get("/selectCurso", (req, res) =>{
    // funcion para obtener los datos de los elementos sleccionados por tabla y condicion si hay
    obtenerDatosEnum(db, 'alumnos', 'curso')
    .then(datos => {
        res.json(datos);  // Enviar los alumnos al cliente en formato JSON
      })
      .catch(err => {
        res.status(500).json({ message: "Error al obtener los datos de select tutor", error: err });
      });
});

app.get("/selectCentro", (req, res) =>{
    // funcion para obtener los datos de los elementos sleccionados por tabla y condicion si hay
    obtenerDatosEnum(db, 'alumnos', 'centro')
    .then(datos => {
        res.json(datos);  // Enviar los alumnos al cliente en formato JSON
      })
      .catch(err => {
        res.status(500).json({ message: "Error al obtener los datos de select tutor", error: err });
      });
});

app.get("/selectEmpresa", (req, res) =>{
    obtenerElementoId(db, 'empresas')
    .then(datos => {
        res.json(datos);  // Enviar los alumnos al cliente en formato JSON
      })
      .catch(err => {
        res.status(500).json({ message: "Error al obtener los datos de select tutor", error: err });
      });
});

app.get("/selectEstadoEmpresa", (req, res) =>{
    obtenerDatosEnum(db, 'empresas', 'estado')
    .then(datos => {
        res.json(datos);  // Enviar los alumnos al cliente en formato JSON
      })
      .catch(err => {
        res.status(500).json({ message: "Error al obtener los datos de select tutor", error: err });
      });
});

app.get("/selectEntidad", (req, res) =>{
    obtenerDatosEnum(db, 'empresas', 'tipo_entidad')
    .then(datos => {
        res.json(datos);  // Enviar los alumnos al cliente en formato JSON
      })
      .catch(err => {
        res.status(500).json({ message: "Error al obtener los datos de select tutor", error: err });
      });
});

app.get("/obtenerTutor/:tabla/:id", (req, res) => {
    const tabla = req.params.tabla;
    const id = req.params.id;
    obtenerElementoId(db, tabla, `WHERE id = ${id}`)
        .then(data => res.json({ success: true, data }))
        .catch(err => res.status(500).json({ success: false, message: "Error al obtener el tutor", error: err }));
}); 

// OBTENER LOS ESTADOS DE MANERA DINAMICA
app.get("/obtenerEstados/:tabla", (req, res) => {
    const tabla = req.params.tabla;
    obtenerEstados(db, tabla)
        .then(estados => res.json({ success: true, estados }))
        .catch(err => res.status(500).json({ success: false, message: "Error al obtener estados", error: err }));
});

// PARA OBTENER EL ESTADO ESPECIFICO POR ID
app.get("/obtenerEstadoPorId/:tabla/:id", (req, res) => {
    const tabla = req.params.tabla;
    const id = req.params.id;
    obtenerEstadoSeleccionado(db, tabla, id)
        .then(estado => res.json({ success: true, estado }))
        .catch(err => res.status(500).json({ success: false, message: "Error al obtener estado del alumno", error: err }));
});

app.put("/actualizarEstado/:tabla/:id", (req, res) => {
    const tabla = req.params.tabla;
    const id = req.params.id;    
    const { nuevoEstado } = req.body;
    console.log(req.body);
    if (!nuevoEstado) {
        return res.status(400).json({ success: false, message: "El estado es obligatorio" });
    }
    cambiarEstado(db, tabla, id, nuevoEstado)
        .then(response => res.json(response))
        .catch(error => res.status(500).json(error));
});


// FUNCIONES PARA GENERAR EL HTML O FORMULARIO PARA EL LOGIN
function generaHtml(main, rol, usuario){
    let enlaces = {'login':'/login', 'logout': '/logout'};
    let enlacesNav = generaEnlacesNav(rol);
    let html = generaHeader('style.css', enlaces, enlacesNav, usuario);
    html += main;
    html += generaFooter();
    return html;
}

function generaEnlacesNav(rol){
    let enlacesNav = {};
     if(rol === 'admin'){
        enlacesNav['profesores'] = '/profesores';
     }else if(rol === 'profesor'){
        enlacesNav['alumnos'] = '/alumnos';
        enlacesNav['empresas'] = '/empresas';
        enlacesNav['representantes'] = '/representantes';
     }else if(!rol){
        enlacesNav = [];
     }
    enlacesNav['Inicio'] = '/';
    return enlacesNav;
}

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});