import { API_BASE_URL } from "./apiConfig.js";

document.addEventListener("DOMContentLoaded", function () {
  // $("#saveProductButton").click(agregarNuevoProducto);
  $("#addProductButton").click(selectProductos);
  $("#editProductButton").click(editarProducto);
  selectProveedores();
  selectUnidadMedida();

  $("#datosProducto").slideUp();
  $("#datosLote").slideDown();
  $("#saveProductButton").off("click").on("click", agregarNuevoLote);
  console.log("lote")
  $("#newProductCheckbox").on("change", function () {

    if ($(this).find("input").is(":checked")) {
      $("#datosProducto").slideDown();
      $("#datosLote").slideUp();
      $("#datosLote input, #datosLote select").attr("disabled", true);
      $("#saveProductButton").off("click").on("click", agregarNuevoProducto);
    }

  });
  // llenar campos modal editar productos
  const tbody = document.getElementById("productTableBody");

  tbody.addEventListener("click", function (event) {
    const editarButton = event.target.closest(".editarProductoBtn");

    if (editarButton) {
      const row = editarButton.closest("tr");

      const idProducto = row.cells[0].textContent.trim();
      const nombreProducto = row.cells[1].textContent.trim();
      const descripcionProducto = row.cells[2].textContent.trim();
      const unidadMedida = row.cells[3].textContent.trim();
      const totalCantidad = row.cells[4].textContent.trim();
      const precioVenta = row.cells[5].textContent.trim();
      const proveedor = row.cells[6].textContent.trim();
      const fechaCompra = row.cells[7].textContent.trim();

      document.getElementById("idProductoEdit").value = idProducto;
      document.getElementById("nombreProductoEdit").value = nombreProducto;
      document.getElementById("descripcionProductoEdit").value = descripcionProducto;
      document.getElementById("unidadMedidaEdit").value = unidadMedida;
      document.getElementById("totalCantidadEdit").value = totalCantidad;
      document.getElementById("precioVentaEdit").value = precioVenta;
      document.getElementById("proveedorEditField").value = proveedor;
      document.getElementById("fechaCompraEdit").value = fechaCompra;

      $("#editModal").modal("show");
    }
  });
});

window.onload = function () {
  document.querySelectorAll(".estado-dropdown").forEach((dropdown) => {
    dropdown.addEventListener("change", () => cambiarEstadoProducto(dropdown));
  });
};

// Limpieza del modal
document
  .querySelector(".ui.red.cancel.button")
  .addEventListener("click", function () {
    limpiarFormularioProducto();
  });
$("#productModal").on("hidden.bs.modal", function () {
  limpiarFormularioProducto();
});

$("#productModal").on("show.bs.modal", function () {
  limpiarFormularioProducto();
});

async function agregarNuevoProducto() {
  const nombreField = document.getElementById("nombreField");
  const descripcionField = document.getElementById("descripcionField");
  const unidadField = document.getElementById("unidadField");
  const proveedorField = document.getElementById("proveedorField");
  const idNuevoLote = document.getElementById("idNuevoLote");
  const fechaVencField = document.getElementById("nuevaFechaVenc");
  const fechaCompField = document.getElementById("nuevaFechaComp");
  const cantidadField = document.getElementById("nuevaCantidad");
  const precioCompField = document.getElementById("nuevoPrecioComp");
  const precioVentaField = document.getElementById("nuevoPrecioVenta");
  const idUsuario = document.getElementById("ID_USUARIO");

  const nombreValue = nombreField.value.trim();
  const descripcionValue = descripcionField.value.trim();
  const unidadValue = unidadField.value.trim();
  const proveedorValue = proveedorField.value.trim();
  const idNuevoLoteValue = idNuevoLote.value.trim();
  let fechaVencValue = fechaVencField.value.trim();
  const fechaCompValue = fechaCompField.value.trim();
  const cantidadValue = cantidadField.value.trim();
  const precioCompValue = precioCompField.value.trim();
  const precioVentaValue = precioVentaField.value.trim();
  const idUsuarioValue = idUsuario.textContent.trim();

  if(fechaVencValue == ""){
    fechaVencValue = "9999-01-01";
  }

  if (!cantidadValue || cantidadValue <= 0 ||
    !precioCompValue || precioCompValue <= 0 ||
    !precioVentaValue || precioCompValue <= 0) {
    $('body').toast({
      message: "CANTIDAD, PRECIO COMPRA y PRECIO VENTA deben ser mayor a 0",
      showProgress: 'top',
      class: 'error',
      displayTime: 8000,
    })
  } else if (cantidadValue.length > 9 || precioCompValue.length > 9 || precioVentaValue.length > 9) {
    $('body').toast({
      message: "CANTIDAD, PRECIO COMPRA y PRECIO VENTA exceden el largo permitido (9)",
      showProgress: 'top',
      class: 'error',
      displayTime: 8000,
    })
  }
  else {

    // console.log([
    //   nombreValue,
    //   descripcionValue,
    //   unidadValue,
    //   proveedorValue,
    //   idNuevoLoteValue,
    //   fechaVencValue,
    //   fechaCompValue,
    //   cantidadValue,
    //   precioCompValue,
    //   precioVentaValue,
    //   idUsuarioValue,
    // ]);

    try {
      console.log("Enviando datos al servidor...");
      console.log([
        nombreValue,
        descripcionValue,
        unidadValue,
        proveedorValue,
        idNuevoLoteValue,
        fechaVencValue,
        fechaCompValue,
        cantidadValue,
        precioCompValue,
        precioVentaValue,
        idUsuarioValue,
      ]);
      const response = await fetch(
        `${API_BASE_URL}inventario/agregarNuevoProducto`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            P_NOMBRE_PRODUCTO: nombreValue,
            P_DESCRIPCION_PROD1: descripcionValue,
            P_UNIDAD_MEDIDA: unidadValue,
            P_ID_PROVEEDOR: proveedorValue,
            P_ID_USUARIO: idUsuarioValue,
            P_ID_LOTE: idNuevoLoteValue,
            P_FECHA_VENCIMIENTO: fechaVencValue,
            P_CANTIDAD: cantidadValue,
            P_PRECIO_COMPRA: precioCompValue,
            P_PRECIO_VENTA: precioVentaValue,
            P_FECHA_COMPRA: fechaCompValue,
          }),
        }
      );
      if (!response.ok) {
        throw new Error(
          `Error al agregar el producto. Estado: ${response.status}`
        );
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        console.log("Producto agregado con éxito:", data);

        $("body").toast({
          message: "Se ha agregado un nuevo producto exitosamente",
          class: "success",
          displayTime: 3000,
        });
      } else {
        console.warn("El servidor no devolvió un JSON válido.");
        $("body").toast({
          message:
            "Producto agregado exitosamente, pero la respuesta no es válida.",
          class: "warning",
          displayTime: 3000,
        });
      }
      nombreField.value = "";
      descripcionField.value = "";
      unidadField.value = "";
      proveedorField.value = "";
      idNuevoLote.value = "";
      fechaVencField.value = "";
      fechaCompField.value = "";
      cantidadField.value = "";
      precioCompField.value = "";
      precioVentaField.value = "";
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);

      // Mostrar mensaje de error
      $("body").toast({
        message:
          "Error al agregar el producto. Revisa la consola para más detalles.",
        class: "error",
        displayTime: 3000,
      });
    }
  }
}

async function agregarNuevoLote() {
  const idLoteField = document.getElementById("idLote")
  const cantidadField = document.getElementById("cantidadLote");
  const precioCompField = document.getElementById("precioCompLote");
  const fechaVencField = document.getElementById("calendarioVencLote");
  const fechaCompField = document.getElementById("calendarioCompLote");
  const precioVentaField = document.getElementById("precioVentaLote");
  const idUsuario = document.getElementById("idUsuarioEdit");

  const idLoteValue = idLoteField.value.trim();
  let fechaVencValue = fechaVencField.value.trim();
  const fechaCompValue = fechaCompField.value.trim();
  const cantidadValue = cantidadField.value.trim();
  const precioCompValue = precioCompField.value.trim();
  const precioVentaValue = precioVentaField.value.trim();
  const idUsuarioValue = idUsuario.textContent.trim();

  const productoDropdown = document.getElementById("productoDropdown");
  const idProductoValue = productoDropdown.value

  if(fechaVencValue == ""){
    fechaVencValue = "9999-01-01";
  }

  if (!cantidadValue || cantidadValue <= 0 ||
    !precioCompValue || precioCompValue <= 0 ||
    !precioVentaValue || precioCompValue <= 0) {
    $('body').toast({
      message: "CANTIDAD, PRECIO COMPRA y PRECIO VENTA deben ser mayor a 0 sdfgsdfgsdfg",
      showProgress: 'top',
      class: 'error',
      displayTime: 8000,
    })
  } else if (cantidadValue.length > 9 || precioCompValue.length > 9 || precioVentaValue.length > 9) {
    $('body').toast({
      message: "CANTIDAD, PRECIO COMPRA y PRECIO VENTA exceden el largo permitido (9)",
      showProgress: 'top',
      class: 'error',
      displayTime: 8000,
    })
  }
  else {
    try {
      console.log(fechaCompValue
        // idLoteValue,
        // fechaVencValue,
        // ,
        // cantidadValue,
        // precioCompValue,
        // precioVentaValue
        );
      const response = await fetch(
        `${API_BASE_URL}inventario/nuevoLote`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            P_NROLOTE: idLoteValue,
            P_IDPRODUCTO: idProductoValue,
            P_IDUSUARIO: idUsuarioValue,
            P_FECHA_VENCIMIENTO: fechaVencValue,
            P_CANTIDAD: cantidadValue,
            P_PRECIO_COMPRA: precioCompValue,
            P_PRECIO_VENTA: precioVentaValue,
            P_FECHA_COMPRA: fechaCompValue,
          }),
        }
      );
      if (!response.ok) {
        throw new Error(
          `Error al agregar el producto. Estado: ${response.status}`
        );
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        console.log("Producto agregado con éxito:", data);

        $("body").toast({
          message: "Se ha agregado un nuevo lote exitosamente",
          class: "success",
          displayTime: 3000,
        });
      } else {
        console.warn("El servidor no devolvió un JSON válido.");
        $("body").toast({
          message:
            "Producto agregado exitosamente, pero la respuesta no es válida.",
          class: "warning",
          displayTime: 3000,
        });
      }
      idLoteField.value = "";
      fechaVencField.value = "";
      fechaCompField.value = "";
      cantidadField.value = "";
      precioCompField.value = "";
      precioVentaField.value = "";
      productoDropdown.value = "";
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);

      // Mostrar mensaje de error
      $("body").toast({
        message:
          "Error al agregar el producto. Revisa la consola para más detalles.",
        class: "error",
        displayTime: 3000,
      });
    }
  }
}

let productoId = null;

const tbody = document.getElementById("productTableBody");
// Delegación de eventos para el clic en los botones de edición
tbody.addEventListener("click", function (event) {
  const editarButton = event.target.closest(".editarProductoBtn");

  if (editarButton) {
    productoId = editarButton.getAttribute("data-producto-id");
    $("#editModal").modal("show");
    console.log("id producto editar: ", productoId);
  }
});

/**
 * editarProducto()
 */
async function editarProducto() {
  const nombreField = document.getElementById("nombreProductoEdit");
  const descripcionField = document.getElementById("descripcionProductoEdit");
  const unidadField = document.getElementById("unidadMedidaEdit");
  const proveedorField = document.getElementById("proveedorEditField");
  const idLoteField = document.getElementById("idLoteEdit"); // Campo para el ID del lote
  const fechaVencimientoField = document.getElementById("fechaVencimientoEdit"); // Campo para la fecha de vencimiento
  const fechaCompraField = document.getElementById("fechaCompraEdit");
  const cantidadField = document.getElementById("totalCantidadEdit");
  const precioCompraField = document.getElementById("precioCompraEdit");
  const precioVentaField = document.getElementById("precioVentaEdit");
  const idUsuario = document.getElementById("idUsuarioEdit");

  // Obtener los valores de los campos
  const nombreValue = nombreField.value.trim();
  const descripcionValue = descripcionField.value.trim();
  const unidadValue = unidadField.value.trim();
  const proveedorValue = proveedorField.value.trim();
  const idUsuarioValue = idUsuario.textContent.trim(); // Asegúrate que `value` es lo correcto aquí
  const idLoteValue = idLoteField.value.trim(); // ID del lote
  const fechaVencimientoValue = fechaVencimientoField.value.trim();
  const fechaCompraValue = fechaCompraField.value.trim();
  const cantidadValue = cantidadField.value.trim();
  const precioCompraValue = precioCompraField.value.trim();
  const precioVentaValue = precioVentaField.value.trim();
  
  console.log(fechaVencimientoValue)
  if (!cantidadValue || cantidadValue <= 0 ||
    !precioCompraValue || precioCompraValue <= 0 ||
    !precioVentaValue || precioVentaValue <= 0) {
    $('body').toast({
      message: "CANTIDAD, PRECIO COMPRA y PRECIO VENTA deben ser mayor a 0",
      showProgress: 'top',
      class: 'error',
      displayTime: 8000,
    })
  } else if (cantidadValue.length > 9 || precioCompraValue.length > 9 || precioVentaValue.length > 9) {
    $('body').toast({
      message: "CANTIDAD, PRECIO COMPRA y PRECIO VENTA exceden el largo permitido (9)",
      showProgress: 'top',
      class: 'error',
      displayTime: 8000,
    })
  }
  else {
    try {
      const response = await fetch(
        `${API_BASE_URL}inventario/editarProducto`, // URL para editar el producto
        {
          method: "POST", // El método sigue siendo POST
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            P_ID_PRODUCTO: productoId, // Incluye el ID del producto
            P_NOMBRE_PRODUCTO: nombreValue,
            P_DESCRIPCION_PROD1: descripcionValue,
            P_UNIDAD_MEDIDA: unidadValue,
            P_ID_PROVEEDOR: proveedorValue,
            P_ID_USUARIO: idUsuarioValue,
            P_ID_LOTE: idLoteValue, // Incluye el ID del lote
            P_FECHA_VENCIMIENTO: fechaVencimientoValue,
            P_CANTIDAD: cantidadValue,
            P_PRECIO_COMPRA: precioCompraValue,
            P_PRECIO_VENTA: precioVentaValue,
            P_FECHA_COMPRA: fechaCompraValue,
          }),
        }
      );
      console.log(response);
      // Verificar si la respuesta es exitosa
      if (!response.ok) {
        throw new Error(
          `Error al editar el producto. Estado: ${response.status}`
        );
      }
  
      // Verificar si el contenido es JSON y procesarlo
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        console.log("Producto editado con éxito:", data);
  
        // Mostrar mensaje de éxito con toast
        $("body").toast({
          message: "Se ha editado el producto exitosamente",
          class: "success",
          displayTime: 3000,
        });
      } else {
        console.warn("El servidor no devolvió un JSON válido.");
        // Mostrar mensaje de advertencia si no es JSON válido
        $("body").toast({
          message:
            "Producto editado exitosamente, pero la respuesta no es válida.",
          class: "warning",
          displayTime: 3000,
        });
        // Limpiar los campos del formulario
        limpiarFormulario();
  
        // Cerrar el modal
        $("#editModal").modal("hide");
      }
    } catch (error) {
      // Manejo de errores: mostrar mensaje con toast
      console.error("Error al enviar la solicitud:", error);
      $("body").toast({
        message:
          "Error al editar el producto. Revisa la consola para más detalles.",
        class: "error",
        displayTime: 3000,
      });
    }
  }

  // Obtener los campos del formulario de edición
}

// funcion limpiar formulario agregar nuevos productos
function limpiarFormularioProducto() {
  document
    .querySelectorAll(
      '#productModal input[type="text"], #productModal input[type="number"]'
    )
    .forEach((input) => {
      input.value = "";
    });

  document.querySelectorAll("#productModal select").forEach((select) => {
    select.selectedIndex = 0;
  });

  document
    .querySelectorAll('#productModal input[type="date"]')
    .forEach((input) => {
      input.value = "";
    });

  const newProductCheckbox = document.getElementById("newProductCheckbox").querySelector("input");
  if (newProductCheckbox.checked) {
    newProductCheckbox.checked = false;
    // Asegúrate de ocultar los campos de "Datos Producto"
    document.getElementById("datosProducto").style.display = "none";
    document.getElementById("datosLote").style.display = "none";
  }
}

//Función seleccionar Proveedores
async function selectProveedores() {
  try {
    const idusuario = document.getElementById("ID_USUARIO").innerHTML.trim();

    const response = await fetch(
      `${API_BASE_URL}inventario/selectProveedores`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          P_IDUSUARIO: idusuario,
        }),
      }
    );

    const data = await response.json(); // Consumir la respuesta solo una vez

    // Dropdown para proveedorField
    const dropdown = document.getElementById("proveedorField");
    data.response.forEach((opcion) => {
      var opt = document.createElement("option");
      opt.value = opcion.ID_PROVEEDOR;
      opt.innerHTML = opcion.NOMBRE_PROVEEDOR;
      dropdown.appendChild(opt);
    });

    // Dropdown para proveedorEditField
    const dropdownEdit = document.getElementById("proveedorEditField");
    data.response.forEach((opcion) => {
      var opt = document.createElement("option");
      opt.value = opcion.ID_PROVEEDOR;
      opt.innerHTML = opcion.NOMBRE_PROVEEDOR;
      dropdownEdit.appendChild(opt);
    });
  } catch (error) {
    console.error("Error al enviar la solicitud", error);
  }
}

// function llenadoSelect(idSelect, codOpcion, nomOpcion) {
//   select = document.getElementById(idSelect);
//   var opt = document.createElement('option');
//   opt.value = codOpcion;
//   opt.innerHTML =nomOpcion;
//   select.appendChild(opt);
// }
async function selectProductos() {
  let id_usuario = document.getElementById("ID_USUARIO").innerHTML.trim();

  const response = await fetch(`${API_BASE_URL}movimientos/selectProductos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      P_IDUSUARIO: id_usuario,
    }),
  });

  const data = await response.json();
  // console.log("Datos de la respuesta:", data);

  // Obtenemos el elemento select una vez fuera del bucle para evitar múltiples búsquedas en el DOM
  const select = document.getElementById("productoDropdown");
  // Limpiamos el select antes de llenarlo
  select.innerHTML = '<option value="">Seleccionar Producto</option>';

  if (!select) {
    console.error("No se encontró el elemento select en el DOM.");
    return;
  }


  for (let x of data.response) {
    const opt = document.createElement("option");
    opt.value = x.ID_PRODUCTO;
    opt.textContent = x.DESCRIPCION_PRODUCTO;
    select.appendChild(opt);

  }

  // FUNCION QUE TRAE LA CANTIDAD TOTAL DEL PRODUCTO SLECCIONADO, EL ERRROR QUE SALE ES COMO TOMO EL VALOR DEL RESPONSE, YA ESTA LISTO TODO EL PROCE :D
  // async function cant_total() {
  //   let id_producto = document.getElementById("productoDropdown").value;
  //   const response = await fetch(`${API_BASE_URL}movimientos/selectProductos`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     credentials: "include",
  //     body: JSON.stringify({
  //       P_IDUSUARIO: id_producto,
  //     }),
  //   });

  //   const data = await response.json();

  //   for (let x of data.response) {
  //     document.getElementById("cant_total").innerHTML = x.CANTIDAD;
  //   }
  // }
  // Se ejecuta cuando cambia de estado el select
  // document
  //   .getElementById("productoDropdown")
  //   .addEventListener("change", /*cant_total*/);
}
async function selectUnidadMedida() {
  try {
    const response = await fetch(
      `${API_BASE_URL}inventario/selectUnidadMedida`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    const dropdown = document.getElementById("unidadField");

    console.log("Datos unidad:", data);
    data.response.forEach((opcion) => {
      var opt = document.createElement("option");
      opt.value = opcion.ID_UNIDAD_MEDIDA;
      opt.innerHTML = opcion.DESCRIPCION_UNIDAD;
      dropdown.appendChild(opt);
      console.log("Error");
    });

    const dropdownEdit = document.getElementById("unidadMedidaEdit");

    console.log("Datos unidad:", data);
    data.response.forEach((opcion) => {
      var opt = document.createElement("option");
      opt.value = opcion.ID_UNIDAD_MEDIDA;
      opt.innerHTML = opcion.DESCRIPCION_UNIDAD;
      dropdownEdit.appendChild(opt);
      console.log("Error");
    });
  } catch {
    console.error("Error al enviar la solicitud");
  }
}
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

  function mostarLoader() {
    document.getElementById("loader").style.display = "block";
  }

  // Función para ocultar el loader
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

  $("#newProductCheckbox").on("change", function () {
    if ($(this).find("input").is(":checked")) {
      $("#datosProducto").slideDown();
      $("#datosLote").slideUp();
      $("#datosLote input, #datosLote select").attr("disabled", true);
      $("#saveProductButton").off("click").on("click", agregarNuevoProducto);
    }
    else {
      $("#datosProducto").slideUp();
      $("#datosLote").slideDown();
      $("#datosLote input, #datosLote select").attr("disabled", false);
      $("#saveProductButton").off("click").on("click", agregarNuevoLote);
    }
  });

  // Lógica del filtro de estado (Activo, Inactivo)
  $("#estadoDropdown").change(function () {
    var selectedEstado = $(this).val(); // Captura el valor seleccionado (1, 2 o vacío para "Todos")

    // Itera sobre cada fila de la tabla
    $("#productTableBody tr").each(function () {
      // Obtiene el valor seleccionado en el dropdown de cada fila
      var estadoFila = $(this).find(".estado-dropdown").val();

      // Compara con el valor seleccionado en el dropdown de filtro
      if (selectedEstado === "" || estadoFila === selectedEstado) {
        $(this).show(); // Muestra la fila si coincide el estado o si "Todos" está seleccionado
      } else {
        $(this).hide(); // Oculta la fila si no coincide
      }
    });
  });

  async function llenarTablaProductos() {
    console.log("Entré a llenarTabla");
    mostarLoader();

    try {
      const id_usuario = document.getElementById("ID_USUARIO").innerHTML.trim();
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

        let filaHTML = `
            <td class="center aligned">${producto.ID_PRODUCTO}</td>
            <td class="center aligned">${producto.NOMBRE_PRODUCTO}</td>
            <td class="center aligned">${producto.DESCRIPCION_PRODUCTO}</td>
            <td class="center aligned">${producto.UNIDAD_MEDIDA}</td>
            <td class="center aligned">${producto.TOTAL_CANTIDAD}</td>
            <td class="center aligned">${producto.PRECIO_VENTA}</td>
            <td class="center aligned">${producto.NOMBRE_PROVEEDOR}</td>
            <td class="center aligned">${producto.FECHA_COMPRA}</td>
            <td class="center aligned">
                <select class="estado-dropdown" data-producto-id="${producto.ID_PRODUCTO
          }">
                    <option value="1" ${producto.ID_ESTADO == 1 ? "selected" : ""
          }>Activo</option>
                    <option value="2" ${producto.ID_ESTADO == 2 ? "selected" : ""
          }>Inactivo</option>
                </select>
            </td>
        `;

        // Agregar botón de edición si el rol del usuario es "1"
        if (userRol === "1") {
          filaHTML += `
                <td class="center aligned actions-column">
                    <div class="ui icon buttons">
                        <button class="ui icon button editarProductoBtn" data-producto-id="${producto.ID_PRODUCTO}" title="Editar">
                            <i class="fas fa-edit" style="color: blue;"></i>
                        </button>
                    </div>
                </td>
            `;
        }

        fila.innerHTML = filaHTML;
        tbody.appendChild(fila);
      });

      // Evento para cambiar el estado del producto
      document.querySelectorAll(".estado-dropdown").forEach((dropdown) => {
        dropdown.addEventListener("change", () =>
          cambiarEstadoProducto(dropdown)
        );
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

  // controladr cambio estado productos
  async function cambiarEstadoProducto(dropdown) {
    const productoId = dropdown.getAttribute("data-producto-id");
    const nuevoEstado = dropdown.value;
    const idUsuario = document.getElementById("ID_USUARIO").textContent.trim();

    // Hacemos el console.log para verificar que los datos son correctos
    console.log({
      P_IDUSUARIO: idUsuario,
      P_IDPRODUCTO: productoId, // Cambiado para que coincida con el controlador
      P_IDESTADO: nuevoEstado, // Cambiado para que coincida con el controlador
    });

    try {
      const response = await fetch(
        `${API_BASE_URL}inventario/actualizaEstadoProducto`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            P_IDUSUARIO: idUsuario,
            P_IDPRODUCTO: productoId, // Cambiado a P_IDPRODUCTO
            P_IDESTADO: nuevoEstado, // Cambiado a P_IDESTADO
          }),
        }
      );

      // Verifica si la respuesta no fue exitosa (status >= 400)
      if (!response.ok) {
        throw new Error(
          `Error al cambiar el estado del producto. Estado: ${response.status}`
        );
      }

      // Procesamos el cuerpo de la respuesta en formato JSON
      const data = await response.json();
      console.log("Estado del producto actualizado exitosamente:", data);

      // Muestra un mensaje de éxito si todo salió bien
      $("body").toast({
        message: "El estado del producto se ha actualizado correctamente.",
        class: "success",
        displayTime: 3000,
      });
    } catch (error) {
      // Si ocurre algún error, lo mostramos en la consola y como toast
      console.error("Error al actualizar el estado del producto:", error);

      $("body").toast({
        message: "Error al actualizar el estado del producto.",
        class: "error",
        displayTime: 3000,
      });
    }
  }

  // logica exportar excel
  document
    .getElementById("exportExcelButton")
    .addEventListener("click", function () {
      var table = document.querySelector(
        "table.ui.celled.long.scrolling.table"
      );
      var rows = table.querySelectorAll("tr");
      var accionesColumnIndex = -1;
      var data = [];

      rows.forEach(function (row, rowIndex) {
        var cells = row.querySelectorAll("th, td");
        var rowData = [];

        cells.forEach(function (cell, cellIndex) {
          if (rowIndex === 0 && cell.textContent.trim() === "Acciones") {
            accionesColumnIndex = cellIndex;
          }

          if (cellIndex !== accionesColumnIndex) {
            if (cell.querySelector("select")) {
              var selectedText =
                cell.querySelector("select").selectedOptions[0].textContent;
              rowData.push(selectedText);
            } else {
              rowData.push(cell.textContent.trim());
            }
          }
        });

        data.push(rowData);
      });

      var wb = XLSX.utils.book_new();
      var ws = XLSX.utils.aoa_to_sheet(data);
      XLSX.utils.book_append_sheet(wb, ws, "Productos");
      XLSX.writeFile(wb, "gestion_productos.xlsx");
    });

  //calendarizacion editar producto
  $(document).ready(function () {
    function showToast(message) {
      $('body').toast({
        message: message,
        showProgress: 'top',
        class: 'warning',
        displayTime: 8000,
      });
    }
    // Inicializar calendario "Fecha Desde"
    var today = new Date(); // Obtener la fecha actual
    $("#calendarioVencimientoEdit").calendar({
      type: "date",
      minDate: today,
      text: {
        days: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
        months: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",],
        monthsShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",],
        today: "Hoy",
        now: "Ahora",
        am: "AM",
        pm: "PM",
      },
      formatter: {
        date: function (date, settings) {
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
      onChange: function (date, text, mode) {
        if (!date) return;

        var oneWeekBefore = new Date(date);
        oneWeekBefore.setDate(oneWeekBefore.getDate() - 7); // Restar 7 días para calcular 1 semana antes

        if (today >= oneWeekBefore && today <= date) {
          showToast("¡Atención! Tenga en cuenta que su lote vencerá dentro de una semana");
        }
      }
    });

    $("#calendarioCompraEdit").calendar({
      type: "date",
      maxDate: today,
      text: {
        days: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
        months: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",],
        monthsShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",],
        today: "Hoy",
        now: "Ahora",
        am: "AM",
        pm: "PM",
      },
      formatter: {
        date: function (date, settings) {
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
  });

  // calendarizacion nuevo lote
  $(document).ready(function () {
    function showToast(message) {
      $('body').toast({
        message: message,
        showProgress: 'top',
        class: 'warning',
        displayTime: 8000,
      });
    }
    // Inicializar calendario "Fecha Desde"
    var today = new Date(); // Obtener la fecha actual
    $("#calendarioVencimientoLote").calendar({
      type: "date",
      minDate: today,
      text: {
        days: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
        months: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",],
        monthsShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",],
        today: "Hoy",
        now: "Ahora",
        am: "AM",
        pm: "PM",
      },
      formatter: {
        date: function (date, settings) {
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
      onChange: function (date, text, mode) {
        if (!date) return;

        var oneWeekBefore = new Date(date);
        oneWeekBefore.setDate(oneWeekBefore.getDate() - 7); // Restar 7 días para calcular 1 semana antes

        if (today >= oneWeekBefore && today <= date) {
          showToast("¡Atención! Tenga en cuenta que su lote vencerá dentro de una semana");
        }
      }
    });

    $("#calendarioCompraLote").calendar({
      type: "date",
      maxDate: today,
      text: {
        days: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
        months: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",],
        monthsShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",],
        today: "Hoy",
        now: "Ahora",
        am: "AM",
        pm: "PM",
      },
      formatter: {
        date: function (date, settings) {
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
  });

  // lógica calendario nuevo producto
  $(document).ready(function () {
    function showToast(message) {
      $('body').toast({
        message: message,
        showProgress: 'top',
        class: 'warning',
        displayTime: 8000,
      });
    }
    // Inicializar calendario "Fecha Desde"
    var today = new Date(); // Obtener la fecha actual

    $("#calendarioVencimiento").calendar({
      type: "date",
      minDate: today, // Establecer la fecha mínima a hoy
      text: {
        days: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
        months: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",],
        monthsShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",],
        today: "Hoy",
        now: "Ahora",
        am: "AM",
        pm: "PM",
      },
      formatter: {
        date: function (date, settings) {
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
      onChange: function (date, text, mode) {
        if (!date) return;

        var oneWeekBefore = new Date(date);
        oneWeekBefore.setDate(oneWeekBefore.getDate() - 7); // Restar 7 días para calcular 1 semana antes

        if (today >= oneWeekBefore && today <= date) {
          showToast("¡Atención! Tenga en cuenta que su producto vencerá dentro de una semana");
        }
      }
    });



    // Inicializar calendario "Fecha Hasta"
    $("#calendarioCompra").calendar({
      type: "date",
      maxDate: today,
      text: {
        days: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
        months: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",],
        monthsShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",],
        today: "Hoy",
        now: "Ahora",
        am: "AM",
        pm: "PM",
      },
      formatter: {
        date: function (date, settings) {
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
  });

});
