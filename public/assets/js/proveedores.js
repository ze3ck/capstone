import { API_BASE_URL } from "./apiConfig.js";

document.addEventListener("DOMContentLoaded", function () {
  $("#selectProveedor").dropdown();
  $("#selectEstado").dropdown();
  $("#selectContacto").dropdown();
  selectProveedor();
  llenadoTablaProv();
});

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

async function llenadoTablaProv() {
  let id_usuario = document.getElementById("ID_USUARIO").innerHTML.trim();
  console.log(id_usuario);
  const response = await fetch(`${API_BASE_URL}proveedores/llenadoTablaProv`, {
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
    console.log("Datos obtenidos del servidor: ", data);
  } else {
    console.error("Error al obtener proveedores");
  }
}
