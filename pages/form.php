<?php
$pageTitle = 'Form';
ob_start();
?>

<h1>Formulario</h1>
<form action="submit.php" method="POST">
  <label for="name">Nombre:</label>
  <input type="text" id="name" name="name">
  <input type="submit" value="Enviar">
</form>

<?php
$content = ob_get_clean();
include '../templates/base.php';
?>
