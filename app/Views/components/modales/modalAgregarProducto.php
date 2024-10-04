<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>

<body>
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
          <input id="idlote" type="text" name="product-name" placeholder="Ej: Manzanas" required />
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
              <input type="radio" name="example2" checked="checked">
              <label>Perecible</label>
            </div>
          </div>
          <div class="field">
            <div class="ui radio checkbox">
              <input type="radio" name="example2">
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
      <div class="two fields">
        <div class="field">
          <label>Fecha de Ingreso</label>
          <input type="date" name="entry-date" required />
        </div>
        <div class="field">
          <label>Ubicación</label>
          <input type="text" name="location" placeholder="Ej: Bodega A" required />
        </div>
      </div>
      <div class="actions">
        <div id="addProductModal" class="ui green approve button">
          Agregar
        </div>
        <div class="ui red cancel button">Cancelar</div>
        <div id="agregarProveedor" class="ui red button">Agregar Proveedor
          <div id="modalContainer"></div>
        </div>
      </div>
      <!-- Botón para agregar el producto -->
    </form>
  </div>
</body>
<script>
  $('#agregarProveedor').on('click', function() {
    event.preventDefault();
    $('#modalContainer').load('modalAgregarProveedor.html', function() {
      $('#providerModal').modal('show');
      return false;
    });
  })
</script>

</html>