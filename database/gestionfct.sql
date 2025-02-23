-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 23-02-2025 a las 17:10:07
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.1.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `gestionfct`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `alumnos`
--

CREATE TABLE `alumnos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `email` varchar(50) NOT NULL,
  `telefono` int(11) NOT NULL,
  `dni` varchar(20) NOT NULL,
  `centro` enum('Centro Educativo Alfa','Instituto Beta','Colegio Gamma','Escuela Delta','Academia Épsilon','Centro de Formación Zeta','Instituto Omega','Colegio Sigma','Escuela Lambda','Academia Tau') NOT NULL,
  `curso` enum('Desarrollo de Aplicaciones Web','Desarrollo de Software','Administración de Sistemas Informáticos','Redes y Telecomunicaciones') NOT NULL,
  `estado` enum('NO REALIZA PRACTICAS','PENDIENTE ASIGNACION DE EMPRESA','ASIGNADO A EMPRESA','PENDIENTE CONVENIO',' REALIZADO CONVENIO','PENDIENTE RELACION DE ALUMNOS','REALIZADO RELACION DE ALUMNOS','PENDIENTE PROGRAMA Y HORARIO','REALIZADO PROGRAMA y HORARIO','PENDIENTE HOJAS DE FIRMAS',' REALIZADAS HOJAS DE FIRMAS','PENDIENTE ENVIO DOCUMENTACION','FINALIZADAS') NOT NULL DEFAULT 'NO REALIZA PRACTICAS',
  `tutor_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `alumnos`
--

INSERT INTO `alumnos` (`id`, `nombre`, `email`, `telefono`, `dni`, `centro`, `curso`, `estado`, `tutor_id`) VALUES
(11, 'Alejandro Gutierrez', 'alejandro25@gmail.com', 789567239, '11111111A', 'Colegio Gamma', 'Administración de Sistemas Informáticos', 'PENDIENTE CONVENIO', 8),
(12, 'Beatriz Nui', 'beatriz@domenico.es', 234567987, '22222222B', 'Instituto Beta', 'Desarrollo de Aplicaciones Web', 'PENDIENTE HOJAS DE FIRMAS', 8),
(13, 'Carlos Piedra', '', 0, '33333333C', 'Centro Educativo Alfa', 'Desarrollo de Aplicaciones Web', 'PENDIENTE ASIGNACION DE EMPRESA', 2),
(14, 'Diana Castillo', '', 0, '44444444D', 'Centro Educativo Alfa', 'Desarrollo de Aplicaciones Web', 'PENDIENTE PROGRAMA Y HORARIO', 2),
(15, 'Eduardo Fernandez', '', 0, '55555555E', 'Centro Educativo Alfa', 'Desarrollo de Aplicaciones Web', 'PENDIENTE ASIGNACION DE EMPRESA', 2),
(16, 'Felipe Gonzalez', 'felipe@domenico.es', 432765546, '66666666F', 'Colegio Sigma', 'Desarrollo de Aplicaciones Web', 'PENDIENTE ASIGNACION DE EMPRESA', 2),
(17, 'Gabriela Navarro', '', 0, '77777777G', 'Centro Educativo Alfa', 'Desarrollo de Aplicaciones Web', 'PENDIENTE ASIGNACION DE EMPRESA', 2),
(18, 'Hugo Pos', '', 0, '88888888H', 'Centro Educativo Alfa', 'Desarrollo de Aplicaciones Web', 'PENDIENTE ASIGNACION DE EMPRESA', 2),
(19, 'Isabel', '', 0, '99999999I', 'Centro Educativo Alfa', 'Desarrollo de Aplicaciones Web', 'PENDIENTE ASIGNACION DE EMPRESA', 2),
(20, 'Javier Nieblas', 'javier@domenico.es', 321321321, '10101010J', 'Colegio Gamma', 'Desarrollo de Software', 'PENDIENTE ENVIO DOCUMENTACION', 2),
(34, 'joselito', 'jose@domenico.es', 543789376, '54903278M', 'Colegio Sigma', 'Desarrollo de Software', 'PENDIENTE ASIGNACION DE EMPRESA', 8),
(35, 'ninini', 'nini@domenico.es', 654654654, '65904378M', 'Escuela Delta', 'Administración de Sistemas Informáticos', 'PENDIENTE ENVIO DOCUMENTACION', 8);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `empresas`
--

CREATE TABLE `empresas` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `cif` varchar(20) NOT NULL,
  `direccion` text DEFAULT NULL,
  `telefono` varchar(15) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `estado` enum('Sin contactar','Contactado','Admite alumnos','No admite alumnos') NOT NULL,
  `representante_id` int(11) DEFAULT NULL,
  `tipo_entidad` enum('SA','SL','OTRO') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `empresas`
--

INSERT INTO `empresas` (`id`, `nombre`, `cif`, `direccion`, `telefono`, `email`, `estado`, `representante_id`, `tipo_entidad`) VALUES
(1, 'Tech Solutions S.A.', 'A12345678', 'Calle Ficticia 123, Madrid', '911234567', 'contacto@techsolutions.com', 'No admite alumnos', 0, 'SL'),
(2, 'Web Innovators SL', 'B98765432', 'Av. del Mar 45, Barcelona', '932345678', 'info@webinnovators.com', 'Contactado', 2, 'SL'),
(3, 'DataSoft S.L.', 'C23456789', 'Calle Mayor 10, Valencia', '961234567', 'info@datasoft.com', 'Sin contactar', 3, 'SL'),
(4, 'CloudTech S.A.', 'D34567890', 'Plaza del Sol 5, Sevilla', '954567890', 'contacto@cloudtech.com', 'Sin contactar', 4, 'SA'),
(5, 'AI Solutions SL', 'E45678901', 'Carrer de la Pau 23, Barcelona', '933445566', 'ai@solutions.com', 'Sin contactar', 5, 'SL'),
(6, 'CyberSecurity Ltd.', 'F56789012', 'Av. de la Ciencia 99, Madrid', '911223344', 'security@cybersec.com', 'Sin contactar', 6, 'OTRO'),
(7, 'Green Energy S.A.', 'G67890123', 'Paseo Verde 45, Zaragoza', '976556677', 'info@greenenergy.com', 'Sin contactar', 7, 'SA'),
(8, 'Quantum Systems SL', 'H78901234', 'Ronda del Progreso 12, Málaga', '952667788', 'contact@quantum.com', 'Sin contactar', 8, 'SL'),
(9, 'Robotics Future S.A.', 'I89012345', 'Calle Innovación 77, Bilbao', '944778899', 'info@roboticsfuture.com', 'Sin contactar', 9, 'SA'),
(10, 'Big Data Corp.', 'J90123456', 'Av. del Conocimiento 15, Valencia', '963112233', 'bigdata@corp.com', 'Contactado', 10, 'OTRO'),
(14, 'empresa viaj', '3213J', 'c/empresaVieja', '321321321', 'empresaViaje@domenico.es', 'Sin contactar', 0, 'SA');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `fct`
--

CREATE TABLE `fct` (
  `id` int(11) NOT NULL,
  `alumno_id` int(11) NOT NULL,
  `empresa_id` int(11) DEFAULT NULL,
  `representante_id` int(11) DEFAULT NULL,
  `persona_contacto` varchar(25) DEFAULT NULL,
  `email_contacto` varchar(25) DEFAULT NULL,
  `telefono_contacto` varchar(25) DEFAULT NULL,
  `firma` enum('Digital','Manuscrita') DEFAULT NULL,
  `fecha_inicio` date DEFAULT NULL,
  `fecha_fin` date DEFAULT NULL,
  `horario` varchar(255) DEFAULT NULL,
  `num_horas` int(11) DEFAULT NULL,
  `modalidad` enum('Presencial','Teletrabajo') DEFAULT NULL,
  `localizacion` varchar(50) DEFAULT NULL,
  `fecha_entrega_firmas` date DEFAULT NULL,
  `lugar_firma` varchar(25) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `fct`
--

INSERT INTO `fct` (`id`, `alumno_id`, `empresa_id`, `representante_id`, `persona_contacto`, `email_contacto`, `telefono_contacto`, `firma`, `fecha_inicio`, `fecha_fin`, `horario`, `num_horas`, `modalidad`, `localizacion`, `fecha_entrega_firmas`, `lugar_firma`) VALUES
(1, 11, 10, NULL, NULL, NULL, NULL, NULL, '2025-03-06', '2025-06-08', '9:00 - 14:00', 300, 'Presencial', NULL, NULL, NULL),
(2, 12, 2, NULL, NULL, NULL, NULL, NULL, '2025-04-09', '2025-07-17', '10:00 - 15:00', 320, 'Teletrabajo', NULL, NULL, NULL),
(3, 13, 1, NULL, NULL, NULL, NULL, NULL, '2025-05-02', '2025-08-30', '8:00 - 16:00', 350, 'Presencial', NULL, NULL, NULL),
(4, 35, 4, 4, 'persona2', 'persona2@domenico.es', '321321321', 'Manuscrita', '2025-04-18', '2025-06-20', '08:00 - 15:30', 250, 'Presencial', 'c/templada', '2025-02-28', 'c/templada'),
(5, 14, 8, 8, 'contacnto', 'contacto@domenico.es', '543543543', 'Digital', '2025-03-14', '2025-06-26', '08:00 - 15:30', 250, 'Teletrabajo', 'c/fria', NULL, NULL),
(6, 15, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(7, 16, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(8, 17, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(9, 18, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(10, 19, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(11, 20, 6, 6, 'persona', 'persona@domenico.es', '321321321', 'Digital', '2025-04-12', '2025-05-24', '08:00 - 15:30', 250, 'Presencial', 'c/caliente', '2025-02-27', 'c/fria'),
(12, 34, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `profesores`
--

CREATE TABLE `profesores` (
  `id` int(11) NOT NULL,
  `nombre_usuario` varchar(25) NOT NULL,
  `clave` varchar(25) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `dni` varchar(20) NOT NULL,
  `email` varchar(255) NOT NULL,
  `telefono` varchar(15) DEFAULT NULL,
  `rol` enum('profesor','tutor','admin') DEFAULT 'profesor',
  `centro` enum('Centro Educativo Alfa','Instituto Beta','Colegio Gamma','Escuela Delta','Academia Épsilon','Centro de Formación Zeta','Instituto Omega','Colegio Sigma','Escuela Lambda','Academia Tau') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `profesores`
--

INSERT INTO `profesores` (`id`, `nombre_usuario`, `clave`, `nombre`, `dni`, `email`, `telefono`, `rol`, `centro`) VALUES
(1, 'juan', '1234', 'Juan Perez', '12345678A', 'juan.lopez@ejemplo.com', '650987654', 'profesor', 'Academia Épsilon'),
(2, 'marta', '1234', 'Marta Castañas', '98765432B', 'marta.perez@ejemplo.com', '650123456', 'tutor', 'Centro Educativo Alfa'),
(8, 'pepe', '1234', 'Pepe Torres', '12670967W', 'pepe@domenico.es', '432678456', 'tutor', 'Centro Educativo Alfa'),
(11, 'admin', '1234', 'admin', '32543467I', 'admin@domenico.es', '543543543', 'admin', 'Centro Educativo Alfa');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `representantes`
--

CREATE TABLE `representantes` (
  `id` int(11) NOT NULL,
  `dni` varchar(20) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `empresa_id` int(11) NOT NULL,
  `cargo_puesto` varchar(255) NOT NULL,
  `departamento` enum('Recursos Humanos','Administración','Operaciones') NOT NULL,
  `email` varchar(255) NOT NULL,
  `telefono` varchar(15) NOT NULL,
  `direccion` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `representantes`
--

INSERT INTO `representantes` (`id`, `dni`, `nombre`, `empresa_id`, `cargo_puesto`, `departamento`, `email`, `telefono`, `direccion`) VALUES
(1, '12345678A', 'Carlos Pérez', 1, 'CEO', 'Recursos Humanos', 'carlos.perez@techsolutions.com', '911234567', 'Calle Ficticia 123, Madrid'),
(2, '98765432B', 'Ana García', 2, 'Directora General', 'Administración', 'ana.garcia@webinnovators.com', '932345678', 'Av. del Mar 45, Barcelona'),
(3, '23456789C', 'Luis Martínez', 3, 'Gerente', 'Administración', 'luis.martinez@datasoft.com', '961234567', 'Calle Mayor 10, Valencia'),
(4, '34567890D', 'María Fernández', 4, 'CEO', 'Administración', 'maria.fernandez@cloudtech.com', '954567890', 'Plaza del Sol 5, Sevilla'),
(5, '45678901E', 'Javier Torres', 5, 'Director de IA', 'Operaciones', 'javier.torres@aisolutions.com', '933445566', 'Carrer de la Pau 23, Barcelona'),
(6, '56789012F', 'Isabel Gómez', 6, 'Directora de Seguridad', 'Operaciones', 'isabel.gomez@cybersec.com', '911223344', 'Av. de la Ciencia 99, Madrid'),
(7, '67890123G', 'Fernando Ruiz', 7, 'Gerente de Energía', 'Operaciones', 'fernando.ruiz@greenenergy.com', '976556677', 'Paseo Verde 45, Zaragoza'),
(8, '78901234H', 'Laura Méndez', 8, 'CTO', 'Operaciones', 'laura.mendez@quantum.com', '952667788', 'Ronda del Progreso 12, Málaga'),
(9, '89012345I', 'Andrés Navarro', 9, 'Director de Robótica', 'Operaciones', 'andres.navarro@roboticsfuture.com', '944778899', 'Calle Innovación 77, Bilbao'),
(10, '90123456J', 'Sofía Pérez', 10, 'CEO', 'Administración', 'sofia.perez@bigdata.com', '963112233', 'Av. del Conocimiento 15, Valencia'),
(18, '4343289M', 'repre biejop', 3, 'gerente', 'Recursos Humanos', 'biej@domenico.es', '543543543', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `seguimiento`
--

CREATE TABLE `seguimiento` (
  `id` int(11) NOT NULL,
  `empresa_id` int(11) DEFAULT NULL,
  `fecha` datetime DEFAULT current_timestamp(),
  `tipo` enum('Llamada','Correo','Reunion') DEFAULT NULL,
  `detalle` text DEFAULT NULL,
  `prox_paso` text DEFAULT NULL,
  `fecha_prox_paso` date DEFAULT NULL,
  `observaciones` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `seguimiento`
--

INSERT INTO `seguimiento` (`id`, `empresa_id`, `fecha`, `tipo`, `detalle`, `prox_paso`, `fecha_prox_paso`, `observaciones`) VALUES
(1, 1, '2025-02-22 00:00:00', 'Llamada', 'Se contactó con el CEO para discutir colaboración', 'Enviar propuesta formal', '2025-02-25', 'Interesados en prácticas a partir de septiembre'),
(2, 2, '2025-02-22 00:00:00', 'Correo', 'Se envió correo con información sobre el programa', 'Esperar respuesta', '2025-02-27', 'Pendiente confirmación de reunión'),
(3, 3, '2025-02-22 00:00:00', 'Reunion', 'Reunión con RRHH para explicar convenio de colaboración', 'Revisar contrato', '2025-03-01', 'Interesados en alumnos de Desarrollo Web'),
(4, 4, '2025-02-22 00:00:00', 'Llamada', 'Confirmación de interés por parte de la empresa', 'Enviar documentación requerida', '2025-02-26', 'Empresa solicita alumnos con perfil técnico'),
(5, 5, '2025-02-22 00:00:00', 'Correo', 'Seguimiento al correo enviado sobre prácticas', 'Llamar si no responden', '2025-02-28', 'Empresa analizando si puede aceptar alumnos'),
(6, 6, '2025-02-22 00:00:00', 'Reunion', 'Visita a la empresa para conocer instalaciones', 'Esperar feedback', '2025-03-05', 'Buena recepción, posible convenio en proceso'),
(7, 7, '2025-02-22 00:00:00', 'Llamada', 'Consulta sobre número de plazas disponibles', 'Confirmar disponibilidad', '2025-03-02', 'Empresa interesada pero con cupos limitados'),
(8, 8, '2025-02-22 00:00:00', 'Correo', 'Empresa solicita más información sobre alumnos', 'Enviar perfiles de estudiantes', '2025-03-01', 'Posibilidad de prácticas en verano'),
(9, 9, '2025-02-22 00:00:00', 'Reunion', 'Primera reunión con empresa nueva para colaboración', 'Enviar acuerdo de confidencialidad', '2025-03-03', 'Muy interesados, revisión interna en curso'),
(10, 10, '2025-02-22 00:00:00', 'Llamada', 'Llamada con responsable de formación', 'Confirmar disponibilidad de mentores', '2025-03-04', 'Empresa con buena disposición, falta cierre de detalles');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `alumnos`
--
ALTER TABLE `alumnos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `dni` (`dni`),
  ADD KEY `alumnos_ibfk_1` (`tutor_id`);

--
-- Indices de la tabla `empresas`
--
ALTER TABLE `empresas`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `fct`
--
ALTER TABLE `fct`
  ADD PRIMARY KEY (`id`),
  ADD KEY `alumno_id` (`alumno_id`),
  ADD KEY `empresa_id` (`empresa_id`);

--
-- Indices de la tabla `profesores`
--
ALTER TABLE `profesores`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `dni` (`dni`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indices de la tabla `representantes`
--
ALTER TABLE `representantes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `correo` (`email`),
  ADD UNIQUE KEY `correo_UNIQUE` (`email`),
  ADD KEY `empresa_id` (`empresa_id`),
  ADD KEY `dni` (`dni`);

--
-- Indices de la tabla `seguimiento`
--
ALTER TABLE `seguimiento`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `alumnos`
--
ALTER TABLE `alumnos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT de la tabla `empresas`
--
ALTER TABLE `empresas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `fct`
--
ALTER TABLE `fct`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `profesores`
--
ALTER TABLE `profesores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `representantes`
--
ALTER TABLE `representantes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT de la tabla `seguimiento`
--
ALTER TABLE `seguimiento`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `alumnos`
--
ALTER TABLE `alumnos`
  ADD CONSTRAINT `alumnos_ibfk_1` FOREIGN KEY (`tutor_id`) REFERENCES `profesores` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `fct`
--
ALTER TABLE `fct`
  ADD CONSTRAINT `fct_ibfk_1` FOREIGN KEY (`alumno_id`) REFERENCES `alumnos` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fct_ibfk_2` FOREIGN KEY (`empresa_id`) REFERENCES `empresas` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `representantes`
--
ALTER TABLE `representantes`
  ADD CONSTRAINT `representantes_ibfk_1` FOREIGN KEY (`empresa_id`) REFERENCES `empresas` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
