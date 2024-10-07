<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login | OptiFlow</title>
    <link rel="shortcut icon" href="/assets/img/opti.ico" />

    <!-- Estilos de Fomantic UI -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/fomantic-ui@2.9.3/dist/semantic.min.css" />

    <!-- Fuentes de Google -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" rel="stylesheet">

    <!-- Iconos de FontAwesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />

    <!-- Archivo CSS personalizado -->
    <link rel="stylesheet" href="/assets/css/login.css">
</head>

<body>

    <div class="login-container">
        <!-- Lado izquierdo con la animación -->
        <header class="text-container-frase">
            <h1 id="my-text">TRANSFORMA</h1>
            <h1 id="my-text">TUS DATOS</h1>
            <h1 id="my-text">EN DECISIONES</h1>
            <h1 id="my-text">ESTRATÉGICAS</h1>
            <h1 id="my-text"> > <span class="highlight">OPTIFLOW<span class="underline"></span></span></h1>
        </header>


        <!-- Formulario de Login -->
        <div class="form-side hidden">
            <div class="ui middle aligned center aligned grid" style="height: 100vh;">
                <div class="column" style="max-width: 450px;">
                    <h2 class="ui teal image header">
                        <div class="content-title">Hola, bienvenido! :)</div>
                    </h2>
                    <h4 class="ui teal image header">
                        <div class="content-subtitle" style="font-size: 150%">Inicia Sesión con Tu Cuenta</div>
                    </h4>

                    <!-- Mostrar errores si existen -->
                    <?php if (session()->getFlashdata('error')): ?>
                        <div class="ui negative message">
                            <?= session()->getFlashdata('error') ?>
                        </div>
                    <?php endif; ?>

                    <!-- Formulario de Login -->
                    <form class="ui large form" id="loginForm" method="POST">
                        <!-- CSRF Token (If CSRF is enabled) -->
                        <?= csrf_field() ?>

                        <div class="ui stacked segment">
                            <div class="field" id="emailField">
                                <div class="ui left icon input">
                                    <i class="fas fa-envelope"></i>
                                    <input type="text" id="email" name="email" placeholder="E-mail" required />
                                </div>
                            </div>
                            <div class="field" id="passwordField">
                                <div class="ui left icon input">
                                    <i class="fas fa-lock"></i>
                                    <input type="password" id="password" name="password" placeholder="Contraseña" required />
                                    <i class="fas fa-eye-slash" id="togglePassword"></i>
                                </div>
                            </div>
                            <button type="submit" class="ui fluid large teal submit button" id="loginButton">Ingresar</button>
                        </div>
                    </form>

                    <div class="ui message">
                        ¿Problemas para Ingresar? <br><a class="sop-tec" href="#">Soporte Técnico</a>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal para Soporte Técnico -->
    <div class="ui modal" id="soporteModal">
        <i class="close icon"></i>
        <div class="header">Soporte Técnico</div>
        <div class="content">
            <!-- Loader que aparece cuando se envía el formulario -->
            <div id="loader" class="ui active inverted dimmer" style="display: none;">
                <div class="ui text loader">Enviando...</div>
            </div>
            <!-- Formulario de soporte -->
            <form class="ui form" id="soporteForm">
                <div class="field">
                    <label for="emailSoporte">Ingresa tu correo</label>
                    <input type="email" id="emailSoporte" name="emailSoporte" placeholder="tucorreo@example.com">
                </div>
                <div class="field">
                    <label for="motivoSoporte">Motivo de contacto</label>
                    <textarea id="motivoSoporte" name="motivoSoporte" placeholder="Describe tu problema o pregunta" required></textarea>
                </div>
            </form>
        </div>
        <div class="actions">
            <div class="ui button" id="cancelarSoporte">Cancelar</div>
            <div class="ui button teal" id="enviarSoporte">Enviar</div>
        </div>
    </div>

    <div class="redirect-overlay" style="display: none;"></div>

    <div class="ui active dimmer" id="loadingOverlay" style="display: none;">
        <div class="ui text loader">Cargando Dashboard...</div>
    </div>

    <!-- Footer -->
    <?php include __DIR__ . '/../components/footer.php'; ?>

    <!-- Scripts -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.10.4/gsap.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/fomantic-ui@2.9.3/dist/semantic.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.2/gsap.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.10.4/CSSRulePlugin.min.js"></script>
    <script src="https://unpkg.com/split-type"></script>


    <!-- Archivos JS personalizados -->
    <script type="module" src="/assets/js/login.js"></script>
    <script type="module" src="/assets/js/apiConfig.js"></script>

    <!-- Animación del texto con GSAP -->
    <script>

    </script>

</body>

</html>