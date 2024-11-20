// // reportes.js
// import { API_BASE_URL } from "./apiConfig.js";

// $(document).ready(function () {
//   // Inicializar dropdown
//   $(".ui.dropdown").dropdown();

//   // Mostrar modal de leyenda
//   $("#show-legend-modal").on("click", function () {
//     $(".ui.small.modal").modal("show");
//   });

//   // Cargar y llenar las tablas antes de inicializar DataTables
//   cargarDatos();
// });

// async function cargarDatos() {
//   const tablaProductos = $("#tabla-productos");
//   const tablaCriticos = $("#tabla-criticos");
//   const tablaSobreStock = $("#tabla-sobre-stock");
//   const P_IDUSUARIO = $("#ID_USUARIO").text().trim();

//   try {
//     const response = await fetch(`${API_BASE_URL}reportes/tablaNiveles`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ P_IDUSUARIO: P_IDUSUARIO }),
//     });

//     if (!response.ok) {
//       throw new Error("Error en la solicitud: " + response.statusText);
//     }

//     const data = await response.json();

//     if (data.success) {
//       const productos = data.response;

//       // Llenar tabla productos
//       llenarTablaProductos(productos);

//       // Filtrar y llenar tabla Críticos
//       const criticos = productos.filter(p => p.ESTADO === 'CRITICO' || p.ESTADO === 'BAJO CRITICO');
//       llenarTablaCríticos(criticos);

//       // Filtrar y llenar tabla Sobre Stock
//       const sobreStock = productos.filter(p => p.ESTADO === 'SOBRE_STOCK');
//       llenarTablaSobreStock(sobreStock);

//       // Inicializar DataTables para cada tabla
//       inicializarDataTable('#tabla-productos', true);
//       inicializarDataTable('#tabla-criticos', false);
//       inicializarDataTable('#tabla-sobre-stock', false);
//     } else {
//       console.error("No se encontraron datos:", data.message || "Error desconocido");
//     }
//   } catch (error) {
//     // console.error("Ocurrió un error:", error);
//   }
// }

// function llenarTablaProductos(datos) {
//   const tbody = $("#tabla-productos tbody");
//   tbody.empty();

//   datos.forEach((producto) => {
//     const fila = `
//       <tr>
//         <td>${producto.ID_PRODUCTO}</td>
//         <td>${producto.NOMBRE_PRODUCTO}</td>
//         <td>${producto.CANTIDAD}</td>
//         <td>${producto.IDEAL}</td>
//         <td style="display:none;">${producto.ESTADO}</td> <!-- Columna Oculta -->
//       </tr>
//     `;
//     tbody.append(fila);
//   });
// }

// function llenarTablaCríticos(datos) {
//   const tbody = $("#tabla-criticos tbody");
//   tbody.empty();

//   datos.forEach((producto) => {
//     const fila = `
//       <tr>
//         <td>${producto.NOMBRE_PRODUCTO}</td>
//         <td>${producto.CANTIDAD}</td>
//         <td>${producto.IDEAL}</td>
//       </tr>
//     `;
//     tbody.append(fila);
//   });
// }

// function llenarTablaSobreStock(datos) {
//   const tbody = $("#tabla-sobre-stock tbody");
//   tbody.empty();

//   datos.forEach((producto) => {
//     const fila = `
//       <tr>
//         <td>${producto.NOMBRE_PRODUCTO}</td>
//         <td>${producto.CANTIDAD}</td>
//         <td>${producto.IDEAL}</td>
//       </tr>
//     `;
//     tbody.append(fila);
//   });
// }

// // function obtenerSemaforoHTML(estado) {
// //   console.log("Estado recibido:", estado); // Depuración
// //   const colorMap = {
// //     SOBRE_STOCK: "blue",
// //     BIEN: "green",
// //     MINIMO: "orange",
// //     CRITICO: "red",
// //     "BAJO CRITICO": "darkred",
// //     "SIN MOVIMIENTOS": "grey",
// //   };
// //   const color = colorMap[estado] || "black";
// //   console.log("Color asignado:", color); // Depuración
// //   return `<span style="color:${color};">●</span>`;
// // }

// function inicializarDataTable(selector, hasCustomFilter) {
//   const table = $(selector).DataTable({
//     paging: true,
//     pageLength: 5,
//     lengthMenu: [5, 10, 15, 20, 25, 30],
//     searching: true,
//     ordering: true,
//     info: true,
//     language: {
//       paginate: {
//         previous: "Anterior",
//         next: "Siguiente",
//       },
//       lengthMenu: "Registros por página: _MENU_",
//       zeroRecords: "No se encontraron resultados",
//       info: "Mostrando página _PAGE_ de _PAGES_",
//       infoEmpty: "No hay registros disponibles",
//       infoFiltered: "(filtrado de _MAX_ registros totales)",
//       search: "Buscar:",
//     },
//     dom:
//       '<"ui stackable grid"<"row"<"eight wide column"l><"eight wide column"f>>' +
//       '<"row dt-table"t>' +
//       '<"row"<"six wide column"i><"six wide column"p>>>',
//     columnDefs: selector === '#tabla-productos' ? [
//       { targets: 5, visible: false } // Ocultar la columna de Estado solo para tabla-productos
//     ] : []
//   });

//   if (hasCustomFilter && selector === '#tabla-productos') {
//     // Agregar un filtro personalizado para la tabla-productos
//     $.fn.dataTable.ext.search.push(
//       function(settings, data, dataIndex) {
//         var selectedState = $(".ui.dropdown").dropdown('get value');
//         var estado = data[5]; // columna oculta

//         if (selectedState === "TODOS" || estado === selectedState) {
//           return true;
//         }
//         return false;
//       }
//     );

//     // Manejar el cambio en el dropdown para filtrar
//     $(".ui.dropdown").dropdown({
//       onChange: function (value, text, $selectedItem) {
//         console.log("Filtro seleccionado:", value);
//         table.draw();
//       },
//     });
//   }
// }

import { API_BASE_URL } from "./apiConfig.js";
const userIdElement = document.getElementById("ID_USUARIO");
const userId = userIdElement ? userIdElement.textContent.trim() : null;


document.addEventListener("DOMContentLoaded", () => {
  const userIdElement = document.getElementById("ID_USUARIO");
  const userId = userIdElement ? userIdElement.textContent.trim() : null;

  if (!userId) {
    console.error("ID de usuario no encontrado.");
    // Opcional: Redirigir al login o mostrar un mensaje de error
    return;
  }

  cargarTablas();
});

async function cargarTablas() {
  try {
    const response = await fetch(`${API_BASE_URL}reportes/tablaNiveles`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ P_IDUSUARIO: parseInt(userId, 10) }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(
        "Error al obtener los datos:",
        errorData.error || "Error desconocido"
      );
      return;
    }

    const data = await response.json();

    if (data.success && Array.isArray(data.response)) {
      const productos = data.response;

      const criticos = productos.filter((p) => p.ESTADO === "CRITICO" || "BAJO CRITICO");
      const sobreStock = productos.filter((p) => p.ESTADO === "SOBRE_STOCK");
      const generales = productos; 

      llenarTabla("tabla-criticos", criticos, [
        "NOMBRE_PRODUCTO",
        "CANTIDAD",
        "IDEAL",
      ]);

      llenarTabla("tabla-sobre-stock", sobreStock, [
        "NOMBRE_PRODUCTO",
        "CANTIDAD",
        "IDEAL",
      ]);

      llenarTabla("tabla-productos", generales, [
        "ID_PRODUCTO",
        "NOMBRE_PRODUCTO",
        "CANTIDAD",
        "IDEAL",
        "ESTADO",
      ]);

      // Inicializar DataTables
      inicializarDataTables();
    } else {
      console.error("Respuesta inválida del servidor.");
    }
  } catch (error) {
    console.error("Error en la solicitud:", error);
  }
}

function llenarTabla(idTabla, datos, campos) {
  const tablaBody = document.querySelector(`#${idTabla} tbody`);
  tablaBody.innerHTML = ""; 

  datos.forEach((item) => {
    const fila = document.createElement("tr");

    campos.forEach((campo) => {
      const celda = document.createElement("td");
      celda.textContent = item[campo] || "N/A";
      fila.appendChild(celda);
    });

    tablaBody.appendChild(fila);
  });
}

function inicializarDataTables() {
  // Tabla Críticos 🧉
  if (!$.fn.DataTable.isDataTable("#tabla-criticos")) {
    $("#tabla-criticos").DataTable({
      paging: false,
      searching: false,
      info: false,
      // language: {
      //   url: "//cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json",
      // },
    });
  }

  // Tabla Sobre Stock 🧉
  if (!$.fn.DataTable.isDataTable("#tabla-sobre-stock")) {
    $("#tabla-sobre-stock").DataTable({
      paging: false,
      searching: false,
      info: false,
      // language: {
      //   url: "//cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json",
      // },
    });
  }

  // Tabla General 🧉
  if (!$.fn.DataTable.isDataTable("#tabla-productos")) {
    $("#tabla-productos").DataTable({
      paging: true,
      searching: true,
      info: true,
      // language: {
      //   url: "//cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json",
      // },
    });
    // columnDefs: [
    //   { targets: [4], visible: false }, // Ocultar la columna "Estado"
    // ];
  }
}
