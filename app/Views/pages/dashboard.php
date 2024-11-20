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
        <div class="resumen-titulo">
            <h1>Resumen</h1>
        </div>
        <div class="ui container" style="width: 100%;" id="graficos-container">
            <!-- Contenedor de los gráficos -->
            <!-- <div id="wrapper"> -->
            <!-- <div class="content-area"> -->
            <!-- <div class="container-fluid"> -->
            <div class="main">
                <div id="box-boxes" class="row sparkboxes mt-4">
                    <div class="col-md-3">
                        <div class="box box1">
                            <div class="details">
                                <h3>1213</h3>
                                <h4>CLICKS</h4>
                            </div>
                            <div id="spark1"></div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="box box2">
                            <div class="details">
                                <h3>422</h3>
                                <h4>VIEWS</h4>
                            </div>
                            <div id="spark2"></div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="box box3">
                            <div class="details">
                                <h3>311</h3>
                                <h4>LEADS</h4>
                            </div>
                            <div id="spark3"></div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="box box4">
                            <div class="details">
                                <h3>22</h3>
                                <h4>SALES</h4>
                            </div>
                            <div id="spark4"></div>
                        </div>
                    </div>
                </div>

                <div class="row mt-4">
                    <div class="col-md-5">
                        <div class="box shadow mt-4">
                            <div id="radialBarBottom"></div>
                        </div>
                    </div>
                    <div class="col-md-7">
                        <div class="box shadow mt-4">
                            <div id="line-adwords" class=""></div>
                        </div>
                    </div>
                </div>

                <div class="row mt-4">
                    <div class="col-md-5">
                        <div class="box shadow mt-4">
                            <div id="barchart"></div>
                        </div>
                    </div>
                    <div class="col-md-7">
                        <div class="box shadow mt-4">
                            <div id="areachart"></div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- </div> -->
            <!-- </div> -->
            <!-- </div> -->

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

        <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.slim.min.js"></script>
        <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/fomantic-ui@2.9.3/dist/semantic.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
        <script src="/assets/js/dashboard.js"></script>
        <script src="/assets/js/charts.js"></script>

        <!-- Scripts -->


    </div>
</body>

</html>