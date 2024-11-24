import { API_BASE_URL } from "./apiConfig.js";

document.addEventListener("DOMContentLoaded", function () {
  $("#selectProveedor").dropdown();

  // $("#saveProductButton").click(agregarNuevoProducto);
  $("#addProductButton").click(selectProductos);
  $("#editProductButton").click(editarProducto);
  $("#editProductButtonCancel").click(limpiarCampos);
  selectProveedores();
  selectUnidadMedida();
  // selectProveedor();

  $("#selectProveedor").dropdown({
    onChange: function (value, text) {
      filtrarTablaProveedor(); // Llama a la función de filtrado combinada
    },
  });

  $("#selectProducto").dropdown({
    onChange: function (value, text) {
      filtrarTablaProducto();
    },
  });

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

  function refreshTable() {
    $.ajax({
      url: 'http://localhost:8080/inventario',
      method: 'GET',
      success: function (response) {
        // Maneja la respuesta aquí si es necesario
        console.log("Datos cargados exitosamente.");

        // Recarga la página después de una carga exitosa
        location.reload();
      },
      error: function (xhr, status, error) {
        console.error("Error al cargar la tabla: ", error);
      }
    });
  }
  $(document).ready(function () {

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
        // const precioCompra = row.cells[5].textContent.trim();
        const fechaCompra = row.cells[6].textContent.trim();
        const proveedorNombre = row.cells[7].textContent.trim(); // Nombre del proveedor
        // if(fechaVencimiento == undefined){
        //   fechaVencimiento = "0000-00-00"
        // }


        $("#idLoteEdit").on("change", function () {
          const selectedLote = $(this).val();
          const idProducto = document.getElementById("idProductoEdit").value;

          if (selectedLote && idProducto) {
          } else {
            limpiarCampos();
          }
        });
        const unidadDropdown = document.getElementById("unidadMedidaEdit");
        const proveedorDropdown = document.getElementById("proveedorEditField");

        // Asigna el resto de los valores al modal
        document.getElementById("idProductoEdit").value = idProducto;
        document.getElementById("nombreProductoEdit").value = nombreProducto;
        document.getElementById("descripcionProductoEdit").value = descripcionProducto;
        document.getElementById("totalCantidadEdit").value = totalCantidad;
        // document.getElementById("precioCompraEdit").value = precioCompra;
        document.getElementById("fechaCompraEdit").value = fechaCompra;

        for (let i = 0; i < proveedorDropdown.options.length; i++) {
          if (proveedorDropdown.options[i].text === proveedorNombre) {
            proveedorDropdown.selectedIndex = i;
            break;
          }
        }

        for (let i = 0; i < unidadDropdown.options.length; i++) {
          if (unidadDropdown.options[i].text === unidadMedida) {
            unidadDropdown.selectedIndex = i;
            break;
          }
        }
        // Mostrar el modal de edición
        $("#idLoteEdit").dropdown();
        cargarLotesPorProducto(idProducto);


        $("#editModal").modal("show");
      }
      let lotesData = [];
      let cantidadDisponibleLote = 0;


      $(".editarProductoBtn").on("click", function (event) {
        const editarButton = event.target.closest(".editarProductoBtn");
        const row = editarButton.closest("tr");
        const idProducto = row.cells[0].textContent.trim();
        cargarLotesPorProducto(idProducto);
      });

      $("#idLoteEdit").on("change", function () {
        const selectedLote = $(this).val();
        // let cantidadDisponibleLote = 0;

        if (selectedLote) {
          const loteSeleccionado = lotesData.find(
            (lote) => lote.ID_LOTE == selectedLote
          );
          cantidadDisponibleLote = loteSeleccionado ? loteSeleccionado.CANTIDAD : 0;
        }
      });

      async function cargarLotesPorProducto(id_producto) {
        const id_usuario = document.getElementById("ID_USUARIO").innerHTML.trim();

        try {
          const response = await fetch(`${API_BASE_URL}movimientos/salidaMermaProductos`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              P_IDUSUARIO: id_usuario,
              P_IDPRODUCTO: id_producto,
            }),
          });

          if (!response.ok) {
            throw new Error("Error al cargar los lotes");
          }

          const data = await response.json();

          const loteDropdown = document.getElementById("idLoteEdit");
          loteDropdown.innerHTML = '<option value="">Seleccionar Lote</option>'; // Limpia las opciones anteriores

          if (data.success && data.response.length > 0) {
            lotesData = data.response; // Almacena los datos de los lotes

            data.response.forEach((lote) => {
              const option = document.createElement("option");
              option.value = lote.ID_LOTE;
              option.textContent = `Lote ${lote.ID_LOTE} - Cantidad: ${lote.CANTIDAD}`;
              loteDropdown.appendChild(option);
            });
          }
        } catch (error) {
          console.error("Hubo un error:", error);
        }
      }
      document.getElementById("idLoteEdit").addEventListener("change", async function () {
        const selectedLote = this.value; // Lote seleccionado
        const idProducto = document.getElementById("idProductoEdit").value; // ID del producto seleccionado

        if (selectedLote && idProducto) {
          try {
            const response = await fetch(`${API_BASE_URL}/inventario/selectDatosLote`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                P_IDPRODUCTO: idProducto,
                P_IDLOTE: selectedLote,
              }),
            });

            if (!response.ok) {
              throw new Error("Error al cargar los datos del lote");
            }

            const data = await response.json();

            if (data.success) {
              const loteData = data.response[0]; // Suponiendo que solo se devuelve un objeto con datos del lote

              // Rellenar los campos con los datos del lote
              document.getElementById("precioCompraEdit").value = loteData.PRECIO_COMPRA || '';
              document.getElementById("precioVentaEdit").value = loteData.PRECIO_VENTA || '';
              document.getElementById("fechaVencimientoEdit").value = loteData.FECHA_VENCIMIENTO || '';
              document.getElementById("fechaCompraEdit").value = loteData.FECHA_COMPRA || '';

              if (loteData.FECHA_VENCIMIENTO == "9999-01-01") {
                document.getElementById("fechaVencimientoEdit").value = "";
                document.getElementById("fechaVencimientoEdit").placeholder = "No Aplica";
              }
            } else {
              limpiarCampos();
            }
          } catch (error) {
            console.error("Error:", error);
            limpiarCampos();
          }
        } else {
          limpiarCampos();
        }
      });

      // Función para limpiar campos
      function limpiarCampos() {
        document.getElementById("precioCompraEdit").value = '';
        document.getElementById("precioVentaEdit").value = '';
        document.getElementById("fechaVencimientoEdit").value = '';
        document.getElementById("fechaCompraEdit").value = '';
      }
    });
  })
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

  // if (fechaVencValue == "No Aplica") {
  //   fechaVencValue = '9999-01-01';
  // }

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
      refreshTable();
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

  if (fechaVencValue == "") {
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
  const nombreValue = document.getElementById("nombreProductoEdit").value.trim();
  const descripcionValue = document.getElementById("descripcionProductoEdit").value.trim();
  const unidadValue = document.getElementById("unidadMedidaEdit").value.trim();
  const proveedorValue = document.getElementById("proveedorEditField").value.trim();
  const idLoteValue = document.getElementById("idLoteEdit").value.trim(); // Campo para el ID del lote
  let fechaVencimientoValue = document.getElementById("fechaVencimientoEdit").value.trim(); // Campo para la fecha de vencimiento
  const fechaCompraValue = document.getElementById("fechaCompraEdit").value.trim();
  const cantidadValue = document.getElementById("totalCantidadEdit").value.trim();
  const precioCompraValue = document.getElementById("precioCompraEdit").value.trim();
  const precioVentaValue = document.getElementById("precioVentaEdit").value.trim();
  const idUsuarioValue = document.getElementById("idUsuarioEdit").textContent.trim();

  console.log(nombreValue);
  console.log(descripcionValue);
  console.log(unidadValue);
  console.log(proveedorValue);
  console.log(idUsuarioValue);
  console.log(idLoteValue);
  console.log(fechaVencimientoValue);
  console.log(fechaCompraValue);
  console.log(cantidadValue);
  console.log(precioCompraValue);
  console.log(precioVentaValue);

  const productoData = {
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
  };

  // Muestra el objeto completo en la consola
  console.log("Datos del producto a enviar:", productoData);


  if (fechaVencimientoValue == "") {
    fechaVencimientoValue = "9999-01-01";
  }
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
  } else if (idLoteValue.value == "") {
    $('body').toast({
      message: "Por favor, seleccione un Lote",
      showProgress: 'top',
      class: 'error',
      displayTime: 8000,
    })
  }
  else {
    try {
      const response = await fetch(
        `${API_BASE_URL}inventario/editarProducto`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            P_ID_PRODUCTO: productoId,
            P_NOMBRE_PRODUCTO: nombreValue,
            P_DESCRIPCION_PROD1: descripcionValue,
            P_UNIDAD_MEDIDA: unidadValue,
            P_ID_PROVEEDOR: proveedorValue,
            P_ID_USUARIO: idUsuarioValue,
            P_ID_LOTE: idLoteValue,
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
        // Cerrar el modal
        $("#editModal").modal("hide");
      }

      refreshTable()
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
      console.log("ID_PROVEEDOR:", opcion.ID_PROVEEDOR, "NOMBRE_PROVEEDOR:", opcion.NOMBRE_PROVEEDOR); // Depuración
      dropdownEdit.appendChild(opt);
    });

    let menu = document.querySelector("#selectProveedor .menu");
    menu.innerHTML = "";

    // Agregar la opción "Todos"
    let allItem = document.createElement("div");
    allItem.className = "item";
    allItem.dataset.value = ""; // Valor vacío para "Todos"
    allItem.textContent = "Todos";
    menu.appendChild(allItem);

    // Agregar opciones de proveedores usando el nombre como valor
    data.response.forEach((x) => {
      let item = document.createElement("div");
      item.className = "item";
      item.dataset.value = x.NOMBRE_PROVEEDOR; // Usar el nombre del proveedor
      item.textContent = x.NOMBRE_PROVEEDOR;
      menu.appendChild(item);
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
    limpiarFormularioProducto()
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

        // FORMATEA FECHA A DD-MM-YYY
        const [año, mes, día] = producto.FECHA_COMPRA.split("-");
        const FECHA_COMPRA = `${día}-${mes}-${año}`;

        const fila = document.createElement("tr");

        let filaHTML = `
            <td class="center aligned">${producto.ID_PRODUCTO}</td>
            <td class="center aligned">${producto.NOMBRE_PRODUCTO}</td>
            <td class="center aligned">${producto.DESCRIPCION_PRODUCTO}</td>
            <td class="center aligned">${producto.UNIDAD_MEDIDA}</td>
            <td class="center aligned">${producto.TOTAL_CANTIDAD}</td>
            
            <td class="center aligned">${FECHA_COMPRA}</td>
            <td class="center aligned">${producto.NOMBRE_PROVEEDOR}</td>
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
        "table.ui.celled.large.unstackable.scrolling.table"
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

function filtrarTablaProveedor() {
  let estadoSeleccionado = $("#estadoDropdown").dropdown("get value");
  let proveedorSeleccionado = $("#selectProveedor").dropdown("get value");

  console.log("Filtrando por Estado:", estadoSeleccionado, "Proveedor:", proveedorSeleccionado);

  const filas = document.querySelectorAll("#productTableBody tr");

  filas.forEach(function (fila) {
    const selectEstado = fila.querySelector(".estado-dropdown");
    const nombreProveedorFila = fila.querySelector("td:nth-child(7)").textContent.trim(); // Nombre del proveedor en la columna

    if (selectEstado) {
      const estadoFila = selectEstado.value;
      console.log("Estado en fila:", estadoFila, "Proveedor en fila:", nombreProveedorFila);

      const mostrarPorEstado = estadoSeleccionado === "" || estadoSeleccionado === estadoFila;
      const mostrarPorProveedor = proveedorSeleccionado === "" || proveedorSeleccionado === nombreProveedorFila;

      if (mostrarPorEstado && mostrarPorProveedor) {
        fila.style.display = ""; // Mostrar la fila
        console.log("Fila mostrada");
      } else {
        fila.style.display = "none"; // Ocultar la fila
        console.log("Fila oculta");
      }
    } else {
      console.warn("No se encontró el select de estado en esta fila.");
    }
  });
}

function filtrarTablaProducto() {
  const productoSeleccionado = $("#selectProducto").dropdown("get value");

  console.log("Filtrando por Producto:", productoSeleccionado);

  const filas = document.querySelectorAll("#productTableBody tr");

  filas.forEach(function (fila) {
    const nombreProductoFila = fila.querySelector("td:nth-child(2)").textContent.trim(); // Columna "Nombre Producto"

    // Si no hay producto seleccionado o coincide con la fila, se muestra
    if (productoSeleccionado === "" || productoSeleccionado === nombreProductoFila) {
      fila.style.display = ""; // Mostrar la fila
      console.log("Fila mostrada:", nombreProductoFila);
    } else {
      fila.style.display = "none"; // Ocultar la fila
      console.log("Fila oculta:", nombreProductoFila);
    }
  });
}



document.getElementById("id-producto").addEventListener("click", function () {
  const tableBody = document.getElementById("productTableBody");
  const rows = Array.from(tableBody.querySelectorAll("tr"));

  let order = this.getAttribute("data-order");
  const isAscending = order === "asc";

  rows.sort((a, b) => {
    const idA = parseInt(a.cells[0].textContent);
    const idB = parseInt(b.cells[0].textContent);
    return isAscending ? idA - idB : idB - idA;
  });

  this.setAttribute("data-order", isAscending ? "desc" : "asc");

  tableBody.innerHTML = "";
  rows.forEach((row) => tableBody.appendChild(row));
});

function limpiarCampos() {
  const campos = [
    "precioCompraEdit",
    "precioVentaEdit",
    "fechaVencimientoEdit"
  ];

  // Limpiar campos de texto
  campos.forEach(campo => {
    const input = document.getElementById(campo);
    if (input) {
      input.value = ''; // Limpiar el valor del campo
    }
  });

  // Restablecer el dropdown con Fomantic-UI
  const dropdown = $("#idLoteEdit");
  if (dropdown.length) {
    dropdown.dropdown("clear"); // Limpia el valor seleccionado en el dropdown de Fomantic-UI
  }

  console.log("Campos limpiados correctamente.");
}

function refreshTable() {
  $.ajax({
    url: 'http://localhost:8080/inventario',
    method: 'GET',
    success: function (response) {
      // Maneja la respuesta aquí si es necesario
      console.log("Datos cargados exitosamente.");

      // Recarga la página después de una carga exitosa
      location.reload();
    },
    error: function (xhr, status, error) {
      console.error("Error al cargar la tabla: ", error);
    }
  });
}