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
    <title>OptiFlow - Inventario</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
    <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/fomantic-ui@2.9.3/dist/semantic.min.css" />
    <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
    <link rel="stylesheet" href="/assets/css/inventario.css" />
    <link rel="stylesheet" href="/assets/css/styles.css" />
    <script src="/assets/js/inventario.js"></script>
</head>

<body>
    <!-- sidebar.php -->
    <?php include __DIR__ . '/../components/sidebar.php'; ?>
    <!-- sidebar.php -->

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
        <h1 style="text-align: center; margin-top: 4%;">Gestión de Productos</h1>

        <!-- Formulario para agregar productos -->
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

            <!-- Modal de agregar producto -->
            <div class="ui modal" id="productModal">
                <div class="header">Agregar Producto</div>
                <form class="ui form" style="margin: 20px 50px">
                    <h4 class="ui dividing header">Información del Producto</h4>

                    <div class="two fields">
                        <div class="field">
                            <label>Nombre del Producto</label>
                            <input id="inputNombre" type="text" name="product-name" placeholder="Ej: Manzanas" required />
                        </div>
                        <div class="field">
                            <label>ID Lote</label>
                            <input id="idlote" type="text" name="product-name" placeholder="Ej: Lote123" required />
                        </div>
                        <div class="field">
                            <label>Categoría</label>
                            <select id="categoria" name="category" class="ui dropdown" required>
                                <option value="">Selecciona Categoría</option>
                                <option value="fruits">Frutas y Verduras</option>
                                <option value="dairy">Lácteos</option>
                                <option value="bakery">Panadería</option>
                                <option value="beverages">Bebidas</option>
                            </select>
                        </div>
                    </div>
                    <div class="ui form">
                        <div class="grouped fields">
                            <div class="field">
                                <div class="ui radio checkbox">
                                    <input type="radio" name="perecibilidad" value="perecible" checked="checked">
                                    <label>Perecible</label>
                                </div>
                            </div>
                            <div class="field">
                                <div class="ui radio checkbox">
                                    <input type="radio" name="perecibilidad" value="no_perecible">
                                    <label>No Perecible</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="two fields">
                        <div class="field">
                            <label>Cantidad</label>
                            <input id="cantidad" type="number" name="quantity" placeholder="Ej: 10.00" step="0.01" required />
                        </div>
                        <div class="field">
                            <label>Precio Unitario</label>
                            <input type="number" name="unit-price" placeholder="Ej: 1000" step="0.01" required />
                        </div>
                    </div>
                    <div class="field">
                        <label>Proveedor</label>
                        <input type="text" name="supplier" placeholder="Ej: Santiago Natural Food" required />
                    </div>
                    <div class="field">
                        <label>Fecha de Ingreso</label>
                        <input type="date" name="entry-date" required />
                    </div>
                    <div class="actions">
                        <div id="addProductModal" class="ui green approve button">
                            Agregar
                        </div>
                        <div class="ui red cancel button">Cancelar</div>
                    </div>
                </form>
            </div>
        </div>

        <!-- Botón para abrir el modal de agregar producto -->
        <div class="button-container">
            <div class="ui button green" id="addProductButton" tabindex="0">
                Agregar Producto
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
                        <th colspan="2;" class="center aligned two wide">Acciones</th>
                    </tr>
                </thead>
                <tbody id="productTableBody"></tbody>
            </table>
        </div>
    </div>
</body>

<link rel="stylesheet" type="text/css"
    href="https://cdnjs.cloudflare.com/ajax/libs/fomantic-ui/2.9.3/semantic.min.css" />
<script src="https://cdnjs.cloudflare.com/ajax/libs/fomantic-ui/2.9.3/semantic.min.js"></script>

<script>
    // Abrir el modal cuando se hace clic en el botón de "Agregar Producto"
    $('#addProductButton').on('click', function() {
        $('#productModal').modal('show');
    });

    // Acción para el botón "Agregar" dentro del modal
    $('#addProductModal').on('click', function() {
        // Aquí iría la lógica para agregar el producto
        alert('Producto agregado!');
        $('#productModal').modal('hide'); // Cerrar el modal después de agregar el producto
    });

    // Botón cancelar cierra el modal
    $('.cancel.button').on('click', function() {
        $('#productModal').modal('hide');
    });
</script>

</html>