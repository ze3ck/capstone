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
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OptiFlow | Dashboard</title>
    <link rel="shortcut icon" href="/assets/img/opti.ico" />
    <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/fomantic-ui@2.9.3/dist/semantic.min.css" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
    <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />

    <script src="https://cdn.jsdelivr.net/npm/ag-charts-community@7.0.0/dist/ag-charts-community.min.js"></script>
    <!-- Apex Charts  -->
    <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
    <link
        rel="stylesheet"
        href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" />
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <link rel="stylesheet" href="/assets/css/style.css">

</head>

<body style="min-width: 1200px; min-height: 800px">
    <!-- sessionControllerModal.php -->
    <?= $this->include('components/sessionControllerModal') ?>
    <!-- sessionControllerModal.php -->
    <!-- sidebar.php -->
    <?php include __DIR__ . '/../components/sidebar.php'; ?>
    <!-- sidebar.php -->

    <!-- Pusher debe ser hijo directo del body donde este siendo usado -->
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
        <!-- Pusher -->

        <!-- Main Content -->
        <div class="resumen-titulo" style="margin-top: 3%;">
            <h1 style="color:black;">Resumen</h1>
        </div>
        <div class="ui container" style="width: 100%; margin-top: 2%" id="graficos-container">
            <!-- Contenedor de los gráficos -->
            <div class="ui grid">
                <br>
                <!-- Tabla Críticos -->
                <div class="eight wide column">
                    <h2 class="ui header" style="color: white;">Críticos Y Bajo Críticos</h2>

                    <table class="ui celled unstackable table" id="tabla-criticos">
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Existencias</th>
                                <th>Ideal</th>
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>

                </div>

                <div class="eight wide column">
                    <!-- <div class="ui segment"> -->
                    <h2 class="ui header" style="color: white;">Sobre Stock</h2>
                    <table class="ui celled unstackable table" id="tabla-sobre-stock">
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Existencias</th>
                                <th>Ideal</th>
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                    <!-- </div> -->
                </div>
            </div>
            <div class="ui grid">
                <div class="eight wide column">
                    <h2 class="ui header" style="color: white;">Más Vendidos</h2>
                    <div class="ui form">
                        <div class="fields">
                            <div class="field">
                                <label>Desde</label>
                                <input type="date" id="fecha-desde" placeholder="Fecha Desde">
                            </div>
                            <div class="field">
                                <label>Hasta</label>
                                <input type="date" id="fecha-hasta" placeholder="Fecha Hasta">
                            </div>
                            <div class="field" style="margin-top: 24px;">
                                <button class="ui primary button" id="btn-filtrar">Filtrar</button>
                                <button class="ui button" id="btn-limpiar">Limpiar</button>
                            </div>
                        </div>
                    </div>
                    <table class="ui celled unstackable table" id="tabla-mas-vendidos" style="color: white;">
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Cantidad</th>
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                </div>
                <!-- Tabla de Mayores Ganancias -->
                <div class="eight wide column">
                    <h2 class="ui header" style="color: white;">Mayores Ganancias</h2>
                    <table class="ui celled unstackable table" id="tabla-mayores-ganancias" style="color: white;">
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Ventas Totales</th>
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                </div>
            </div>
            <!-- Main Content -->
            <!-- Scripts -->


            <!-- Scripts -->

            <span id="ID_USUARIO" style="display:none">
                <?php echo $_SESSION['user_id'] ?></span>
        </div>
    </div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.slim.min.js"></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/fomantic-ui@2.9.3/dist/semantic.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
    <script src="/assets/js/dashboard.js"></script>
    <script type="module" src="/assets/js/reportes.js"></script>
    <script src="/assets/js/charts.js"></script>

</body>

</html>