// reportes.js
import { API_BASE_URL } from "./apiConfig.js";

$(document).ready(function () {
  // Inicializar dropdown
  $(".ui.dropdown").dropdown();

  // Mostrar modal de leyenda
  $("#show-legend-modal").on("click", function () {
    $(".ui.small.modal").modal("show");
  });

  // Cargar y llenar la tabla antes de inicializar DataTables
  cargarDatos();
});

async function cargarDatos() {
  const tablaProductos = $("#tabla-productos");
  const P_IDUSUARIO = $("#ID_USUARIO").text().trim();

  try {
    const response = await fetch(`${API_BASE_URL}reportes/tablaNiveles`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ P_IDUSUARIO: P_IDUSUARIO }),
    });

    if (!response.ok) {
      throw new Error("Error en la solicitud: " + response.statusText);
    }

    const data = await response.json();

    if (data.success) {
      llenarTabla(data.response);
      inicializarDataTable();
    } else {
      console.error("No se encontraron datos:", data.message || "Error desconocido");
    }
  } catch (error) {
    console.error("Ocurrió un error:", error);
  }
}

function llenarTabla(datos) {
  const tbody = $("#tabla-productos tbody");
  tbody.empty();

  datos.forEach((producto) => {
    const fila = `
      <tr>
        <td>${producto.ID_PRODUCTO}</td>
        <td>${producto.NOMBRE_PRODUCTO}</td>
        <td>${producto.CANTIDAD}</td>
        <td>${producto.IDEAL}</td>
        <td>${obtenerSemaforoHTML(producto.ESTADO)}</td>
        <td style="display:none;">${producto.ESTADO}</td> <!-- Columna Oculta -->
      </tr>
    `;
    tbody.append(fila);
  });
}

function obtenerSemaforoHTML(estado) {
  console.log("Estado recibido:", estado); // Depuración
  const colorMap = {
    SOBRE_STOCK: "blue",
    BIEN: "green",
    MINIMO: "orange",
    CRITICO: "red",
    "BAJO CRITICO": "darkred",
    "SIN MOVIMIENTOS": "grey",
  };
  const color = colorMap[estado] || "black";
  console.log("Color asignado:", color); // Depuración
  return `<span style="color:${color};">●</span>`;
}

function inicializarDataTable() {
  const table = $("#tabla-productos").DataTable({
    paging: true,
    pageLength: 5,
    lengthMenu: [5, 10, 15, 20, 25, 30],
    searching: true,
    ordering: true,
    info: true,
    language: {
      paginate: {
        previous: "Anterior",
        next: "Siguiente",
      },
      lengthMenu: "Registros por página: _MENU_",
      zeroRecords: "No se encontraron resultados",
      info: "Mostrando página _PAGE_ de _PAGES_",
      infoEmpty: "No hay registros disponibles",
      infoFiltered: "(filtrado de _MAX_ registros totales)",
      search: "Buscar:",
    },
    dom:
      '<"ui stackable grid"<"row"<"eight wide column"l><"eight wide column"f>>' +
      '<"row dt-table"t>' +
      '<"row"<"six wide column"i><"six wide column"p>>>',
    columnDefs: [
      { targets: 5, visible: false } // Ocultar la columna de Estado
    ]
  });

  // Agregar un filtro personalizado
  $.fn.dataTable.ext.search.push(
    function(settings, data, dataIndex) {
      var selectedState = $(".ui.dropdown").dropdown('get value');
      var estado = data[5]; // columna oculta

      if (selectedState === "TODOS" || estado === selectedState) {
        return true;
      }
      return false;
    }
  );

  // Manejar el cambio en el dropdown para filtrar
  $(".ui.dropdown").dropdown({
    onChange: function (value, text, $selectedItem) {
      console.log("Filtro seleccionado:", value);
      table.draw();
    },
  });
}
