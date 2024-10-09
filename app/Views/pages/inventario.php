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
    <title>OptiFlow | Inventario</title>
    <link rel="shortcut icon" href="/assets/img/opti.ico" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
    <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/fomantic-ui@2.9.3/dist/semantic.min.css" />
    <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
    <link rel="stylesheet" href="/assets/css/style.css">
    <link rel="stylesheet" href='/assets/css/inventario.css' />
    <script type="module" src='/assets/js/inventario.js'></script>
    <script type="module" src="/assets/js/dashboard.js"></script>
</head>

<body>
    <!-- sessionControllerModal.php -->
    <?= $this->include('components/sessionControllerModal') ?>
    <!-- sessionControllerModal.php -->
    <!-- sidebar.php -->
    <?php include __DIR__ . '/../components/sidebar.php'; ?>
    <!-- sidebar.php -->
    <div id="loader" class="ui active dimmer">
        <div class="ui text loader">Loading</div>
    </div>
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
        <h1 class="titulo-gestion-prod" style="text-align: center; margin-top: 4%;">Gestión de Productos</h1>
        <!-- Formulario para generar productos -->
        <div id="modalContainer">
            <!-- Modal para editar producto -->
            <div class="ui modal" id="editProductModal">
                <div class="header">Editar Producto</div>
                <form class="ui form" style="margin: 20px 50px">
                    <h4 class="ui dividing header">Información del Producto</h4>

                    <div class="two fields">
                        <div class="field">
                            <label>Nombre del Producto</label>
                            <input type="text" id="editProductName" required />
                        </div>
                        <div class="field">
                            <label>Categoría</label>
                            <select id="editCategory" class="ui dropdown" required>
                                <option value="fruits">Frutas y Verduras</option>
                                <option value="dairy">Lácteos</option>
                                <option value="bakery">Panadería</option>
                                <option value="beverages">Bebidas</option>
                            </select>
                        </div>
                    </div>

                    <div class="ui large checkbox" style="margin-bottom: 10px">
                        <input type="checkbox" id="editIsPerishable" />
                        <label>Producto Perecible (Opcional)</label>
                    </div>

                    <div class="two fields">
                        <div class="field">
                            <label>Cantidad</label>
                            <input type="number" id="editQuantity" step="0.01" required />
                        </div>
                        <div class="field">
                            <label>Precio Unitario</label>
                            <input type="number" id="editUnitPrice" step="0.01" required />
                        </div>
                    </div>

                    <div class="field">
                        <label>Proveedor</label>
                        <input type="text" id="editSupplier" required />
                    </div>
                    <div class="field">
                        <label>Fecha de Ingreso</label>
                        <input type="date" id="editEntryDate" required />
                    </div>
                    <div class="actions">
                        <div id="saveEditProductModal" class="ui green approve button">
                            Guardar Cambios
                        </div>
                        <div class="ui red cancel button">Cancelar</div>
                    </div>
                </form>
            </div>

            <!-- Modal de generar producto -->
            <div class="ui modal" id="productModal">
                <div class="header">Nuevo ingreso de inventario</div>
                <div class="content">
                    <!-- Checkbox para controlar la visualización de Datos Productos -->
                    <div class="ui checkbox" id="newProductCheckbox">
                        <input type="checkbox" name="new-product">
                        <label>Producto nuevo</label>
                    </div>

                    <!-- Datos Productos, se oculta inicialmente -->
                    <div id="datosProducto" style="display: none; margin-top: 10px;">
                        <h4>Datos Productos</h4>
                        <div class="ui form">
                            <div class="two fields">
                                <div class="field">
                                    <label>Nombre Producto</label>
                                    <input type="text" name="nombre-producto" placeholder="Nombre Producto">
                                </div>
                                <div class="field">
                                    <label>Descripción</label>
                                    <input type="text" name="nombre-producto" placeholder="Nombre Producto">
                                </div>
                            </div>
                            <div class="two fields">

                                <div class="field">
                                    <label>Unidad de Medida</label>
                                    <select class="ui dropdown">
                                        <option value="">Seleccione</option>
                                        <option value="unidad">Unidad</option>
                                        <option value="unidad">Gramos/Mililitros</option>
                                    </select>
                                </div>
                                <div class="field">
                                    <label>Proveedor</label>
                                    <select class="ui dropdown">
                                        <option value="">Seleccione</option>
                                        <option value="proveedor1">Proveedor 1</option>
                                        <option value="proveedor2">Proveedor 2</option>
                                    </select>
                                    <div class="ui icon button info-button" style="margin-top: 5px; background-color: transparent;" title="Si no encuentra a su proveedor vaya a la sección de proveedores para agregar a su nuevo proveedor">
                                        <i class="info circle big icon"></i>
                                    </div>
                                </div>
                            </div>


                        </div>
                    </div>

                    <!-- Datos Lote -->
                    <div id="datosLote" style="margin-top: 20px;">
                        <h4>Datos Lote</h4>
                        <div class="ui form">
                            <div class="field">
                                <label>Nro. Lote</label>
                                <input type="text" name="nro-lote" placeholder="Nro. Lote">
                            </div>
                            <div class="field">
                                <label>Buscar Producto</label>
                                <select class="ui dropdown">
                                    <option value="">Seleccione</option>
                                    <option value="productos">Proveedor 1</option>
                                </select>
                            </div>
                            <div class="field">
                                <label>Precio Compra</label>
                                <input type="number" name="precio-compra" placeholder="Precio Compra">
                            </div>
                            <div class="field">
                                <label>Cantidad</label>
                                <input type="number" name="cantidad" placeholder="Cantidad">
                            </div>
                            <div class="field">
                                <label>Precio Venta</label>
                                <input type="number" name="precio-venta" placeholder="Precio Venta">
                            </div>
                        </div>
                    </div>
                </div>

                <div class="actions">
                    <button class="ui button">Guardar</button>
                    <button class="ui button">Cancelar</button>
                </div>
            </div>
        </div>

        <!-- Botón para abrir el modal de generar producto -->
        <div class="button-container">
            <div class="ui button green" id="addProductButton" tabindex="0">
                Generar Producto
            </div>
            <!-- Formularios para Exportar e Importar -->
            <form id="exportForm" action="exportar_excel.php" method="post">
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
        <!-- Buscador  -->

        <div class="ui category search">
            <div class="ui icon input" style="width: 100%">
                <input class="prompt" type="text" id="searchProduct" placeholder="Buscar por producto, proveedor o categoría..." />
                <i class="search icon"></i>
            </div>
            <div class="results"></div>
        </div>
        <span id="ID_USUARIO" style="display: none;"><?php echo session('user_id'); ?></span>
        <span id="ROL" style="display: none;"><?php echo session('rol'); ?></span>

        <!-- Tabla de productos -->
        <div class="main-container">
            <table class="ui celled long scrolling table">
                <thead>
                    <tr>
                        <th class="center aligned">ID Producto</th>
                        <th class="center aligned">Nombre Producto</th>
                        <th class="center aligned">Descripción Producto</th>
                        <th class="center aligned">Unidad de Medida</th>
                        <th class="center aligned">Total Cantidad</th>
                        <th class="center aligned">Precio Venta</th>
                        <th class="center aligned">Nombre Proveedor</th>
                        <th class="center aligned">Fecha Compra</th>
                        <th class="center aligned">Estado</th>
                        <th class="center aligned trhee wide">Acciones</th>
                    </tr>
                </thead>
                <tbody id="productTableBody"></tbody>
            </table>
        </div>
    </div>
    <!-- scripts  -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.slim.min.js"></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/fomantic-ui@2.9.3/dist/semantic.min.css" />
    <script src="https://cdn.jsdelivr.net/npm/fomantic-ui@2.9.3/dist/semantic.min.js"></script>
    <link rel="stylesheet" type="text/css"
        href="https://cdnjs.cloudflare.com/ajax/libs/fomantic-ui/2.9.3/semantic.min.css" />
    <script src="https://cdnjs.cloudflare.com/ajax/libs/fomantic-ui/2.9.3/semantic.min.js"></script>
    <script src="/assets/js/dashboard.js"></script>
</body>


</html>