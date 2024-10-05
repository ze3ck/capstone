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
    <title>OptiFlow - Movimientos</title>
    <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/fomantic-ui@2.9.3/dist/semantic.min.css" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
    <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
    <link rel="stylesheet" href="/assets/css/style.css">

    <script src="https://cdn.jsdelivr.net/npm/ag-charts-community@7.0.0/dist/ag-charts-community.min.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/fomantic-ui/2.8.8/semantic.min.css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />

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
        <!-- <div id="loader" class="ui active dimmer">
            <div class="ui text loader">Loading</div>
        </div> -->
        <!-- Contenido de la página -->

        <div class="ui container" style="margin-top:4%">

            <h2 class="ui center aligned icon header">
                <i class="dragon icon" style="visibility: visible;"></i>
                Movimientos
            </h2>
            <div class="ui equal width grid">
                <div class="column">
                    <select value="" name="clinica" class="ui clearable fluid search dropdown"
                        id="dropDownTipomov">
                        <option value="">Tipo</option>
                        <option value="1">ENTRADA</option>
                        <option value="1">SALIDA</option>
                    </select>
                    <script>
                        $('#dropDownTipomov').dropdown({
                            ignoreDiacritics: true,
                            fullTextSearch: 'exact'
                        });
                    </script>
                </div>
                <div class="column">
                    <div class="field">
                        <div class="ui calendar large" id="fechaInicio">
                            <div class="ui input left icon tiny">
                                <i class="calendar icon "></i>
                                <input type="text" placeholder="Fecha Desde" id="fechaDesde">
                            </div>
                        </div>
                        <script>
                            var today = new Date();
                            let set_date = new Date(2021, 12, 1);
                            //console.log(set_date);
                            $('#fechaInicio')
                                .calendar({
                                    type: 'date',
                                    minDate: set_date,
                                    maxDate: new Date(today.getFullYear(), today.getMonth(), today
                                        .getDate() - 1),
                                    text: {
                                        days: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
                                        months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo',
                                            'Junio', 'Julio', 'Agosto', 'Septiembre',
                                            'Octubre', 'Noviembre', 'Diciembre'
                                        ],
                                        monthsShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
                                            'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
                                        ],
                                        today: 'Hoy'
                                    }
                                });
                        </script>
                    </div>
                </div>
                <div class="column">Fecha Final</div>
                <div class="column">producto</div>
                <div class="equal width row">
                    <div class="column">
                        <table class="ui celled table" id="tblMovimientos">
                            <thead>
                                <tr>
                                    <th>ID Movimiento</th>
                                    <th>Tipo</th>
                                    <th>Fecha</th>
                                    <th>Total</th>
                                    <th>Descripción</th>
                                    <th>Categoría</th>
                                    <th>Responsable</th>
                                    <th>Metodo de Pago</th>
                                    <th>Detalle</th>
                                </tr>
                            </thead>
                            <tbody id="tblMovimientos_body">
                            </tbody>
                            <span id="ID_USUARIO" style="display:none">
                                <?php echo $_SESSION['user_id'] ?></span>
                        </table>
                        <button class="ui blue button">Generar Salida Producto</button>
                        <button class="ui blue button">Generar Entrada Producto</button>
                    </div>
                </div>
            </div>

            <!-- MODAL DETALLE MOVIMIENTO -->
            <div class="ui tiny modal" id="modalDetalleMovimientos">
                <div class="content">
                    <table class="ui celled table" id="tblDetalleMovimientos">
                        <thead>
                            <tr>
                                <th>ID Movimiento</th>
                                <th>Item</th>
                                <th>Producto</th>
                                <th>Lote</th>
                                <th>CAntidad</th>
                                <th>Precio</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody id="tblDetalleMovimientos_body">
                        </tbody>
                    </table>


                </div>

            </div>
        </div>

        <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/fomantic-ui/2.8.8/semantic.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.slim.min.js"></script>
        <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/fomantic-ui@2.9.3/dist/semantic.min.js"></script>
        <script type="module" src="/assets/js/movimientos.js"></script>
        <!-- <script src="/assets/js/charts.js"></script> -->

        <!-- Scripts -->
        <!-- <script>
            $(".menu .item").tab();
            $(".ui.dropdown").dropdown();

            $('#estado-dropdown').on('change', function() {
                var nuevoEstado = $(this).val();
                $('#estado-label').text(nuevoEstado);
            });
        </script> -->

    </div>
</body>

</html>