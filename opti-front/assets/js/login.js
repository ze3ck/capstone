// Importar API_BASE_URL
import { API_BASE_URL } from "./apiConfig.js";

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

  // Mover formulario al centro y mostrar animación de carga
  function moverFormularioAlCentro() {
    gsap.to(".text-container-frase", {
      opacity: 0,
      duration: 0.5,
      ease: "power2.out",
    });

    gsap.to(".form-side", {
      x:
        window.innerWidth / 2 -
        document.querySelector(".form-side").offsetWidth / 2,
      y:
        window.innerHeight / 2 -
        document.querySelector(".form-side").offsetHeight / 2,
      duration: 1,
      scale: 1.2,
      ease: "power2.out",
      onComplete: mostrarAnimacionDeCarga,
    });
  }

  // Mostrar animación de carga en forma de onda
  function mostrarAnimacionDeCarga() {
    const loadingWave = document.createElement("div");
    loadingWave.classList.add("loading-wave");
    document.body.appendChild(loadingWave);

    gsap.fromTo(
      loadingWave,
      { opacity: 0, scale: 0 },
      { opacity: 1, scale: 1.5, duration: 1 }
    );

    // Redirigir después de 2 segundos
    setTimeout(redirigirDashboard, 2000);
  }

  // Redirigir al dashboard
  function redirigirDashboard() {
    window.location.href = "/opti-front/pages/dashboard.php";
  }

  // Animaciones de pie de página y campos de formulario
  gsap.from(".footer-container", {
    duration: 0.5,
    opacity: 0,
    y: -7,
    ease: "power2.out",
  });

  gsap.from(".ui.stacked.segment .field", {
    duration: 0.5,
    opacity: 0,
    y: 7,
    ease: "power2.out",
    delay: 0.5,
    stagger: 0.2,
  });

  // Mostrar/ocultar contraseña
  const togglePassword = document.querySelector("#togglePassword");
  const password = document.querySelector("#password");

  togglePassword.addEventListener("click", function () {
    const type =
      password.getAttribute("type") === "password" ? "text" : "password";
    password.setAttribute("type", type);

    togglePassword.classList.toggle("fa-eye");
    togglePassword.classList.toggle("fa-eye-slash");
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

        if (data.status === "success") {
          // Guardar la sesión en el servidor usando PHP
          await guardarSesionEnPHP(emailValue);
        } else {
          mostrarError(data.message || "Credenciales incorrectas.");
        }
      } catch (error) {
        mostrarError("Ocurrió un error en la conexión con el servidor.");
      }
    }
  });

  // Guardar los datos de la sesión en PHP
  async function guardarSesionEnPHP(email) {
    try {
      const response = await fetch(`${API_BASE_URL}usuarios/guardar_sesion`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email }), // Envía los datos que quieres guardar en la sesión
      });

      if (!response.ok) {
        throw new Error(`Error al guardar la sesión: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.status === "success") {
        // Redirige al dashboard una vez que la sesión está guardada
        moverFormularioAlCentro();
      } else {
        mostrarError(data.message || "No se pudo guardar la sesión.");
      }
    } catch (error) {
      mostrarError("Error al guardar la sesión en el servidor.");
    }
  }

  // Mostrar mensajes de error en el formulario
  function mostrarError(mensaje) {
    const errorDiv = document.getElementById("formError");
    errorDiv.innerText = mensaje;
    errorDiv.style.display = "block";
  }
});
