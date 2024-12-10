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
  <title>OptiFlow | Mermas y Caducados</title>
  <link rel="shortcut icon" href="/assets/img/opti.ico" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/fomantic-ui/2.8.8/semantic.min.css" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
  <link rel="stylesheet" href="/assets/css/style.css">

</head>

<body>
  <!-- sessionControllerModal.php -->
  <?= $this->include('components/sessionControllerModal') ?>
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
    <!-- <div id="loader-xd" class="ui active dimmer">
      <div class="ui text loader">Loading</div>
    </div> -->

    <!-- Aqui va el contenido **no meter todo en un container sino el contenido se centra y se pierden lso costados de la pagina-->
    <!-- <h1 class="titulo-mas-vendidos" style="text-align: center; margin-top: 4%; color:black;">Totales Ventas</h1> -->



    <h1 class="ui header" style="text-align: center; margin-top: 4%;">Mermas y Caducados</h1>

    <div class="ui container" style="margin-top: 30px;">
      <!-- Sección de filtros -->
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

      <!-- Tabla existente -->
      <table class="ui celled striped table" id="tabla-mermas">
        <thead>
          <tr>
            <th>ID Producto</th>
            <th>ID Lote</th>
            <th>Nombre Producto</th>
            <th>Cantidad Merma</th>
            <th>Fecha Vencimiento</th>
            <th>Costo Merma</th>
            <th>Razón Merma</th>
            <th>Fecha Registro</th>
          </tr>
        </thead>
        <tbody>
          <!-- Aquí se llenarán las filas dinámicamente -->
        </tbody>
      </table>
    </div>
    <div class="ui container" style="margin-top: 20px;">
      <div class="ui raised segment" style="background-color: #333; text-align: center; color: white; border-radius: 10px; padding: 1.5rem;">
        <h2 class="ui header" style="color: white;">Costo Total de Mermas</h2>
        <div id="costo-total-mermas" style="font-size: 2rem; margin-top: 1rem;">$0</div>
      </div>
    </div>

    <div class="ui container" style="margin-top: 40px;">
      <h2 class="ui header" style="text-align: center;">Costo de Merma por Producto</h2>
      <div id="grafico-mermas" style="background-color: #222; border-radius: 10px; padding: 20px;"></div>
    </div>




    <!-- Fin Contenido -->
    <span id="ID_USUARIO" style="display:none">
      <?php echo $_SESSION['user_id'] ?></span>
  </div>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/fomantic-ui/2.8.8/semantic.min.js"></script>



  <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>

  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/fomantic-ui@2.9.3/dist/semantic.min.js"></script>
  <script src="/assets/js/dashboard.js"></script>
  <script type="module" src="/assets/js/reportes.js"></script>
  <!-- <script type="module" src="/assets/js/perfilUsuario.js"></script> -->


</body>

</html>