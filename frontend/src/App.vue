<template>
  <LoginForm />
</template>

<script>
import LoginForm from './components/LoginForm.vue'; // Asegúrate de que el nombre coincida

export default {
  name: 'App',
  components: { LoginForm } // Usa el nombre correcto del componente
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

body {
  margin: 0;
  background: #eee;
}
</style>
