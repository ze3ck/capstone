import { API_BASE_URL } from "./apiConfig.js";
$(document).ready(function () {
  console.log("entre a inventario.js");
  llenarTablaProductos();
  let products = []; // Array de productos

  // $(".info-button").popup({
  //   title: "Información",
  //   content:
  //     "Si no encuentra a su proveedor vaya a la sección de proveedores para agregar a su nuevo proveedor",
  //   position: "bottom center",
  //   on: "hover", // Muestra el popup al pasar el ratón
  // });
  // Evento para abrir el modal al hacer clic en el botón "Agregar Producto"
  function editarProducto(param){
    console.log('cristian wekito ', param)
  }
  function mostarLoader() {
    document.getElementById("loader").style.display = "block";
    
  }
  function ocultarLoader() {
    document.getElementById("loader").style.display = "none";
  }

  $("#addProductButton").on("click", function () {
    $("#productModal")
      .modal({
        centered: true, // Esto asegura que el modal esté centrado
      })
      .modal("show");
  });

  // Acción para agregar un nuevo producto
  $("#addProductModal").on("click", function () {
    const productName = $('input[name="product-name"]').val().trim();
    const category = $('select[name="category"]').val();
    const isPerishable = $('input[name="perecibilidad"]:checked').val();
    const quantity = parseFloat($('input[name="quantity"]').val());
    const unitPrice = parseFloat($('input[name="unit-price"]').val());
    const supplier = $('input[name="supplier"]').val().trim();
    const entryDate = $('input[name="entry-date"]').val();

    if (
      !productName ||
      !category ||
      !quantity ||
      !unitPrice ||
      !supplier ||
      !entryDate
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
    };

    products.push(product);
    clearForm();
    updateProductTable();
    $("#productModal").modal("hide");
  });

  // Función para actualizar la tabla de productos
  function updateProductTable(filteredProducts = products) {
    const productTableBody = $("#productTableBody");
    productTableBody.empty();

    filteredProducts.forEach((product, index) => {
      productTableBody.append(`
              <tr>
                  <td data-label="producto">${product.name}</td>
                  <td data-label="cantidad">${product.quantity}</td>
                  <td data-label="precio_unitario">${product.unitPrice}</td>
                  <td data-label="proveedor">${product.supplier}</td>
                  <td data-label="fec_ing">${product.entryDate}</td>
                  <td data-label="edit" class="center aligned one wide">
                      <h3>
                          <i class="edit icon" style="color: rgb(255, 217, 0); cursor: pointer;" data-index="${index}"></i>
                      </h3>
                  </td>
                  <td data-label="delete" class="center aligned one wide">
                      <h3>
                          <i class="trash icon" style="color: red; cursor: pointer;" data-index="${index}"></i>
                      </h3>
                  </td>
              </tr>
          `);
    });
  }

  // Evento para buscar productos por nombre, proveedor o categoría
  $("#searchProduct").on("input", function () {
    const searchTerm = $(this).val().toLowerCase();

    // Filtrar los productos por nombre, proveedor o categoría
    const filteredProducts = products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm) ||
        // product.category.toLowerCase().includes(searchTerm) ||
        product.supplier.toLowerCase().includes(searchTerm)
    );

    updateProductTable(filteredProducts);
  });

  // Botón cancelar cierra el modal
  $(".cancel.button").on("click", function () {
    $("#productModal").modal("hide");
  });

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

    // Rellenar los campos del modal de edición con los datos del producto seleccionado
    $("#editProductName").val(product.name);
    $("#editCategory").val(product.category);
    $("#editIsPerishable").prop(
      "checked",
      product.isPerishable === "perecible"
    );
    $("#editQuantity").val(product.quantity);
    $("#editUnitPrice").val(product.unitPrice);
    $("#editSupplier").val(product.supplier);
    $("#editEntryDate").val(product.entryDate);

    // Mostrar el modal de edición
    $("#editProductModal").modal("show");

    // Guardar cambios en el producto
    $("#saveEditProductModal")
      .off("click")
      .on("click", function () {
        const editedProduct = {
          name: $("#editProductName").val(),
          category: $("#editCategory").val(),
          isPerishable: $("#editIsPerishable").is(":checked")
            ? "perecible"
            : "no_perecible",
          quantity: parseFloat($("#editQuantity").val()),
          unitPrice: parseFloat($("#editUnitPrice").val()),
          supplier: $("#editSupplier").val(),
          entryDate: $("#editEntryDate").val(),
        };

        products[index] = editedProduct;
        updateProductTable();
        $("#editProductModal").modal("hide");
      });
  });

  function clearForm() {
    $('input[name="product-name"]').val("");
    $('select[name="category"]').val("");
    $('input[name="perecibilidad"]').prop("checked", false);
    $('input[name="quantity"]').val("");
    $('input[name="unit-price"]').val("");
    $('input[name="supplier"]').val("");
    $('input[name="entry-date"]').val("");
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

  $(".ui.sidebar").sidebar({
    transition: "push",
    onVisible: function () {
      console.log("Sidebar visible");
    },
    onHide: function () {
      console.log("Sidebar hidden");
    },
  });

  // Controlar el evento de cambio del checkbox
  $("#newProductCheckbox").on("change", function () {
    if ($(this).find("input").is(":checked")) {
      // Mostrar los datos de producto
      $("#datosProducto").slideDown(); // Mostrar los datos del producto
      $("#buscarProducto").hide(); // Ocultar el campo de búsqueda de producto
      $("#datosLote input, #datosLote select").attr("disabled", true); // Desactivar campos
    } else {
      // Ocultar los datos de producto
      $("#datosProducto").slideUp(); // Ocultar los datos del producto
      $("#buscarProducto").show(); // Mostrar el campo de búsqueda de producto
      $("#datosLote input, #datosLote select").attr("disabled", false); // Habilitar campos
    }
  });

  // llenarTablaProductos()
  async function llenarTablaProductos() {
    console.log("entre a llenartabla");
    mostarLoader();

    try {
      let id_usuario = document.getElementById("ID_USUARIO").innerHTML.trim();

      console.log("ID del usuario:", id_usuario);

      const response = await fetch(
        `${API_BASE_URL}inventario/llenarTablaProductos`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            P_IDUSUARIO: id_usuario,
          }),
        }
      );

      console.log("Estado de la respuesta:", response.status);

      if (!response.ok) {
        throw new Error("Error al obtener los productos.");
      }

      const data = await response.json();

      console.log("Datos de la respuesta:", data);

      if (!data.success) {
        throw new Error("No se encontraron productos o ocurrió un error.");
      }

      const tbody = document.getElementById("productTableBody");
      const userRol = document.getElementById("ROL").innerHTML.trim();

      tbody.innerHTML = "";

      data.response.forEach((producto) => {
        const fila = document.createElement("tr");

        // Estructura básica de las celdas de la fila
        let filaHTML = `
              <td class="center aligned">${producto.ID_PRODUCTO}</td>
              <td class="center aligned">${producto.NOMBRE_PRODUCTO}</td>
              <td class="center aligned">${producto.DESCRIPCION_PRODUCTO}</td>
              <td class="center aligned">${producto.UNIDAD_MEDIDA}</td>
              <td class="center aligned">${producto.TOTAL_CANTIDAD}</td>
              <td class="center aligned">${producto.PRECIO_VENTA}</td>
              <td class="center aligned">${producto.NOMBRE_PROVEEDOR}</td>
              <td class="center aligned">${producto.FECHA_COMPRA}</td>
              <td class="center aligned">DISPONIBLE</td>
          `;

        if (userRol === "1") {
          filaHTML += `
                <td class="center aligned actions-column">
                    <div class="ui icon buttons">
                        <button class="ui icon button" title="Editar" onclick="editarProducto(${producto.ID_PRODUCTO})">
                            <i class="fas fa-edit" style="color: blue;"></i>
                        </button>
                    </div>
                </td>
            `;
        }

        fila.innerHTML = filaHTML;
        tbody.appendChild(fila);
      });
    } catch (error) {
      console.error("Error:", error);
    }

    ocultarLoader();
  }

  // Llamada de la función al cargar el documento
  // document.addEventListener("DOMContentLoaded", function () {
  //    // Llamamos a la función para llenar la tabla al cargar la página
  // });

});


