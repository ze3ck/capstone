<?php
date_default_timezone_set('America/Santiago');

$horaActual = date('H');

if ($horaActual >= 6 && $horaActual < 12) {
    $saludo = '<i class="fas fa-sun"></i> Buenos días';
} elseif ($horaActual >= 12 && $horaActual < 18) {
    $saludo = '<i class="fas fa-cloud-sun"></i> Buenas tardes';
} else {
    $saludo = '<i class="fas fa-moon"></i> Buenas noches';
}

return $saludo;
