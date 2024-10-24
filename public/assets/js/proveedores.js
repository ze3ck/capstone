import { API_BASE_URL } from "./apiConfig.js";

document.addEventListener("DOMContentLoaded", function () {
  $("#selectProveedor").dropdown();
  $("#selectEstado").dropdown();
  $("#selectContacto").dropdown();

  selectProveedor();
  selectContacto();

  // LIMPIAR FILTROS
  $("#btnLimpiarfiltros").click(function () {
    $("#selectProveedor").dropdown("clear");
    $("#selectEstado").dropdown("clear");
    $("#selectContacto").dropdown("clear");
  });

  llenadoTablaProv();
});

async function selectContacto() {
  let id_usuario = document.getElementById("ID_USUARIO").innerHTML.trim();
  // console.log(id_usuario)
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
    throw new Error("Error al obtener CONTACTOS");
  }

  const data = await response.json();

  if (data.success) {
    // console.log(data)
    // Obtener el menú dentro del dropdown
    let menu = document.querySelector("#selectContacto .menu");
    // Limpiar los items existentes
    menu.innerHTML = "";

    for (let x of data.response) {
      // console.log(x.ID_PROVEEDOR);
      // console.log(x.NOMBRE_PROVEEDOR);
      // Crear un nuevo elemento div con clase 'item'
      let item = document.createElement("div");
      item.className = "item";
      item.dataset.value = x.NOMBRE_CONTACTO; // Asignar el valor del data-value
      item.textContent = x.NOMBRE_CONTACTO; // Asignar el texto que se mostrará
      // Agregar el nuevo item al menú
      menu.appendChild(item);
    }

    // Refrescar el dropdown para que Fomantic UI reconozca los nuevos items
    $("#selectContacto").dropdown("refresh");
  } else {
    console.error("Error al obtener proveedores");
  }
}

async function selectProveedor() {
  let id_usuario = document.getElementById("ID_USUARIO").innerHTML.trim();
  console.log(id_usuario);
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
    // Obtener el menú dentro del dropdown
    let menu = document.querySelector("#selectProveedor .menu");
    // Limpiar los items existentes
    menu.innerHTML = "";

    for (let x of data.response) {
      // console.log(x.ID_PROVEEDOR);
      // console.log(x.NOMBRE_PROVEEDOR);
      // Crear un nuevo elemento div con clase 'item'
      let item = document.createElement("div");
      item.className = "item";
      item.dataset.value = x.ID_PROVEEDOR; // Asignar el valor del data-value
      item.textContent = x.NOMBRE_PROVEEDOR; // Asignar el texto que se mostrará
      // Agregar el nuevo item al menú
      menu.appendChild(item);
    }

    // Refrescar el dropdown para que Fomantic UI reconozca los nuevos items
    $("#selectProveedor").dropdown("refresh");
  } else {
    console.error("Error al obtener proveedores");
  }
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
                      <button class="ui icon button editarProveedorBtn" onclick="accionProveedor(${
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

// Controlador para cambiar el estado de un proveedor
async function actualizarEstadoProveedor(dropdown) {
  const proveedorId = dropdown.getAttribute("data-proveedor-id");
  const nuevoEstado = dropdown.value;

  // Hacemos el console.log para verificar que los datos son correctos
  console.log({
    P_IDPROVEEDOR: proveedorId, // Cambiado para que coincida con el controlador
    P_IDESTADO: nuevoEstado, // Cambiado para que coincida con el controlador
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
          P_IDPROVEEDOR: proveedorId, // Enviar ID del proveedor
          P_IDESTADO: nuevoEstado, // Enviar el nuevo estado
        }),
      }
    );

    // Verifica si la respuesta no fue exitosa (status >= 400)
    if (!response.ok) {
      throw new Error(
        `Error al cambiar el estado del proveedor. Estado: ${response.status}`
      );
    }

    // Procesamos el cuerpo de la respuesta en formato JSON
    const data = await response.json();
    console.log("Estado del proveedor actualizado exitosamente:", data);

    // Muestra un mensaje de éxito si todo salió bien
    $("body").toast({
      message: "El estado del proveedor se ha actualizado correctamente.",
      class: "success",
      displayTime: 3000,
    });
  } catch (error) {
    // Si ocurre algún error, lo mostramos en la consola y como toast
    console.error("Error al actualizar el estado del proveedor:", error);

    $("body").toast({
      message: "Error al actualizar el estado del proveedor.",
      class: "error",
      displayTime: 3000,
    });
  }
}
