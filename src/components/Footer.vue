<template>
  <footer class="text-center">
    <div class="container p-4 pb-0 footer-content">
      <!-- Contact Information -->
      <div class="footer-column">
        <p class="foo-info-contacto">Información de Contacto</p>
        <!-- Email -->
        <div class="contact-info">
          <a
            data-mdb-ripple-init
            class="btn text-white btn-floating m-1 email-icon"
            style="background-color: #dd4b39"
            href="mailto:contacto@optiflow.cl"
            role="button"
            target="_blank"
          >
            <i class="fa-regular fa-envelope"></i>
          </a>
          <span
            ><a class="url-contacto" href="mailto:contacto@optiflow.cl"
              >(contacto@optiflow.cl)</a
            ></span
          >
        </div>
      </div>

      <!-- Social Media -->
      <div class="footer-column">
        <p class="foo-redes-sociales">Redes Sociales</p>
        <!-- Section: Social media -->
        <section class="mb-4 social-icons">
          <!-- Github -->
          <a
            data-mdb-ripple-init
            class="btn text-white btn-floating m-1"
            style="background-color: #333333"
            href="https://github.com/ze3ck/capstone"
            role="button"
            target="_blank"
          >
            <i class="fab fa-github"></i>
          </a>
          <span
            ><a class="url-red-github" href="https://github.com/ze3ck/capstone">(Github)</a></span
          >
        </section>
      </div>

      <!-- Copyright -->
      <div class="footer-column">
        <div class="text-center p-3">
          © 2024
          <a class="optiflow-text-foo" href="https://mdbootstrap.com/">OptiFlow</a>. Todos los
          derechos reservados
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer'
}
</script>
