<?php

session_start();

// Verificar si el usuario ha iniciado sesión
if (!isset($_SESSION['loggedin']) || $_SESSION['loggedin'] !== true) {
    // Redirigir al formulario de login si no está autenticado
    header('Location: login.php');
    exit;
}

echo "Hola";