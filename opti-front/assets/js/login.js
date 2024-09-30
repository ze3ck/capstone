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
  // /**
  //  * Mover formulario al centro y mostrar animación de carga
  //  */
  // function moverFormularioAlCentro() {
  //   gsap.to(".text-container-frase", {
  //     opacity: 0,
  //     duration: 0.5,
  //     ease: "power2.out",
  //   });

  //   gsap.to(".form-side", {
  //     x:
  //       window.innerWidth / 2 -
  //       document.querySelector(".form-side").offsetWidth / 2,
  //     y:
  //       window.innerHeight / 2 -
  //       document.querySelector(".form-side").offsetHeight / 2,
  //     duration: 1,
  //     scale: 1.2,
  //     ease: "power2.out",
  //     onComplete: mostrarAnimacionDeCarga, // Iniciar la animación de carga
  //   });
  // }

  // // Mostrar animación de carga en forma de onda y luego redirigir
  // function mostrarAnimacionDeCarga() {
  //   const loadingWave = document.createElement("div");
  //   loadingWave.classList.add("loading-wave");
  //   document.body.appendChild(loadingWave);

  //   gsap.fromTo(
  //     loadingWave,
  //     { opacity: 0, scale: 0 },
  //     {
  //       opacity: 1,
  //       scale: 1.5,
  //       duration: 1,
  //       onComplete: redirigirDashboard, // Redirigir después de la animación
  //     }
  //   );
  // }

  // // Redirigir al dashboard
  // function redirigirDashboard() {
  //   window.location.href = "/capstone/opti-front/pages/dashboard.php";
  // }

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
  const togglePassword = document.getElementById("togglePassword");
  const passwordInput = document.getElementById("password");

  togglePassword.addEventListener("click", function (event) {
    // Evitar que el ícono cause problemas en el envío del formulario
    event.preventDefault();
    event.stopPropagation();

    // Alterna el tipo de input entre 'password' y 'text'
    const type =
      passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);

    // Alterna el ícono entre 'fa-eye-slash' y 'fa-eye'
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

        // Cambiamos de 'data.status === "success"' a 'data.success === true'
        if (data.success === true) {
          // Limpiar cualquier error anterior
          ocultarError();

          // Mover el formulario y mostrar animación solo si la autenticación fue exitosa
          moverFormularioAlCentro();
        } else {
          mostrarError(data.message || "Credenciales incorrectas.");
        }
      } catch (error) {
        // mostrarError("Credenciales incorrectas.");
        window.location.reload();
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
// Abrir el modal cuando se haga clic en el enlace de Soporte Técnico
document.querySelector(".sop-tec").addEventListener("click", function (event) {
  event.preventDefault();
  $("#soporteModal").modal("show"); // Mostrar el modal usando Fomantic UI
});

// Cerrar el modal cuando se haga clic en "Cancelar"
document
  .getElementById("cancelarSoporte")
  .addEventListener("click", function () {
    $("#soporteModal").modal("hide"); // Cerrar el modal
  });

// Manejar el envío del formulario de Soporte Técnico
document.getElementById("enviarSoporte").addEventListener("click", function () {
  const email = document.getElementById("emailSoporte").value;
  const motivo = document.getElementById("motivoSoporte").value;

  if (email && motivo) {
    // Mostrar el loader dentro del modal
    $("#loader").css("display", "block");

    // Enviar los datos por AJAX al backend PHP
    fetch("/capstone/opti-front/includes/enviarSoporte.php", {
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
        // Ocultar el loader
        $("#loader").css("display", "none");

        if (data.success) {
          // Mostrar éxito con un toast
          $("body").toast({
            class: "success",
            message:
              "Correo enviado correctamente. Te responderemos a la brevedad.",
            position: "top right",
            showProgress: "bottom",
            displayTime: 7000,
          });
          // Cerrar el modal
          $("#soporteModal").modal("hide");
        } else {
          // Mostrar error con un toast
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
        // Ocultar el loader
        $("#loader").css("display", "none");

        console.error("Error:", error);
        // Mostrar error de red
        $("body").toast({
          class: "error",
          message: "Ocurrió un error al intentar enviar el correo.",
          position: "top right",
          showProgress: "bottom",
          displayTime: 7000,
        });
      });
  } else {
    $("body").toast({
      class: "warning",
      message: "Por favor, completa ambos campos.",
      position: "top right",
      showProgress: "bottom",
      displayTime: 7000,
    });
  }
});

// Animacion redirecciona dashboard
document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");

  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(loginForm);

    fetch("login.php", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          const loader = document.getElementById("loadingOverlay");
          loader.style.display = "block";

          const formSide = document.querySelector(".login-container");
          const overlay = document.querySelector(".redirect-overlay");
          overlay.style.display = "block";

          const timeline = gsap.timeline({
            onComplete: function () {
              window.location.href = "dashboard.php";
            },
          });

          timeline.to(formSide, {
            x: "-100%",
            duration: 1,
            ease: "power2.inOut",
          });

          timeline.fromTo(
            overlay,
            {
              x: "100%",
            },
            {
              x: "0%",
              duration: 1,
              ease: "power2.inOut",
            },
            0
          );

          timeline.to(
            loader,
            {
              opacity: 0,
              duration: 0.5,
              ease: "power2.out",
              onComplete: function () {
                loader.style.display = "none";
              },
            },
            "-=0.5"
          );
        } else {
          const errorDiv = document.createElement("div");
          errorDiv.classList.add("ui", "negative", "message");
          errorDiv.innerHTML = `<p>${data.message}</p>`;

          const formContainer = document.querySelector(".column");
          const existingMessage = formContainer.querySelector(
            ".ui.negative.message"
          );
          if (existingMessage) {
            existingMessage.remove();
          }
          formContainer.insertBefore(errorDiv, loginForm);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");

  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const formData = new FormData(loginForm);

    // Enviar solicitud AJAX
    fetch("login.php", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          const loader = document.getElementById("loadingOverlay");
          loader.style.display = "block";

          gsap.to(loader, {
            opacity: 1,
            duration: 0.5,
            onComplete: function () {
              setTimeout(() => {
                gsap.to(loader, {
                  opacity: 0,
                  duration: 0.5,
                  onComplete: function () {
                    loader.style.display = "none";
                    window.location.href = "dashboard.php";
                  },
                });
              }, 3000);
            },
          });
        } else {
          const errorDiv = document.createElement("div");
          errorDiv.classList.add("ui", "negative", "message");
          errorDiv.innerHTML = `<p>${data.message}</p>`;

          const formContainer = document.querySelector(".column");
          const existingMessage = formContainer.querySelector(
            ".ui.negative.message"
          );
          if (existingMessage) {
            existingMessage.remove();
          }
          formContainer.insertBefore(errorDiv, loginForm);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
});
