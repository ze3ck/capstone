<template>
  <div class="background">
    <div id="loginPage">
      <div class="glass-container" ref="loginForm">
        <div id="imageContainer" style="text-align: center" ref="imageContainer">
          <img class="logo" src="../assets/img/optwbg.png" alt="Logo" />
          <h1>OptiFlow</h1>
        </div>

        <!-- Formulario de inicio de sesión -->
        <form @submit.prevent="login" ref="form" novalidate>
          <div class="form-group">
            <label>Email:</label>
            <div class="input-container">
              <input type="email" v-model="email" placeholder="email@example.com" />
              <span class="material-icons icon-email">email</span>
            </div>
            <p v-if="errorEmail" class="error-text">{{ errorEmail }}</p>
          </div>

          <div class="form-group">
            <label>Contraseña:</label>
            <div class="input-container">
              <input :type="mostrarContrasena ? 'text' : 'password'" v-model="contrasenia" placeholder="*******" />
              <span @click="toggleMostrarContrasena" class="material-icons show-password">
                {{ mostrarContrasena ? "visibility" : "visibility_off" }}
              </span>
            </div>
            <p v-if="errorContrasena" class="error-text">
              {{ errorContrasena }}
            </p>
          </div>

          <div class="forgot-password">
            <a href="#" @click.prevent="abrirModalRecuperacion">¿Olvidaste tu contraseña?</a>
          </div>

          <div>
            <button id="btnIngresar" @click="login">Iniciar Sesión</button>
          </div>
        </form>
      </div>

      <!-- Alerta  -->
      <div v-if="showAlert" class="custom-alert" ref="customAlert">
        <p>{{ alertMessage }}</p>
      </div>

      <!-- Loader  -->
      <div v-if="loading" class="loader-overlay" ref="loaderOverlay">
        <div class="custom-loader" ref="loaderCircle"></div>
      </div>

      <!-- Modal para recuperación de contraseña -->
      <div v-if="mostrarModalRecuperacion" class="modal-overlay">
        <div class="glass-container modal-container">
          <h2>Contactar con Soporte Técnico</h2>
          <p>Ingrese su correo electrónico y nombre de empresa para recuperar su contraseña:</p>

          <!-- Campo de Correo Electrónico -->
          <div class="form-group">
            <label for="emailRecuperar">Correo Electrónico:</label>
            <input type="email" v-model="emailRecuperar" placeholder="email@example.com" />
            <p v-if="errorRecuperar" class="error-text">{{ errorRecuperar }}</p>
          </div>

          <!-- Campo de Nombre de Empresa -->
          <div class="form-group">
            <label for="nombreEmpresa">Nombre de Empresa:</label>
            <input type="text" v-model="nombreEmpresa" placeholder="Nombre de la Empresa" />
            <p v-if="errorEmpresa" class="error-text">{{ errorEmpresa }}</p>
          </div>

          <div>
            <button @click="enviarRecuperacion" class="btn-recuperar">
              Recuperar Contraseña
            </button>
          </div>

          <p v-if="mensajeRecuperacion" class="mensaje-recuperacion">{{ mensajeRecuperacion }}</p>

          <!-- Botón para cerrar el modal con ícono de Material Icons -->
          <button class="close-modal" @click="cerrarModalRecuperacion">
            <span class="material-icons">close</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Importar las funciones del archivo LoginHost.js
import LoginHost from "@/services/loginService.js";

export default {
  data() {
    return {
      email: "",
      contrasenia: "",
      mostrarContrasena: false,
      loading: false,
      showAlert: false, // Estado para mostrar la alerta
      alertMessage: "", // Mensaje personalizado de alerta
      errorEmail: null,
      errorContrasena: null,

      // Variables para el modal de recuperación
      mostrarModalRecuperacion: false,
      emailRecuperar: "",
      errorRecuperar: null,
      mensajeRecuperacion: "",
    };
  },
  methods: {
    // Usar las funciones importadas del archivo LoginHost.js
    validarEmail(email) {
      return LoginHost.methods.validarEmail(email);
    },
    validarContrasenia(contrasenia) {
      return LoginHost.methods.validarContrasenia(contrasenia);
    },
    toggleMostrarContrasena() {
      LoginHost.methods.toggleMostrarContrasena.call(this);
    },
    async login() {
      await LoginHost.methods.login.call(this);
    },
    mostrarAlerta(mensaje) {
      LoginHost.methods.mostrarAlerta.call(this, mensaje);
    },
    ocultarAlerta() {
      LoginHost.methods.ocultarAlerta.call(this);
    },
    abrirModalRecuperacion() {
      LoginHost.methods.abrirModalRecuperacion.call(this);
    },
    cerrarModalRecuperacion() {
      LoginHost.methods.cerrarModalRecuperacion.call(this);
    },
    enviarRecuperacion() {
      LoginHost.methods.enviarRecuperacion.call(this);
    },
  },
};
</script>

<style scoped>
/* Fondo con gradiente suave */
.background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #141e30, #243b55);
  z-index: -1;
}

.glass-container {
  max-width: 400px;
  margin: 80px auto 0;
  padding: 40px;
  border-radius: 15px;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.18);
  color: #fff;
}

.logo {
  width: 120px;
  margin-bottom: 20px;
}

label {
  color: #aaa;
  font-size: 0.9rem;
  letter-spacing: 1px;
  font-weight: bold;
  margin-bottom: 5px;
  text-align: left;
  display: block;
}

/* Contenedor de entrada con íconos */
.input-container {
  position: relative;
  margin-bottom: 20px;
}

input {
  width: 100%;
  padding: 12px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 10px;
  color: white;
  transition: all 0.3s ease;
}

input:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.4);
  box-shadow: 0 4px 10px rgba(0, 132, 255, 0.3);
}

input::placeholder {
  color: #ccc;
}

.material-icons {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #167ec8;
}

/* Botón de iniciar sesión */
#btnIngresar {
  width: 100%;
  margin-top: 20px;
  font-weight: bold;
  color: white;
  background: #167ec8;
  text-align: center;
  padding: 12px;
  border-radius: 30px;
  cursor: pointer;
  border: none;
  transition: background-color 0.3s ease, transform 0.3s ease,
    box-shadow 0.3s ease;
}

#btnIngresar:hover {
  background-color: #135ea8;
  transform: translateY(-0.3px);
  box-shadow: 0 4px 15px rgba(0, 132, 255, 0.1);
}

/* Estilo del modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1001;
}

.modal-container {
  max-width: 400px;
  padding: 40px;
  border-radius: 15px;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.18);
  color: #fff;
  text-align: center;
}

.close-modal {
  position: absolute;
  top: 25px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}

.close-modal .material-icons {
  color: white;
  font-size: 24px;
  cursor: pointer;
  line-height: 1;
}

.btn-recuperar {
  width: 100%;
  margin-top: 20px;
  font-weight: bold;
  color: white;
  background: #167ec8;
  text-align: center;
  padding: 12px;
  border-radius: 30px;
  cursor: pointer;
  border: none;
  transition: background-color 0.3s ease, transform 0.3s ease,
    box-shadow 0.3s ease;
}

.btn-recuperar:hover {
  background-color: #135ea8;
  transform: translateY(-0.3px);
  box-shadow: 0 4px 15px rgba(0, 132, 255, 0.1);
}

.mensaje-recuperacion {
  color: #00ff00;
  margin-top: 15px;
  font-size: 0.9rem;
}

/* Loader personalizado */
.loader-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.custom-loader {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #167ec8;
  animation: loader-animation 1.5s infinite;
}

.show-password {
  cursor: pointer;
}

@keyframes loader-animation {
  0% {
    transform: scale(0.5);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.1);
    opacity: 1;
  }
  100% {
    transform: scale(0.5);
    opacity: 0.8;
  }
}

/* Estilo de la alerta personalizada */
.custom-alert {
  position: fixed;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #ff3b3b;
  color: white;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  opacity: 0;
}

.form-group {
  margin-bottom: 20px; /* Aumenta el espacio entre los campos */
}

a:link, a:visited{
  color: rgb(255, 255, 255);
  text-decoration: none
}

a:hover{
  color: rgb(0, 0, 0);
  transition: black, 0.5s ease
}

</style>