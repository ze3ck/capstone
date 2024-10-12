import { API_BASE_URL } from "./apiConfig.js";

document.addEventListener("DOMContentLoaded", function () {
  llenarTablaMovimientos();
  // selectCategoria();
});

window.onload = function () {
  selectCategoria();
  selectResponsables();
  selectCatGastoOperacional();
};


async function selectCategoria() {
  try {
    const response = await fetch(`${API_BASE_URL}movimientos/selectCatMovimiento`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    });

    if (!response.ok) {
      throw new Error("Error en la respuesta del servidor");
    }

    const data = await response.json();
    // console.log("Datos de la respuesta:", data);

    // Obtenemos el elemento select una vez fuera del bucle para evitar múltiples búsquedas en el DOM
    const select = document.getElementById('selectCategoria');

    if (!select) {
      console.error('No se encontró el elemento select en el DOM.');
      return;
    }

    // Limpiamos el select antes de llenarlo
    select.innerHTML = '<option value="">categoría</option>';

    // Recorremos la respuesta de la API y llenamos el select
    for (let x of data.response) {
      const opt = document.createElement('option');
      opt.value = x.DESCRIPCION.trim();  // Cambia esto si el nombre de la propiedad es diferente
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
    const response = await fetch(`${API_BASE_URL}movimientos/selectResponsables`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        P_IDUSUARIO: id_usuario,
      }),
    });

    if (!response.ok) {
      throw new Error("Error en la respuesta del servidor");
    }

    const data = await response.json();
    // console.log("Datos de la respuesta:", data);

    // Obtenemos el elemento select una vez fuera del bucle para evitar múltiples búsquedas en el DOM
    const select = document.getElementById('selectResponsable');

    if (!select) {
      console.error('No se encontró el elemento select en el DOM.');
      return;
    }

    // Limpiamos el select antes de llenarlo
    select.innerHTML = '<option value="">Responsable</option>';

    // Recorremos la respuesta de la API y llenamos el select
    for (let x of data.response) {
      const opt = document.createElement('option');
      opt.value = x.NOMBRE.trim();  // Cambia esto si el nombre de la propiedad es diferente
      opt.textContent = x.NOMBRE.trim();
      select.appendChild(opt);
    }

  } catch (error) {
    console.error("Error al cargar las categorías:", error);
  }
}

async function selectCatGastoOperacional() {

  try {
    const response = await fetch(`${API_BASE_URL}movimientos/selectCatGastoOperativoMovimiento`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    });

    if (!response.ok) {
      throw new Error("Error en la respuesta del servidor");
    }

    const data = await response.json();
    // console.log("Datos de la respuesta:", data);

    // Obtenemos el elemento select una vez fuera del bucle para evitar múltiples búsquedas en el DOM
    const select = document.getElementById('selectCategoriaGastoOperacional');

    if (!select) {
      console.error('No se encontró el elemento select en el DOM.');
      return;
    }

    // Limpiamos el select antes de llenarlo
    select.innerHTML = '<option value="">categoría</option>';

    // Recorremos la respuesta de la API y llenamos el select
    for (let x of data.response) {
      const opt = document.createElement('option');
      opt.value = x.DESCRIPCION_CATEGORIA.trim();  // Cambia esto si el nombre de la propiedad es diferente
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
      onDeny: function(){
        return true;
      }
      
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

async function llenarTblDetalleMovimiento(ID_MOVIMIENTO) {
  // mostarLoader();
  // console.log(ID_MOVIMIENTO);

  $("#tblDetalleMovimientos tbody tr").remove();
  // console.log(usuario)

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

  for (let x of data.response) {
    // console.log(x.EMAIL);
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
  // ocultarLoader();
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
    $("#modalGenerarSalida")
      .modal({
        onApprove: function () {
          // GENERAR SALIDA (falta agregar funcion)
          event.preventDefault();
          // return ;
        },
        onDeny: function () {

          return true;
        }
      })
      .modal("show");
  });

  $("#btnNuevoGastoOperativo").on("click", function () {
    $("#modalNuevoGastoOperativo")
      .modal({
        onApprove: function () {
          event.preventDefault();
          generarGastoOperativo();
        },
        onDeny: function () {
          event.preventDefault();
          console.log('modal cancelado')
          return true;
        }
      })
      .modal("show");
  });

  let total = 0;

  // Función para agregar producto
  $("#agregarProducto").on("click", function () {
    const producto = $("#productoDropdown").dropdown("get value");
    const cantidad = $('input[name="cantidad"]').val();
    const precio = 1000; // Simulación del precio

    if (producto && cantidad > 0) {
      const subtotal = precio * cantidad;
      total += subtotal;

      // Añadir el producto a la tabla
      $("#productList").append(`
              <tr>
                  <td>${producto}</td>
                  <td>${cantidad}</td>
                  <td>$${subtotal}</td>
              </tr>
          `);

      // Actualizar el total
      $("#totalAmount").text(total);
    } else {
      alert("Por favor seleccione un producto y una cantidad válida");
    }
  });

});



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
  $('body')
      .toast({
          displayTime: tiempo,
          class: clase,
          message: mensaje,
          showProgress: 'top',
          progressUp: true
      });
}

async function generarGastoOperativo() {
  let descripcion = document.getElementById('descripcion').value.trim();
  let monto = document.getElementById('monto').value;
  let categoria = document.getElementById('selectCategoriaGastoOperacional').value;
  let id_usuario = document.getElementById("ID_USUARIO").innerHTML.trim();

  console.log(descripcion);
  console.log(monto);
  console.log(categoria);
  console.log(id_usuario);
  

  if(!descripcion || descripcion.length > 100){
    mensaje('error', 2000, 'Descripción inválida')
    return;
  }

  if(!monto || monto == 0 || monto < 0  || Number.isInteger(monto) === false){
    mensaje('error', 2000, 'Monto Inválido')
    return;
  }

  if(categoria != "RECREACION" || categoria != 'MANTENIMIENTO'|| categoria != 'INSUMOS'|| categoria != 'SERVICIOS'){
    mensaje('error', 2000, 'Categoría Inválida')
    return;
  }
  
  const response = await fetch(
    `${API_BASE_URL}movimientos/llenadoDetalleMovimiento`,
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
  vaalidacion = data.response(); 
  if (vaalidacion = 1)
    mensaje('success', 2000, 'Gasto operativo ingresado con éxito!!!')


}
