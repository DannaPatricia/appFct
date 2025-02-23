function generaFormularioLogin(){
    return `  <main>
        <p class = "saludo">¡Bienvenido a la gestión de Fct!😊 Disfruta del servicio más intuitivo y eficaz.</p>
        <div class = "bienvenida">
            <img src = "/img/portada.avif">
        <form id= "loginForm" class = "bienvenidaForm">
                    <h2>INICIAR SESIÓN</h2>
            <div class="input-container">
                <label for="nombre_usuario">Nombre de usuario</label>
                <input type="text" name="nombre_usuario" id="nombre_usuario" placeholder="Inserte nombre de Usuario" required/>
            </div>
            <div class="input-container">
                <label for="clave">Clave de usuario</label>
                <input type="password" name="clave" id="clave" placeholder="Inserte clave de Usuario" required/>
            </div>
            <div class="botones">
                <button name="btn" type="submit" class = "boton-opcion" value = "enviar">Enviar</button>
            </div>
        </form>
        </div>
    </main>
    <script>
            document.getElementById("loginForm").addEventListener("submit", async (e) => {
                e.preventDefault();
                const nombre_usuario = document.getElementById("nombre_usuario").value;
                const clave = document.getElementById("clave").value;

                const response = await fetch("/procesarLogin", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ nombre_usuario, clave })
                });

                const data = await response.json();
                if (data.mensaje === 'Nombre completo o contraseña incorrectos') {
                    alert(data.mensaje);
                } else {
                    alert(data.mensaje);
                    window.location.href = '/';
                }
            });
</script>`;
}

module.exports = {generaFormularioLogin};
