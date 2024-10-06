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
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/fomantic-ui/2.8.8/semantic.min.css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
    <link rel="stylesheet" href="/assets/css/style.css">

</head>

<body>
    <!-- Loader -->

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
        <div id="loader" class="ui active dimmer">
            <div class="ui text loader">Loading</div>
        </div>
        <p></p>
        <!-- Pusher -->
        <!-- sidebar.php -->

        <div class="ui container" id="container-perfilUsuario">
            <h4 id="tituloPerfilUsuario" class="ui dividing header">Perfil de Usuario</h4>
            <div class="ui stackable grid">
                <div class="four wide column">
                    <!--Menu lateral, si quieren lo eliminan o lo agregan al sidebar-->
                    <div class="ui vertical fluid tabular menu">
                        <a class="item active" data-tab="general">General</a>
                        <a class="item" data-tab="user-management" style="display: none;">Gestionar usuarios</a>
                    </div>
                    <!--Fin Menu -->
                </div>
                <!-- Perfil General del Usuario -->
                <div class="twelve wide stretched column">
                    <div class="ui tab segment active" data-tab="general">
                        <form class="ui form">
                            <div class="field">
                                <label>Nombre de Usuario</label>
                                <input id="nombre_usuario" type="text" />
                            </div>
                            <div class="field">
                                <label>E-mail</label>
                                <input id="email" type="text" />
                            </div>
                            <div class="field">
                                <label>Nombre</label>
                                <input id="nombre" type="text" />
                            </div>
                            <div class="field">
                                <label>Apellido Paterno</label>
                                <input id="apaterno" type="text" />
                            </div>
                            <div class="field">
                                <label>Apellido Materno</label>
                                <input id="amaterno" type="text" />
                            </div>
                            <div class="field">
                                <label>Teléfono</label>
                                <input id="telefono" type="text" />
                            </div>
                            <div class="field" style="display: none;">
                                <label>ROL</label>
                                <input id="ROL" type="text" />
                            </div>
                        </form>
                        <div class="ui right aligned grid">
                            <div class="column">
                                <button onclick="guardarCambios()" id="guardarCambios" class="ui primary button">Guardar cambios</button>
                            </div>
                        </div>
                    </div>
                    <!-- Sección de gestionar usuarios -->
                    <div class="ui tab segment" data-tab="user-management">
                        <table id="t_gestion_usuarios" class="ui celled table stackable">
                            <thead>
                                <tr>
                                    <th>ID Usuario</th> 
                                    <th>Nombre Usuario</th>
                                    <th>Email</th>
                                    <th>Estado</th>
                                </tr>
                            </thead>
                            <tbody id="gestionador_body">

                            </tbody>
                        </table>
                        <span id="ID_USUARIO" style="display:none">
                            <?php echo $_SESSION['user_id'] ?></span>
                        <span id="EMAIL" style="display:none">
                            <?php echo $_SESSION['email'] ?></span>
                        <span id="NOMBRE_USUARIO" style="display:none">
                            <?php echo $_SESSION['nombre_usuario'] ?></span>
                        <span id="ROL" style="display:none">
                            <?php echo $_SESSION['rol'] ?></span>

                        <!-- bOTONERA -->
                        <div class="ui right aligned grid">
                            <div class="column">
                                <button id="crearUsuario" class="ui green button">Crear Usuario
                                    <div id="modalUsuario" class="ui large modal">
                                        <div class="header">
                                            Crear Nuevo Usuario
                                        </div>
                                        <div class="ui two column grid" style="margin: 0 20px;">
                                            <!-- Primera fila: Información de Conexión -->
                                            <div class="row">
                                                <div class="column">
                                                    <h3>Información de Conexión</h3>
                                                    <form class="ui form">
                                                        <div class="field">
                                                            <label>Usuario</label>
                                                            <input type="text" name="username" placeholder="Usuario">
                                                        </div>
                                                        <div class="field">
                                                            <label>Contraseña</label>
                                                            <input type="password" name="password" placeholder="Contraseña">
                                                        </div>
                                                        <div class="field">
                                                            <label>Email</label>
                                                            <input type="email" name="email" placeholder="Email">
                                                        </div>
                                                        <div class="ui divider"></div>
                                                    </form>
                                                </div>
                                                <div class="column">
                                                    <h3>Información Laboral</h3>
                                                    <form class="ui form">
                                                        <div class="field">
                                                            <label>Seleccionar Empresa</label>
                                                            <div class="ui selection dropdown">
                                                                <input type="hidden" name="empresa">
                                                                <i class="dropdown icon"></i>
                                                                <div class="default text">Empresa</div>
                                                                <div class="menu">
                                                                    <div class="item" data-value="0">Cualquier Empresa</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="field">
                                                            <label>Seleccionar Rol</label>
                                                            <div class="ui selection dropdown">
                                                                <input type="hidden" name="rol">
                                                                <i class="dropdown icon"></i>
                                                                <div class="default text">Rol</div>
                                                                <div class="menu">
                                                                    <div class="item" data-value="0">Administrador</div>
                                                                    <div class="item" data-value="1">Empleado</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="field">
                                                            <label>Seleccionar Estado</label>
                                                            <div class="ui selection dropdown">
                                                                <input type="hidden" name="estado">
                                                                <i class="dropdown icon"></i>
                                                                <div class="default text">Estado</div>
                                                                <div class="menu">
                                                                    <div class="item" data-value="0">Cat</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="ui divider"></div>
                                                    </form>
                                                </div>
                                            </div>

                                            <!-- Segunda fila: Información Personal -->
                                            <div class="row">
                                                <div class="column">
                                                    <h3>Información Personal</h3>
                                                    <form class="ui form">
                                                        <div class="field">
                                                            <label>Nombre</label>
                                                            <input type="text" name="first-name" placeholder="Nombre">
                                                        </div>
                                                        <div class="field">
                                                            <label>Apellido Paterno</label>
                                                            <input type="text" name="last-name" placeholder="Apellido Paterno">
                                                        </div>
                                                        <div class="field">
                                                            <label>Apellido Materno</label>
                                                            <input type="text" name="middle-name" placeholder="Apellido Materno">
                                                        </div>
                                                        <div class="field">
                                                            <label>Teléfono</label>
                                                            <input type="text" name="phone" placeholder="Teléfono">
                                                        </div>
                                                        <div class="ui divider"></div>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </button>
                                <button id="guardarCambiosGestion" class="ui primary button">Guardar cambios</button>
                            </div>
                        </div>
                    </div>
                    <!-- Fin de gestionar usuarios -->
                </div>
                <!-- Fin Perfil General-->
            </div>
        </div>
    </div>

<<<<<<< Updated upstream
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
=======


>>>>>>> Stashed changes
    <script src="https://cdnjs.cloudflare.com/ajax/libs/fomantic-ui/2.8.8/semantic.min.js"></script>
    <script>
        $(".menu .item").tab();
        $(".ui.dropdown").dropdown();

        $('#estado-dropdown').on('change', function() {
            var nuevoEstado = $(this).val();
            $('#estado-label').text(nuevoEstado);
        });
        $('#crearUsuario').on('click', function() {
            $('#modalUsuario').modal('show');
        });
    </script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/fomantic-ui@2.9.3/dist/semantic.min.js"></script>
    <script src="/assets/js/dashboard.js"></script>
    <script type="module" src="/assets/js/perfilUsuario.js"></script>
</body>

</html>