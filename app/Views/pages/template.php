<?php
$session = session();
if (!$session->get('loggedin')) {
    return redirect()->to('/login');
}

$saludo = include APPPATH . 'includes/zona_horaria.php';
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>OptiFlow | Perfil</title>
    <link rel="shortcut icon" href="/assets/img/opti.ico" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/fomantic-ui/2.8.8/semantic.min.css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
    <link rel="stylesheet" href="/assets/css/style.css">

</head>

<body>
    <!-- sessionControllerModal.php -->
    <?= $this->include('components/sessionControllerModal') ?>
    <!-- sessionControllerModal.php -->

    <!-- sidebar.php -->
    <?php include __DIR__ . '/../components/sidebar.php'; ?>
    <div class="pusher">
        <div class="ui stackable menu">
            <!-- Botón para togglear el sidebar -->
            <a class="item" id="menu-toggle">
                <i class="sidebar icon"></i>
            </a>
            <div class="header item">
                Optiflow
            </div>
            <!-- Mensaje de bienvenida -->
            <div class="item">
                <p><?php echo $saludo . ', ' .  $_SESSION['nombre'] . ' ' . $_SESSION['apaterno'] ?></p>

            </div>
            <!-- Cerrar sesión a la derecha -->
            <div class="right menu">
                <div class="item cerrar-sesion">
                    <i class="fas fa-sign-out-alt"></i>
                    <a href="<?= site_url('logout') ?>">Cerrar sesión</a>
                </div>
            </div>
        </div>
        <div id="loader" class="ui active dimmer">
            <div class="ui text loader">Loading</div>
        </div>

        <!-- Aqui va el contenido **no meter todo en un container sino el contenido se centra y se pierden lso costados de la pagina-->


        <!-- Fin Contenido -->
        <span id="ID_USUARIO" style="display:none">
        <?php echo $_SESSION['user_id'] ?></span>
    </div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/fomantic-ui/2.8.8/semantic.min.js"></script>
    <script>
        $(".menu .item").tab();
        $(".ui.dropdown").dropdown();

        $('#estado-dropdown').on('change', function() {
            var nuevoEstado = $(this).val();
            $('#estado-label').text(nuevoEstado);
        });
        $('#crearUsuario').on('click', function() {
            $('#modalUsuario').modal('show');
        });
    </script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/fomantic-ui@2.9.3/dist/semantic.min.js"></script>
    <script src="/assets/js/dashboard.js"></script>
    <script type="module" src="/assets/js/perfilUsuario.js"></script>
</body>

</html>