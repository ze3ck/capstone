<footer>
  <div class="footer-container">
    <div class="ui inverted vertical footer segment form-page">
      <div class="ui container">
        <div class="footer-content">
          <div class="footer-text">
            <p>© 2024 | OptiFlow | Chile<i class="chile flag"></i></p>
          </div>
          <div class="footer-links">
            <a href="#">Política de Privacidad</a> |
            <a href="#">Términos de Servicio</a> |
            <a href="#" id="contactoBtn">Contacto</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</footer>

<!-- Modal de contacto  -->
<div class="ui modal" id="contactoModal">
  <i class="close icon"></i>
  <div class="header">Contacto</div>
  <div class="content">
    <div id="loader" class="ui active inverted dimmer" style="display: none;">
      <div class="ui text loader">Enviando...</div>
    </div>
    <form class="ui form" id="contactoForm">
      <div class="field">
        <label for="emailContacto">Ingresa tu correo</label>
        <input type="email" id="emailContacto" name="emailContacto" placeholder="tucorreo@example.com">
      </div>
      <div class="field">
        <label for="motivoContacto">Motivo de contacto</label>
        <textarea id="motivoContacto" name="motivoContacto" placeholder="Describe tu problema o pregunta" required></textarea>
      </div>
    </form>
  </div>
  <div class="actions">
    <div class="ui button" id="cancelarContacto">Cancelar</div>
    <div class="ui button teal" id="enviarContacto">Enviar</div>
  </div>
</div>


<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/fomantic-ui@2.8.8/dist/semantic.min.js"></script>

<script>
  $('#contactoBtn').on('click', function(event) {
    event.preventDefault();
    $('#contactoModal').modal('show');
  });

  $('#enviarContacto').on('click', function() {
    $('#loader').show();
    setTimeout(function() {
      $('#loader').hide();
      $('#contactoModal').modal('hide');
    }, 2000);
  });
</script>