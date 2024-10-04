<?php

/**
 * Aviso de Derechos de Autor
 *
 * Este software, incluidos todos sus componentes y módulos, es propiedad exclusiva de https://optiflow.cl .
 * Todos los derechos están reservados. Queda estrictamente prohibida cualquier reproducción, distribución,
 * comunicación pública, transformación o explotación total o parcial del presente software, en cualquier forma
 * o por cualquier medio, sin la autorización previa, expresa y por escrito de https://optiflow.cl .
 *
 * El uso no autorizado de este software, así como su reproducción, adaptación, distribución, cesión o cualquier
 * otro acto que infrinja los derechos de propiedad intelectual del titular, será considerado una violación de las
 * leyes vigentes en materia de derechos de autor y dará lugar a las acciones legales pertinentes.
 *
 * Este software se proporciona "tal cual", sin garantías de ningún tipo, ya sean expresas o implícitas, incluyendo,
 * pero no limitándose, a garantías de comercialización o idoneidad para un fin particular.
 * 
 * © 2024 OptiFlow. Todos los derechos reservados.
 */


/*
 *---------------------------------------------------------------
 * CHECK PHP VERSION
 *---------------------------------------------------------------
 */

$minPhpVersion = '8.1'; // If you update this, don't forget to update `spark`.
if (version_compare(PHP_VERSION, $minPhpVersion, '<')) {
    $message = sprintf(
        'Your PHP version must be %s or higher to run CodeIgniter. Current version: %s',
        $minPhpVersion,
        PHP_VERSION
    );

    header('HTTP/1.1 503 Service Unavailable.', true, 503);
    echo $message;

    exit(1);
}

/*
 *---------------------------------------------------------------
 * SET THE CURRENT DIRECTORY
 *---------------------------------------------------------------
 */

// Path to the front controller (this file)
define('FCPATH', __DIR__ . DIRECTORY_SEPARATOR);

// Ensure the current directory is pointing to the front controller's directory
if (getcwd() . DIRECTORY_SEPARATOR !== FCPATH) {
    chdir(FCPATH);
}

/*
 *---------------------------------------------------------------
 * BOOTSTRAP THE APPLICATION
 *---------------------------------------------------------------
 * This process sets up the path constants, loads and registers
 * our autoloader, along with Composer's, loads our constants
 * and fires up an environment-specific bootstrapping.
 */

// LOAD OUR PATHS CONFIG FILE
// This is the line that might need to be changed, depending on your folder structure.
require FCPATH . '../app/Config/Paths.php';
// ^^^ Change this line if you move your application folder

$paths = new Config\Paths();

// LOAD THE FRAMEWORK BOOTSTRAP FILE
require $paths->systemDirectory . '/Boot.php';

exit(CodeIgniter\Boot::bootWeb($paths));
