<head>
  <style>
    .custom-width {
      width: 400px !important;
    }

    .custom-width .content {
      max-width: 100%;
      text-align: center;
    }

    .custom-width .actions {
      display: flex;
      justify-content: center;
    }

    .custom-width .actions .button {
      margin: 0 10px;
    }
  </style>
</head>

<div id="sessionModal" class="ui modal custom-width">
  <div class="header">Sesión por expirar</div>
  <div class="content">
    <p>Su sesión está por expirar. ¿Desea continuar trabajando?</p>
  </div>
  <div class="actions">
    <div class="ui black deny button" onclick="window.location.href='<?= site_url('login') ?>'">
      Cerrar sesión
    </div>
    <div class="ui positive right labeled icon button" onclick="extendSession()">
      Continuar trabajando
      <i class="checkmark icon"></i>
    </div>
  </div>
</div>

<script>
  var sessionDuration = 2700; 

  var timeToShowModal = 300; 

  var initialCheckTime = (sessionDuration - timeToShowModal) * 1000; 

  var sessionCheckInterval = 60000; 

  function checkSessionTime() {
    console.log("Verificando tiempo de sesión...");

    $.getJSON("<?= site_url('sessioncontroller/getSessionTime') ?>", function(data) {
      console.log("Tiempo restante: ", data.timeRemaining);

      if (data.timeRemaining <= timeToShowModal) {
        $('#sessionModal').modal('show');
      }
    });
  }

  function extendSession() {
    $.getJSON("<?= site_url('sessioncontroller/updateLastActivity') ?>", function(data) {
      $('#sessionModal').modal('hide');

      resetSessionTimer();
    });
  }

  function resetSessionTimer() {
    clearInterval(sessionTimer);

    setTimeout(function() {
      checkSessionTime();

      sessionTimer = setInterval(checkSessionTime, sessionCheckInterval);
    }, initialCheckTime);
  }

  var sessionTimer;

  $(document).ready(function() {
    resetSessionTimer();
  });
</script>