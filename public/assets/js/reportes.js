// /assets/js/reportes.js

import { API_BASE_URL } from "./apiConfig.js";

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
      // dom: '<"ui stackable grid"<"row"<"eight wide column"l><"eight wide column"f>>>t<"row"<"eight wide column"i><"eight wide column"p>>>',
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
      // dom: '<"ui stackable grid"<"row"<"eight wide column"l><"eight wide column"f>>>t<"row"<"eight wide column"i><"eight wide column"p>>>',
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
      // dom: '<"ui stackable grid"<"row"<"eight wide column"l><"eight wide column"f>>>t<"row"<"eight wide column"i><"eight wide column"p>>>',
      className: "ui celled table",
      language: {
        url: "https://cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json",
      },
      paginate: {
        previous: "<i class='left chevron icon'></i>",
        next: "<i class='right chevron icon'></i>",
      },
    });
  }
}
