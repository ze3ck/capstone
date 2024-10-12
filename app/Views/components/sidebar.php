<!-- Sidebar -->
<div class="ui left inverted vertical sidebar menu">
  <div class="ui accordion">
    <a class="item" href="<?= site_url('dashboard') ?>">
      Resumen
    </a>
    <a class="item" href="<?= site_url('movimientos') ?>">
      Movimientos
    </a>
    <a class="item" href="<?= site_url('inventario') ?>">
      Inventario
    </a>
    <a class="item">
      Proveedores
    </a>
    <!-- Primer grupo de items del accordion -->
    <!-- <div class="item"> -->
    <a class="item" style="width:10" href="<?= site_url('reportes') ?>">
      Reportes
    </a>
    <!-- <div class="content"> -->
    <div class="menu">
      <a class="item" style="padding-left: 50px;">Niveles (Crit, Min, Max)</a>
      <a class="item" style="padding-left: 50px;">Mermas</a>
      <a class="item" style="padding-left: 50px;">Sin Movimientos</a>
      <a class="item" style="padding-left: 50px;">Mas Vendidos</a>
      <a class="item" style="padding-left: 50px;">Productos Por Vencer</a>
    </div>
    <!-- </div> -->
    <!-- </div> -->
    <div class="profile-container">
      <div class="item" style="display: flex; text-align:center">
        <h1>
          <i class="user tie icon" style="visibility: visible; margin-right: 30px;"></i>
        </h1>
        <div style="display: block;">
          <div class="header">
            <h3>
              <a href="<?= site_url('perfilUsuario') ?>" class="nomus-side"><?php echo $_SESSION['nombre_usuario']; ?></a>
            </h3>
          </div>
          <div class="meta" style="margin-top: 10px;">
            ID Usuario: <?php echo $_SESSION['user_id']; ?>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</div>

<style>
  .profile-container {
    position: fixed;
    bottom: 0;
    background-color: #1b1c1d;
    width: 100%;
  }
</style>