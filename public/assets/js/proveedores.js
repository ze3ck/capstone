import { API_BASE_URL } from "./apiConfig.js";

document.addEventListener("DOMContentLoaded", function () {
  $("#selectProveedor").dropdown();
  $("#selectEstado").dropdown();
  $("#selectContacto").dropdown();
  $("#selectNewCiudad").dropdown();
  $("#selectNewComuna").dropdown();
  $("#selectNewRegion").dropdown();
  $("#editarProveedorBtn").click(editarProveedor);

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
  $(document).ready(function () {
    const tbody = document.getElementById("tblProveedores_body");
    tbody.addEventListener("click",function(event){
      const editarButton = event.target.closest(".editarProveedorBtn");

      if(editarButton){
        const row = editarButton.closest("tr");

        // const idProveedor = row.cells[0].textContent.trim();
        const nombreProveedor = row.cells[1].textContent.trim();
        const contacto = row.cells[2].textContent.trim();
        const telefonoContacto = row.cells[3].textContent.trim()
        const emailContacto = row.cells[4].textContent.trim();
        const calle = row.cells[5].textContent.trim();
        const numero = row.cells[6].textContent.trim();
        const ciudad = row.cells[7].textContent.trim();
        const estado = row.cells[8].textContent.trim();

        // const selectRegion = document.getElementById("selectNewRegionEdit");
        // const selectComuna = document.getElementById("selectNewComunaEdit");
        // const selectCiudad = document.getElementById("selectNewCiudadEdit");
        document.getElementById("nombreProveedorEdit").value = nombreProveedor;
        document.getElementById("nombreContactoEdit").value = contacto;
        document.getElementById("telefonoContactoEdit").value = telefonoContacto;
        document.getElementById("emailContactoEdit").value = emailContacto;
        document.getElementById("nombreCalleEdit").value = calle;
        document.getElementById("numeroCalleEdit").value = numero;
        document.getElementById("ciudadProveedorEdit").value = ciudad;
        // document.getElementById("selectNewCiudadEdit").value;
        // document.getElementById("selectNewComunaEdit").value;
        // document.getElementById("selectNewRegionEdit").value;

      }
    })

  })
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
                      <button class="ui icon button editarProveedorBtn" data-proveedor-id="${proveedor.ID_PROVEEDOR}"onclick="abrirModalEditarProveedor(${
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

let proveedorId = null;

const tbody = document.getElementById("tblProveedores");
// Delegación de eventos para el clic en los botones de edición
tbody.addEventListener("click", function (event) {
  const editarButton = event.target.closest(".editarProveedorBtn");

  if (editarButton) {
    proveedorId = editarButton.getAttribute("data-proveedor-id");
    $("#modalEditarProveedor").modal("show");
    console.log("id proveedor editar: ", proveedorId);
  }
});


async function editarProveedor(){
  const nombreProveedorEdit = document.getElementById("nombreProveedorEdit").value.trim();
  const nombreContactoEdit = document.getElementById("nombreContactoEdit").value.trim();
  const telefonoContactoEdit = document.getElementById("telefonoContactoEdit").value.trim();
  const emailContactoEdit = document.getElementById("emailContactoEdit").value.trim();
  const nombreCalleEdit = document.getElementById("nombreCalleEdit").value.trim();
  const numeroCalleEdit = document.getElementById("nuCalleEdit").value.trim();
  const ciudadProveedorEdit = document.getElementById("nombreCalleEdit").value.trim();
  const selectNewCiudadEdit = document.getElementById("selectNewCiudadEdit").value.trim();
  const selectNewComunaEdit = document.getElementById("selectNewComunaEdit").value.trim();
  const selectNewRegionEdit = document.getElementById("selectNewRegionEdit").value.trim();
  if(
    !nombreProveedorEdit ||nombreProveedorEdit.lenght == 0 ||
    !nombreContactoEdit ||nombreContactoEdit.lenght == 0 ||
    !telefonoContactoEdit ||telefonoContactoEdit.lenght == 0 ||
    !emailContactoEdit ||emailContactoEdit.lenght == 0 ||
    !nombreCalleEdit ||nombreCalleEdit.lenght == 0 ||
    !numeroCalleEdit ||numeroCalleEdit.lenght == 0 ||
    !ciudadProveedorEdit ||ciudadProveedorEdit.lenght == 0
  ){
    $('body').toast({
      message: "Uno o más campos están vacíos",
      showProgress: 'top',
      class: 'error',
      displayTime: 8000,
    })
  } else {
    try {
      const response = await fetch(
        `${API_BASE_URL}proveedores/actualizarProv`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            P_IDPROVEEDOR: proveedorId, //CORREGIR
            P_NOMBRE_PROVEEDOR: nombreProveedorEdit,
            P_NOMBRE_CONTACTO: nombreContactoEdit,
            P_TELEFONO: telefonoContactoEdit,
            P_EMAIL: emailContactoEdit,
            P_NOMBRE_CALLE: nombreCalleEdit,
            P_NUMERO_CALLE: numeroCalleEdit,
            P_IDCIUDAD: selectNewCiudadEdit, //CORREGIR
            P_IDCOMUNA: selectNewComunaEdit, //CORREGIR
            P_IDREGION: selectNewRegionEdit //CORREGIR
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Error al editar el proveedor. Estado: ${response.status}`
        );
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        console.log("Proveedor editado con éxito:", data);

        // Mostrar mensaje de éxito con toast
        $("body").toast({
          message: "Se ha editado el proveedor exitosamente",
          class: "success",
          displayTime: 3000,
        });
      } else {
        console.warn("El servidor no devolvió un JSON válido.");
        // Mostrar mensaje de advertencia si no es JSON válido
        $("body").toast({
          message:
            "Proveedor editado exitosamente, pero la respuesta no es válida.",
          class: "warning",
          displayTime: 3000,
        });
        // Limpiar los campos del formulario
        limpiarFormulario();

        // Cerrar el modal
        $("#editModal").modal("hide");
      }
    } catch (error) {
      
    }
  }
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
 * PR_38_SELECT_REGION 🧉
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
 * PR_39_SELECT_COMUNA 🧉
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
 * PR_40_SELECT_CIUDAD 🧉
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

document
  .getElementById("formNuevoProveedor")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); 
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
    const form = document.getElementById("formNuevoProveedor");
    const formData = new FormData(form);

    const idUsuarioElement = document.getElementById("ID_USUARIO");
    if (!idUsuarioElement) {
      console.error("Elemento con ID 'ID_USUARIO' no encontrado.");
      alert("Error interno: ID de usuario no encontrado.");
      return;
    }

    let idUsuario;
    if (idUsuarioElement.tagName.toLowerCase() === "input") {
      idUsuario = idUsuarioElement.value.trim();
    } else {
      idUsuario = idUsuarioElement.innerHTML.trim();
    }

    const nombreProveedor = formData.get("nombre")
      ? formData.get("nombre").trim()
      : "";
    const nombreContacto = formData.get("contacto")
      ? formData.get("contacto").trim()
      : "";
    const telefonoContacto = formData.get("telefono")
      ? formData.get("telefono").trim()
      : "";
    const emailContacto = formData.get("email")
      ? formData.get("email").trim()
      : "";
    const nombreCalle = formData.get("calle")
      ? formData.get("calle").trim()
      : "";
    const numeroCalle = formData.get("numeroCalle")
      ? formData.get("numeroCalle").trim()
      : "";

    const idRegion = formData.get("region");
    const idComuna = formData.get("comuna");
    const idCiudad = formData.get("ciudad");

    console.log("idUsuario:", idUsuario);
    console.log("Nombre Proveedor:", nombreProveedor);
    console.log("Nombre Contacto:", nombreContacto);
    console.log("Teléfono Contacto:", telefonoContacto);
    console.log("Email Contacto:", emailContacto);
    console.log("Nombre Calle:", nombreCalle);
    console.log("Número Calle:", numeroCalle);
    console.log("ID Región:", idRegion);
    console.log("ID Comuna:", idComuna);
    console.log("ID Ciudad:", idCiudad);

    if (
      !nombreProveedor ||
      !nombreContacto ||
      !telefonoContacto ||
      !emailContacto ||
      !nombreCalle ||
      !numeroCalle ||
      !idRegion ||
      !idComuna ||
      !idCiudad
    ) {
      mostrarToast("Por favor, complete todos los campos antes de guardar.", "warning");
      return;
    }

    const data = {
      P_IDUSUARIO: idUsuario,
      P_NOMBRE_PROVEEDOR: nombreProveedor,
      P_NOMBRE_CONTACTO: nombreContacto,
      P_TELEFONO: telefonoContacto,
      P_EMAIL: emailContacto,
      P_NOMBRE_CALLE: nombreCalle,
      P_NUMERO_CALLE: parseInt(numeroCalle, 10),
      P_ID_REGION: parseInt(idRegion, 10),
      P_ID_COMUNA: parseInt(idComuna, 10),
      P_ID_CIUDAD: parseInt(idCiudad, 10),
    };

    console.log("Datos a enviar:", data); 

    try {
      const response = await fetch(
        `${API_BASE_URL}proveedores/nuevoProveedor`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Error al guardar el proveedor");
      }

      const result = await response.json();

      if (result.success) {
        mostrarToast("Proveedor guardado correctamente.", "success");
        $("#modalNuevoProveedor").modal("hide");
        limpiarModalNuevoProveedor();
      } else {
        console.error("Error al guardar el proveedor:", result.message);
        // mostrarToast("Error: " + result.message, "error");
      }
    } catch (error) {
      console.error("Error en guardarProveedor:", error);
      mostrarToast("Error al guardar el proveedor. Inténtelo de nuevo.", "error");
    }
  });

// limpiar modal de nuevo prov 🧉
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


  
