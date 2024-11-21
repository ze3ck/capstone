// /assets/js/reportes.js

import { API_BASE_URL } from "./apiConfig.js";

let chart; // Variable global para almacenar la instancia del gráfico

document.addEventListener("DOMContentLoaded", () => {
  const userIdElement = document.getElementById("ID_USUARIO");
  const userId = userIdElement ? userIdElement.textContent.trim() : null;
  console.log("ID DEL USUARIO", userId);
  if (!userId) {
    console.error("ID de usuario no encontrado.");
    // Opcional: Redirigir al login o mostrar un mensaje de error
    return;
  }

  cargarTablas(userId);
});

async function cargarTablas(userId) {
  try {
    const response = await fetch(`${API_BASE_URL}reportes/tablaNiveles`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ P_IDUSUARIO: parseInt(userId, 10) }),
    });
    console.log("Respuesta recibida:", response);
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

      const criticos = productos.filter(
        (p) => p.ESTADO === "CRITICO" || p.ESTADO === "BAJO CRITICO"
      );
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

      // Procesar datos para el gráfico
      const { labels, porcentajes } = procesarDatosParaGrafico(productos);
      console.log("Datos para el gráfico:", { labels, porcentajes });

      // Actualizar o inicializar el gráfico
      actualizarGrafico(labels, porcentajes);

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
  console.log(`Llenando tabla ${idTabla} con datos:`, datos);
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
  console.log(`Tabla ${idTabla} llenada.`);
}

function procesarDatosParaGrafico(productos) {
  // Inicializar un objeto para almacenar las sumas por estado
  const sumasPorEstado = {
    "Sobre Stock": 0,
    Bien: 0,
    Mínimo: 0,
    Crítico: 0,
  };

  // Recorrer los productos y sumar las cantidades según el estado
  productos.forEach((producto) => {
    const estado = producto.ESTADO;
    const cantidad = parseFloat(producto.CANTIDAD) || 0;

    switch (estado) {
      case "SOBRE_STOCK":
        sumasPorEstado["Sobre Stock"] += cantidad;
        break;
      case "BIEN":
        sumasPorEstado["Bien"] += cantidad;
        break;
      case "MINIMO":
        sumasPorEstado["Mínimo"] += cantidad;
        break;
      case "CRITICO":
      case "BAJO_CRITICO":
        sumasPorEstado["Crítico"] += cantidad;
        break;
      default:
        // Manejar estados desconocidos si es necesario
        break;
    }
  });

  // Calcular el total para determinar los porcentajes
  const total = Object.values(sumasPorEstado).reduce(
    (acc, val) => acc + val,
    0
  );

  // Calcular los porcentajes como números
  const porcentajes = Object.keys(sumasPorEstado).map((estado) => {
    return total > 0
      ? parseFloat(((sumasPorEstado[estado] / total) * 100).toFixed(2))
      : 0;
  });

  // Obtener los labels en el orden deseado
  const labels = Object.keys(sumasPorEstado);

  return { labels, porcentajes };
}

function inicializarGrafico(labels, porcentajes) {
  const options = {
    series: porcentajes,
    chart: {
      width: 500,
      type: "pie",
      background: "#2e2e2e",
    },
    labels: labels,
    colors: ["#3498db", "#2ecc71", "#f39c12", "#e74c3c"],
    legend: {
      position: "bottom",
      labels: {
        colors: "#FFFFFF",
      },
    },
    tooltip: {
      theme: "dark",
      y: {
        formatter: function (val) {
          return val + "%";
        },
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  chart = new ApexCharts(document.querySelector("#chart"), options);
  chart.render();
  console.log("Gráfico inicializado.");
}

function actualizarGrafico(labels, porcentajes) {
  console.log(
    "Actualizando el gráfico con labels:",
    labels,
    "y porcentajes:",
    porcentajes
  );
  if (chart) {
    chart.updateOptions({
      series: porcentajes,
      labels: labels,
    });
    console.log("Gráfico actualizado correctamente.");
  } else {
    console.log("Inicializando el gráfico.");
    inicializarGrafico(labels, porcentajes);
  }
}

function inicializarDataTables() {
  // Tabla general 🧉
  if (!$.fn.DataTable.isDataTable("#tabla-productos")) {
    $("#tabla-productos").DataTable({
      paging: true,
      searching: true,
      info: true,
      pageLength: 5,
      lengthMenu: [5, 10, 15, 20, 25, 30],
      responsive: true,
      // dom: '<"ui unstackable grid"<"row"<"eight wide column"l><"eight wide column"f>>>t<"row"<"eight wide column"i><"eight wide column"p>>>',
      className: "ui celled table",
      language: {
        url: "https://cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json",
      },
    });
  }

  // Tabla Sobre Stock 🧉
  if (!$.fn.DataTable.isDataTable("#tabla-sobre-stock")) {
    $("#tabla-sobre-stock").DataTable({
      paging: true,
      searching: true,
      info: true,
      pageLength: 5,
      lengthMenu: [5, 10, 15, 20, 25, 30],
      responsive: true,
      // dom: '<"ui unstackable grid"<"row"<"eight wide column"l><"eight wide column"f>>>t<"row"<"eight wide column"i><"eight wide column"p>>>',
      className: "ui celled table",
      language: {
        url: "https://cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json",
      },
    });
  }

  // Tabla Críticos 🧉
  if (!$.fn.DataTable.isDataTable("#tabla-criticos")) {
    $("#tabla-criticos").DataTable({
      paging: true,
      searching: true,
      info: true,
      pageLength: 5,
      lengthMenu: [5, 10, 15, 20, 25, 30],
      responsive: true,
      // dom: '<"ui unstackable grid"<"row"<"eight wide column"l><"eight wide column"f>>>t<"row"<"eight wide column"i><"eight wide column"p>>>',
      className: "ui celled table",
      language: {
        url: "https://cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json",
        paginate: {
          previous: "<i class='left chevron icon'></i>",
          next: "<i class='right chevron icon'></i>",
        },
      },
    });
  }
}

/**
 *
 */
document.addEventListener("DOMContentLoaded", async () => {
  const idUsuario = document.getElementById("ID_USUARIO").textContent.trim();

  async function obtenerDatosGanancias() {
    try {
      const response = await fetch(`${API_BASE_URL}reportes/topGanancias`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ P_IDUSUARIO: idUsuario }),
      });

      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success && data.response.length > 0) {
        llenarTabla(data.response);
      } else {
        mostrarMensajeSinDatos();
      }
    } catch (error) {
      console.error("Error al obtener los datos:", error);
      mostrarMensajeError();
    }
  }

  function llenarTabla(data) {
    const tbody = document.querySelector("#tabla-mayores-ganancias tbody");
    tbody.innerHTML = "";

    data.forEach((item) => {
      const fila = document.createElement("tr");

      // Celda Nombre Producto
      const celdaNombre = document.createElement("td");
      celdaNombre.textContent = item.NOMBRE_PRODUCTO;
      fila.appendChild(celdaNombre);

      // Celda Ganancia
      const celdaGanancia = document.createElement("td");
      const ganancia = parseFloat(item.GANANCIA) || 0;
      celdaGanancia.textContent = `$${ganancia.toLocaleString("en-US", {
        minimumFractionDigits: 0,
      })}`;
      fila.appendChild(celdaGanancia);

      tbody.appendChild(fila);
    });
  }

  function mostrarMensajeSinDatos() {
    const tbody = document.querySelector("#tabla-mayores-ganancias tbody");
    tbody.innerHTML = `
      <tr>
        <td colspan="2" style="text-align: center;">No se encontraron datos.</td>
      </tr>
    `;
  }

  function mostrarMensajeError() {
    const tbody = document.querySelector("#tabla-mayores-ganancias tbody");
    tbody.innerHTML = `
      <tr>
        <td colspan="2" style="text-align: center; color: red;">Error al cargar los datos.</td>
      </tr>
    `;
  }

  await obtenerDatosGanancias();
});

document.addEventListener("DOMContentLoaded", async () => {
  const idUsuario = document.getElementById("ID_USUARIO").textContent.trim();

  async function obtenerDatosMasVendidos() {
    try {
      const response = await fetch(`${API_BASE_URL}reportes/topVentas`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ P_IDUSUARIO: idUsuario }),
      });

      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success && data.response.length > 0) {
        llenarTablaMasVendidos(data.response);
      } else {
        mostrarMensajeSinDatos("tabla-mas-vendidos");
      }
    } catch (error) {
      console.error("Error al obtener los datos:", error);
      mostrarMensajeError("tabla-mas-vendidos");
    }
  }

  function llenarTablaMasVendidos(data) {
    const tbody = document.querySelector("#tabla-mas-vendidos tbody");
    tbody.innerHTML = "";

    data.forEach((item) => {
      const fila = document.createElement("tr");

      const celdaProducto = document.createElement("td");
      celdaProducto.textContent = item.NOMBRE_PRODUCTO;
      fila.appendChild(celdaProducto);

      const celdaCantidad = document.createElement("td");
      const cantidad = parseInt(item.CANTIDAD, 10) || 0;
      celdaCantidad.textContent = cantidad.toLocaleString("en-US");
      fila.appendChild(celdaCantidad);

      tbody.appendChild(fila);
    });
  }

  function mostrarMensajeSinDatos(idTabla) {
    const tbody = document.querySelector(`#${idTabla} tbody`);
    tbody.innerHTML = `
      <tr>
        <td colspan="2" style="text-align: center;">No se encontraron datos.</td>
      </tr>
    `;
  }

  function mostrarMensajeError(idTabla) {
    const tbody = document.querySelector(`#${idTabla} tbody`);
    tbody.innerHTML = `
      <tr>
        <td colspan="2" style="text-align: center; color: red;">Error al cargar los datos.</td>
      </tr>
    `;
  }

  await obtenerDatosMasVendidos();
});

document.addEventListener("DOMContentLoaded", async () => {
  const idUsuario = document.getElementById("ID_USUARIO").textContent.trim();

  // Función para obtener Ventas Totales
  async function obtenerVentasTotales() {
    try {
      const response = await fetch(`${API_BASE_URL}reportes/totalVentas`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ P_IDUSUARIO: idUsuario }),
      });

      if (!response.ok)
        throw new Error(`Error en la solicitud: ${response.statusText}`);

      const data = await response.json();
      if (data.success && data.response.VENTA !== null) {
        const ventasTotales = parseFloat(data.response.VENTA).toLocaleString(
          "en-US",
          {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }
        );
        document.getElementById("ventas-totales").textContent = ventasTotales;
      } else {
        document.getElementById("ventas-totales").textContent = "No disponible";
      }
    } catch (error) {
      console.error("Error al obtener las ventas totales:", error);
      document.getElementById("ventas-totales").textContent = "Error";
    }
  }

  // Función para obtener Ganancias Totales
  async function obtenerGananciasTotales() {
    showLoader();
    try {
      const response = await fetch(`${API_BASE_URL}reportes/gananciasTotales`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ P_IDUSUARIO: idUsuario }),
      });

      if (!response.ok)
        throw new Error(`Error en la solicitud: ${response.statusText}`);

      const data = await response.json();
      if (data.success && data.response.length > 0) {
        const totalGanancia = data.response
          .reduce((acc, item) => acc + parseFloat(item.GANANCIA), 0)
          .toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          });
        document.getElementById("ganancias-totales").textContent =
          totalGanancia;
      } else {
        document.getElementById("ganancias-totales").textContent =
          "No disponible";
      }
    } catch (error) {
      console.error("Error al obtener las ganancias totales:", error);
      document.getElementById("ganancias-totales").textContent = "Error";
    } finally {
      hideLoader();
    }
  }

  // Llamar a las funciones para obtener y mostrar los datos
  await obtenerVentasTotales();
  await obtenerGananciasTotales();
});

document.addEventListener("DOMContentLoaded", async () => {
  const idUsuario = document.getElementById("ID_USUARIO").textContent.trim();

  // Función para obtener los datos del endpoint
  async function obtenerVentasPorUsuario() {
    try {
      const response = await fetch(`${API_BASE_URL}reportes/ventasPorUsuario`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ P_IDUSUARIO: idUsuario }),
      });

      if (!response.ok)
        throw new Error(`Error en la solicitud: ${response.statusText}`);

      const data = await response.json();

      if (data.success && data.response.length > 0) {
        generarGrafico(data.response);
      } else {
        mostrarMensajeError(
          "No se encontraron datos para mostrar en el gráfico."
        );
      }
    } catch (error) {
      console.error("Error al obtener los datos:", error);
      mostrarMensajeError("Error al cargar los datos del gráfico.");
    }
  }

  // Función para generar el gráfico
  function generarGrafico(data) {
    const nombres = data.map((item) => `${item.NOMBRE} ${item.APELLIDO}`);
    const ventas = data.map((item) => parseFloat(item.VENTA));

    const options = {
      chart: {
        type: "bar",
        height: 350,
        background: "#333",
        foreColor: "#fff",
      },
      series: [
        {
          name: "Ventas Totales",
          data: ventas,
        },
      ],
      xaxis: {
        categories: nombres,
      },
      yaxis: {
        labels: {
          formatter: (value) => `$${value.toLocaleString("en-US")}`,
        },
      },
      title: {
        text: "Ventas Totales por Usuario",
        align: "center",
        style: {
          color: "#fff",
          fontSize: "18px",
        },
      },
      tooltip: {
        y: {
          formatter: (value) => `$${value.toLocaleString("en-US")}`,
        },
      },
      colors: ["#00E396"],
    };

    const chart = new ApexCharts(
      document.querySelector("#grafico-ventas-usuarios"),
      options
    );
    chart.render();
  }

  // Función para mostrar mensajes de error
  function mostrarMensajeError(mensaje) {
    const contenedor = document.querySelector("#grafico-ventas-usuarios");
    contenedor.innerHTML = `<div style="color: red; text-align: center; font-size: 18px;">${mensaje}</div>`;
  }

  // Llamar a la función para obtener y mostrar los datos
  await obtenerVentasPorUsuario();
});

/**
 * loader
 */
function showLoader() {
  const loader = document.getElementById("loader-xd");
  loader.style.display = "block";
}

function hideLoader() {
  const loader = document.getElementById("loader-xd");
  loader.style.display = "none";
}

document.addEventListener("DOMContentLoaded", async () => {
  const idUsuario = document.getElementById("ID_USUARIO").textContent.trim();

  // Función para obtener las mermas
  async function obtenerMermas() {
    try {
      const tbody = document.querySelector("#tabla-mermas tbody");
      tbody.innerHTML = `
        <tr>
          <td colspan="7">
            <div class="ui active inline loader"></div> Cargando datos...
          </td>
        </tr>
      `;

      const response = await fetch(
        "http://localhost:8080/api/reportes/reporteMermas",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ P_IDUSUARIO: idUsuario }),
        }
      );

      if (!response.ok)
        throw new Error(`Error en la solicitud: ${response.statusText}`);

      const data = await response.json();

      if (data.success && data.response.length > 0) {
        llenarTablaMermas(data.response);
        calcularCostoTotal(data.response);
        generarGraficoMermas(data.response); // Generar gráfico con la data
      } else {
        tbody.innerHTML = `
          <tr>
            <td colspan="7" style="text-align: center;">No se encontraron datos de mermas.</td>
          </tr>
        `;
        document.getElementById("costo-total-mermas").textContent = "$0";
        document.getElementById("grafico-mermas").innerHTML =
          "<p style='color: white; text-align: center;'>No hay datos para generar el gráfico.</p>";
      }
    } catch (error) {
      console.error("Error al obtener las mermas:", error);
      const tbody = document.querySelector("#tabla-mermas tbody");
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; color: red;">Error al cargar los datos.</td>
        </tr>
      `;
      document.getElementById("costo-total-mermas").textContent = "Error";
      document.getElementById("grafico-mermas").innerHTML =
        "<p style='color: red; text-align: center;'>Error al cargar el gráfico.</p>";
    }
  }

  // Función para llenar la tabla
  function llenarTablaMermas(mermas) {
    const tbody = document.querySelector("#tabla-mermas tbody");
    tbody.innerHTML = ""; // Limpiar contenido previo

    mermas.forEach((merma) => {
      const fechaVencimiento =
        merma.FECHA_VENCIMIENTO === "9999-01-01"
          ? "N/A"
          : merma.FECHA_VENCIMIENTO;

      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${merma.ID_PRODUCTO}</td>
        <td>${merma.ID_LOTE}</td>
        <td>${merma.NOMBRE_PRODUCTO}</td>
        <td>${merma.CANTIDAD_MERMA}</td>
        <td>${fechaVencimiento}</td>
        <td>$${parseFloat(merma.COSTO_MERMA).toLocaleString("en-US", {
          minimumFractionDigits: 0,
        })}</td>
        <td>${merma.RAZON_MERMA}</td>
      `;
      tbody.appendChild(fila);
    });
  }

  // Función para calcular el costo total de las mermas
  function calcularCostoTotal(mermas) {
    const costoTotal = mermas.reduce(
      (sum, merma) => sum + parseFloat(merma.COSTO_MERMA),
      0
    );
    document.getElementById(
      "costo-total-mermas"
    ).textContent = `$${costoTotal.toLocaleString("en-US", {
      minimumFractionDigits: 0,
    })}`;
  }

  // Función para generar el gráfico de barras
  function generarGraficoMermas(mermas) {
    const nombresProductos = mermas.map((merma) => merma.NOMBRE_PRODUCTO);
    const costosMermas = mermas.map((merma) => parseFloat(merma.COSTO_MERMA));

    const options = {
      chart: {
        type: "bar",
        height: 350,
        background: "#222",
        foreColor: "#fff",
      },
      series: [
        {
          name: "Costo Merma",
          data: costosMermas,
        },
      ],
      xaxis: {
        categories: nombresProductos,
        title: {
          text: "Productos",
          style: {
            color: "#fff",
          },
        },
      },
      yaxis: {
        title: {
          text: "Costo Merma ($)",
          style: {
            color: "#fff",
          },
        },
      },
      title: {
        text: "Costo de Merma por Producto",
        align: "center",
        style: {
          color: "#fff",
        },
      },
      tooltip: {
        theme: "dark",
      },
    };

    const chart = new ApexCharts(
      document.querySelector("#grafico-mermas"),
      options
    );
    chart.render();
  }

  // Llamar a la función para obtener las mermas al cargar la página
  await obtenerMermas();
});
