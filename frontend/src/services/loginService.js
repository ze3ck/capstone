import axios from "axios";
import { gsap } from "gsap";

// Funciones del módulo de autenticación
export default {
  methods: {
    validarEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(String(email).toLowerCase());
    },

    validarContrasenia(contrasenia) {
      const espaciosEnBlanco = /\s/;
      return contrasenia.length >= 5 && !espaciosEnBlanco.test(contrasenia);
    },

    toggleMostrarContrasena() {
      this.mostrarContrasena = !this.mostrarContrasena;
    },

    async login() {
      this.errorEmail = null;
      this.errorContrasena = null;

      if (!this.email || !this.contrasenia) {
        this.mostrarAlerta("Debe ingresar un correo y una contraseña.");
        return;
      }

      if (!this.validarEmail(this.email)) {
        this.mostrarAlerta(
          "Por favor ingrese un correo válido (ejemplo@dominio.com)."
        );
        return;
      }

      if (!this.validarContrasenia(this.contrasenia)) {
        this.mostrarAlerta("La contraseña no cumple con los estándares.");
        return;
      }

      try {
        this.loading = true;

        const response = await axios.post("/api/usuarios/login", {
          email: this.email,
          contrasenia: this.contrasenia,
        });

        if (response.status === 200 && response.data.success) {
          this.$router.push("/dashboard");
        } else {
          this.mostrarAlerta("Credenciales incorrectas.");
        }
      } catch (error) {
        this.mostrarAlerta(
          error.response?.data?.message || "Credenciales Incorrectas"
        );
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    mostrarAlerta(mensaje) {
      this.alertMessage = mensaje;
      this.showAlert = true;

      gsap.fromTo(
        this.$refs.customAlert,
        { y: -50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" }
      );

      setTimeout(() => {
        this.ocultarAlerta();
      }, 3000);
    },

    ocultarAlerta() {
      gsap.to(this.$refs.customAlert, {
        y: -50,
        opacity: 0,
        duration: 0.5,
        ease: "power2.in",
        onComplete: () => {
          this.showAlert = false;
        },
      });
    },

    // Funciones para el modal de recuperación de contraseña
    abrirModalRecuperacion() {
      this.mostrarModalRecuperacion = true;
      this.errorRecuperar = null;
      this.mensajeRecuperacion = "";
      this.emailRecuperar = "";
    },

    cerrarModalRecuperacion() {
      this.mostrarModalRecuperacion = false;
    },

    enviarRecuperacion() {
      this.errorRecuperar = null;

      if (!this.emailRecuperar) {
        this.errorRecuperar = "Por favor, ingrese un correo electrónico.";
        return;
      }

      if (!this.validarEmail(this.emailRecuperar)) {
        this.errorRecuperar = "Por favor, ingrese un correo válido.";
        return;
      }

      // Simulamos el envío de la solicitud
      this.mensajeRecuperacion =
        "Te contactaremos a la brevedad para que puedas recuperar tu contraseña.";
    },
  },
};
