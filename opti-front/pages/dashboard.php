<?php
session_start();

if (!isset($_SESSION['loggedin']) || $_SESSION['loggedin'] !== true) {
    header('Location: login.php');
    exit();
}

$saludo = include __DIR__ . '/../includes/zona_horaria.php';
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard</title>
    <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/fomantic-ui@2.9.3/dist/semantic.min.css" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
    <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
    <link rel="stylesheet" href="/capstone/opti-front/assets/css/style.css">

    <script src="https://cdn.jsdelivr.net/npm/ag-charts-community@7.0.0/dist/ag-charts-community.min.js"></script>
    <style>
        .chart-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
        }

        .chart {
            width: 48%;
            height: 500px;
        }
    </style>
</head>

<body>

    <!-- sidebar.php -->
    <?php include __DIR__ . '/../components/sidebar.php'; ?>
    <!-- sidebar.php -->

    <!-- Pusher debe ser hijo directo del body donde este siendo usado -->
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
                <p><?php echo $saludo . ', ' .  $_SESSION['nombre_usuario']; ?></p>
            </div>

            <!-- Cerrar sesión a la derecha -->
            <div class="right menu">
                <div class="item cerrar-sesion">
                    <i class="fas fa-sign-out-alt"></i>
                    <a href="logout.php">Cerrar sesión</a>
                </div>
            </div>
        </div>
        <!-- Pusher -->

        <!-- Main Content -->
        <div class="resumen-titulo">
            <h1>Resumen</h1>
        </div>
        <div class="ui container">
            <!-- Contenedor de los gráficos -->
            <div class="chart-container">
                <!-- Gráfico AG Charts (Columnas) -->
                <div id="myChart" class="chart"></div>
                <!-- Gráfico AG Charts (Torta) -->
                <div id="myPieChart" class="chart"></div>
            </div>

            <!-- Aquí puedes agregar tu contenido principal -->
            <table class="ui celled padded table">
                <thead>
                    <tr>
                        <th class="single line">Evidence Rating</th>
                        <th>Effect</th>
                        <th>Efficacy</th>
                        <th>Consensus</th>
                        <th>Comments</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <h2 class="ui center aligned header">A</h2>
                        </td>
                        <td class="single line">
                            Power Output
                        </td>
                        <td>
                            <div class="ui yellow rating" data-rating="3" data-max-rating="3"></div>
                        </td>
                        <td class="right aligned">
                            80% <br>
                            <a href="#">18 studies</a>
                        </td>
                        <td>Creatine supplementation is the reference compound for increasing muscular creatine levels; hay variability in this increase, however, with some nonresponders.</td>
                    </tr>
                    <tr>
                        <td>
                            <h2 class="ui center aligned header">A</h2>
                        </td>
                        <td class="single line">
                            Weight
                        </td>
                        <td>
                            <div class="ui yellow rating" data-rating="3" data-max-rating="3"></div>
                        </td>
                        <td class="right aligned">
                            100% <br>
                            <a href="#">65 studies</a>
                        </td>
                        <td>Creatine is the reference compound for power improvement, with numbers from one meta-analysis to assess potency</td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <th colspan="5">
                            <div class="ui right floated pagination menu">
                                <a class="icon item">
                                    <i class="left chevron icon"></i>
                                </a>
                                <a class="item">1</a>
                                <a class="item">2</a>
                                <a class="item">3</a>
                                <a class="item">4</a>
                                <a class="icon item">
                                    <i class="right chevron icon"></i>
                                </a>
                            </div>
                        </th>
                    </tr>
                </tfoot>
            </table>
        </div>
        <!-- Main Content -->

        <!-- Scripts -->
        <script>

        </script>
        <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/fomantic-ui@2.9.3/dist/semantic.min.js"></script>
        <script src="/capstone/opti-front/assets/js/dashboard.js"></script>
        <script src="/capstone/opti-front/assets/js/charts.js"></script>

        <!-- Scripts -->

        <!-- Footer -->
        <?php include __DIR__ . '/../components/footer.php'; ?>
        <!-- Footer -->
    </div>
</body>

</html>