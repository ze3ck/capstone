import { API_BASE_URL } from "./apiConfig.js";

document.addEventListener("DOMContentLoaded", function () {
  llenarTablaMovimientos();
  // selectCategoria();
  cargarRazonesMerma();
});

window.onload = function () {
  selectCategoria();
  selectResponsables();
  selectCatGastoOperacional();
  // guardarMerma()
};

async function selectCategoria() {
  try {
    const response = await fetch(
      `${API_BASE_URL}movimientos/selectCatMovimiento`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Error en la respuesta del servidor");
    }

    const data = await response.json();
    // console.log("Datos de la respuesta:", data);

    // Obtenemos el elemento select una vez fuera del bucle para evitar múltiples búsquedas en el DOM
    const select = document.getElementById("selectCategoria");

    if (!select) {
      console.error("No se encontró el elemento select en el DOM.");
      return;
    }

    // Limpiamos el select antes de llenarlo
    select.innerHTML = '<option value="">categoría</option>';

    // Recorremos la respuesta de la API y llenamos el select
    for (let x of data.response) {
      const opt = document.createElement("option");
      opt.value = x.DESCRIPCION.trim(); // Cambia esto si el nombre de la propiedad es diferente
      opt.textContent = x.DESCRIPCION.trim();
      select.appendChild(opt);
    }
  } catch (error) {
    console.error("Error al cargar las categorías:", error);
  }
}

async function selectResponsables() {
  let id_usuario = document.getElementById("ID_USUARIO").innerHTML.trim();
  try {
    const response = await fetch(
      `${API_BASE_URL}movimientos/selectResponsables`,
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

    if (!response.ok) {
      throw new Error("Error en la respuesta del servidor");
    }

    const data = await response.json();
    // console.log("Datos de la respuesta:", data);

    // Obtenemos el elemento select una vez fuera del bucle para evitar múltiples búsquedas en el DOM
    const select = document.getElementById("selectResponsable");

    if (!select) {
      console.error("No se encontró el elemento select en el DOM.");
      return;
    }

    // Limpiamos el select antes de llenarlo
    select.innerHTML = '<option value="">Responsable</option>';

    // Recorremos la respuesta de la API y llenamos el select
    for (let x of data.response) {
      const opt = document.createElement("option");
      opt.value = x.NOMBRE.trim(); // Cambia esto si el nombre de la propiedad es diferente
      opt.textContent = x.NOMBRE.trim();
      select.appendChild(opt);
    }
  } catch (error) {
    console.error("Error al cargar las categorías:", error);
  }
}

async function selectCatGastoOperacional() {
  try {
    const response = await fetch(
      `${API_BASE_URL}movimientos/selectCatGastoOperativoMovimiento`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Error en la respuesta del servidor");
    }

    const data = await response.json();
    // console.log("Datos de la respuesta:", data);

    // Obtenemos el elemento select una vez fuera del bucle para evitar múltiples búsquedas en el DOM
    const select = document.getElementById("selectCategoriaGastoOperacional");

    if (!select) {
      console.error("No se encontró el elemento select en el DOM.");
      return;
    }

    // Limpiamos el select antes de llenarlo
    select.innerHTML = '<option value="">categoría</option>';

    // Recorremos la respuesta de la API y llenamos el select
    for (let x of data.response) {
      const opt = document.createElement("option");
      opt.value = x.DESCRIPCION_CATEGORIA.trim(); // Cambia esto si el nombre de la propiedad es diferente
      opt.textContent = x.DESCRIPCION_CATEGORIA.trim();
      select.appendChild(opt);
    }
  } catch (error) {
    console.error("Error al cargar las categorías:", error);
  }
}

async function llenarTablaMovimientos() {
  // console.log("Entre a llenarTablaMovimientos");
  // mostarLoader();
  let id_usuario = document.getElementById("ID_USUARIO").innerHTML.trim();

  $("#tblMovimientos tbody tr").remove();
  // console.log(id_usuario);

  const response = await fetch(`${API_BASE_URL}movimientos/llenadoMovimiento`, {
    //             await fetch(`${API_BASE_URL}inventario/llenadoDetalleMovimiento`
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
  // console.log(P_IDUSUARIO);
  // console.log("Datos de la respuesta:", data);

  for (let x of data.response) {
    // console.log(x.ID_MOVIMIENTO);
    cargarFilasMovimientos(
      x.ID_MOVIMIENTO,
      x.DESCRIPCION_MOVIMIENTO,
      x.RESPONSABLE,
      x.FECHA_MOVIMIENTO,
      x.NOTA,
      x.TOTAL_MOVIMIENTO,
      x.DESCRIPCION,
      x.DESCRIPCION_PAGO
    );
  }
}

// Cargar Data movimientos usuarios
function cargarFilasMovimientos(
  ID_MOVIMIENTO,
  DESCRIPCION_MOVIMIENTO,
  RESPONSABLE,
  FECHA_MOVIMIENTO,
  NOTA,
  TOTAL_MOVIMIENTO,
  DESCRIPCION,
  DESCRIPCION_PAGO
) {
  var tablaVisor = document.getElementById("tblMovimientos_body");

  var tr = document.createElement("tr");
  tr.classList.add("center", "aligned");

  var col1 = document.createElement("td");
  var col2 = document.createElement("td");
  var col3 = document.createElement("td");
  var col4 = document.createElement("td");
  var col5 = document.createElement("td");
  var col6 = document.createElement("td");
  var col7 = document.createElement("td");
  var col8 = document.createElement("td");
  var col9 = document.createElement("td");

  col1.innerHTML = ID_MOVIMIENTO;
  col2.innerHTML = DESCRIPCION_MOVIMIENTO;
  col3.innerHTML = FECHA_MOVIMIENTO;
  col4.innerHTML = TOTAL_MOVIMIENTO;
  col5.innerHTML = NOTA;
  col6.innerHTML = DESCRIPCION;
  col7.innerHTML = RESPONSABLE;
  col8.innerHTML = DESCRIPCION_PAGO;

  // creacion de Boton dinamico de ver Detalle
  var button = document.createElement("button");
  button.id = "verDetalle_" + ID_MOVIMIENTO; // ID único
  button.type = "button";
  button.className = "ui blue button";
  button.innerHTML = "Ver Detalle";
  col9.appendChild(button);

  // Agregar evento de clic al botón para mostrar el modal
  button.addEventListener("click", function () {
    // Mostrar el modal usando jQuery
    $("#modalDetalleMovimientos")
      .modal({
        onDeny: function () {
          return true;
        },
      })
      .modal("show");
    llenarTblDetalleMovimiento(ID_MOVIMIENTO);
  });

  tr.appendChild(col1);
  tr.appendChild(col2);
  tr.appendChild(col3);
  tr.appendChild(col4);
  tr.appendChild(col5);
  tr.appendChild(col6);
  tr.appendChild(col7);
  tr.appendChild(col8);
  tr.appendChild(col9);

  // Finalmente, agregar la fila a la tabla
  tablaVisor.appendChild(tr);
}

/**
 * llenarTblDetalleMovimiento
 */

async function llenarTblDetalleMovimiento(ID_MOVIMIENTO) {
  // Limpiar las filas actuales de la tabla
  $("#tblDetalleMovimientos tbody tr").remove();

  try {
    const response = await fetch(
      `${API_BASE_URL}movimientos/llenadoDetalleMovimiento`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          P_IDMOVIMIENTO: ID_MOVIMIENTO,
        }),
      }
    );

    const data = await response.json();
    console.log("Datos de la respuesta:", data);

    // Verificar si la respuesta es exitosa
    if (response.ok && data.response && data.response.length > 0) {
      // Si hay detalles de movimientos, recorrerlos y agregarlos a la tabla
      for (let x of data.response) {
        cargarFilasDetalleMovimientos(
          x.ID_MOVIMIENTO,
          x.ITEM,
          x.ID_LOTE,
          x.CANTIDAD,
          x.PRECIO,
          x.DESCRIPCION_PRODUCTO,
          x.TOTAL
        );
      }
    } else {
      // Si no hay detalles, mostrar un toast con el mensaje correspondiente
      mostrarToast("No se encontraron detalles del movimiento.", "warning");
    }
  } catch (error) {
    // Mostrar un mensaje de error si ocurre un problema con la solicitud
    console.error("Error al cargar los detalles del movimiento:", error);
    mostrarToast(
      "Ocurrió un error al cargar los detalles del movimiento.",
      "error"
    );
  }
}

// Función para mostrar el toast de alerta
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

// Cargar Data detalle movimiento
function cargarFilasDetalleMovimientos(
  ID_MOVIMIENTO,
  ITEM,
  ID_LOTE,
  CANTIDAD,
  PRECIO,
  DESCRIPCION_PRODUCTO,
  TOTAL
) {
  var tablaVisor = document.getElementById("tblDetalleMovimientos_body");

  var tr = document.createElement("tr");
  tr.classList.add("center", "aligned");

  var col1 = document.createElement("td");
  var col2 = document.createElement("td");
  var col3 = document.createElement("td");
  var col4 = document.createElement("td");
  var col5 = document.createElement("td");
  var col6 = document.createElement("td");
  var col7 = document.createElement("td");

  col1.innerHTML = ID_MOVIMIENTO;
  col2.innerHTML = ITEM;
  col3.innerHTML = DESCRIPCION_PRODUCTO;
  col4.innerHTML = ID_LOTE;
  col5.innerHTML = CANTIDAD;
  col6.innerHTML = PRECIO;
  col7.innerHTML = TOTAL;

  tr.appendChild(col1);
  tr.appendChild(col2);
  tr.appendChild(col3);
  tr.appendChild(col4);
  tr.appendChild(col5);
  tr.appendChild(col6);
  tr.appendChild(col7);

  // Finalmente, agregar la fila a la tabla
  tablaVisor.appendChild(tr);
}

$(document).ready(function () {
  // Evento cuando se cambia el valor del campo
  $("#cantidadMerma").on("input", function () {
    var valor = $(this).val();

    // Verificamos si el valor es un número entero mayor o igual a 1
    if (!/^\d+$/.test(valor) || parseInt(valor) < 1) {
      // Si no es válido, establecemos el valor mínimo (1)
      $(this).val(1);
    }
  });

  // <!-- Generar Modal para salida de Merma  -->
  $("#mermaProductoDropdown").dropdown();
  $("#mermaLoteDropdown").dropdown();

  $("#btnNuevaSalidaMerma").on("click", function () {
    $("#modalSalidaMerma").modal("show");
  });

  $("#btnGenerarSalidaMerma").on("click", function () {
    const producto = $("#mermaProductoDropdown").val();
    const lote = $("#mermaLoteDropdown").val();
    const cantidad = $("#cantidadMerma").val();

    if (!producto || !lote || !cantidad) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    console.log({
      producto,
      lote,
      cantidad,
    });

    $("#modalSalidaMerma").modal("hide");
  });

  // Inicializar calendario "Fecha Desde"
  $("#fechaInicio").calendar({
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

  // Inicializar calendario "Fecha Hasta"
  $("#fechaFin").calendar({
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
  // Mostrar el modal cuando se haga clic en el botón "Generar Salida Producto"
  $("#btnNuevoMovimiento").on("click", function () {
    selectProductos();
    $("#modalGenerarSalida")
      .modal({
        onApprove: function (event) {
          // GENERAR SALIDA (falta agregar funcion)
          if (event) {
            event.preventDefault();
          }
          // return ;
        },
        onDeny: function () {
          return true;
        },
      })
      .modal("show");
  });

  $("#btnNuevoGastoOperativo").on("click", function () {
    $("#modalNuevoGastoOperativo")
      .modal({
        onApprove: function () {
          generarGastoOperativo();
          return false;
        },
        onDeny: function () {
          console.log("modal cancelado");
          return true;
        },
      })
      .modal("show");
  });
});

// MANEJO DE CARRITO DE COMPRAS ----------------------------

$(document).ready(function () {
  // Función para agregar un producto al carrito
  $("#agregarProducto").on("click", function () {
    let productoSeleccionado = $("#productoDropdown").val();
    let cantidadIngresada = parseInt($("#inputCantidad").val());
    let descuento = parseFloat($("#inputDescuento").val()) || 0;
    let precio = Math.ceil(parseFloat($("#precio").val())); // Redondear precio a entero hacia arriba
    let inventarioDisponible = parseInt($("#cant_total").text()); // Cantidad total disponible en inventario

    // Calcular la cantidad total del producto ya en el carrito
    let cantidadEnCarrito = 0;
    $("#carrito_body tr").each(function () {
      let productoEnFila = $(this).find("td:eq(1)").text();
      if (productoEnFila === productoSeleccionado) {
        cantidadEnCarrito += parseInt($(this).find("td:eq(3)").text());
      }
    });

    // Validar que se seleccionó un producto y que la cantidad es válida
    if (!productoSeleccionado) {
      mensaje("error", 2000, "Selecciona un producto.");
      return;
    }
    if (isNaN(cantidadIngresada) || cantidadIngresada <= 0) {
      mensaje("error", 2000, "Ingresa una cantidad válida.");
      return;
    }

    // Verificar que no se supere el inventario disponible
    if (cantidadEnCarrito + cantidadIngresada > inventarioDisponible) {
      mensaje(
        "error",
        2000,
        "No puedes agregar más de la cantidad disponible en inventario."
      );
      return;
    }

    // Aplicar el descuento y redondear hacia arriba el total de la fila
    let precioConDescuento = Math.ceil(precio - descuento);
    let totalFila = Math.ceil(precioConDescuento * cantidadIngresada); // Redondear el total hacia arriba

    // Crear una nueva fila en la tabla
    let $nuevaFila = $(`
          <tr>
              <td></td>
              <td>${productoSeleccionado}</td>
              <td>${$("#productoDropdown option:selected").text()}</td>
              <td>${cantidadIngresada}</td>
              <td>${precio}</td>
              <td>${descuento}</td>
              <td><i class="window close icon" style="color: red; cursor: pointer;"></i></td>
          </tr>
      `);

    // Añadir el evento para eliminar la fila
    $nuevaFila.find("i.window.close.icon").on("click", function () {
      $(this).closest("tr").remove();
      actualizarNumerosFila();
      actualizarTotal();
    });

    $("#carrito_body").append($nuevaFila);

    // Actualizar el número de ítems
    actualizarNumerosFila();

    // Actualizar el total
    actualizarTotal();

    // Limpiar los campos de entrada
    limpiarCampos();
  });

  // Función para limpiar los campos del formulario
  function limpiarCampos() {
    $("#productoDropdown").val(""); // Limpiar selección del dropdown
    $("#inputCantidad").val(""); // Limpiar cantidad
    $("#inputDescuento").val(""); // Limpiar descuento
    $("#precio").val(""); // Limpiar precio
    $("#cant_total").text(""); // Limpiar disponibilidad
  }

  // Función para actualizar los números de ítems en la primera columna
  function actualizarNumerosFila() {
    $("#carrito_body tr").each(function (index) {
      $(this)
        .find("td:first")
        .text(index + 1);
    });
  }

  // Función para actualizar el total del carrito
  function actualizarTotal() {
    let total = 0;
    $("#carrito_body tr").each(function () {
      let precio = parseInt($(this).find("td:eq(4)").text());
      let cantidad = parseInt($(this).find("td:eq(3)").text());
      let descuento = parseFloat($(this).find("td:eq(5)").text());
      let precioConDescuento = Math.ceil(precio - descuento);
      total += precioConDescuento * cantidad;
    });
    $("#totalAmount").text(total); // Mostrar el total como número entero
  }
});

// ---------------------------------------------

// FILTROS DE LA TABLA

// Function to filter the table based on the selected filters
function filterTable() {
  // Get the values from the filter inputs
  let tipo = document.getElementById("dropDownTipomov").value;
  let fechaDesde = document.getElementById("fechaDesde").value;
  let fechaHasta = document.getElementById("fechaHasta").value;
  let categoria = document
    .getElementById("selectCategoria")
    .value.toUpperCase();
  let responsable = document
    .getElementById("selectResponsable")
    .value.toUpperCase();
  let metodoPago = document
    .getElementById("selectMetodoPago")
    .value.toUpperCase();

  let table = document.getElementById("tblMovimientos_body");
  let rows = table.getElementsByTagName("tr");

  // Loop through all table rows, and hide those that don't match the search query
  for (let i = 0; i < rows.length; i++) {
    let tdTipo = rows[i].getElementsByTagName("td")[1]; // This is where "ENTRADA" or "SALIDA" is located in the table
    let tdFecha = rows[i].getElementsByTagName("td")[2];
    let tdCategoria = rows[i].getElementsByTagName("td")[5];
    let tdResponsable = rows[i].getElementsByTagName("td")[6];
    let tdMetodoPago = rows[i].getElementsByTagName("td")[7];

    let show = true;

    // Filter by Tipo
    if (tipo && tdTipo) {
      let tipoText = tdTipo.textContent.trim().toUpperCase();
      if (
        (tipo === "1" && tipoText !== "ENTRADA") ||
        (tipo === "2" && tipoText !== "SALIDA")
      ) {
        show = false;
      }
    }

    // Filter by Fecha Desde and Hasta
    if (fechaDesde || fechaHasta) {
      let rowDate = new Date(tdFecha.textContent);
      let startDate = fechaDesde ? new Date(fechaDesde) : null;
      let endDate = fechaHasta ? new Date(fechaHasta) : null;

      if (
        (startDate && rowDate < startDate) ||
        (endDate && rowDate > endDate)
      ) {
        show = false;
      }
    }

    // Filter by Categoria
    if (categoria && tdCategoria) {
      if (tdCategoria.textContent.toUpperCase().indexOf(categoria) === -1) {
        show = false;
      }
    }

    // Filter by Responsable
    if (responsable && tdResponsable) {
      if (tdResponsable.textContent.toUpperCase().indexOf(responsable) === -1) {
        show = false;
      }
    }

    // Filter by Metodo Pago
    if (metodoPago && tdMetodoPago) {
      if (tdMetodoPago.textContent.toUpperCase().indexOf(metodoPago) === -1) {
        show = false;
      }
    }

    // Toggle row visibility
    rows[i].style.display = show ? "" : "none";
  }
}

// Function to clear all filters
function clearFilters() {
  // Reset all filter inputs
  document.getElementById("dropDownTipomov").value = "";
  document.getElementById("fechaDesde").value = "";
  document.getElementById("fechaHasta").value = "";
  document.getElementById("selectCategoria").value = "";
  document.getElementById("selectResponsable").value = "";
  document.getElementById("selectMetodoPago").value = "";

  // Reset the dropdowns
  $("#dropDownTipomov").dropdown("clear");
  $("#selectCategoria").dropdown("clear");
  $("#selectResponsable").dropdown("clear");
  $("#selectMetodoPago").dropdown("clear");

  // Re-display all rows (reset the table)
  let table = document.getElementById("tblMovimientos_body");
  let rows = table.getElementsByTagName("tr");
  for (let i = 0; i < rows.length; i++) {
    rows[i].style.display = "";
  }
}

// Attach event listeners after the page is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Initialize Fomantic UI dropdowns
  $("#dropDownTipomov").dropdown({
    placeholder: "Tipo",
  });
  $("#selectCategoria").dropdown({
    placeholder: "Categoria",
  });
  $("#selectResponsable").dropdown({
    placeholder: "Responsable",
  });
  $("#selectMetodoPago").dropdown({
    placeholder: "Metodo Pago",
  });

  // Clear filters on page load
  clearFilters();
  // Attach event listeners for dynamic filtering
  document
    .getElementById("dropDownTipomov")
    .addEventListener("change", filterTable);
  document.getElementById("fechaDesde").addEventListener("change", filterTable);
  document.getElementById("fechaHasta").addEventListener("change", filterTable);
  document
    .getElementById("selectCategoria")
    .addEventListener("change", filterTable);
  document
    .getElementById("selectResponsable")
    .addEventListener("change", filterTable);
  document
    .getElementById("selectMetodoPago")
    .addEventListener("change", filterTable);

  // Attach event listener for clearing filters
  document
    .getElementById("btnLimpiarFiltros")
    .addEventListener("click", clearFilters);
});

function mensaje(clase, tiempo, mensaje) {
  $("body").toast({
    displayTime: tiempo,
    class: clase,
    message: mensaje,
    showProgress: "top",
    progressUp: true,
  });
}

async function generarGastoOperativo(event) {
  event.preventDefault();

  let descripcion = document.getElementById("descripcion").value.trim();
  let monto = parseFloat(document.getElementById("monto").value.trim());
  let categoria = document.getElementById(
    "selectCategoriaGastoOperacional"
  ).value;
  let id_usuario = 6; // Puedes obtener esto dinámicamente si es necesario

  // Validaciones
  if (!descripcion || descripcion.length > 100) {
    mensaje("error", 2000, "Descripción inválida");
    return;
  }

  if (isNaN(monto) || monto <= 0) {
    mensaje("error", 2000, "Monto Inválido");
    return;
  }

  if (!categoria) {
    mensaje("error", 2000, "Categoría Inválida");
    return;
  }

  console.log("datos GastoOperativo:", {
    P_DESCRIPCION: descripcion,
    P_MONTO: monto,
    P_CATEGORIA: categoria,
    P_IDUSUARIO: id_usuario,
  });

  // Realizar el fetch para generar el gasto operativo
  try {
    const response = await fetch(
      `${API_BASE_URL}movimientos/generarGastoOperativo`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          P_DESCRIPCION: descripcion,
          P_MONTO: monto,
          P_CATEGORIA: categoria,
          P_IDUSUARIO: id_usuario,
        }),
      }
    );

    const data = await response.json();

    if (response.ok && data.response && data.response.length > 0) {
      for (let x of data.response) {
        if (x.VALIDACION == 1) {
          mensaje("success", 2000, "Gasto operativo ingresado con éxito.");
          $("#modalNuevoGastoOperativo").modal("hide");
        } else {
          mensaje("error", 2000, "Hubo un problema al ingresar el gasto.");
        }
      }
    } else {
      mensaje(
        "error",
        2000,
        "No se pudo validar el ingreso del gasto operativo."
      );
    }
  } catch (error) {
    console.error("Error en el fetch:", error);
    mensaje("error", 2000, "Error de conexión o del servidor.");
  }
}

// Asignar evento click al botón "Generar Gasto Operativo"
document
  .getElementById("btnGenerarGasto")
  .addEventListener("click", generarGastoOperativo);

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
  select.innerHTML = '<option value="">producto</option>';

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
  async function cant_total() {
    let id_producto = document.getElementById("productoDropdown").value;
    let id_usuario = document.getElementById("ID_USUARIO").innerHTML.trim();
    console.log(id_producto);
    const response = await fetch(`${API_BASE_URL}movimientos/cant_total`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        P_PRODUCTO: id_producto,
        P_IDUSUARIO: id_usuario,
      }),
    });

    const data = await response.json();
    console.log("Datos de la respuesta:", data);
    for (let x of data.response) {
      document.getElementById("cant_total").innerHTML = x.CANTIDAD;
      document.getElementById("precio").value = x.PRECIO_VENTA;
    }
  }
  // Se ejecuta cuando cambia de estado el select
  document
    .getElementById("productoDropdown")
    .addEventListener("change", cant_total);
}

// Función para cargar los productos en el dropdown de productos
async function cargarProductos() {
  let id_usuario = document.getElementById("ID_USUARIO").innerHTML.trim();

  try {
    const response = await fetch(`${API_BASE_URL}movimientos/selectProductos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        P_IDUSUARIO: id_usuario,
      }),
    });

    if (!response.ok) {
      throw new Error("Error al cargar los productos");
    }

    const data = await response.json();

    const productoDropdown = document.getElementById("mermaProductoDropdown");

    productoDropdown.innerHTML =
      '<option value="">Seleccionar Producto</option>';

    if (data.success && data.response.length > 0) {
      data.response.forEach((producto) => {
        const option = document.createElement("option");
        option.value = producto.ID_PRODUCTO;
        option.textContent = producto.NOMBRE_PRODUCTO;
        productoDropdown.appendChild(option);
      });
    } else {
      alert("No se encontraron productos");
    }
  } catch (error) {
    console.error("Hubo un error:", error);
    alert("Error al cargar los productos");
  }
}

window.onload = cargarProductos;
let lotesData = [];

$(document).ready(function () {
  $("#mermaProductoDropdown").on("change", function () {
    const id_producto = $(this).val();
    if (id_producto) {
      cargarLotesPorProducto(id_producto);
    }
  });

  $("#mermaLoteDropdown").on("change", function () {
    const selectedLote = $(this).val();
    let cantidadDisponibleLote = 0;

    if (selectedLote) {
      const loteSeleccionado = lotesData.find(
        (lote) => lote.ID_LOTE == selectedLote
      );
      cantidadDisponibleLote = loteSeleccionado ? loteSeleccionado.CANTIDAD : 0;
    }

    $("#cant_total_prod_lote").text(cantidadDisponibleLote);
  });

  $("#cantidadMerma").on("input", function () {
    const cantidadIngresada = parseInt($(this).val(), 10);
    const cantidadDisponible = parseInt($("#cant_total_prod_lote").text(), 10);

    if (cantidadIngresada > cantidadDisponible) {
      mensaje(
        "error",
        2000,
        "No puedes agregar más de la cantidad disponible en inventario."
      );
      $(this).val(cantidadDisponible);
    }
  });

  $("#btnGenerarSalidaMerma").on("click", function () {
    const cantidadMerma = parseInt($("#cantidadMerma").val(), 10);
    const cantidadDisponible = parseInt($("#cant_total_prod_lote").text(), 10);

    if (cantidadMerma > cantidadDisponible || isNaN(cantidadMerma)) {
      mensaje(
        "error",
        2000,
        "No puedes agregar más de la cantidad disponible en inventario."
      );
      return;
    }

    alert("Salida de merma generada con éxito.");
  });
});
async function cargarLotesPorProducto(id_producto) {
  let id_usuario = document.getElementById("ID_USUARIO").innerHTML.trim();

  try {
    const response = await fetch(
      `${API_BASE_URL}movimientos/salidaMermaProductos`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          P_IDUSUARIO: id_usuario,
          P_IDPRODUCTO: id_producto,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Error al cargar los lotes");
    }

    const data = await response.json();

    const loteDropdown = document.getElementById("mermaLoteDropdown");
    loteDropdown.innerHTML = '<option value="">Seleccionar Lote</option>';

    if (data.success && data.response.length > 0) {
      lotesData = data.response; // Almacena los datos en lotesData

      data.response.forEach((lote) => {
        const option = document.createElement("option");
        option.value = lote.ID_LOTE;
        option.textContent = `Lote ${lote.ID_LOTE} - Expira: ${lote.FECHA_VENCIMIENTO} - Cantidad: ${lote.CANTIDAD}`;
        loteDropdown.appendChild(option);
      });
    } else {
      mostrarToast("No se encontraron lotes para este producto", "warning");
    }
  } catch (error) {
    console.error("Hubo un error:", error);
    mostrarToast("No se encontraron lotes para este producto", "warning");
  }
}

document
  .getElementById("mermaProductoDropdown")
  .addEventListener("change", function () {
    let id_producto = this.value;
    if (id_producto) {
      cargarLotesPorProducto(id_producto);
    } else {
      document.getElementById("mermaLoteDropdown").innerHTML =
        '<option value="">Seleccionar Lote</option>';
    }
  });

async function cargarRazonesMerma() {
  try {
    const response = await fetch(
      `${API_BASE_URL}movimientos/obtenerRazonesMerma`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Error al cargar las razones de merma");
    }

    const data = await response.json();

    const razonMermaDropdown = document.getElementById("razonMermaDropdown");

    // Limpiar el dropdown
    razonMermaDropdown.innerHTML =
      '<option value="">Seleccionar Razón de Merma</option>';

    if (data.success && data.response.length > 0) {
      // Llenar el dropdown con las razones de merma
      data.response.forEach((razon) => {
        const option = document.createElement("option");
        option.value = razon.ID_RAZON_MERMA;
        option.textContent = razon.DESCRIPCION_RAZON;
        razonMermaDropdown.appendChild(option);
      });
    } else {
      alert("No se encontraron razones de merma");
    }
  } catch (error) {
    console.error("Hubo un error:", error);
    alert("Error al cargar las razones de merma");
  }
}

// Función para calcular el costo de merma basado en la cantidad ingresada por el usuario y el precio de compra del lote
async function calcularCostoMerma(id_lote, cantidad) {
  try {
    const response = await fetch(
      `${API_BASE_URL}movimientos/obtenerPrecioCompraLote`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ID_LOTE: id_lote,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Error al obtener el precio de compra del lote");
    }

    const data = await response.json();

    const precioCompra = data.PRECIO_COMPRA;
    const costoMermaCalculado = precioCompra * cantidad;

    // Mostrar el cálculo de costo de merma
    document.getElementById("costoMerma").value =
      costoMermaCalculado.toFixed(2);
  } catch (error) {
    console.error("Error:", error);
  }
}

document
  .getElementById("mermaLoteDropdown")
  .addEventListener("change", function () {
    const id_lote = this.value;
    const cantidad = document.getElementById("cantidadMerma").value;

    if (id_lote && cantidad) {
      calcularCostoMerma(id_lote, cantidad);
    }
  });

document.getElementById("cantidadMerma").addEventListener("input", function () {
  const id_lote = document.getElementById("mermaLoteDropdown").value;
  const cantidad = this.value;

  if (id_lote && cantidad) {
    calcularCostoMerma(id_lote, cantidad);
  }
});

$(document).ready(function () {
  $("#mermaLoteDropdown").on("change", function () {
    const selectedLote = $(this).val();

    let cantidadDisponibleLote = 0;

    if (selectedLote) {
      const loteSeleccionado = data.response.find(
        (lote) => lote.ID_LOTE == selectedLote
      );
      cantidadDisponibleLote = loteSeleccionado ? loteSeleccionado.CANTIDAD : 0;
    }

    $("#cant_total_prod_lote").text(cantidadDisponibleLote);
  });

  $("#cantidadMerma").on("input", function () {
    const cantidadIngresada = parseInt($(this).val(), 10);
    const cantidadDisponible = parseInt($("#cant_total_prod_lote").text(), 10);

    if (cantidadIngresada > cantidadDisponible) {
      alert(
        "La cantidad ingresada no puede ser mayor que la disponibilidad del producto en el lote."
      );
      $(this).val(cantidadDisponible);
    }
  });

  $("#btnGenerarSalidaMerma").on("click", function () {
    const cantidadMerma = parseInt($("#cantidadMerma").val(), 10);
    const cantidadDisponible = parseInt($("#cant_total_prod_lote").text(), 10);

    if (cantidadMerma > cantidadDisponible || isNaN(cantidadMerma)) {
      alert(
        "Por favor ingrese una cantidad válida que no exceda la disponibilidad del lote."
      );
      return;
    }

    alert("Salida de merma generada con éxito.");
  });
});

// Función para obtener el costo de merma desde la tabla productos_merma
async function obtenerCostoMerma(id_lote, id_producto) {
  console.log("id_lote en PRECIO_COMPRA: ", id_lote);
  console.log("id_producto en PRECIO_COMPRA: ", id_producto);

  try {
    const response = await fetch(
      `${API_BASE_URL}movimientos/obtenerCostoMerma`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ID_LOTE: id_lote,
          ID_PRODUCTO: id_producto,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Error al obtener el costo de merma");
    }

    const data = await response.json();
    console.log("Datos obtenidos del servidor: ", data);

    if (data.success) {
      const costoMerma = parseFloat(data.PRECIO_COMPRA);
      if (!isNaN(costoMerma)) {
        const costoFormateado = "$" + Math.floor(costoMerma).toLocaleString();
        document.getElementById("costoMerma").value = costoFormateado;
        console.log("Costo de Merma mostrado: ", costoFormateado);
      } else {
        console.error(
          "El valor de PRECIO_COMPRA no es un número válido:",
          data.PRECIO_COMPRA
        );
        document.getElementById("costoMerma").value = "";
      }
    } else {
      console.warn(data.message || "No se encontró el costo de merma.");
      document.getElementById("costoMerma").value = "";
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

document
  .getElementById("mermaLoteDropdown")
  .addEventListener("change", function () {
    const id_lote = this.value;
    const id_producto = document.getElementById("mermaProductoDropdown").value;

    if (id_lote && id_producto) {
      obtenerCostoMerma(id_lote, id_producto);
    } else {
      console.warn("ID_LOTE o ID_PRODUCTO no seleccionados");
    }
  });

// guardar nueva merma
async function guardarMerma() {
  // Extraer los valores de los campos del formulario
  const p_id_lote = document.getElementById("mermaLoteDropdown").value;
  const p_id_producto = document.getElementById("mermaProductoDropdown").value;
  const p_cantidad = document.getElementById("cantidadMerma").value;
  const p_razon = document.getElementById("razonMermaDropdown").value;
  const p_descripcion = document.getElementById("descripcionProductoMerma").value;
  const p_costo_merma = document.getElementById("costoMerma").value;

  // Validar que todos los campos obligatorios tienen valor
  if (
    !p_id_lote ||
    !p_id_producto ||
    !p_cantidad ||
    !p_razon ||
    !p_descripcion ||
    !p_costo_merma
  ) {
    alert("Por favor, complete todos los campos requeridos.");
    return;
  }

  // Crear el objeto con los datos que se enviarán al endpoint
  const mermaData = {
    p_id_lote: parseInt(p_id_lote),
    p_id_producto: parseInt(p_id_producto),
    p_cantidad: parseInt(p_cantidad),
    p_razon: parseInt(p_razon),
    p_descripcion: p_descripcion,
    p_costo_merma: parseFloat(p_costo_merma),
  };

  console.log("Datos a enviar:", mermaData);

  try {
    const response = await fetch(`${API_BASE_URL}movimientos/guardarMerma`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(mermaData),
    });

    // Verificar si la respuesta fue exitosa
    if (!response.ok) {
      throw new Error("Error al guardar la merma: " + response.statusText);
    }

    // Obtener la respuesta en formato JSON
    const result = await response.json();

    // Manejar el resultado exitoso
    if (result.success) {
      alert("Merma registrada correctamente.");
      console.log("Merma registrada correctamente:", result.message);
      // Aquí podrías cerrar el modal o reiniciar los campos del formulario si lo necesitas
      $("#modalSalidaMerma").modal("hide"); // Cierra el modal usando jQuery si lo estás usando
    } else {
      console.error("Error en la respuesta:", result.error);
      alert("Error: " + result.error);
    }
  } catch (error) {
    // Manejo de errores
    console.error("Ocurrió un error al enviar los datos:", error);
    alert("Error al guardar la merma: " + error.message);
  }
}
document.getElementById("btnGenerarSalidaMerma").onclick = function () {
  guardarMerma();
};
