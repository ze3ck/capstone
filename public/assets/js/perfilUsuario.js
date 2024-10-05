// Importar API_BASE_URL
import { API_BASE_URL } from "./apiConfig.js";

document.addEventListener("DOMContentLoaded", function () {
  const botonGuardar = document.getElementById("guardarCambios");
  // Asegúrate de que el botón exista en el DOM antes de agregar el evento
  if (guardarCambios) {
    botonGuardar.addEventListener("click", function () {
      guardarCambios();
    });
  }
  cargarPerfil();
  // rol = document.getElementById('ROL').innerHTML.trim();
  // if (rol == 1) {

  //   var thirdTab = document.querySelector('[data-tab="user-management"]');
  //   if (thirdTab) {
  //     thirdTab.style.display = 'block'; // Asegurar que se muestre
  //   }
  // }

});

async function cargarPerfil() {
  mostarLoader();

  try {
    // Obtener el id_usuario del DOM
    let id_usuario = document.getElementById("ID_USUARIO").innerHTML.trim();

    console.log("ID del usuario:", id_usuario); // Verifica que el ID de usuario es correcto

    // Hacer la solicitud con fetch
    const response = await fetch(`${API_BASE_URL}usuarios/rellenarPerfil`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Incluir cookies/sesiones
      body: JSON.stringify({
        id_usuario: id_usuario,
      }),
    });

    // Verificar si la respuesta es exitosa
    console.log("Estado de la respuesta:", response.status); // Verifica si la respuesta es 200 o alguna otra

    if (!response.ok) {
      throw new Error(
        `Error en la respuesta del servidor: ${response.statusText}`
      );
    }

    // Convertir la respuesta a JSON
    const data = await response.json();

    console.log("Datos de la respuesta:", data); // Verifica qué está devolviendo el backend

    // for (let x in data.perfil) {
    //   console.log(x);
    // }

    // estado-label.inner
    document.getElementById("nombre_usuario").value = data.perfil.nombre_usuario;
    document.getElementById("email").value = data.perfil.email;
    document.getElementById("nombre").value = data.perfil.nombre;
    document.getElementById("apaterno").value = data.perfil.apaterno;
    document.getElementById("amaterno").value = data.perfil.amaterno;
    document.getElementById("telefono").value = data.perfil.telefono;
    document.getElementById("ROL").value = data.perfil.rol;

    var rol = document.getElementById('ROL').value.trim();
    if (rol == 1) {

      var thirdTab = document.querySelector('[data-tab="user-management"]');
      if (thirdTab) {
        thirdTab.style.display = 'block'; // Asegurar que se muestre
      }
    }
    // document.getElementById("estado-label").innerHTML =
    //   data.perfil.descripcion_estado;

    // console.log("LABEL", label)

    // Verificar si la respuesta tiene éxito
    if (data.success === true) {
      console.log("Datos del perfil:", data.perfil);
    } else {
      console.error("Mensaje de error del servidor:", data.message);
    }
  } catch (error) {
    console.error("Error:", error);
  }
  ocultarLoader();
}

function mostarLoader() {
  document.getElementById("loader").style.display = "block";
}
function ocultarLoader() {
  document.getElementById("loader").style.display = "none";
}

// guardarCambios
async function guardarCambios() {
  try {
    mostarLoader();
    let nombre_usuario = document.getElementById("nombre_usuario").value;
    let email = document.getElementById("email").value;
    let nombre = document.getElementById("nombre").value;
    let apaterno = document.getElementById("apaterno").value;
    let amaterno = document.getElementById("amaterno").value;
    let telefono = document.getElementById("telefono").value;
    let id_usuario = document.getElementById("ID_USUARIO").innerHTML.trim();

    // Validadores de mensajes de error en inputs del form guardarCambios()
    if (!nombre_usuario) {
      mensaje("error", 2000, "Nombre Usuario no Puede Estár Vacío");
      ocultarLoader();
      return;
    }

    if (!email) {
      mensaje("error", 2000, "email Usuario no Puede Estár Vacío");
      ocultarLoader();
      return;
    }

    if (!nombre) {
      mensaje("error", 2000, "Nombre no Puede Estár Vacío");
      ocultarLoader();
      return;
    }

    if (!apaterno) {
      mensaje("error", 2000, "Apellido Paterno no Puede Estár Vacío");
      ocultarLoader();
      return;
    }

    if (!amaterno) {
      mensaje("error", 2000, "Apellido materno no Puede Estár Vacío");
      ocultarLoader();
      return;
    }

    if (!telefono) {
      mensaje("error", 2000, "telefono no Puede Estár Vacío");
      ocultarLoader();
      return;
    }

    if (!id_usuario) {
      mensaje("error", 2000, "id_usuarioo no Puede Estár Vacío");
      ocultarLoader();
      return;
    }

    const response = await fetch(`${API_BASE_URL}usuarios/actualizarPerfil`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        ID_USUARIO: id_usuario,
        NOMBRE_USUARIO: nombre_usuario,
        EMAIL: email,
        NOMBRE: nombre,
        APATERNO: apaterno,
        AMATERNO: amaterno,
        TELEFONO: telefono,
      }),
    });
    const data = await response.json();

    console.log("Datos de la respuesta:", data);

    // Verificar si la respuesta tiene éxito
    if (data.success === true) {
      console.log("Datos del perfil:", data.response);
      if (data.response.VALIDACION === "1") {
        console.log(response.VALIDACION);
        mensaje("success", 2000, "Datos Actualizados Exitosamente");
      }
    } else {
      console.error("Mensaje de error del servidor:", data.message);
    }
  } catch (error) {
    console.error("Error:", error);
  }
  ocultarLoader();
}

// mensaje('error', 2000, 'Campos de busqueda vacios')
function mensaje(clase, tiempo, mensaje) {
  $("body").toast({
    displayTime: tiempo,
    class: clase,
    message: mensaje,
    showProgress: "top",
    progressUp: true,
  });
}

/**
 * Gestionar Usuarios
 */
async function llenarTablaGestionUsuario() {
  mostarLoader();
  let id_usuario = document.getElementById("ID_USUARIO").innerHTML.trim();

  $("#t_gestion_usuarios tbody tr").remove();
  // console.log(usuario)

  const response = await fetch(`${API_BASE_URL}usuarios/gestionarUsuarios`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      ID_USUARIO: id_usuario,
    }),
  });
  const data = await response.json();

  console.log("Datos de la respuesta:", data);

  for (let x of data.response) {
    // console.log(x.EMAIL);
    cargarFilasGestionUsuarios(
      x.EMAIL,
      x.ESTADO,
      x.ID_USUARIO,
      x.NOMBRE_USUARIO
    );
  }
  ocultarLoader();
}

// Seleccionar el botón usando su id
const button = document.getElementById("guardarCambiosGestion");

// Asignar el evento click al botón
button.addEventListener("click", function () {
  obtenerDatosTabla();
});

async function obtenerDatosTabla() {
  // Seleccionamos el cuerpo de la tabla
  const tabla = document.getElementById("gestionador_body");
  const filas = tabla.getElementsByTagName("tr");
  let datos = [];

  // Recorremos cada fila de la tabla
  for (let i = 0; i < filas.length; i++) {
    let celdas = filas[i].getElementsByTagName("td");

    // Acceder al dropdown en la columna 4
    let dropdown = celdas[3].getElementsByTagName("select")[0]; // Seleccionamos el primer <select> dentro de la celda
    let id_estado = dropdown ? dropdown.value : null; // Obtenemos el valor seleccionado del dropdown

    // Guardamos cada dato en un objeto
    let usuario = {
      id_usuario: celdas[0].innerText, // ID del usuario
      ID_ESTADO: id_estado, // Valor seleccionado del dropdown (estado)
    };

    // Añadimos el objeto a la lista de datos
    datos.push(usuario);
  }

  // Aquí puedes procesar los datos o enviarlos a través de una petición AJAX
  console.log(datos);

  // Fetch usuarios/actualizarEstado
  const response = await fetch(`${API_BASE_URL}usuarios/actualizarEstado`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(datos), // Convertir el array de datos a formato JSON
  });


  // console.log("Datos de la respuesta:", data);

  // Verificar si la respuesta tiene éxito
  const data = await response.json();
  console.log("Datos de la respuesta:", data);

  // Verificar si la respuesta tiene éxito
  if (data.success === true) {
    data.response.forEach((usuario) => {
      console.log(`Usuario ${usuario.id_usuario}: ${usuario.message}`);
    });
    mensaje("success", 2000, "Datos Actualizados Exitosamente");
  } else {
    console.error("Mensaje de error del servidor:", data.message);
  }

}

// document.addEventListener("DOMContentLoaded", function () {
//   const button = document.getElementById("guardarCambiosGestion");
//   button.addEventListener("click", llenarTablaGestionUsuario);
// });

$(document).ready(function () {
  // Inicializar el componente tab de Fomantic UI
  $(".menu .item").tab();

  $('a[data-tab="user-management"]').on("click", function () {
    llenarTablaGestionUsuario();
  });
});

// Cargar Data gestion usuarios
function cargarFilasGestionUsuarios(EMAIL, ESTADO, ID_USUARIO, NOMBRE_USUARIO) {
  var tablaVisor = document.getElementById("gestionador_body");

  var tr = document.createElement("tr");
  tr.classList.add("center", "aligned");

  var col1 = document.createElement("td");
  var col2 = document.createElement("td");
  var col3 = document.createElement("td");
  var col4 = document.createElement("td");

  col1.innerHTML = ID_USUARIO;
  col2.innerHTML = NOMBRE_USUARIO;
  col3.innerHTML = EMAIL;

  // Crear el dropdown vacío en la columna 4 (ESTADO)
  var dropdown = document.createElement("select");
  dropdown.classList.add("ui", "selection", "dropdown");
  dropdown.id = "dropdown_" + ID_USUARIO;

  // Eliminar la opción por defecto, ya que solo se llenará con datos del fetch

  col4.appendChild(dropdown); // Añadir el dropdown a la columna 4

  // Añadir las columnas a la fila
  tr.appendChild(col1);
  tr.appendChild(col2);
  tr.appendChild(col3);
  tr.appendChild(col4);

  // Finalmente, agregar la fila a la tabla
  tablaVisor.appendChild(tr);

  // Función para solicitar los datos desde la base de datos para llenar el dropdown
  solicitarDatosDropdown(ID_USUARIO, dropdown, ESTADO);
}

// Función que hará la solicitud a la base de datos y llenará el dropdown
function solicitarDatosDropdown(ID_USUARIO, dropdown, ESTADO) {
  // Aquí haces una petición fetch a la base de datos (o a una API) para traer los datos
  fetch(`${API_BASE_URL}usuarios/llenarEstadoUsuario`) // Aquí pones la URL correcta a tu API o servicio
    .then((response) => {
      console.log("Respuesta recibida del servidor.");
      return response.json();
    })
    .then((data) => {
      // Ahora accedemos a data.data en lugar de data.response
      if (data && data.data) {
        console.log("Datos de la API: ", data.data);

        data.data.forEach((opcion) => {
          // Llenar el dropdown con los datos recibidos
          var opt = document.createElement("option");
          opt.value = opcion.ID_ESTADO; // Usar el ID_ESTADO como valor
          opt.innerHTML = opcion.DESCRIPCION_ESTADO; // Usar la DESCRIPCION_ESTADO como texto visible
          dropdown.appendChild(opt);
        });

        // Seleccionar la opción según el ESTADO proporcionado
        dropdown.value = ESTADO; // Asignar el estado actual al dropdown
        console.log(
          "Dropdown llenado correctamente para el usuario: " + ID_USUARIO
        );
      } else {
        console.error(
          "Error: El formato de respuesta no es el esperado o está vacío."
        );
      }
    })
    .catch((error) => {
      console.error("Error al obtener los estados:", error);
    });
}

// Actualizar Estado Usuario
async function actualizarEstadoUsuario(ID_DROPDOWN) {
  let valor = document.getElementById(ID_DROPDOWN).value;
  // dropdown.id = "dropdown_" + ID_USUARIO;
  let ID_USUARIO = Document.getElementById(ID_DROPDOWN).id.split("_")[1];
}
