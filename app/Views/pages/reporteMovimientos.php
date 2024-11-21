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
    <title>OptiFlow | Reportes de Movimientos</title>
    <link rel="shortcut icon" href="/assets/img/opti.ico" />

    <!-- Fomantic UI CSS -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/fomantic-ui/2.8.8/semantic.min.css" />

    <!-- DataTables Fomantic UI CSS -->
    <link rel="stylesheet" href="https://cdn.datatables.net/1.13.4/css/dataTables.fomanticui.min.css" />

    <link rel="stylesheet" href="/assets/css/style.css">
    <link rel="stylesheet" href="/assets/css/reportes.css">
</head>

<body style="min-width: 1200px; min-height: 800px">
    <!-- sessionControllerModal.php -->
    <span id="idUsuario" style="display: none;"><?php echo session('user_id'); ?></span>
    <!-- sidebar.php -->
    <?php include __DIR__ . '/../components/sidebar.php'; ?>
    <div class="pusher">
        <div class="ui unstackable menu">
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
        <!-- <div id="loader" class="ui active dimmer">
            <div class="ui text loader">Loading</div>
        </div> -->

        <!-- Aqui va el contenido **no meter todo en un container sino el contenido se centra y se pierden los costados de la pagina-->

        <h1>Gráficos Movimientos</h1>

        <div class="ui grid">
            <div class="eight wide column">
                <div class="ui segment">
                    <h3>Total de Movimiento</h3>
                    <div id="totalMovimientoChart">
                    </div>
                </div>
            </div>
            <div class="eight wide column">
                <div class="ui segment">
                    <h3>Total de Movimientos por Producto</h3>
                    <div id="topProductosMovimientoChart">
                    </div>
                </div>
            </div>

            <!-- Fin Contenido -->
        </div>

        <!-- Scripts al final del body -->
        <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/fomantic-ui/2.8.8/semantic.min.js"></script>
        <script src="https://cdn.datatables.net/1.13.4/js/jquery.dataTables.min.js"></script>
        <script src="https://cdn.datatables.net/1.13.4/js/dataTables.fomanticui.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
        <script src="/assets/js/dashboard.js"></script>
        <!-- <script type="module" src="/assets/js/perfilUsuario.js"></script> -->
        <script type="module" src="/assets/js/reporteMovimiento.js"></script>


</body>

</html>