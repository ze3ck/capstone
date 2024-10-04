$(document).ready(function () {

  // Evento para abrir el modal al hacer clic en el botón "Agregar Producto"
  $("#addProductButton").on("click", function () {
    $("#productModal")
      .modal({
        closable: false,
        onApprove: function () {
          nombre = document.getElementById("inputNombre").value.trim();
          categoria = document.getElementById("categoria").value.trim();
          if (!nombre && !categoria) {
            event.preventDefault();
            console.log("Campo vacío")
            return false;
          }
          else {
            event.preventDefault();
            console.log("Campo con dato");
            return true;
          }
        }
      })
      .modal("show");
  });

  // buttonRechazar.addEventListener("click", function () {
  //   $('#modalRendicionRechazada')
  //     .modal({
  //       closable: false,
  //       onApprove: function () {

  //       }, onDeny: function () {
  //         true
  //       }
  //     })
  //     .modal('show');
  // });

  // Evento para agregar un nuevo producto
  $("#addProductModal").on("click", function () {
    const productName = $('input[name="product-name"]').val();
    const category = $('select[name="category"]').val();
    const isPerishable = $('input[name="example"]').is(":checked") ? 1 : 0;
    const quantity = parseFloat($('input[name="quantity"]').val());
    const unitPrice = parseFloat($('input[name="unit-price"]').val());
    const supplier = $('input[name="supplier"]').val();
    const entryDate = $('input[name="entry-date"]').val();
    const location = $('input[name="location"]').val();

    if (
      !productName ||
      !category ||
      !quantity ||
      !unitPrice ||
      !supplier ||
      !entryDate ||
      !location
    ) {
      alert("Por favor completa todos los campos obligatorios.");
      return;
    }

    const product = {
      name: productName,
      category: category,
      isPerishable: isPerishable,
      quantity: quantity,
      unitPrice: unitPrice,
      supplier: supplier,
      entryDate: entryDate,
      location: location,
    };

    products.push(product);
    clearForm();
    updateProductTable();
    $("#productModal").modal("hide");
  });

  function updateProductTable() {
    const productTableBody = $("#productTableBody");
    productTableBody.empty();
    products.forEach((product, index) => {
      productTableBody.append(`
        <tr>
            <td data-label="producto">${product.name}</td>
            <td data-label="cantidad">${product.quantity}</td>
            <td data-label="precio_unitario">${product.unitPrice}</td>
            <td data-label="categoria">${product.category}</td>
            <td data-label="proveedor">${product.supplier}</td>
            <td data-label="fec_ing">${product.entryDate}</td>
            <td data-label="ubicacion">${product.location}</td>
            <td data-label="edit" class="center aligned one wide">
                <h3>
                    <i class="edit icon" style="color: rgb(255, 217, 0); cursor: pointer;" data-index="${index}"></i>
                </h3>
            </td>
            <td data-label="delete" class="center aligned one wide">
                <h3>
                    <i class="trash icon" style="color: red; cursor: pointer;" onclick="deleteProduct(${index})"></i>
                </h3>
            </td>
        </tr>
      `);
    });
  }
  // Función para filtrar productos en la tabla
  $("#searchProduct").on("input", function () {
    const searchTerm = $(this).val().toLowerCase();
    const filteredProducts = products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm) ||
        product.supplier.toLowerCase().includes(searchTerm) ||
        product.location.toLowerCase().includes(searchTerm)
    );
    updateFilteredTable(filteredProducts);
  });

  // Actualizar la tabla con los productos filtrados
  function updateFilteredTable(filteredProducts) {
    const productTableBody = $("#productTableBody");
    productTableBody.empty();
    filteredProducts.forEach((product, index) => {
      productTableBody.append(`
      <tr>
          <td data-label="producto">${product.name}</td>
          <td data-label="cantidad">${product.quantity}</td>
          <td data-label="precio_unitario">${product.unitPrice}</td>
          <td data-label="categoria">${product.category}</td>
          <td data-label="proveedor">${product.supplier}</td>
          <td data-label="fec_ing">${product.entryDate}</td>
          <td data-label="ubicacion">${product.location}</td>
          <td data-label="edit" class="center aligned one wide">
              <h3>
                  <i class="edit icon" style="color: rgb(255, 217, 0); cursor: pointer;" data-index="${index}"></i>
              </h3>
          </td>
          <td data-label="delete" class="center aligned one wide">
              <h3>
                  <i class="trash icon" style="color: red; cursor: pointer;" onclick="deleteProduct(${index})"></i>
              </h3>
          </td>
      </tr>
    `);
    });
  }
  // Delegación de eventos para eliminar productos
  $("#productTableBody").on("click", ".trash.icon", function () {
    const index = $(this).data("index");
    deleteProduct(index);
  });

  // Delegación de eventos para editar productos
  $("#productTableBody").on("click", ".edit.icon", function () {
    const index = $(this).data("index");
    const product = products[index];

    if (!product) {
      alert("Producto no encontrado.");
      return;
    }

    $("#editProductName").val(product.name);
    $("#editCategory").val(product.category);
    $("#editIsPerishable").prop("checked", product.isPerishable);
    $("#editQuantity").val(product.quantity);
    $("#editUnitPrice").val(product.unitPrice);
    $("#editSupplier").val(product.supplier);
    $("#editEntryDate").val(product.entryDate);
    $("#editLocation").val(product.location);
    $("#editProductModal").modal("show");

    // Al hacer clic en guardar cambios
    $("#saveEditProductModal")
      .off("click")
      .on("click", function () {
        const editedProduct = {
          name: $("#editProductName").val(),
          category: $("#editCategory").val(),
          isPerishable: $("#editIsPerishable").is(":checked") ? 1 : 0,
          quantity: parseFloat($("#editQuantity").val()),
          unitPrice: parseFloat($("#editUnitPrice").val()),
          supplier: $("#editSupplier").val(),
          entryDate: $("#editEntryDate").val(),
          location: $("#editLocation").val(),
        };

        products[index] = editedProduct;
        updateProductTable();
        $("#editProductModal").modal("hide");
      });
  });

  function clearForm() {
    $('input[name="product-name"]').val("");
    $('select[name="category"]').val("");
    $('input[name="example"]').prop("checked", false);
    $('input[name="quantity"]').val("");
    $('input[name="unit-price"]').val("");
    $('input[name="supplier"]').val("");
    $('input[name="entry-date"]').val("");
    $('input[name="location"]').val("");
  }

  function deleteProduct(index) {
    const confirmation = confirm(
      "¿Estás seguro de que quieres eliminar este producto?"
    );
    if (confirmation) {
      products.splice(index, 1);
      updateProductTable();
    }
  }
});