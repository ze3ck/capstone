<?php
// session_start();

// // Suponiendo que has verificado el email y la contraseña:
// if ($_SERVER['REQUEST_METHOD'] === 'POST') {
//     $email = $_POST['email'];
//     $password = $_POST['password'];

//     // Aquí iría la lógica para autenticar al usuario con la API de tu backend.
//     // Supongamos que la autenticación fue exitosa y el usuario existe.

//     // Si la autenticación es exitosa:
//     if ($autenticacion_exitosa) {
//         $_SESSION['loggedin'] = true;
//         $_SESSION['user_id'] = $user_id;  // Almacena el ID del usuario u otra información
//         $_SESSION['email'] = $email;

//         // Redirige al dashboard
//         header("Location: dashboard.php");
//         exit();
//     } else {
//         echo "Usuario o contraseña incorrectos.";
//     }
// }
// ?>
<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - OptiFlow</title>

    <!-- Estilos de Fomantic UI -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/fomantic-ui@2.9.3/dist/semantic.min.css" />

    <!-- Fuentes de Google -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" rel="stylesheet">

    <!-- Iconos de FontAwesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />

    <!-- Archivo CSS personalizado -->
    <link rel="stylesheet" href="/opti-front/assets/css/login.css">
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
                    <form class="ui large form" id="loginForm" method="POST">
                        <div class="ui stacked segment">
                            <div class="field" id="emailField" >
                                <div class="ui left icon input" >
                                    <i class="fas fa-envelope"></i>
                                    <input type="text" id="email" name="email" placeholder="E-mail" required />
                                </div>
                            </div>
                            <div class="field" id="passwordField">
                                <div class="ui left icon input">
                                    <i class="fas fa-lock"></i>
                                    <input type="password" id="password" name="password" placeholder="Contraseña" required />
                                </div>
                                <i class="far fa-eye-slash" id="togglePassword" style="cursor: pointer;"></i>
                            </div>
                            <button type="submit" class="ui fluid large teal submit button" id="loginButton">Ingresar</button>
                        </div>
                        <div class="ui error message" id="formError" style="display: none;">
                            Por favor, corrige los errores antes de continuar.
                        </div>
                    </form>

                    <div class="ui message">
                        ¿Olvidaste tu Contraseña?
                        <br>
                        <a href="#">Soporte Técnico</a>
                    </div>
                </div>
            </div>
        </div>
    </div>


    <!-- Scripts -->
    <!-- GSAP -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.10.4/gsap.min.js"></script>
    <!-- jQuery (necesario para Fomantic UI) -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <!-- Fomantic UI -->
    <script src="https://cdn.jsdelivr.net/npm/fomantic-ui@2.9.3/dist/semantic.min.js"></script>
    <!-- SplitType -->
    <script src="https://unpkg.com/split-type"></script>
    <!-- Archivo GSAP adicional -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.2/gsap.min.js"></script>
    <!-- CSSRulePlugin -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.10.4/CSSRulePlugin.min.js"></script>

    <!-- Archivos JS personalizados -->
    <script type="module" src="/opti-front/assets/js/login.js"></script>
    <script type="module" src="/opti-front/assets/js/apiConfig.js"></script>

    <!-- Footer -->
    <?php include __DIR__ . '/../components/footer.php'; ?>

    <!-- Animación del texto con GSAP -->
    <script>
        const myText = new SplitType('#my-text');

        gsap.to('.char', {
            y: 0,
            stagger: 0.02,
            delay: 0.4,
            duration: 0.1
        });

        // Animación de subrayado de la palabra "OptiFlow"
        gsap.to(".highlight::after", {
            width: "100%", // Hace que el subrayado crezca del 0% al 100%
            duration: 1, // Duración de la animación
            ease: "power2.out", // Efecto de la animación
            delay: 3 // Comienza después de la animación principal
        });
    </script>

</body>

</html>