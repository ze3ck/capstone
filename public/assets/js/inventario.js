import { API_BASE_URL } from "./apiConfig.js";

document.addEventListener("DOMContentLoaded", function () {
  $("#saveProductButton").click(agregarNuevoProducto);
  selectProveedores();
  selectUnidadMedida();
});

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
  const fechaVencValue = fechaVencField.value.trim();
  const fechaCompValue = fechaCompField.value.trim();
  const cantidadValue = cantidadField.value.trim();
  const precioCompValue = precioCompField.value.trim();
  const precioVentaValue = precioVentaField.value.trim();
  const idUsuarioValue = idUsuario.textContent.trim();

  try {
    console.log("Enviando datos al servidor...");
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

  const newProductCheckbox = document
    .getElementById("newProductCheckbox")
    .querySelector("input");
  if (newProductCheckbox.checked) {
    newProductCheckbox.checked = false;
    // Asegúrate de ocultar los campos de "Datos Producto"
    document.getElementById("datosProducto").style.display = "none";
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
    const dropdown = document.getElementById("proveedorField");

    const data = await response.json();
    console.log("Datos de la respuesta:", data);
    data.response.forEach((opcion) => {
      // llenadoSelect("proveedorField", opcion.ID_PROVEEDOR, opcion.NOMBRE_PROVEEDOR)
      var opt = document.createElement("option");
      opt.value = opcion.ID_PROVEEDOR;
      opt.innerHTML = opcion.NOMBRE_PROVEEDOR;
      dropdown.appendChild(opt);
    });
  } catch {
    console.error("Error al enviar la solicitud");
  }
}

// function llenadoSelect(idSelect, codOpcion, nomOpcion) {
//   select = document.getElementById(idSelect);
//   var opt = document.createElement('option');
//   opt.value = codOpcion;
//   opt.innerHTML =nomOpcion;
//   select.appendChild(opt);
// }

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
    const dropdown = document.getElementById("unidadField");

    const data = await response.json();
    console.log("Datos unidad:", data);
    data.response.forEach((opcion) => {
      var opt = document.createElement("option");
      opt.value = opcion.ID_UNIDAD_MEDIDA;
      opt.innerHTML = opcion.DESCRIPCION_UNIDAD;
      dropdown.appendChild(opt);
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

  // Función para mostrar el loader
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
      $("#buscarProducto").hide();
      $("#datosLote input, #datosLote select").attr("disabled", true);
    } else {
      $("#datosProducto").slideUp();
      $("#buscarProducto").show();
      $("#datosLote input, #datosLote select").attr("disabled", false);
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
    console.log("Entré a llenartabla");
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
                  <select class="estado-dropdown" data-producto-id="${producto.ID_PRODUCTO}">
                      <option value="1" ${producto.ID_ESTADO == 1 ? "selected" : ""}>Activo</option>
                      <option value="2" ${producto.ID_ESTADO == 2 ? "selected" : ""}>Inactivo</option>
                  </select>
              </td>
          `;
      
        if (userRol === "1") {
          filaHTML += `
              <td class="center aligned actions-column">
                  <div class="ui icon buttons">
                      <button class="ui icon button edit-button" data-producto-id="${producto.ID_PRODUCTO}" title="Editar">
                          <i class="fas fa-edit" style="color: blue;"></i>
                      </button>
                  </div>
              </td>

            `;
        }
      
        fila.innerHTML = filaHTML;
        tbody.appendChild(fila);
      });
      
      // Delegación de eventos para los botones de editar
      tbody.addEventListener("click", function (event) {
        if (event.target.closest(".edit-button")) {
          const productoId = event.target.closest(".edit-button").dataset.productoId;
          console.log("Producto a editar:", productoId);
      
          // Mostrar el modal y cargar los datos del producto correspondiente
          $("#editModal").modal("show");
      
          // Aquí puedes cargar los datos del producto al modal
        }
      });
      

      document.querySelectorAll(".estado-dropdown").forEach((dropdown) => {
        dropdown.addEventListener("change", () =>
          cambiarEstadoProducto(dropdown)
        );
      });
    } catch (error) {
      console.error("Error:", error);
    }

    ocultarLoader(); // Ocultar el loader cuando se termine de cargar la tabla
  }

  function cambiarEstadoProducto(dropdown) {
    const idProducto = dropdown.getAttribute("data-producto-id");
    const nuevoEstado = dropdown.value;

    console.log("ID del producto:", idProducto);
    console.log("Nuevo estado:", nuevoEstado);

    actualizarEstadoProducto(idProducto, nuevoEstado);
  }

  async function actualizarEstadoProducto(idProducto, nuevoEstado) {
    const idUsuario = document.getElementById("ID_USUARIO").innerHTML.trim();

    console.log("Datos enviados al backend:", {
      P_IDUSUARIO: idUsuario,
      P_IDPRODUCTO: idProducto,
      P_IDESTADO: nuevoEstado,
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
            P_IDPRODUCTO: idProducto,
            P_IDESTADO: nuevoEstado,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();

        if (data.success) {
          mostrarToast(
            "El estado del producto ha sido actualizado correctamente.",
            "success"
          );
        }
      } else {
        mostrarToast("Error al actualizar el estado del producto.", "error");
      }
    } catch (error) {
      console.error("Error al actualizar el estado del producto:", error);
      mostrarToast("Hubo un problema al actualizar el estado.", "error");
    }
  }

  // array de toast
  function mostrarToast(mensaje, tipo) {
    const validTypes = ["success", "error", "warning", "info"];
    const toastClass = validTypes.includes(tipo) ? tipo : "error";

    $("body").toast({
      class: toastClass,
      message: mensaje,
      showProgress: "bottom",
      displayTime: 3000,
    });
  }

  document
    .getElementById("productTableBody")
    .addEventListener("change", function (event) {
      if (event.target && event.target.classList.contains("estado-dropdown")) {
        const idProducto = event.target.getAttribute("data-producto-id");
        const nuevoEstado = event.target.value; // Obtener el nuevo estado seleccionado

        console.log(
          "ID del producto capturado desde data-producto-id:",
          idProducto
        );
        console.log("Nuevo estado seleccionado:", nuevoEstado);

        if (!idProducto || !nuevoEstado) {
          console.error("ID del producto o estado no definidos:", {
            idProducto,
            nuevoEstado,
          });
          return; // Si alguno de los valores es inválido, detener la ejecución
        }

        actualizarEstadoProducto(idProducto, nuevoEstado); // Llamar a la función para actualizar el estado
      }
    });

  llenarTablaProductos();

  // calendarios para fecha vencimiento y fecha compra

  $(document).ready(function () {
    $("#calendarioVencimiento").calendar({
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

    $("#calendarioCompra").calendar({
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

  // exportar excel
  document
    .getElementById("exportExcelButton")
    .addEventListener("click", function () {
      exportarTablaAExcel("productTableBody", "inventario.xlsx");
    });

  function exportarTablaAExcel(tablaID, nombreArchivo = "") {
    var tabla = document.querySelector(`#${tablaID}`).closest("table");

    var tablaClonada = tabla.cloneNode(true);

    var headers = tablaClonada.querySelectorAll("thead th");
    let indexAcciones = -1;
    headers.forEach((header, index) => {
      if (header.innerText.trim().toLowerCase() === "acciones") {
        indexAcciones = index;
      }
    });
    // remover columna 'acciones'
    if (indexAcciones !== -1) {
      headers[indexAcciones].remove();

      tablaClonada.querySelectorAll("tbody tr").forEach((fila) => {
        fila.querySelectorAll("td")[indexAcciones].remove();
      });
    }

    tablaClonada.querySelectorAll("tr").forEach(function (fila) {
      fila.querySelectorAll("td").forEach(function (celda) {
        var select = celda.querySelector("select");
        if (select) {
          var selectedOption = select.options[select.selectedIndex].text;
          celda.innerText = selectedOption;
        }
      });
    });

    var wb = XLSX.utils.table_to_book(tablaClonada, {
      sheet: "Inventario",
      raw: true,
    });

    XLSX.writeFile(wb, nombreArchivo || "archivo.xlsx");
  }
});
