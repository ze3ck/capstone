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
    <title>OptiFlow | Movimientos</title>
    <link rel="shortcut icon" href="/assets/img/opti.ico" />
    <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/fomantic-ui@2.9.3/dist/semantic.min.css" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com/" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
    <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
    <link rel="stylesheet" href="/assets/css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/fomantic-ui/2.8.8/semantic.min.css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
    
</head>

<body>
    <!-- sessionControllerModal.php -->
    <?= $this->include('components/sessionControllerModal') ?>
    <!-- sessionControllerModal.php -->
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

        <div style="margin-left: 2%; margin-right: 2%;  margin-top: 3%">

            <h2 class="ui center aligned icon header">
                <i class="exchange alternate icon" style="visibility: visible;"></i>
                Movimientos
            </h2>
            <div class="ui grid">
                <!-- Tipo -->
                <div class="three wide column">
                    <select name="clinica" class="ui selection dropdown" id="dropDownTipomov">
                        <!-- <option value="">Tipo</option> -->
                        <option value="1">ENTRADA</option>
                        <option value="2">SALIDA</option>
                    </select>
                    <!-- <script>
                        $('#dropDownTipomov').dropdown({
                            ignoreDiacritics: true,
                            fullTextSearch: 'exact'
                        });
                    </script> -->
                </div>

                <!-- Fecha Desde -->
                <div class="three wide column">
                    <div class="field">
                        <div class="ui calendar large" id="fechaInicio">
                            <div class="ui input left icon tiny">
                                <i class="calendar icon"></i>
                                <input type="text" placeholder="Fecha Desde" id="fechaDesde">
                            </div>
                        </div>
                        <!-- <script>
                            $("#fechaInicio").calendar({
                                type: "date",
                                text: {
                                    days: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
                                    months: [
                                        "Enero",
                                        "Febrero",
                                        "Marzo",
                                        "Abril",
                                        "Mayo",
                                        "Junio",
                                        "Julio",
                                        "Agosto",
                                        "Septiembre",
                                        "Octubre",
                                        "Noviembre",
                                        "Diciembre",
                                    ],
                                    monthsShort: [
                                        "Ene",
                                        "Feb",
                                        "Mar",
                                        "Abr",
                                        "May",
                                        "Jun",
                                        "Jul",
                                        "Ago",
                                        "Sep",
                                        "Oct",
                                        "Nov",
                                        "Dic",
                                    ],
                                    today: "Hoy",
                                    now: "Ahora",
                                    am: "AM",
                                    pm: "PM",
                                },
                                formatter: {
                                    date: function(date, settings) {
                                        if (!date) return "";
                                        var day = date.getDate();
                                        var month = date.getMonth() + 1;
                                        var year = date.getFullYear();
                                        return (
                                            year +
                                            "-" +
                                            (month < 10 ? "0" + month : month) +
                                            "-" +
                                            (day < 10 ? "0" + day : day)
                                        );
                                    },
                                },
                            });
                        </script> -->
                    </div>
                </div>

                <!-- Fecha Hasta -->
                <div class="three wide column">
                    <div class="field">
                        <div class="ui calendar large" id="fechaFin">
                            <div class="ui input left icon tiny">
                                <i class="calendar icon"></i>
                                <input type="text" placeholder="Fecha Hasta" id="fechaHasta">
                            </div>
                        </div>
                        <!-- <script>
                            $("#fechaFin").calendar({
                                type: "date",
                                text: {
                                    days: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
                                    months: [
                                        "Enero",
                                        "Febrero",
                                        "Marzo",
                                        "Abril",
                                        "Mayo",
                                        "Junio",
                                        "Julio",
                                        "Agosto",
                                        "Septiembre",
                                        "Octubre",
                                        "Noviembre",
                                        "Diciembre",
                                    ],
                                    monthsShort: [
                                        "Ene",
                                        "Feb",
                                        "Mar",
                                        "Abr",
                                        "May",
                                        "Jun",
                                        "Jul",
                                        "Ago",
                                        "Sep",
                                        "Oct",
                                        "Nov",
                                        "Dic",
                                    ],
                                    today: "Hoy",
                                    now: "Ahora",
                                    am: "AM",
                                    pm: "PM",
                                },
                                formatter: {
                                    date: function(date, settings) {
                                        if (!date) return "";
                                        var day = date.getDate();
                                        var month = date.getMonth() + 1;
                                        var year = date.getFullYear();
                                        return (
                                            year +
                                            "-" +
                                            (month < 10 ? "0" + month : month) +
                                            "-" +
                                            (day < 10 ? "0" + day : day)
                                        );
                                    },
                                },
                            });
                        </script> -->
                    </div>
                </div>

                <!-- Categoria -->
                <div class="three wide column">
                    <select class="ui selection dropdown" id="selectCategoria">

                    </select>
                </div>

                <!-- Responsable -->
                <div class="three wide column">
                    <div class="field">
                        <select class="ui selection dropdown" id="selectResponsable" placeholder="Responsable">
                        <option value="" style="color:gray;">categoría</option>

                        </select>
                    </div>
                </div>

                <!-- Metodo Pago -->
                <div class="three wide column">
                    <div class="field">
                        <select class="ui selection dropdown" id="selectMetodoPago">
                            <option value="EFECTIVO">EFECTIVO</option>
                            <option value="DEBITO">DEBITO</option>
                            <option value="CREDITO">CREDITO</option>
                            <option value="TRANSFERENCIA">TRANSFERENCIA</option>
                        </select>
                    </div>
                </div>

                <!-- Boton limpiar filtro -->
                <div class="two wide column">
                    <div class="field">
                        <button class="ui green button" id="btnLimpiarFiltros">Limpiar Filtros</button>
                    </div>
                </div>
            </div>


            <table class="ui unstackable celled very small scrolling table" id="tblMovimientos">
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
            <button id="btnNuevoMovimiento" class="ui blue button">Nueva Salida Producto</button>
            <button id="btnNuevoGastoOperativo" class="ui blue button">Nuevo Gasto Operativo</button>

        </div>
    </div>

    <!-- MODAL DETALLE MOVIMIENTO -->
    <div class="ui large modal" id="modalDetalleMovimientos">
        <div class="header">Detalle de Movimiento</div>
        <div class="content">
            <table class="ui unstackable celled very small scrolling table" id="tblDetalleMovimientos">
                <thead>
                    <tr>
                        <th>ID Movimiento</th>
                        <th>Item</th>
                        <th>Producto</th>
                        <th>Lote</th>
                        <th>Cantidad</th>
                        <th>Precio</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody id="tblDetalleMovimientos_body">
                </tbody>
            </table>
        </div>
        <div class="actions">
            <button class="negative ui button">Cerrar</button>
        </div>
    </div>



    <!-- Modal para Generar Salida de Producto -->
    <div class="ui modal" id="modalGenerarSalida">
        <div class="header">Nueva Salida de Producto</div>
        <div class="content">
            <form class="ui form">
                <div class="field">
                    <label>Producto</label>
                    <select class="ui dropdown" name="producto" id="productoDropdown">
                        <option value="">Seleccionar</option>
                        <option value="1">ENTRADA DE LAPTOPS AL INVENTARIO</option>
                        <option value="2">SALIDA DE ROUTERS PARA CLIENTE</option>
                    </select>
                </div>
                <div class="field">
                    <label>Disponibilidad en Inventario</label>
                    <b>10</b>
                    <b>10</b>
                </div>
                <div class="field">
                    <label>Tipo de Pago</label>
                    <b>Efectivo</b>
                </div>
                <div class="field">
                    <label>Cantidad</label>
                    <input type="number" name="cantidad" placeholder="Cantidad">
                </div>
                <div class="field">
                    <label>Precio ($)</label>
                    <input type="number" name="precio" placeholder="1000" min="0" step="0.01">
                </div>
                <div class="field">
                    <label>Descuento (%)</label>
                    <input type="number" name="descuento" placeholder="0">
                </div>
                <button type="button" class="ui button" id="agregarProducto">Agregar Producto</button>

                <table class="ui unstackable celled very small scrolling table">
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Unidad</th>
                            <th>Precio</th>
                        </tr>
                    </thead>
                    <tbody id="productList">
                    </tbody>
                </table>

                <div class="ui grid">
                    <div class="four wide column">TOTAL:</div>
                    <div class="twelve wide column right aligned">
                        <strong>$<span id="totalAmount">0</span></strong>
                    </div>
                </div>
            </form>
        </div>
        <div class="actions">
            <button class="ui positive button">Generar Salida</button>
            <button class="ui negative button">Cancelar</button>
        </div>
    </div>

    <!-- Modal para Generar Gasto Operativo -->
    <div class="ui large modal" id="modalNuevoGastoOperativo">
        <div class="header">Nuevo Gasto Operativo</div>
        <div class="content">
            <form class="ui form">
                <div class="field">
                    <label>Descripción</label>
                    <input type="text" id="descripcion" placeholder="Descripción">
                </div>
                <div class="field">
                    <label>Monto</label>
                    <input type="number" id="monto" placeholder="Monto" min="0">
                </div>
                <div class="field">
                    <label>Categoría</label>
                    <select id="selectCategoriaGastoOperacional">
                        <option value="">LLenar dinamico</option>
                        <option value="">Recreacion</option>
                        <option value="">Servicion</option>
                    </select>

                </div>
        </div>
        <div class="actions">
            <button class="ui positive button">Guardar</button>
            <button class="ui negative button">Cancelar</button>
        </div>
    </div>


    
    <!-- <script src="/assets/js/charts.js"></script> -->


    </div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/fomantic-ui/2.8.8/semantic.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.slim.min.js"></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/fomantic-ui@2.9.3/dist/semantic.min.js"></script>
    <script type="module" src="/assets/js/movimientos.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/ag-charts-community@7.0.0/dist/ag-charts-community.min.js"></script>
    <script src="/assets/js/dashboard.js"></script>
    <script type="module" src="/assets/js/movimientos.js"></script>
</body>

</html>