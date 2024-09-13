<template>
  <div id="loginForm">
    <div id="imageContainer" style="text-align: center;">
      <img src="../assets/optwbg.png" alt="">
    </div>
    <form action="">
      <label for="">Email:</label>
      <input type="email" required v-model="email" placeholder="example@gmail.com">
      <!--v-model crea un tipo variable, en este caso es email para darle un valor en la etiqueta script-->
      <label for="">Contraseña:</label>
      <input type="password" required v-model="password">
    </form>
    <div>
      <button id="btnIngresar" @click="login">INGRESAR</button>
    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2/src/sweetalert2.js'

export default {
  
  data() {
    return {
      email: '',
      password: ''
    };
  },
  methods: {
    login() {
      if (this.email && this.password) { //Verifica que email y password no estén vacíos
        this.$router.push('/dashboard'); //Navega al dashboard
      } else {
        Swal.fire({
          title: 'Error!',
          text: 'Debe ingresar un correo válido',
          icon: 'error',
          confirmButtonText: 'Confirmar'
        })
      }
    },
  }
}

</script>

<style>
img {
  width: 200px;
}

#loginForm {
  max-width: 420px;
  margin: 30px auto;
  background: white;
  text-align: left;
  padding: 40px;
  border-radius: 10px;
}

label {
  color: #aaa;
  display: inline-block;
  margin: 25px 0 15px;
  font-size: 0.6rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: bold;
}

input {
  display: block;
  padding: 10px 6px;
  width: 100%;
  box-sizing: border-box;
  border: none;
  border-bottom: 1px solid #ddd;
  color: #555;
}

#btnIngresar {
  width: 50%;
  margin: 20px;
  font-weight: bold;
  color: white;
  background: rgb(0, 0, 0);
  text-align: left;
  padding: 10px;
  border-radius: 10px;
  text-align: center;
  justify-content: center;
  cursor: pointer;
}

div {
  text-align: center;
}
</style>