<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="../assets/css/producto.css">
</head>

<body>
    <h1 style="text-align: center;">Gestión de Productos</h1>

    <!-- Formulario para agregar productos -->
    <div class="ui modal" id="productModal">
        <div class="header">Agregar Producto</div>
        <form class="ui form" style="margin: 20px 50px;">
            <h4 class="ui dividing header">Información del Producto</h4>

            <div class="field">
                <label>Nombre del Producto</label>
                <input type="text" name="product-name" placeholder="Ej: Manzanas" required>
            </div>

            <div class="two fields">
                <div class="field">
                    <label>Cantidad</label>
                    <input type="number" name="quantity" placeholder="Ej: 10.00" step="0.01" required>
                </div>
                <div class="field">
                    <label>Precio Unitario</label>
                    <input type="number" name="unit-price" placeholder="Ej: 1000" step="0.01" required>
                </div>
            </div>

            <div class="field">
                <label>Categoría</label>
                <select name="category" class="ui dropdown" required>
                    <option value="">Selecciona Categoría</option>
                    <option value="fruits">Frutas y Verduras</option>
                    <option value="dairy">Lácteos</option>
                    <option value="bakery">Panadería</option>
                    <option value="beverages">Bebidas</option>
                </select>
            </div>

            <div class="field">
                <label>Proveedor</label>
                <input type="text" name="supplier" placeholder="Ej: Santiago Natural Food" required>
            </div>

            <div class="two fields">
                <div class="field">
                    <label>Fecha de Ingreso</label>
                    <input type="date" name="entry-date" required>
                </div>
                <div class="field">
                    <label>Fecha de Última Venta</label>
                    <input type="date" name="last-sale-date">
                </div>
            </div>

            <div class="field">
                <label>Ubicación</label>
                <input type="text" name="location" placeholder="Ej: Bodega A" required>
            </div>

            <!-- Botón para agregar el producto -->
        </form>
    </div>

    <!-- Botón para abrir el modal de agregar producto -->
    <div class="button-container">

        <div class="ui button green" id="addProductButton" tabindex="0">Agregar Producto</div>

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
            <input type="file" name="excelFile" id="excelFile" style="display: none;">
            <label for="excelFile" class="ui green basic button">
                <i class="file excel icon"></i>
                <i class="arrow alternate circle down outline icon"></i>
                Importar Excel
            </label>
        </form>
    </div>

    <div class="ui category search">
        <div class="ui icon input" style="width: 100%;">
            <input class="prompt" type="text" placeholder="Buscar Producto...">
            <i class="search icon"></i>
        </div>
        <div class="results"></div>
    </div>

    <!-- Tabla de productos -->
    <div class="main-container">
        <table class="ui celled long scrolling table">
            <thead>
                <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio Unitario</th>
                    <th>Categoría</th>
                    <th>Proveedor</th>
                    <th>Fecha de Ingreso</th>
                    <th>Fecha de Última Venta</th>
                    <th>Ubicación</th>
                    <th>Acción</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td data-label="producto">Manzanas</td>
                    <td data-label="cantidad">10.00</td>
                    <td data-label="precio_unitario">1000</td>
                    <td data-label="categoria">Frutas y Verduras</td>
                    <td data-label="proveedor">Santiago Natural Food</td>
                    <td data-label="fec_ing">20/10/2024</td>
                    <td data-label="fec_ult_venta">20/08/2024</td>
                    <td data-label="ubicacion">Bodega A</td>
                    <td data-label="accion">
                        <h2>
                            <i id="editIcon" class="edit icon" style="visibility: visible; color: rgb(255, 217, 0); cursor: pointer; ">
                                <div class="ui modal" id="productEditModal">
                                    <div class="header">Editar Producto</div>
                                    <form class="ui form" style="margin: 20px 50px;">
                                        <h4 class="ui dividing header">Información del Producto</h4>
                            
                                        <div class="field">
                                            <label>Nombre del Producto</label>
                                            <input type="text" name="product-name" placeholder="Ej: Manzanas" required>
                                        </div>
                            
                                        <div class="two fields">
                                            <div class="field">
                                                <label>Cantidad</label>
                                                <input type="number" name="quantity" placeholder="Ej: 10.00" step="0.01" required>
                                            </div>
                                            <div class="field">
                                                <label>Precio Unitario</label>
                                                <input type="number" name="unit-price" placeholder="Ej: 1000" step="0.01" required>
                                            </div>
                                        </div>
                            
                                        <div class="field">
                                            <label>Categoría</label>
                                            <select name="category" class="ui dropdown" required>
                                                <option value="">Selecciona Categoría</option>
                                                <option value="fruits">Frutas y Verduras</option>
                                                <option value="dairy">Lácteos</option>
                                                <option value="bakery">Panadería</option>
                                                <option value="beverages">Bebidas</option>
                                            </select>
                                        </div>
                            
                                        <div class="field">
                                            <label>Proveedor</label>
                                            <input type="text" name="supplier" placeholder="Ej: Santiago Natural Food" required>
                                        </div>
                            
                                        <div class="two fields">
                                            <div class="field">
                                                <label>Fecha de Ingreso</label>
                                                <input type="date" name="entry-date" required>
                                            </div>
                                            <div class="field">
                                                <label>Fecha de Última Venta</label>
                                                <input type="date" name="last-sale-date">
                                            </div>
                                        </div>
                            
                                        <div class="field">
                                            <label>Ubicación</label>
                                            <input type="text" name="location" placeholder="Ej: Bodega A" required>
                                        </div>
                            
                                        <div class="actions">
                                            <div class="ui green approve button">Aplicar</div>
                                            <div class="ui red cancel button">Cancelar</div>
                                        </div>
                                    </form>
                                </div>
                            </i>
                            <i id="deleteIcon" class="trash icon" style="visibility: visible; color: red; cursor: pointer;">
                                <div id="deleteModal" class="ui modal mini">
                                    <div class="header">Eliminar Producto</div>
                                    <div class="content">
                                        <p>¿Está seguro que desea eliminar este producto?</p>
                                    </div>
                                    <div class="actions">
                                        <div class="ui green approve button">Confirmar</div>
                                        <div class="ui red cancel button">Cancelar</div>
                                    </div>
                                </div>
                            </i>
                        </h2>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</body>

<!-- Scripts -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/fomantic-ui/2.9.3/semantic.min.css">
<script src="https://cdnjs.cloudflare.com/ajax/libs/fomantic-ui/2.9.3/semantic.min.js"></script>

<script>
    // Evento para abrir el modal al hacer clic en el botón "Agregar Producto"
    $('#addProductButton').on('click', function () {
        $('#productModal').modal('show');
    });

    // Asociar el input file a un botón estilizado
    $('#excelFile').on('change', function () {
        $('#importForm').submit();
    });

    $('#editIcon').on('click', function () {
        $('#productEditModal').modal('show');
    });
    $('#deleteIcon').on('click', function () {
        $('#deleteModal').modal('show');
    });
</script>

</html>