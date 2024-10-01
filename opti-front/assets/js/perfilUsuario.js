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
    document.getElementById("nombre_usuario").value =
      data.perfil.nombre_usuario;
    document.getElementById("email").value = data.perfil.email;
    document.getElementById("nombre").value = data.perfil.nombre;
    document.getElementById("apaterno").value = data.perfil.apaterno;
    document.getElementById("amaterno").value = data.perfil.amaterno;
    document.getElementById("telefono").value = data.perfil.telefono;
    document.getElementById("estado-label").innerHTML =
      data.perfil.descripcion_estado;

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
    let id_usuario = document.getElementById('ID_USUARIO').innerHTML.trim();
    
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
      mensaje('success', 2000, 'Datos Actualizados Exitosamente')
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


