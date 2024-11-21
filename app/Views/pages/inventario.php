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
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
    <link rel="shortcut icon" href="/assets/img/opti.ico" />
    <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/fomantic-ui@2.9.3/dist/semantic.min.css" />
    <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
    <!-- <link rel="stylesheet" href="/assets/css/style.css"> -->
    <link rel="stylesheet" href='/assets/css/inventario.css' />

</head>

<body style="min-width: 1200px; min-height: 800px">
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
                <p><?php echo $saludo . ', ' . $_SESSION['nombre'] . ' ' . $_SESSION['apaterno'] ?></p>
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
                    <div class="ui form" id="formulario" method="POST">
                        <div class="two fields">
                            <div class="field">
                                <label>Nombre Producto</label>
                                <input type="text" name="P_NOMBRE_PRODUCTO" id="nombreField" placeholder="Nombre Producto" required>
                            </div>
                            <div class="field">
                                <label>Descripción Producto</label>
                                <input type="text" name="P_DESCRIPCION_PROD1" id="descripcionField" placeholder="Descripción Producto" required>
                            </div>
                        </div>
                        <div class="two fields">
                            <div class="field">
                                <label>Unidad de Medida</label>
                                <select class="ui dropdown" name="P_UNIDAD_MEDIDA" id="unidadField" required>
                                    <option value="">Seleccione</option>
                                </select>
                            </div>
                            <span id="ID_USUARIO" style="display:none">
                                <?php echo $_SESSION['user_id'] ?></span>
                            <div class="field">
                                <label>Proveedor</label>
                                <select class="ui dropdown proveedorField" name="P_ID_PROVEEDOR" id="proveedorField" required>
                                    <option value="">Seleccione Proveedor</option>
                                </select>
                                <div class="ui icon button" id="infoButton" data-title="Información"
                                    data-content="Si no encuentra a su proveedor vaya a la sección de proveedores para agregar a su nuevo proveedor"
                                    data-position="bottom center" style="margin-top: 5px; background-color: transparent;">
                                    <i class="info circle big icon"></i>
                                </div>
                            </div>
                        </div>
                        <div class="field">
                            <label>ID Lote</label>
                            <input type="text" name="P_ID_LOTE" id="idNuevoLote" placeholder="ID del Lote" required>
                        </div>
                        <div class="two fields">
                            <div class="field">
                                <label>Fecha de Vencimiento</label>
                                <div class="ui calendar" id="calendarioVencimiento">
                                    <div class="ui input left icon">
                                        <i class="calendar icon"></i>
                                        <input type="text" name="P_FECHA_VENCIMIENTO" id="nuevaFechaVenc" placeholder="Fecha de Vencimiento">
                                    </div>
                                </div>
                            </div>
                            <div class="field">
                                <label>Fecha de Compra</label>
                                <div class="ui calendar" id="calendarioCompra">
                                    <div class="ui input left icon">
                                        <i class="calendar icon"></i>
                                        <input type="text" name="P_FECHA_COMPRA" id="nuevaFechaComp" placeholder="Fecha de Compra" required>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="two fields">
                            <div class="field">
                                <label>Cantidad</label>
                                <input type="number" name="P_CANTIDAD" id="nuevaCantidad" placeholder="Cantidad" required>
                            </div>
                            <div class="field">
                                <label>Precio de Compra</label>
                                <input type="number" name="P_PRECIO_COMPRA" id="nuevoPrecioComp" step="0.01" placeholder="Precio de Compra"
                                    required>
                            </div>
                            <div class="field">
                                <label>Precio de Venta</label>
                                <input type="number" name="P_PRECIO_VENTA" id="nuevoPrecioVenta" step="0.01" placeholder="Precio de Venta"
                                    required>
                            </div>
                        </div>
                    </div>
                </div>
                <span id="ID_USUARIO" style="display: none;"><?php echo session('user_id'); ?></span>
                <span id="ROL" style="display: none;"><?php echo session('rol'); ?></span>
                <!-- Datos Lote -->
                <div id="datosLote" style="margin-top: 20px;">
                    <h4>Datos Lote</h4>
                    <div class="ui form">
                        <div class="two fields">
                            <div class="field">
                                <label>Producto</label>
                                <select id="productoDropdown" class="ui dropdown"> </select>
                            </div>
                            <div class="field">
                                <label>ID Lote</label>
                                <input type="text" name="P_ID_LOTE" placeholder="ID del Lote" id="idLote" required>
                            </div>
                        </div>
                    </div>
                    <div class="ui form">
                        <div class="two fields">
                            <div class="field">
                                <label>Fecha de Vencimiento</label>
                                <div class="ui calendar" id="calendarioVencimientoLote">
                                    <div class="ui input left icon">
                                        <i class="calendar icon"></i>
                                        <input type="text" name="P_FECHA_VENCIMIENTO" placeholder="Fecha de Vencimiento" id="calendarioVencLote">
                                    </div>
                                </div>
                            </div>
                            <div class="field">
                                <label>Fecha de Compra</label>
                                <div class="ui calendar" id="calendarioCompraLote">
                                    <div class="ui input left icon">
                                        <i class="calendar icon"></i>
                                        <input type="text" name="P_FECHA_COMPRA" placeholder="Fecha de Compra" id="calendarioCompLote" required>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="two fields">
                            <div class="field">
                                <label>Cantidad</label>
                                <input type="number" name="P_CANTIDAD" placeholder="Cantidad" id="cantidadLote" required>
                            </div>
                            <div class="field">
                                <label>Precio de Compra</label>
                                <input type="number" name="P_PRECIO_COMPRA" step="0.01" placeholder="Precio de Compra" id="precioCompLote"
                                    required>
                            </div>
                            <div class="field">
                                <label>Precio de Venta</label>
                                <input type="number" name="P_PRECIO_VENTA" step="0.01" placeholder="Precio de Venta" id="precioVentaLote"
                                    required>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="actions">
                <input type="hidden" name="P_ID_USUARIO" value="<?php echo $_SESSION['user_id']; ?>">
                <button class="ui green button" id="saveProductButton">Guardar</button>
                <button class="ui red cancel button">Cancelar</button>
            </div>
        </div>
        <!-- EDITAR MODAL -->
        <div id="editModal" class="ui modal">
            <div class="header">Editar ingreso de inventario</div>
            <div class="content">
                <!-- Datos Productos, se oculta inicialmente -->
                <div style="margin-top: 10px;">
                    <h4>Datos Productos</h4>
                    <div class="ui form">
                        <!-- Campo oculto para ID Producto -->
                        <input type="hidden" name="P_ID_PRODUCTO" id="idProductoEdit">

                        <div class="two fields">
                            <div class="field">
                                <label>Nombre Producto</label>
                                <input type="text" name="P_NOMBRE_PRODUCTO" id="nombreProductoEdit" placeholder="Nombre Producto" required>
                            </div>
                            <div class="field">
                                <label>Lote</label>
                                <select class="ui clearable dropdown" id="idLoteEdit">
                                    <option value="">Seleccionar Lote</option>
                                </select>
                                <div class="ui checked checkbox">
                                    <input type="checkbox" checked="">
                                    <label>Usar este Lote</label>
                                </div>
                            </div>
                        </div>

                        <div class="two fields">
                            <div class="field">
                                <label>Unidad de Medida</label>
                                <select class="ui dropdown" name="P_UNIDAD_MEDIDA" id="unidadMedidaEdit" required>
                                    <option value="">Seleccione</option>
                                </select>
                            </div>
                            <div class="field">
                                <label>Total Cantidad</label>
                                <input type="number" name="P_CANTIDAD" id="totalCantidadEdit" placeholder="Cantidad Total" required>
                            </div>
                        </div>

                        <div class="two fields">
                            <div class="field">
                                <label>Precio de Compra</label>
                                <input type="number" name="P_PRECIO_COMPRA" id="precioCompraEdit" step="0.01" placeholder="Precio de Compra" required>
                            </div>
                            <div class="field">
                                <label>Precio de Venta</label>
                                <input type="number" name="P_PRECIO_VENTA" id="precioVentaEdit" step="0.01" placeholder="Precio de Venta" required>
                            </div>
                        </div>

                        <div class="two fields">
                            <div class="field">
                                <label>Proveedor</label>
                                <select class="ui dropdown proveedorField" name="P_ID_PROVEEDOR" id="proveedorEditField" required>
                                    <option value="">Seleccione Proveedor</option>
                                </select>
                            </div>

                            <div class="field">
                                <label>Descripción Producto</label>
                                <input type="text" name="P_DESCRIPCION_PRODUCTO" id="descripcionProductoEdit" placeholder="Descripción Producto" required>
                            </div>
                        </div>

                        <div class="two fields">
                            <div class="field">
                                <label>Fecha de Vencimiento</label>
                                <div class="ui calendar" id="calendarioVencimientoEdit">
                                    <div class="ui input left icon">
                                        <i class="calendar icon"></i>
                                        <input type="text" name="P_FECHA_VENCIMIENTO" id="fechaVencimientoEdit" placeholder="Fecha de Vencimiento">
                                    </div>
                                </div>
                            </div>
                            <div class="field">
                                <label>Fecha de Compra</label>
                                <div class="ui calendar" id="calendarioCompraEdit">
                                    <div class="ui input left icon">
                                        <i class="calendar icon"></i>
                                        <input type="text" name="P_FECHA_COMPRA" id="fechaCompraEdit" placeholder="Fecha de Compra" required>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="actions">
                <!-- Campo oculto para ID Usuario -->
                <span id="idUsuarioEdit" style="display: none;"><?php echo session('user_id'); ?></span>
                <button class="ui green button" id="editProductButton">Guardar</button>
                <button class="ui red cancel button" id="editProductButtonCancel">Cancelar</button>
            </div>
        </div>

        <!-- Tabla de productos -->
        <div style="margin-top: 3%; margin-right: 2%; margin-left: 3%;">
            <!-- Buscador -->
            <div class="ui grid">
                <div class="left aligned three wide column">
                    <div class="ui form">
                        <div class="field">
                            <label>Filtrar por Estado:</label>
                            <select id="estadoDropdown" class="ui dropdown">
                                <option value="">Todos</option>
                                <option value="1">Activo</option>
                                <option value="2">Inactivo</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="three wide column">
                    <label>Filtrar por Proveedor:</label>
                    <div class="ui fluid search selection dropdown" id="selectProveedor">
                        <input type="hidden">
                        <i class="dropdown icon"></i>
                        <div class="default text">Proveedor</div>
                        <div class="menu">
                        </div>
                    </div>
                </div>
                <!-- <div class="three wide column">
                    <label>Filtrar por producto:</label>
                    <div class="ui fluid search selection dropdown" id="selectProducto">
                        <input type="hidden">
                        <i class="dropdown icon"></i>
                        <div class="default text">Producto</div>
                        <div class="menu">
                        </div>
                    </div>
                </div> -->
            </div>
            <!-- Botón para abrir el modal de generar producto -->
            <div class="ui grid" style="margin-bottom: 20px;">
                <div class="left aligned eight wide column">
                    <div class="ui buttons">
                        <button class="ui green button" id="addProductButton">Generar Producto</button>
                        <button class="ui green basic button" id="exportExcelButton">
                            <i class="file excel icon"></i> Exportar a Excel
                        </button>
                        <label style="display:none" for="excelFile" class="ui green basic button">
                            <i class="file excel icon"></i> Importar Excel
                        </label>
                    </div>
                    <!-- Formulario para cargar el archivo de importación -->
                    <form id="importForm" action="importar_excel.php" method="post" enctype="multipart/form-data" style="display: none;">
                        <input type="file" name="excelFile" id="excelFile" />
                    </form>
                </div>
            </div>

            <table class="ui celled large unstackable scrolling table">
                <thead>
                    <tr>
                        <th id="id-producto" class="center aligned" style="cursor: pointer">ID Producto <i class="fas fa-sort" id="sortIcon" style="cursor: pointer"></i></th>
                        <th class="center aligned">Nombre Producto</th>
                        <th class="center aligned">Descripción Producto</th>
                        <th class="center aligned">Unidad de Medida</th>
                        <th class="center aligned">Total Cantidad</th>
                        <!-- <th class="center aligned">Precio Compra</th> -->
                        <th class="center aligned">Fecha Compra</th>
                        <th class="center aligned">Nombre Proveedor</th>
                        <th class="center aligned">Estado</th>
                        <?php if (session('rol') == 1): ?>
                            <th class="center aligned wide actions-column">Acciones</th>
                        <?php endif; ?>
                    </tr>
                </thead>
                <tbody id="productTableBody"></tbody>
            </table>

        </div>

        <!-- 
        <div class="table-container">


        </div> -->

</body>

<!-- Scripts  -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.0/xlsx.full.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>

<link rel="stylesheet" type="text/css"
    href="https://cdnjs.cloudflare.com/ajax/libs/fomantic-ui/2.9.3/semantic.min.css" />
<script src="https://cdnjs.cloudflare.com/ajax/libs/fomantic-ui/2.9.3/semantic.min.js"></script>
<script type="module" src='/assets/js/inventario.js'></script>
<script type="module" src="/assets/js/dashboard.js"></script>
<!-- Scripts  -->

</html>