// Importar API_BASE_URL
import { API_BASE_URL } from "./apiConfig.js";

// Mostrar loader
function mostrarLoader() {
    document.getElementById("loader").style.display = "block";
}

// Ocultar loader
function ocultarLoader() {
    document.getElementById("loader").style.display = "none";
}

document.addEventListener("DOMContentLoaded", function () {
    console.log("Documento cargado");

    // Animación del texto principal
    const myText = new SplitType("#my-text");

    // Animación de las letras del texto
    gsap.to(".char", {
        y: 0,
        stagger: 0.02,
        delay: 0.4,
        duration: 0.1,
        onComplete: animarSubrayado,
    });

    // Animar subrayado de "OptiFlow"
    function animarSubrayado() {
        gsap.to(".underline", {
            width: "100%",
            duration: 0.5,
            ease: "power2.out",
            delay: 0.3,
            onComplete: mostrarFormulario,
        });
    }

    // Mostrar formulario después de la animación del subrayado
    function mostrarFormulario() {
        const formSide = document.querySelector(".form-side");
        formSide.classList.remove("hidden");

        gsap.from(formSide, {
            opacity: 0,
            y: 50,
            duration: 0.5,
            ease: "power2.out",
        });
    }

    // Mostrar/ocultar contraseña
    const togglePassword = document.getElementById("togglePassword");
    const passwordInput = document.getElementById("password");

    togglePassword?.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        const type =
            passwordInput.getAttribute("type") === "password" ? "text" : "password";
        passwordInput.setAttribute("type", type);
        this.classList.toggle("fa-eye");
        this.classList.toggle("fa-eye-slash");
    });

    // Validación del formulario de login
    const form = document.getElementById("loginForm");
    const emailField = document.getElementById("email");
    const passwordField = document.getElementById("password");

    form.addEventListener("submit", async function (e) {
        e.preventDefault();
        let valid = true;
        const emailValue = emailField.value.trim();
        const passwordValue = passwordField.value.trim();

        if (!emailValue || !passwordValue) {
            mostrarError("Por favor, completa ambos campos.");
            valid = false;
        }

        if (valid) {
            try {
                mostrarLoader();
                const response = await fetch(`${API_BASE_URL}usuarios/login`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        email: emailValue,
                        contrasenia: passwordValue,
                    }),
                });

                if (!response.ok) {
                    throw new Error(
                        `Error en la respuesta del servidor: ${response.statusText}`
                    );
                }

                const data = await response.json();
                console.log(data); // Verificar la respuesta del servidor

                // Si el login es exitoso, redireccionar al dashboard
                if (data.success === true) {
                    window.location.href = "/dashboard"; // Redirigir al dashboard
                } else {
                    mostrarError(data.message || "Credenciales incorrectas.");
                }
            } catch (error) {
                mostrarError("Ocurrió un error inesperado.");
            } finally {
                ocultarLoader();
            }
        }
    });

    // Mostrar mensajes de error en el formulario
    function mostrarError(mensaje) {
        const errorDiv = document.getElementById("formError");
        errorDiv.innerText = mensaje;
        errorDiv.style.display = "block";
    }

    // Ocultar mensajes de error
    function ocultarError() {
        const errorDiv = document.getElementById("formError");
        errorDiv.style.display = "none";
    }
});

// Código para el manejo del modal de Soporte Técnico (con adaptaciones)
document.querySelector(".sop-tec")?.addEventListener("click", function (event) {
    event.preventDefault();
    $("#soporteModal").modal("show");
});

document.getElementById("cancelarSoporte")?.addEventListener("click", function () {
    $("#soporteModal").modal("hide");
});

document.getElementById("enviarSoporte").addEventListener("click", function () {
    const email = document.getElementById("emailSoporte").value;
    const motivo = document.getElementById("motivoSoporte").value;

    if (email && motivo) {
        // Mostrar el loader cuando se comienza a enviar el correo
        mostrarLoader();
        fetch("/enviarSoporte", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                emailSoporte: email,
                motivoSoporte: motivo,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                ocultarLoader();

                if (data.success) {
                    // Mostrar un mensaje de éxito
                    $("body").toast({
                        class: "success",
                        message: "Correo enviado correctamente.",
                        position: "top right",
                        showProgress: "bottom",
                        displayTime: 7000,
                    });
                    $("#soporteModal").modal("hide");
                } else {
                    // Mostrar un mensaje de error si el servidor responde con un fallo
                    $("body").toast({
                        class: "error",
                        message: "Error: " + data.message,
                        position: "top right",
                        showProgress: "bottom",
                        displayTime: 7000,
                    });
                }
            })
            .catch((error) => {
                // En caso de error, ocultar el loader y mostrar un mensaje
                ocultarLoader();

                $("body").toast({
                    class: "error",
                    message: "Ocurrió un error al intentar enviar el correo.",
                    position: "top right",
                    showProgress: "bottom",
                    displayTime: 7000,
                });
            });
    } else {
        // Si los campos no están completos, mostrar un mensaje de advertencia
        $("body").toast({
            class: "warning",
            message: "Por favor, completa ambos campos.",
            position: "top right",
            showProgress: "bottom",
            displayTime: 7000,
        });
    }
});

// Animaciones adicionales
const myText = new SplitType("#my-text");

gsap.to(".char", {
    y: 0,
    stagger: 0.02,
    delay: 0.4,
    duration: 0.1,
});

// Animación de subrayado de la palabra "OptiFlow"
gsap.to(".highlight::after", {
    width: "100%",
    duration: 1,
    ease: "power2.out",
    delay: 3,
});

