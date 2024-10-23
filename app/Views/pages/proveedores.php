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
    <title>OptiFlow | Perfil</title>
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
        <div class="ui stackable menu">
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
        <!-- Aqui va el contenido **no meter todo en un container sino el contenido se centra y se pierden lso costados de la pagina-->
        <!-- <div id="loader" class="ui active dimmer">
            <div class="ui text loader">Loading</div>
        </div> -->
        <div class="ui grid" style="margin-left: 2%; margin-right: 2%;  margin-top: 3%">
            <div class="sixteen wide column">
                <h2 style="text-align: center;">Proveedores</h2>
                <div class="ui divider"></div>
            </div>
            <div class="three wide column">
                <div class="ui fluid search selection dropdown" id="selectProveedor">
                    <input type="hidden">
                    <i class="dropdown icon"></i>
                    <div class="default text">Proveedor</div>
                    <div class="menu">
                        <div class="item" data-value="1"></i>Prov 1</div>
                        <div class="item" data-value="2"></i>Prov 2</div>
                    </div>
                </div>
            </div>
            <div class="three wide column">
                <div class="ui fluid search selection dropdown" id="selectContacto">
                    <input type="hidden">
                    <i class="dropdown icon"></i>
                    <div class="default text">Contacto</div>
                    <div class="menu">
                        <div class="item" data-value="af">
                            << /i>Juan
                        </div>
                        <div class="item" data-value="ax">
                            << /i>Pedro
                        </div>
                        <div class="item" data-value="al">
                            << /i>Elenaor
                        </div>
                    </div>
                </div>
            </div>
            <div class="three wide column">
                <div class="ui fluid search selection dropdown" id="selectEstado">
                    <input type="hidden">
                    <i class="dropdown icon"></i>
                    <div class="default text">Estado</div>
                    <div class="menu">
                        <div class="item" data-value="1">ACTIVO</div>
                        <div class="item" data-value="2">INACTIVO</div>
                    </div>
                </div>
            </div>
            <div class="three wide column">
                <button class="ui blue button" id="btnLimpiarfiltros">Limpiar Filtros</button>
            </div>
            <div class="three wide column">
                <button class="ui green button">Nuevo Proveedor</button>
            </div>
        </div>
        <div class="ui grid">
            <table class="ui striped table" style="margin: 2%;" id="tblProveedores">
                <thead>
                    <tr class="center aligned">
                        <th>ID</th>
                        <th>NOMBRE</th>
                        <th>CONTACTO</th>
                        <th>TELEFONO CONTACTO</th>
                        <th>EMAIL CONTACTO</th>
                        <th>CALLE</th>
                        <th>NUMERO</th>
                        <th>CIUDAD</th>
                        <th>ESTADO</th>
                        <th>ACCION</th>
                    </tr>
                </thead>
                <tbody>
                </tbody id="tblProveedores_body">
            </table>
        </div>
    </div>
    </div>




    <!-- Fin Contenido -->
    </div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/fomantic-ui/2.8.8/semantic.min.js"></script>
    <script>
        $(".menu .item").tab();
        $(".ui.dropdown").dropdown();
    </script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/fomantic-ui@2.9.3/dist/semantic.min.js"></script>
    <script src="/assets/js/dashboard.js"></script>
    <script>
        $('#selectProveedor')
            .dropdown();
    </script>
</body>

</html>