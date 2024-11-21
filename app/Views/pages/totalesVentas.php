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
  <title>OptiFlow | Totales Ventas</title>
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
    <!-- <div id="loader" class="ui active dimmer">
            <div class="ui text loader">Loading</div>
        </div> -->

    <!-- Aqui va el contenido **no meter todo en un container sino el contenido se centra y se pierden lso costados de la pagina-->
    <!-- <h1 class="titulo-mas-vendidos" style="text-align: center; margin-top: 4%; color:black;">Totales Ventas</h1> -->



    <div class="ui container" style="margin-top: 2%; padding: 2rem;">

      <div class="ui two column grid" style="background-color: #222; border-radius: 10px; padding: 2rem; color: white;">

        <!-- Recuadro de Ventas Totales -->
        <div class="column">
          <div class="ui raised segment" style="background-color: #333; text-align: center; color: white; border-radius: 10px; padding: 1.5rem;">
            <h3 class="ui header" style="color: white;">Ventas Totales</h3>
            <div id="ventas-totales" style="font-size: 2rem; margin-top: 1rem;">Cargando...</div>
          </div>
        </div>

        <!-- Recuadro de Ganancias Totales -->
        <div class="column">
          <div class="ui raised segment" style="background-color: #333; text-align: center; color: white; border-radius: 10px; padding: 1.5rem;">
            <h3 class="ui header" style="color: white;">Ganancias Totales</h3>
            <div id="ganancias-totales" style="font-size: 2rem; margin-top: 1rem;">Cargando...</div>
          </div>
        </div>
      </div>

      <div class="ui two column grid" style="margin-top: 4%;">
        <!-- Aquí irán las tablas Mayores Ganancias y Más Vendidos -->
      </div>
    </div>

    <h1 style="text-align: center; font-family: 'Arial', sans-serif; color: black; margin-top: 1%;">Productos Estrella</h1>
    <div class="ui two column grid" style="background-color: #222; border-radius: 10px; padding: 2rem; color: white;">

      <!-- Tabla de Mayores Ganancias -->
      <div class="column">
        <h2 class="ui header" style="color: white;">Mayores Ganancias</h2>
        <table class="ui celled table" id="tabla-mayores-ganancias" style="color: white;">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Ventas Totales</th>
            </tr>
          </thead>
          <tbody>
          </tbody>
        </table>
      </div>

      <!-- Tabla de Más Vendidos -->
      <div class="column">
        <h2 class="ui header" style="color: white;">Más Vendidos</h2>
        <table class="ui celled table" id="tabla-mas-vendidos" style="color: white;">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
            </tr>
          </thead>
          <tbody>
          </tbody>
        </table>
      </div>

    </div>
  </div>










  <!-- Fin Contenido -->
  <span id="ID_USUARIO" style="display:none">
    <?php echo $_SESSION['user_id'] ?></span>
  </div>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/fomantic-ui/2.8.8/semantic.min.js"></script>




  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/fomantic-ui@2.9.3/dist/semantic.min.js"></script>
  <script src="/assets/js/dashboard.js"></script>
  <script type="module" src="/assets/js/reportes.js"></script>
  <!-- <script type="module" src="/assets/js/perfilUsuario.js"></script> -->


</body>

</html>