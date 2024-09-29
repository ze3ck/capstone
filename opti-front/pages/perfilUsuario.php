<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CodingDung | Profile Template</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/fomantic-ui/2.8.8/semantic.min.css" />
    <link rel="stylesheet" href="/opti-front/assets/css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
</head>

<body>
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
                <p>Bienvenido, Jorge Rojas García</p>
                <!-- <?php echo $_SESSION['email']; ?> -->
            </div>
            <!-- Cerrar sesión a la derecha -->
            <div class="right menu">
                <div class="item cerrar-sesion">
                    <i class="fas fa-sign-out-alt"></i>
                    <a href="logout.php">Cerrar sesión</a>
                </div>
            </div>
        </div>
        <!-- Pusher -->
        <!-- sidebar.php -->
        <div class="ui container">
            <h4 class="ui dividing header">Perfil de Usuario</h4>
            <div class="ui stackable grid">
                <div class="four wide column">
                    <!--Menu lateral, si quieren lo eliminan o lo agregan al sidebar-->
                    <div class="ui vertical fluid tabular menu">
                        <a class="item active" data-tab="general">General</a>
                        <a class="item" data-tab="user-management">Gestionar usuarios</a>
                    </div>
                    <!--Fin Menu -->
                </div>
                <!-- Perfil General del Usuario -->
                <div class="twelve wide stretched column">
                    <div class="ui tab segment active" data-tab="general">
                        <form class="ui form">
                            <div class="field">
                                <label>Nombre de Usuario</label>
                                <input type="text" value="nmaxwell" />
                            </div>
                            <div class="field">
                                <label>E-mail</label>
                                <input type="text" value="nmaxwell@mail.com" />
                            </div>
                            <div class="field">
                                <label>Nombre</label>
                                <input type="text" value="Nelle" />
                            </div>
                            <div class="field">
                                <label>Apellido Paterno</label>
                                <input type="text" value="Maxwell" />
                            </div>
                            <div class="field">
                                <label>Apellido Materno</label>
                                <input type="text" value="" />
                            </div>
                            <div class="field">
                                <label>Teléfono</label>
                                <input type="text" value="+0 (123) 456 7891" />
                            </div>
                            <div class="field">
                                <label>Estado</label>
                                <div id="estado-label" class="ui label">
                                    ACTIVO
                                </div>
                            </div>
                        </form>
                    </div>
                    <!-- Sección de gestionar usuarios -->
                    <div class="ui tab segment" data-tab="user-management">
                        <table class="ui celled table stackable">
                            <thead>
                                <tr>
                                    <th>ID Usuario</th>
                                    <th>Nombre Usuario</th>
                                    <th>Email</th>
                                    <th>Teléfono</th>
                                    <th>Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                <!--Agregar logica php-->
                                <tr>
                                    <td>1</td>
                                    <td>nmaxwell</td>
                                    <td>nmaxwell@mail.com</td>
                                    <td>+0 (123) 456 7891</td>
                                    <td>
                                        <select id="estado-dropdown" class="ui dropdown">
                                            <option value="ACTIVO" selected>ACTIVO</option>
                                            <option value="INACTIVO">INACTIVO</option>
                                            <option value="BLOQUEADO">BLOQUEADO</option>
                                        </select>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <!-- Fin de gestionar usuarios -->
                </div>
                <!-- Fin Perfil General-->
            </div>
            <div class="ui right aligned grid">
                <div class="column">
                    <button class="ui primary button">Guardar cambios</button>
                    <button class="ui button">Cancelar</button>
                </div>
            </div>
        </div>
        <?php include __DIR__ . '/../components/footer.php'; ?>
    </div>

    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/fomantic-ui/2.8.8/semantic.min.js"></script>
    <script>
        $(".menu .item").tab();
        $(".ui.dropdown").dropdown();

        $('#estado-dropdown').on('change', function() {
            var nuevoEstado = $(this).val();
            $('#estado-label').text(nuevoEstado);
        });
    </script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/fomantic-ui@2.9.3/dist/semantic.min.js"></script>
    <script src="/opti-front/assets/js/dashboard.js"></script>
</body>

</html>