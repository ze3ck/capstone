<?php

use App\Controllers\API\Usuarios;
use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
/**
 * Rutas para contorlar Views\pages
 * Requieren AuthController
 */

$routes->get('/', 'Home::index');

// login
$routes->get('login', 'AuthController::login');
$routes->post('login', 'AuthController::login');
$routes->get('logout', 'AuthController::logout');

// dashboard
$routes->get('dashboard', 'Home::dashboard');


// perfilUsuario
$routes->get('perfilUsuario', 'Home::perfilUsuario');
$routes->post('perfilUsuario', 'Home::perfilUsuario');

// inventario
$routes->get('inventario', 'Home::inventario');

// enviarSoporte
$routes->post('enviarSoporte', 'SoporteController::enviarSoporte');



/**
 * [RESTful API's]
 */
$routes->group(
  'api',
  ['namespace' => 'App\Controllers\API', 'filter' => 'cors'],
  function ($routes) {

    // Rutas para manejar las peticiones preflight OPTIONS
    $routes->options('usuarios', function () {
      return response()->setStatusCode(204); // Responder con 204 No Content
    });
    $routes->options('usuarios/(:any)', function () {
      return response()->setStatusCode(204);
    });

    /**
     * RESTful API's: others
     */
    // $routes->get('usuarios', 'Usuarios::index');
    $routes->post('usuarios/create', 'Usuarios::create');
    $routes->get('usuarios/edit/(:num)', 'Usuarios::edit/$1');
    $routes->put('usuarios/update/(:num)', 'Usuarios::update/$1');

    /**
     * RESTful API's: Controllers\API\Usuarios
     */
    $routes->post('usuarios/login', 'Usuarios::login');
    $routes->post('usuarios/actualizarPerfil', 'Usuarios::actualizarPerfil');
    $routes->post('usuarios/rellenarPerfil', 'Usuarios::rellenarPerfil');
    $routes->post('usuarios/gestionarUsuarios', 'Usuarios::gestionarUsuarios');
    $routes->get('usuarios/llenarEstadoUsuario', 'Usuarios::llenarEstadoUsuario');
    $routes->post('usuarios/actualizarEstado', 'Usuarios::actualizarEstado');
  }
);