<?php
$session = session();
if (!$session->get('loggedin')) {
  return redirect()->to('/login');
}

$saludo = include APPPATH . 'includes/zona_horaria.php';
?>
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>OptiFlow | Reportes</title>
  <link rel="shortcut icon" href="/assets/img/opti.ico" />

  <!-- Fomantic UI CSS -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/fomantic-ui/2.8.8/semantic.min.css" />

  <!-- DataTables Fomantic UI CSS -->
  <link rel="stylesheet" href="https://cdn.datatables.net/1.13.4/css/dataTables.fomanticui.min.css" />

  <link rel="stylesheet" href="/assets/css/style.css">
  <link rel="stylesheet" href="/assets/css/reportes.css">

  <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
</head>

<body style="min-width: 1200px; min-height: 800px">
  <!-- sessionControllerModal.php -->

  <!-- sidebar.php -->
  <?php include __DIR__ . '/../components/sidebar.php'; ?>
  <div class="pusher">
    <div class="ui unstackable menu">
      <!-- Botón para togglear el sidebar -->
      <a class="item" id="menu-toggle">
        <i class="sidebar icon"></i>
      </a>
      <div class="header item">
        Optiflow
      </div>
      <!-- Mensaje de bienvenida -->
      <div class="item">
        <p><?php echo $saludo . ', ' .  $_SESSION['nombre'] . ' ' . $_SESSION['apaterno'] ?></p>
      </div>
      <!-- Cerrar sesión a la derecha -->
      <div class="right menu">
        <div class="item cerrar-sesion">
          <i class="fas fa-sign-out-alt"></i>
          <a href="<?= site_url('logout') ?>">Cerrar sesión</a>
        </div>
      </div>
    </div>
    <!-- <div id="loader" class="ui active dimmer">
            <div class="ui text loader">Loading</div>
        </div> -->

    <!-- Aqui va el contenido **no meter todo en un container sino el contenido se centra y se pierden los costados de la pagina-->

    <h1>Máximo, Mínimo y Crítico</h1>

    <div class="ui grid">
      <!-- Tabla Críticos -->
      <div class="eight wide column">
        <div class="ui segment">

          <h3>Críticos Y Bajo Críticos</h3>
          <div class="ui form">
            <div class="fields">
              <div class="field">
                <label>Desde</label>
                <input type="date" id="fecha-desde" placeholder="Fecha Desde">
              </div>
              <div class="field">
                <label>Hasta</label>
                <input type="date" id="fecha-hasta" placeholder="Fecha Hasta">
              </div>
              <div class="field" style="margin-top: 24px;">
                <button class="ui primary button" id="btn-filtrar">Filtrar</button>
                <button class="ui button" id="btn-limpiar">Limpiar</button>
              </div>
            </div>
          </div>
          <table class="ui celled unstackable table" id="tabla-criticos">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Existencias</th>
                <th>Ideal</th>
              </tr>
            </thead>
            <tbody>
            </tbody>
          </table>
        </div>
      </div>

      <div class="eight wide column">
        <div class="ui segment">
          <h3>Sobre Stock</h3>
          <div class="ui form">
            <div class="fields">
              <div class="field">
                <label>Desde</label>
                <input type="date" id="fecha-desde" placeholder="Fecha Desde">
              </div>
              <div class="field">
                <label>Hasta</label>
                <input type="date" id="fecha-hasta" placeholder="Fecha Hasta">
              </div>
              <div class="field" style="margin-top: 24px;">
                <button class="ui primary button" id="btn-filtrar">Filtrar</button>
                <button class="ui button" id="btn-limpiar">Limpiar</button>
              </div>
            </div>
          </div>
          <table class="ui celled unstackable table" id="tabla-sobre-stock">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Existencias</th>
                <th>Ideal</th>
              </tr>
            </thead>
            <tbody>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Tabla General -->
      <div class="eight wide column">
        <div class="ui segment">
          <h3>General</h3>
          <div class="ui form">
            <div class="fields">
              <div class="field">
                <label>Desde</label>
                <input type="date" id="fecha-desde" placeholder="Fecha Desde">
              </div>
              <div class="field">
                <label>Hasta</label>
                <input type="date" id="fecha-hasta" placeholder="Fecha Hasta">
              </div>
              <div class="field" style="margin-top: 24px;">
                <button class="ui primary button" id="btn-filtrar">Filtrar</button>
                <button class="ui button" id="btn-limpiar">Limpiar</button>
              </div>
            </div>
          </div>  
          <table class="ui celled unstackable table" id="tabla-productos">
            <thead>
              <tr>
                <th>ID</th>
                <th>Producto</th>
                <th>Existencias</th>
                <th>Ideal</th>
                <!-- <th>Semáforo</th> -->
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
            </tbody>
          </table>
        </div>
      </div>

      <div class="eight wide column">
        <div class="ui segment">
          <h3>Distribución</h3>
          <div id="chart"></div>
        </div>
      </div>

      <div class="ui small modal">
        <div class="header">Simbología de Semáforo</div>
        <div class="content">
          <div class="legend-row">
            <div class="legend-icon icon-blue"></div>
            <span class="span-leyenda">Sobre Stock: Existen más productos de los ideales.</span>
          </div>
          <div class="legend-row">
            <div class="legend-icon icon-green"></div>
            <span class="span-leyenda">Bien: Las existencias están dentro de los límites ideales.</span>
          </div>
          <div class="legend-row">
            <div class="legend-icon icon-orange"></div>
            <span class="span-leyenda">Mínimo: Existen pocas unidades, atención requerida.</span>
          </div>
          <div class="legend-row">
            <div class="legend-icon icon-red"></div>
            <span class="span-leyenda">Crítico: Las existencias están por debajo del mínimo crítico.</span>
          </div>
        </div>
        <div class="actions">
          <div class="ui button">Cerrar</div>
        </div>
      </div>

      <!-- Fin Contenido -->
      <span id="ID_USUARIO" style="display:none">
        <?php echo $_SESSION['user_id'] ?></span>
    </div>

    <!-- Scripts al final del body -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/fomantic-ui/2.8.8/semantic.min.js"></script>
    <script src="https://cdn.datatables.net/1.13.4/js/jquery.dataTables.min.js"></script>
    <script src="https://cdn.datatables.net/1.13.4/js/dataTables.fomanticui.min.js"></script>
    <!-- <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script> -->

    <script src="/assets/js/dashboard.js"></script>
    <script type="module" src="/assets/js/perfilUsuario.js"></script>
    <script type="module" src="/assets/js/reportes.js"></script>


</body>

</html>