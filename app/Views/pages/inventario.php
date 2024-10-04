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
    <title>Document</title>
    <link rel="stylesheet" href="/assets/css/inventario.css" />
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
    <script src="/assets/js/inventario.js"></script>
</head>

<body>
    <h1 style="text-align: center">Gestión de Productos</h1>

    <!-- Formulario para agregar productos -->
    <div id="modalContainer">

    </div>

    <!-- Botón para abrir el modal de agregar producto -->
    <div class="button-container">
        <div class="ui button green" id="addProductButton" tabindex="0">
            Agregar Producto
        </div>
        <!-- Formularios para Exportar e Importar -->
        <form id="exportForm" action="exportar_excel.php" method="post">
            <!-- Usamos un botón de Fomantic con clases -->
            <div type="button" class="ui green basic button" id="exportExcelButton">
                <i class="file excel icon"></i>
                <i class="arrow alternate circle up outline icon"></i>
                Exportar a Excel
            </div>
        </form>
        <form id="importForm" action="importar_excel.php" method="post" enctype="multipart/form-data">
            <input type="file" name="excelFile" id="excelFile" style="display: none" />
            <label for="excelFile" class="ui green basic button">
                <i class="file excel icon"></i>
                <i class="arrow alternate circle down outline icon"></i>
                Importar Excel
            </label>
        </form>
    </div>

    <div class="ui category search">
        <div class="ui icon input" style="width: 100%">
            <input class="prompt" type="text" id="searchProduct" placeholder="Buscar Producto..." />
            <i class="search icon"></i>
        </div>
        <div class="results"></div>
    </div>

    <!-- Tabla de productos -->
    <div class="main-container">
        <table class="ui celled long scrolling table">
            <thead>
                <tr>
                    <th class="center aligned">Producto</th>
                    <th class="center aligned">Cantidad</th>
                    <th class="center aligned">Precio Unitario</th>
                    <th class="center aligned">Categoría</th>
                    <th class="center aligned">Proveedor</th>
                    <th class="center aligned">Fecha de Ingreso</th>
                    <th class="center aligned">Ubicación</th>
                    <th colspan="2;" class="center aligned two wide">Acciones</th>
                </tr>
            </thead>
            <tbody id="productTableBody"></tbody>
        </table>
    </div>
</body>

<link rel="stylesheet" type="text/css"
    href="https://cdnjs.cloudflare.com/ajax/libs/fomantic-ui/2.9.3/semantic.min.css" />
<script src="https://cdnjs.cloudflare.com/ajax/libs/fomantic-ui/2.9.3/semantic.min.js"></script>

<script>
    // Cargar el modal cuando se hace clic en el botón
    $('#agregarProveedor').on('click', function(event) {
        event.preventDefault();
        // Cargar la vista del modal dinámicamente usando AJAX
        $('#modalContainer').load('<?= base_url('modal-agregar-producto') ?>', function() {
            // Mostrar el modal después de cargarlo
            $('#providerModal').modal('show');
        });
    });
</script>

</html>