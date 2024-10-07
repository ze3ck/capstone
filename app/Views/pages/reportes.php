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
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OptiFlow | Reportes</title>
</head>

<body>

</body>

</html>