import { API_BASE_URL } from "./apiConfig.js";


document.addEventListener("DOMContentLoaded", function () {
    $('#selectProveedor')
        .dropdown();
    $('#selectEstado')
        .dropdown();
    $('#selectContacto')
        .dropdown();

    selectProveedor();

});

async function selectProveedor() {
    id_usuario = document.getElementById("ID_USUARIO").innerHTML.trim();
    const response = await fetch(`${API_BASE_URL}usuarios/selectProveedor`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
            ID_USUARIO: id_usuario,
        }),
    });
    if (!response.ok) {
        throw new Error("Error al obtener el costo de merma");
    }

    const data = await response.json();

    if (data.success) {
        console.log("Datos obtenidos del servidor: ", data);

    } else {
        console.error("Error al obtener el costo de merma");
    }

}