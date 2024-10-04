<?php 
require_once __DIR__ . '/../vendor/autoload.php';
use Config\App;
use CodeIgniter\CodeIgniter;

// Crear una instancia de configuración
$appConfig = new App();

// Instanciar CodeIgniter con la configuración
$bootstrap = new CodeIgniter($appConfig);

// Ejecutar la aplicación
$bootstrap->run();
