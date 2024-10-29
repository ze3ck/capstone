<?php

use App\Controllers\API\Usuarios;
use CodeIgniter\Router\RouteCollection;
use App\Controllers\API\Inventario;
use App\Controllers\API\Proveedores;

/**
 * @var RouteCollection $routes
 */
/**
 * Rutas para contorlar Views\pages
 * Requieren AuthController
 */

$routes->get('/', 'Home::index');

// login
$routes->get('login',   'AuthController::login');
$routes->post('login',  'AuthController::login');
$routes->get('logout',  'AuthController::logout');

// dashboard
$routes->get('dashboard', 'Home::dashboard');


// perfilUsuario
$routes->get('perfilUsuario',   'Home::perfilUsuario');
$routes->post('perfilUsuario',  'Home::perfilUsuario');

// inventario
$routes->get('inventario', 'Home::inventario');

// enviarSoporte
$routes->post('enviarSoporte', 'SoporteController::enviarSoporte');

//movimientos
$routes->post('movimientos',  'Home::movimientos');
$routes->get('movimientos',   'Home::movimientos');

// reportes
$routes->post('reportes', 'Home::reportes');
$routes->get('reportes',  'Home::reportes');

// proveedores
$routes->post('proveedores', 'Home::proveedores');
$routes->get('proveedores',  'Home::proveedores');


// session controller modal
$routes->get('sessioncontroller/getSessionTime', 'SessionController::getSessionTime');
$routes->get('sessioncontroller/updateLastActivity', 'SessionController::updateLastActivity');

/**
 * [RESTful API's]
 */
$routes->group(
  'api',
  ['namespace' => 'App\Controllers\API', 'filter' => 'cors'],
  function ($routes) {
    /**
     * rutas preflight OPTIONS
     */
    $routes->options('usuarios', function () {
      return response()->setStatusCode(204);
    });
    $routes->options('usuarios/(:any)', function () {
      return response()->setStatusCode(204);
    });

    $routes->options('inventario', function () {
      return response()->setStatusCode(204);
    });
    $routes->options('inventario/(:any)', function () {
      return response()->setStatusCode(204);
    });
    $routes->options('movimientos', function () {
      return response()->setStatusCode(204);
    });
    $routes->options('movimientos/(:any)', function () {
      return response()->setStatusCode(204);
    });

    $routes->options('proveedores', function () {
      return response()->setStatusCode(204);
    });
    $routes->options('proveedores/(:any)', function () {
      return response()->setStatusCode(204);
    });


    /**
     * RESTful API's: others
     */
    // $routes->get('usuarios', 'Usuarios::index');
    $routes->post('usuarios/create',        'Usuarios::create');
    $routes->get('usuarios/edit/(:num)',    'Usuarios::edit/$1');
    $routes->put('usuarios/update/(:num)',  'Usuarios::update/$1');

    /**
     * RESTful API's: Controllers\API\Usuarios
     */
    $routes->post('usuarios/login',               'Usuarios::login');
    $routes->post('usuarios/actualizarPerfil',    'Usuarios::actualizarPerfil');
    $routes->post('usuarios/rellenarPerfil',      'Usuarios::rellenarPerfil');
    $routes->post('usuarios/gestionarUsuarios',   'Usuarios::gestionarUsuarios');
    $routes->get('usuarios/llenarEstadoUsuario',  'Usuarios::llenarEstadoUsuario');
    $routes->post('usuarios/actualizarEstado',    'Usuarios::actualizarEstado');
    $routes->post('usuarios/crearNuevoUsuario',   'Usuarios::crearNuevoUsuario');

    /**
     * RESTful API's: Controllers\API\Movimientos
     */
    $routes->post('movimientos/llenadoMovimiento',                'Movimientos::llenadoMovimiento');
    $routes->post('movimientos/llenadoDetalleMovimiento',         'Movimientos::llenadoDetalleMovimiento');
    $routes->get('movimientos/selectCatMovimiento',               'Movimientos::selectCatMovimiento');
    $routes->get('movimientos/selectCatGastoOperativoMovimiento', 'Movimientos::selectCatGastoOperativoMovimiento');
    $routes->post('movimientos/selectResponsables',               'Movimientos::selectResponsables');
    $routes->post('movimientos/generarGastoOperativo',            'Movimientos::generarGastoOperativo');
    $routes->post('movimientos/selectProductos',                  'Movimientos::selectProductos');
    $routes->post('movimientos/cant_total',                       'Movimientos::cant_total');
    $routes->post('movimientos/salidaMermaProductos',             'Movimientos::salidaMermaProductos');
    $routes->get('movimientos/obtenerRazonesMerma',               'Movimientos::obtenerRazonesMerma');
    $routes->post('movimientos/obtenerPrecioCompraLote',          'Movimientos::obtenerPrecioCompraLote');
    $routes->post('movimientos/obtenerCostoMerma',                'Movimientos::obtenerCostoMerma');
    $routes->post('movimientos/guardarMerma',                     'Movimientos::guardarMerma');
    $routes->post('movimientos/GenerarSalida',                    'Movimientos::GenerarSalida');
    $routes->post('movimientos/GuardarDetalleMovimiento',         'Movimientos::GuardarDetalleMovimiento');
    $routes->post('movimientos/GenerarMovimientoCompleto',        'Movimientos::GenerarMovimientoCompleto');

    /**
     * RESTful API's: Controllers\API\Inventario-Productos
     */
    $routes->post('inventario/agregarProducto',         'Inventario::agregarProducto');
    $routes->post('inventario/llenarTablaProductos',    'Inventario::llenarTablaProductos');
    $routes->post('inventario/agregarNuevoProducto',    'Inventario::agregarNuevoProducto');
    $routes->post('inventario/selectProductos',         'Inventario::selectProductos');
    $routes->get('inventario/selectUnidadMedida',       'Inventario::selectUnidadMedida');
    $routes->post('inventario/selectProveedores',       'Inventario::selectProveedores');
    $routes->post('inventario/nuevoLote',               'Inventario::nuevoLote');
    $routes->post('inventario/actualizaEstadoProducto', 'Inventario::actualizaEstadoProducto');
    $routes->post('inventario/editarProducto',          'Inventario::editarProducto');
    $routes->post('inventario/llenarModalEditarProd',   'Inventario::llenarModalEditarProd');


    /**
     * RESTful API's: Controllers\API\Proveedores
     */
    $routes->post('proveedores/selectProveedor',      'Proveedores::selectProveedor');
    $routes->post('proveedores/llenadoTablaProv',     'Proveedores::llenadoTablaProv');
    $routes->post('proveedores/selectContacto',       'Proveedores::selectContacto');
    $routes->post('proveedores/actualizarEstadoProv', 'Proveedores::actualizarEstadoProv');
    $routes->post('proveedores/selectRegion',         'Proveedores::selectRegion');
    $routes->post('proveedores/selectComuna',         'Proveedores::selectComuna');
    $routes->post('proveedores/selectCiudad',         'Proveedores::selectCiudad');
    $routes->post('proveedores/actualizarProv',         'Proveedores::actualizarProv');
    $routes->post('proveedores/nuevoProveedor',       'Proveedores::nuevoProveedor');
  }
);
