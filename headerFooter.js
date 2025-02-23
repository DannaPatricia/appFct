
// Función para generar HTML inicial
function generaHtml(style) {
    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gestión FCT</title>
    <link rel="stylesheet" href="${style}">
</head>
<body>`;
}

// Función para generar Header
function generaHeader(style, enlaces, enlacesNav, usuario) {
    let html = generaHtml(style);
    html += `<header>
    <nav class="nav-usuario">
        <div class="container-usuario">
            <span class="nombre-web">Gestión FCT</span>
            <div class="usuario-opciones">`;
    html += usuario != null
        ? `<span class="usuario">${usuario}</span>
           <a href="${enlaces.logout}" class="cerrar-sesion">Cerrar sesión</a>`
        : `<a href="${enlaces.login}" class="cerrar-sesion">Iniciar sesión</a>`;
    html += `</div>
        </div>
    </nav>
    <nav class="nav-navegacion">
        <div class="container-navegacion">
            <ul class="menu">`;
    for (let nombre in enlacesNav) {
        html += `<li><a href="${enlacesNav[nombre]}">${capitalizarPrimeraLetra(nombre)}</a></li>`;
    }
    html += `</ul>
        </div>
    </nav>
</header>`;

    return html;
}

// Función para generar Footer
function generaFooter() {
    return `<footer class="footer">
    <div class="footer-container">
        <p>&copy; 2025 Gestión FCT. Todos los derechos reservados.</p>
    </div>
</footer>
</body>
</html>`;
}

function capitalizarPrimeraLetra(texto) {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
}


module.exports = {generaHeader, generaFooter};