import { API_BASE_URL } from "./apiConfig.js";

document.addEventListener("DOMContentLoaded", function () {
  $("#selectProveedor").dropdown();
  $("#selectEstado").dropdown();
  $("#selectContacto").dropdown();
  $("#selectNewCiudad").dropdown();
  $("#selectNewComuna").dropdown();
  $("#selectNewRegion").dropdown();

  selectProveedor();
  selectContacto();

  // LIMPIAR FILTROS
  $("#btnLimpiarfiltros").click(function () {
    $("#selectProveedor").dropdown("clear");
    $("#selectEstado").dropdown("clear");
    $("#selectContacto").dropdown("clear");
  });

  llenadoTablaProv();
  // Inicializar el dropdown de proveedores global
  $("#selectProveedor").dropdown({
    onChange: function (value, text) {
      filtrarTabla(); // Llama a la función de filtrado combinada
    },
  });

  $("#selectContacto").dropdown({
    onChange: function (value, text) {
      filtrarTabla(); // Llama a la función de filtrado combinada
    },
  });
});

async function selectContacto() {
  let id_usuario = document.getElementById("ID_USUARIO").innerHTML.trim();
  console.log("ID Usuario:", id_usuario);

  try {
    const response = await fetch(`${API_BASE_URL}proveedores/selectContacto`, {
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
      throw new Error("Error al obtener contactos");
    }

    const data = await response.json();

    if (data.success) {
      let menu = document.querySelector("#selectContacto .menu");
      menu.innerHTML = "";

      // Agregar la opción "Todos" al inicio
      let allItem = document.createElement("div");
      allItem.className = "item";
      allItem.dataset.value = ""; // Valor vacío para representar "Todos"
      allItem.textContent = "Todos";
      menu.appendChild(allItem);

      data.response.forEach((x) => {
        let item = document.createElement("div");
        item.className = "item";
        item.dataset.value = x.NOMBRE_CONTACTO.trim(); // Asegurarse de que no haya espacios
        item.textContent = x.NOMBRE_CONTACTO.trim();
        menu.appendChild(item);
      });

      // Refrescar el dropdown para que Semantic UI reconozca los nuevos items
      $("#selectContacto").dropdown("refresh");
    } else {
      console.error("Error al obtener contactos:", data.message);
    }
  } catch (error) {
    console.error("Error en selectContacto:", error);
  }
}

async function selectProveedor() {
  let id_usuario = document.getElementById("ID_USUARIO").innerHTML.trim();
  console.log("ID Usuario:", id_usuario);

  try {
    const response = await fetch(`${API_BASE_URL}proveedores/selectProveedor`, {
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
      throw new Error("Error al obtener proveedores");
    }

    const data = await response.json();

    if (data.success) {
      let menu = document.querySelector("#selectProveedor .menu");
      menu.innerHTML = "";

      // Agregar la opción "Todos" al inicio
      let allItem = document.createElement("div");
      allItem.className = "item";
      allItem.dataset.value = ""; // Valor vacío para representar "Todos"
      allItem.textContent = "Todos";
      menu.appendChild(allItem);

      data.response.forEach((x) => {
        let item = document.createElement("div");
        item.className = "item";
        item.dataset.value = x.ID_PROVEEDOR;
        item.textContent = x.NOMBRE_PROVEEDOR;
        menu.appendChild(item);
      });

      // Refrescar el dropdown para que reconozca los nuevos items
      $("#selectProveedor").dropdown("refresh");
    } else {
      console.error("Error al obtener proveedores:", data.message);
    }
  } catch (error) {
    console.error("Error en selectProveedor:", error);
  }
}
function filtrarTabla() {
  // Obtener los valores seleccionados en ambos dropdowns
  let estadoSeleccionado = $("#selectEstado").dropdown("get value");
  let proveedorSeleccionado = $("#selectProveedor").dropdown("get value");

  console.log(
    "Filtrando por Estado:",
    estadoSeleccionado,
    "Proveedor:",
    proveedorSeleccionado
  );

  // Obtener todas las filas de la tabla de proveedores
  var filas = document.querySelectorAll("#tblProveedores tbody tr");

  filas.forEach(function (fila) {
    // Obtener el <select> que contiene el estado del proveedor en la columna correspondiente
    var selectEstado = fila.querySelector(".estado-dropdown");
    // Obtener el ID del proveedor de la primera celda (asumiendo que es la columna ID_PROVEEDOR)
    var idProveedorFila = fila.querySelector("td").textContent.trim(); // Primer <td>

    // Verificar si selectEstado no es null
    if (selectEstado) {
      // Obtener el valor seleccionado del dropdown dentro de la fila
      var estadoFila = selectEstado.value;

      // Lógica para determinar si la fila debe mostrarse
      var mostrarPorEstado =
        estadoSeleccionado === "" || estadoSeleccionado === estadoFila;

      var mostrarPorProveedor =
        proveedorSeleccionado === "" ||
        proveedorSeleccionado === idProveedorFila;

      // Mostrar la fila solo si cumple ambos criterios
      if (mostrarPorEstado && mostrarPorProveedor) {
        fila.style.display = ""; // Mostrar la fila
      } else {
        fila.style.display = "none"; // Ocultar la fila
      }
    }
  });
}
/**
 * proveedores/llenadoTablaProv
 * llenadoTablaProv()
 */
async function llenadoTablaProv() {
  let id_usuario = document.getElementById("ID_USUARIO").innerHTML.trim();
  console.log(id_usuario);

  try {
    const response = await fetch(
      `${API_BASE_URL}proveedores/llenadoTablaProv`,
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

    // console.log(response);

    if (!response.ok) {
      const errorMessage = `Error: ${response.status} ${response.statusText}`;
      throw new Error(errorMessage);
    }

    const data = await response.json();

    if (data.success && Array.isArray(data.response)) {
      console.log("Datos obtenidos del servidor: ", data.response);
      agregarProveedoresATabla(data.response);
    } else {
      console.error(
        "Error al obtener proveedores o el formato no es correcto",
        data
      );
    }
  } catch (error) {
    console.error("Ocurrió un error:", error);
  }
}

function agregarProveedoresATabla(proveedores) {
  const tblBody = document
    .getElementById("tblProveedores")
    .querySelector("tbody");
  tblBody.innerHTML = "";

  proveedores.forEach((proveedor) => {
    let fila = document.createElement("tr");

    fila.dataset.idProveedor = proveedor.ID_PROVEEDOR;
    fila.dataset.contacto = proveedor.NOMBRE_CONTACTO.trim().toLowerCase();

    fila.innerHTML = `
              <td class="center aligned">${proveedor.ID_PROVEEDOR}</td>
              <td class="center aligned">${proveedor.NOMBRE_PROVEEDOR}</td>
              <td class="center aligned">${proveedor.NOMBRE_CONTACTO}</td>
              <td class="center aligned">${proveedor.TELEFONO_CONTACTO}</td>
              <td class="center aligned">${proveedor.EMAIL_CONTACTO}</td>
              <td class="center aligned">${proveedor.CALLE}</td>
              <td class="center aligned">${proveedor.NUMERO}</td>
              <td class="center aligned">${proveedor.NOMBRE_CIUDAD}</td>
              <td class="center aligned">
                  <select class="estado-dropdown" data-proveedor-id="${
                    proveedor.ID_PROVEEDOR
                  }">
                      <option value="1" ${
                        proveedor.ID_ESTADO == 1 ? "selected" : ""
                      }>Activo</option>
                      <option value="2" ${
                        proveedor.ID_ESTADO == 2 ? "selected" : ""
                      }>Inactivo</option>
                  </select>
              </td>
              <td class="center aligned actions-column">
                  <div class="ui icon buttons">
                      <button class="ui icon button editarProveedorBtn" onclick="abrirModalEditarProveedor(${
                        proveedor.ID_PROVEEDOR
                      })" title="Editar">
                          <i class="fas fa-edit" style="color: blue;"></i>
                      </button>
                  </div>
              </td>
          `;

    tblBody.appendChild(fila);
  });

  document.addEventListener("change", function (event) {
    if (event.target && event.target.classList.contains("estado-dropdown")) {
      actualizarEstadoProveedor(event.target);
    }
  });
}

/**
 * actualizarEstadoProveedor
 */
async function actualizarEstadoProveedor(dropdown) {
  const proveedorId = dropdown.getAttribute("data-proveedor-id");
  const nuevoEstado = dropdown.value;

  console.log({
    P_IDPROVEEDOR: proveedorId,
    P_IDESTADO: nuevoEstado,
  });

  try {
    const response = await fetch(
      `${API_BASE_URL}proveedores/actualizarEstadoProv`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          P_IDPROVEEDOR: proveedorId,
          P_IDESTADO: nuevoEstado,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Error al cambiar el estado del proveedor. Estado: ${response.status}`
      );
    }

    const data = await response.json();
    console.log("Estado del proveedor actualizado exitosamente:", data);

    $("body").toast({
      message: "El estado del proveedor se ha actualizado correctamente.",
      class: "success",
      displayTime: 3000,
    });
  } catch (error) {
    console.error("Error al actualizar el estado del proveedor:", error);

    $("body").toast({
      message: "Error al actualizar el estado del proveedor.",
      class: "error",
      displayTime: 3000,
    });
  }
}

$(document).ready(function () {
  $("#btnNuevoProveedor").click(function () {
    $("#modalNuevoProveedor").modal("show");
  });
});

document.getElementById("sortID").addEventListener("click", function () {
  const tableBody = document.getElementById("tblProveedores_body");
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

/**
 * selectRegion()
 * PR_38_SELECT_REGION
 */
async function selectRegion() {
  try {
    const response = await fetch(`${API_BASE_URL}proveedores/selectRegion`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Error al obtener regiones");
    }

    const data = await response.json();

    if (data.success) {
      let menu = document.querySelector("#selectNewRegion .menu");
      menu.innerHTML = "";

      let allItem = document.createElement("div");
      allItem.className = "item";
      allItem.dataset.value = "";
      // allItem.textContent = "Todos";
      menu.appendChild(allItem);

      data.response.forEach((x) => {
        let item = document.createElement("div");
        item.className = "item";
        item.dataset.value = x.ID_REGION;
        item.textContent = x.NOMBRE_REGION;
        menu.appendChild(item);
      });

      $("#selectNewRegion").dropdown("refresh");

      $("#selectNewRegion").dropdown({
        onChange: function (value) {
          if (value) {
            selectComuna(value);
          }
        },
      });
    } else {
      console.error("Error al obtener regiones:", data.message);
    }
  } catch (error) {
    console.error("Error en selectRegion:", error);
  }
}

/**
 * selectComuna()
 * PR_39_SELECT_COMUNA
 */
async function selectComuna(idRegion) {
  try {
    const response = await fetch(`${API_BASE_URL}proveedores/selectComuna`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        P_IDREGION: idRegion,
      }),
    });

    if (!response.ok) {
      throw new Error("Error al obtener comunas");
    }

    const data = await response.json();

    if (data.success) {
      let menu = document.querySelector("#selectNewComuna .menu");
      menu.innerHTML = "";

      let allItem = document.createElement("div");
      allItem.className = "item";
      allItem.dataset.value = "";
      // allItem.textContent = "Todos";
      menu.appendChild(allItem);

      data.response.forEach((x) => {
        let item = document.createElement("div");
        item.className = "item";
        item.dataset.value = x.ID_COMUNA;
        item.textContent = x.NOMBRE_COMUNA;
        menu.appendChild(item);
      });

      $("#selectNewComuna").dropdown("refresh");

      $("#selectNewComuna").dropdown({
        onChange: function (value) {
          if (value) {
            selectCiudad(value);
          }
        },
      });
    } else {
      console.error("Error al obtener comunas:", data.message);
    }
  } catch (error) {
    console.error("Error en selectComuna:", error);
  }
}

/**
 * selectCiudad()
 * PR_40_SELECT_CIUDAD
 */
async function selectCiudad(idComuna) {
  console.log("idComuna: ", idComuna);
  try {
    const response = await fetch(`${API_BASE_URL}proveedores/selectCiudad`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        P_IDCOMUNA: idComuna,
      }),
    });

    if (!response.ok) {
      throw new Error("Error al obtener ciudades");
    }

    const data = await response.json();

    if (data.success) {
      let menu = document.querySelector("#selectNewCiudad .menu");
      menu.innerHTML = "";

      let allItem = document.createElement("div");
      allItem.className = "item";
      allItem.dataset.value = "";
      // allItem.textContent = "Todos";
      menu.appendChild(allItem);

      data.response.forEach((x) => {
        let item = document.createElement("div");
        item.className = "item";
        item.dataset.value = x.ID_CIUDAD;
        item.textContent = x.NOMBRE_CIUDAD;
        menu.appendChild(item);
      });

      $("#selectNewCiudad").dropdown("refresh");
    } else {
      console.error("Error al obtener ciudades:", data.message);
    }
  } catch (error) {
    console.error("Error en selectCiudad:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  selectRegion();
});

function limpiarModalNuevoProveedor() {
  document
    .querySelectorAll("#modalNuevoProveedor input[type='text']")
    .forEach((input) => (input.value = ""));

  document
    .querySelectorAll("#modalNuevoProveedor input[type='email']")
    .forEach((input) => (input.value = ""));

  document
    .querySelectorAll("#modalNuevoProveedor input[type='number']")
    .forEach((input) => (input.value = ""));

  $("#selectNewRegion").dropdown("clear");
  $("#selectNewComuna").dropdown("clear");
  $("#selectNewCiudad").dropdown("clear");

  document
    .querySelectorAll("#modalNuevoProveedor textarea")
    .forEach((textarea) => (textarea.value = ""));
}

document
  .getElementById("cancelarNuevoProveedor")
  .addEventListener("click", limpiarModalNuevoProveedor);


  
