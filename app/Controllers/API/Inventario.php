<?php

namespace App\Controllers\API;

use CodeIgniter\RESTful\ResourceController;
use Config\Database;

class Inventario extends ResourceController
{



  /**
   * llenadoMovimiento()
   * PR_10_LLENADO_MOVIMIENTOS
   */
  public function llenadoMovimiento()
  {
    // Permitir CORS
    $this->response->setHeader('Access-Control-Allow-Origin', 'http://localhost');
    $this->response->setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    $this->response->setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    $this->response->setHeader('Access-Control-Allow-Credentials', 'true');

    // Responder a las solicitudes OPTIONS
    if ($this->request->getMethod() === 'options') {
      return $this->response->setStatusCode(200);
    }

    // Verificar si la solicitud es POST
    if ($this->request->getMethod() === 'POST') {
      $json = $this->request->getJSON();

      // Validar que el ID de usuario exista y sea numérico
      if (!isset($json->P_IDUSUARIO) || !is_numeric($json->P_IDUSUARIO)) {
        return $this->response->setStatusCode(400)->setJSON(['error' => 'Falta el ID del usuario o es inválido 🟡']);
      }

      $P_IDUSUARIO = $json->P_IDUSUARIO;

      try {
        // Conectar a la base de datos
        $db = \Config\Database::connect();

        // Ejecutar el procedimiento almacenado con el ID del usuario
        $query = $db->query("CALL PR_10_LLENADO_MOVIMIENTOS(?)", [$P_IDUSUARIO]);

        // Obtener los resultados como un array
        $result = $query->getResultArray();

        // Verificar si hay resultados
        if (empty($result)) {
          return $this->response->setStatusCode(404)->setJSON(['message' => 'No se encontraron movimientos para este usuario.']);
        }

        // Procesar los resultados
        $response = [];
        foreach ($result as $row) {
          $response[] = [
            "ID_MOVIMIENTO"           => $row['ID_MOVIMIENTO'],
            "DESCRIPCION_MOVIMIENTO"  => $row['DESCRIPCION_MOVIMIENTO'],
            "RESPONSABLE"             => $row['RESPONSABLE'],
            "FECHA_MOVIMIENTO"        => $row['FECHA_MOVIMIENTO'],
            "NOTA"                    => $row['NOTA'],
            "TOTAL_MOVIMIENTO"        => $row['TOTAL_MOVIMIENTO'],
            "DESCRIPCION"             => $row['DESCRIPCION'],
            "DESCRIPCION_PAGO"        => $row['DESCRIPCION_PAGO'],
          ];
        }

        // Devolver los resultados procesados como JSON
        return $this->respond([
          'success'   => true,
          'response'  => $response
        ]);
      } catch (\Exception $e) {
        // Manejar excepciones
        return $this->response->setStatusCode(500)->setJSON(['error' => 'Ocurrió un error al procesar la solicitud: ' . $e->getMessage()]);
      }
    }

    // Si el método no es POST, devolver error 405
    return $this->response->setStatusCode(405)->setJSON(['error' => 'Método no permitido']);
  }

  /**
   * llenadoDetalleMovimiento()
   * PR_11_LLENADO_DETALLE_MOVIMIENTO
   */
  public function llenadoDetalleMovimiento()
  {
    $this->response->setHeader('Access-Control-Allow-Origin', 'http://localhost');
    $this->response->setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    $this->response->setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    $this->response->setHeader('Access-Control-Allow-Credentials', 'true');

    // Responder a las solicitudes OPTIONS
    if ($this->request->getMethod() === 'options') {
      return $this->response->setStatusCode(200);
    }
    // Verificar si la solicitud es POST
    if ($this->request->getMethod() === 'POST') {
      $json = $this->request->getJSON();

      // Validar que el ID de usuario exista y sea numérico
      if (!isset($json->P_IDMOVIMIENTO) || !is_numeric($json->P_IDMOVIMIENTO)) {
        return $this->response->setStatusCode(400)->setJSON(['error' => 'Falta el P_IDMOVIMIENTO o es inválido']);
      }

      $P_IDMOVIMIENTO = $json->P_IDMOVIMIENTO;

      try {
        // Conectar a la base de datos
        $db = \Config\Database::connect();

        // Ejecutar el procedimiento almacenado con el ID del usuario
        $query = $db->query("CALL PR_11_LLENADO_DETALLE_MOVIMIENTO(?)", [$P_IDMOVIMIENTO]);

        // Obtener los resultados como un array
        $result = $query->getResultArray();

        // Verificar si hay resultados
        if (empty($result)) {
          return $this->response->setStatusCode(404)->setJSON(['message' => 'No se encontraron P_IDMOVIMIENTO.']);
        }
        /**
         * ID_MOVIMIENTO
         * ITEM
         * ID_LOTE
         * CANTIDAD
         * PRECIO
         * DESCRIPCION_PRODUCTO
         * TOTAL
         */

        $response = [];
        foreach ($result as $row) {
          $response[] = [
            "ID_MOVIMIENTO"         => $row['ID_MOVIMIENTO'],
            "ITEM"                  => $row['ITEM'],
            "ID_LOTE"               => $row['ID_LOTE'],
            "CANTIDAD"              => $row['CANTIDAD'],
            "PRECIO"                => $row['PRECIO'],
            "DESCRIPCION_PRODUCTO"  => $row['DESCRIPCION_PRODUCTO'],
            "TOTAL"                 => $row['TOTAL'],
          ];
        }

        // respuesta de $response
        return $this->respond([
          'success'   => true,
          'response'  => $response
        ]);
      } catch (\Exception $e) {
        // Manejar excepciones
        return $this->response->setStatusCode(500)->setJSON(['error' => 'Ocurrió un error al procesar la solicitud: ' . $e->getMessage()]);
      }
    }
  }

  /**
   * agregarProducto()
   */
  public function agregarProducto()
  {
    $this->response->setHeader('Access-Control-Allow-Origin', 'http://localhost');
    $this->response->setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    $this->response->setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    $this->response->setHeader('Access-Control-Allow-Credentials', 'true');

    // Responder a las solicitudes OPTIONS
    if ($this->request->getMethod() === 'options') {
      return $this->response->setStatusCode(200);
    }
    try {
    } catch (\Throwable $th) {
      //throw $th;
    }
  }


  /**
   * llenarTablaProductos()
   * PR_12_LLENADO_PRODUCTOS
   */
  // testear
  public function llenarTablaProductos()
  {
    $this->response->setHeader('Access-Control-Allow-Origin', 'http://localhost');
    $this->response->setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    $this->response->setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    $this->response->setHeader('Access-Control-Allow-Credentials', 'true');

    if ($this->request->getMethod() === 'options') {
      return $this->response->setStatusCode(200);
    }

    if ($this->request->getMethod() === 'POST') {
      $json = $this->request->getJSON();

      if (!isset($json->P_IDUSUARIO)) {
        return $this->response->setStatusCode(400)->setJSON(['error' => 'El parámetro P_IDUSUARIO es requerido.']);
      }

      try {
        $P_IDUSUARIO = $json->P_IDUSUARIO;

        $db = \Config\Database::connect();

        $query = $db->query("CALL PR_12_LLENADO_PRODUCTOS(?)", [$P_IDUSUARIO]);

        $result = $query->getResultArray();

        if (empty($result)) {
          return $this->response->setStatusCode(404)->setJSON(['message' => 'No se encontraron productos.']);
        }

        $response = [];
        foreach ($result as $row) {
          $response[] = [
            "ID_PRODUCTO"           => $row['ID_PRODUCTO'],
            "NOMBRE_PRODUCTO"       => $row['NOMBRE_PRODUCTO'],
            "DESCRIPCION_PRODUCTO"  => $row['DESCRIPCION_PRODUCTO'],
            "UNIDAD_MEDIDA"         => $row['UNIDAD_MEDIDA'],
            "PRECIO_VENTA"          => $row['PRECIO_VENTA'],
            "NOMBRE_PROVEEDOR"      => $row['NOMBRE_PROVEEDOR'],
            "TOTAL_CANTIDAD"        => $row['TOTAL_CANTIDAD'],
            "FECHA_COMPRA"          => $row['FECHA_COMPRA']
          ];
        }

        return $this->respond([
          'success'   => true,
          'response'  => $response
        ]);
      } catch (\Exception $e) {
        return $this->response->setStatusCode(500)->setJSON(['error' => 'Ocurrió un error al procesar la solicitud: ' . $e->getMessage()]);
      }
    }
  }

  /**
   * agregarNuevoProducto()
   * PR_13_NUEVO_PRODUCTO
   */
  public function agregarNuevoProducto()
  {
    $this->response->setHeader('Access-Control-Allow-Origin', 'http://localhost');
    $this->response->setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    $this->response->setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    $this->response->setHeader('Access-Control-Allow-Credentials', 'true');

    if ($this->request->getMethod() === 'options') {
      return $this->response->setStatusCode(200);
    }

    if ($this->request->getMethod() === 'POST') {
      $json = $this->request->getJSON();

      if (
        !isset($json->P_NOMBRE_PRODUCTO) || !isset($json->P_DESCRIPCION_PROD1) || !isset($json->P_UNIDAD_MEDIDA) ||
        !isset($json->P_ID_PROVEEDOR) || !isset($json->P_ID_USUARIO) || !isset($json->P_ID_LOTE) ||
        !isset($json->P_FECHA_VENCIMIENTO) || !isset($json->P_CANTIDAD) || !isset($json->P_PRECIO_COMPRA) ||
        !isset($json->P_PRECIO_VENTA) || !isset($json->P_FECHA_COMPRA)
      ) {
        return $this->response->setStatusCode(400)->setJSON(['error' => 'Faltan parámetros requeridos.']);
      }

      $db = \Config\Database::connect();

      try {
        $P_NOMBRE_PRODUCTO    = $json->P_NOMBRE_PRODUCTO;
        $P_DESCRIPCION_PROD1  = $json->P_DESCRIPCION_PROD1;
        $P_UNIDAD_MEDIDA      = $json->P_UNIDAD_MEDIDA;
        $P_ID_PROVEEDOR       = $json->P_ID_PROVEEDOR;
        $P_ID_USUARIO         = $json->P_ID_USUARIO;
        $P_ID_LOTE            = $json->P_ID_LOTE;
        $P_FECHA_VENCIMIENTO  = $json->P_FECHA_VENCIMIENTO;
        $P_CANTIDAD           = $json->P_CANTIDAD;
        $P_PRECIO_COMPRA      = $json->P_PRECIO_COMPRA;
        $P_PRECIO_VENTA       = $json->P_PRECIO_VENTA;
        $P_FECHA_COMPRA       = $json->P_FECHA_COMPRA;

        $db->transBegin();

        $db->query("CALL PR_13_NUEVO_PRODUCTO(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [
          $P_NOMBRE_PRODUCTO,
          $P_DESCRIPCION_PROD1,
          $P_UNIDAD_MEDIDA,
          $P_ID_PROVEEDOR,
          $P_ID_USUARIO,
          $P_ID_LOTE,
          $P_FECHA_VENCIMIENTO,
          $P_CANTIDAD,
          $P_PRECIO_COMPRA,
          $P_PRECIO_VENTA,
          $P_FECHA_COMPRA
        ]);

        if ($db->transStatus() === FALSE) {
          $db->transRollback();
          return $this->response->setStatusCode(500)->setJSON(['error' => 'Error al insertar el producto en la base de datos.']);
        } else {
          $db->transCommit();
          return $this->respond([
            'success' => true,
            'message' => 'Producto agregado correctamente.'
          ]);
        }
      } catch (\Exception $e) {
        $db->transRollback();
        return $this->response->setStatusCode(500)->setJSON(['error' => 'Ocurrió un error al procesar la solicitud: ' . $e->getMessage()]);
      }
    }

    return $this->response->setStatusCode(405)->setJSON(['error' => 'Método no permitido.']);
  }
}
