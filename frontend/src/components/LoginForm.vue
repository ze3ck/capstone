<template>
  <div id="loginForm">
    <form action="">
      <label for="">Email:</label>
      <input type="email" required v-model="email" placeholder="example@gmail.com">
      <!--v-model crea un tipo variable, en este caso es email para darle un valor en la etiqueta script-->
      <label for="">Password:</label>
      <input type="password" required v-model="password">
    </form>
    <div id="s">
      <button id="btnIngresar">INGRESAR</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: ''
    }
  }
}
</script>

<style>
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
}
div{
  text-align: center;
}
</style>