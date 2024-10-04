<?php
$session = session();
if (!$session->get('loggedin')) {
    return redirect()->to('/login');
}

// $saludo = include APPPATH . 'includes/zona_horaria.php';
?>

<h1>Inventario</h1>