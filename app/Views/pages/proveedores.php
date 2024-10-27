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
    <title>OptiFlow | Proveedores</title>
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
                            Juan
                        </div>
                        <div class="item" data-value="ax">
                            Pedro
                        </div>
                        <div class="item" data-value="al">
                            Elenaor
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
                        <div class="item" data-value="">Todos</div>
                        <div class="item" data-value="1">ACTIVO</div>
                        <div class="item" data-value="2">INACTIVO</div>
                    </div>
                </div>
            </div>

            <div class="three wide column">
                <button class="ui blue button" id="btnLimpiarfiltros">Limpiar Filtros</button>
            </div>
            <div class="three wide column">
                <button class="ui green button" id="btnNuevoProveedor">Nuevo Proveedor</button>
            </div>
        </div>
        <div class="ui grid">
            <table class="ui striped celled table" style="margin: 2%;" id="tblProveedores">
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
                <tbody id="tblProveedores_body">
                </tbody>
            </table>
        </div>
    </div>

    <!-- MODAL NUEVO PROVEEDOR -->
    <div class="ui tiny modal" id="modalNuevoProveedor">
        <div class="header">
            Nuevo Proveedor
        </div>
        <div class="content">
            <div class="ui form">
                <h4>Datos del Proveedor</h4>
                <div class="two fields">
                    <div class="field">
                        <label>Nombre del Proveedor</label>
                        <input type="text" name="nombre" id="nombreProveedor" placeholder="Nombre del Proveedor" required>
                    </div>
                    <div class="field">
                        <label>Nombre del Contacto</label>
                        <input type="text" name="contacto" id="nombreContacto" placeholder="Nombre del Contacto" required>
                    </div>
                </div>
                <div class="two fields">
                    <div class="field">
                        <label>Teléfono del Contacto</label>
                        <input type="text" name="telefono" id="telefonoContacto" placeholder="Teléfono del Contacto" required>
                    </div>
                    <div class="field">
                        <label>Email del Contacto</label>
                        <input type="email" name="email" id="emailContacto" placeholder="Email del Contacto" required>
                    </div>
                </div>
                <div class="two fields">
                    <div class="field">
                        <label>Nombre de la Calle</label>
                        <input type="text" name="calle" id="nombreCalle" placeholder="Nombre de la Calle" required>
                    </div>
                    <div class="field">
                        <label>Número de la Calle</label>
                        <input type="text" name="numeroCalle" id="numeroCalle" placeholder="Número de la Calle" required>
                    </div>
                </div>
                <div class="field">
                    <label>Ciudad</label>
                    <input type="text" name="ciudad" id="ciudadProveedor" placeholder="Ciudad" required>
                </div>
            </div>
        </div>
        <div class="actions">
            <button class="ui green button" id="guardarProveedor">Guardar</button>
            <button class="ui red cancel button">Cancelar</button>
        </div>
    </div>

    <!-- MODAL EDITAR PROVEEDOR -->
    <div class="ui tiny modal" id="modalEditarProveedor">
        <div class="header">
            Editar Datos Proveedor
        </div>
        <div class="content">
            <div class="ui form">
                <h4>Datos del Proveedor</h4>
                <div class="two fields">
                    <div class="field">
                        <label>Nombre del Proveedor</label>
                        <input type="text" name="nombre" id="nombreProveedor" placeholder="Nombre del Proveedor" required>
                    </div>
                    <div class="field">
                        <label>Nombre del Contacto</label>
                        <input type="text" name="contacto" id="nombreContacto" placeholder="Nombre del Contacto" required>
                    </div>
                </div>
                <div class="two fields">
                    <div class="field">
                        <label>Teléfono del Contacto</label>
                        <input type="text" name="telefono" id="telefonoContacto" placeholder="Teléfono del Contacto" required>
                    </div>
                    <div class="field">
                        <label>Email del Contacto</label>
                        <input type="email" name="email" id="emailContacto" placeholder="Email del Contacto" required>
                    </div>
                </div>
                <div class="two fields">
                    <div class="field">
                        <label>Nombre de la Calle</label>
                        <input type="text" name="calle" id="nombreCalle" placeholder="Nombre de la Calle" required>
                    </div>
                    <div class="field">
                        <label>Número de la Calle</label>
                        <input type="text" name="numeroCalle" id="numeroCalle" placeholder="Número de la Calle" required>
                    </div>
                </div>
                <div class="field">
                    <label>Ciudad</label>
                    <input type="text" name="ciudad" id="ciudadProveedor" placeholder="Ciudad" required>
                </div>
            </div>
        </div>
        <div class="actions">
            <button class="ui green button" id="guardarProveedor">Guardar</button>
            <button class="ui red cancel button">Cancelar</button>
        </div>
    </div>


    <!-- Fin Contenido -->
    <span id="ID_USUARIO" style="display:none">
        <?php echo $_SESSION['user_id'] ?></span>
    </div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/fomantic-ui/2.8.8/semantic.min.js"></script>
    <script>
        $(".menu .item").tab();
        $(".ui.dropdown").dropdown();
        $('#modalNuevoProveedor')
            .modal('show');
    </script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/fomantic-ui@2.9.3/dist/semantic.min.js"></script>
    <script src="/assets/js/dashboard.js"></script>
    <script type="module" src="/assets/js/proveedores.js"></script>
    <script>
        function abrirModalEditarProveedor(idProveedor) {

            $('#modalEditarProveedor').modal('show');
        }
    </script>
</body>

</html>