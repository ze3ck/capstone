<?php
// ajustar credenciales para hosting -> .env del backend
$servername = "localhost";
$username = "root";
$password = "hola";
$dbname = "c2611566_OPTFW_DEV";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

function cerrarConexion($conn) {
    $conn->close();
}
?>
