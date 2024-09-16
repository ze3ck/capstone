<?php

use App\Controllers\API\Usuarios;
use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');


/**
 * app.baseURL = 'http://localhost:8080/'
 */

// RESTful API
$routes->group(
  'api',
  ['namespace' => 'App\Controllers\API'],
  function ($routes) {

    /** USUARIOS ROUTES RESTFUL API */

    // http://localhost:8080/api/usuarios
    $routes->get('usuarios', 'Usuarios::index');
    // http://localhost:8080/api/usuarios/create
    $routes->post('usuarios/create', 'Usuarios::create');
    // http://localhost:8080/api/usuarios/edit/1
    $routes->get('usuarios/edit/(:num)', 'Usuarios::edit/$1');
    // http://localhost:8080/api/usuarios/update/1
    $routes->put('usuarios/update/(:num)', 'Usuarios::update/$1');
    // http://localhost:8080/api/usuarios/login
    $routes->post('usuarios/login', 'Usuarios::login');
    // http://localhost:8080/api/usuarios/enviar-correo
    $routes->post('usuarios/enviar-correo', 'Usuarios::enviarCorreo');

  }

);
