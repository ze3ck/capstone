<?php

namespace App\Controllers\API;

use CodeIgniter\RESTful\ResourceController;
use Config\Database;

class Inventario extends ResourceController
{

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
   * PR_12_LLENADO_TABLA_PRODUCTOS
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

        $query = $db->query("CALL PR_12_LLENADO_TABLA_PRODUCTOS(?)", [$P_IDUSUARIO]);

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
      /**
       * P_NOMBRE_PRODUCTO
       * P_DESCRIPCION_PROD1
       * P_UNIDAD_MEDIDA
       * P_ID_PROVEEDOR
       * P_ID_USUARIO
       * P_ID_LOTE
       * P_FECHA_VENCIMIENTO
       * P_CANTIDAD
       * P_PRECIO_COMPRA
       * P_PRECIO_VENTA
       * P_FECHA_COMPRA
       */
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

  /**
   * selectProductos()
   * PR_14_SELECT_PRODUCTOS
   */

  public function selectProductos()
  {
    $this->response->setHeader('Access-Control-Allow-Origin', 'http://localhost');
    $this->response->setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    $this->response->setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    $this->response->setHeader('Access-Control-Allow-Credentials', 'true');

    if ($this->request->getMethod() === 'options') {
      return $this->response->setStatusCode(200);
    }

    if ($this->request->getMethod() !== 'POST') {
      return $this->response->setStatusCode(405)->setJSON(['error' => 'Método no permitido.']);
    }

    $json = $this->request->getJSON();

    if (!isset($json->P_IDUSUARIO)) {
      return $this->response->setStatusCode(400)->setJSON(['error' => 'El parámetro P_IDUSUARIO es requerido.']);
    }

    $P_IDUSUARIO = $json->P_IDUSUARIO;

    $db = \Config\Database::connect();

    try {
      $query = $db->query("CALL PR_14_SELECT_PRODUCTOS(?)", [$P_IDUSUARIO]);

      $result = $query->getResultArray();

      /**
       * ID_PRODUCTO,
       * NOMBRE_PRODUCTO,
       * DESCRIPCION_PRODUCTO
       */

      $response = [];
      foreach ($result as $row) {
        $response[] = [
          "ID_PRODUCTO"           => $row['ID_PRODUCTO'],
          "NOMBRE_PRODUCTO"       => $row['NOMBRE_PRODUCTO'],
          "DESCRIPCION_PRODUCTO"  => $row['DESCRIPCION_PRODUCTO'],
        ];
      }

      // $result = $query->getResultArray();

      return $this->respond([
        'success'   => true,
        'response'  => $response
      ]);
    } catch (\Exception $e) {
      return $this->response->setStatusCode(500)->setJSON(['error' => 'Ocurrió un error al procesar la solicitud: ' . $e->getMessage()]);
    }
  }

  /**
   * selectUnidadMedida()
   * PR_15_SELECT_UNIDAD_MEDIDA
   */
  public function selectUnidadMedida()
  {
    $this->response->setHeader('Access-Control-Allow-Origin', 'http://localhost');
    $this->response->setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    $this->response->setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    $this->response->setHeader('Access-Control-Allow-Credentials', 'true');

    if ($this->request->getMethod() === 'options') {
      return $this->response->setStatusCode(200);
    }

    if ($this->request->getMethod() !== 'GET') {
      return $this->response->setStatusCode(405)->setJSON(['error' => 'Método no permitido.']);
    }

    $db = \Config\Database::connect();

    try {
      $query = $db->query('CALL PR_15_SELECT_UNIDAD_MEDIDA');
      $result = $query->getResultArray();

      // resultados de la query al PR
      /**
       * ID_UNIDAD_MEDIDA,
       * DESCRIPCION_UNIDAD
       */
      $response = [];
      foreach ($result as $row) {
        $response[] = [
          "ID_UNIDAD_MEDIDA"    => $row['ID_UNIDAD_MEDIDA'],
          "DESCRIPCION_UNIDAD"  => $row['DESCRIPCION_UNIDAD'],
        ];
      }

      // $result = $query->getResultArray();

      return $this->respond([
        'success'   => true,
        'response'  => $response
      ]);
    } catch (\Exception $e) {
      return $this->response->setStatusCode(500)->setJSON(['error' => 'Ocurrió un error al procesar la solicitud: ' . $e->getMessage()]);
    }
  }

  /**
   * selectProveedores()
   * PR_16_SELECT_PROVEEDORES
   */
  public function selectProveedores()
  {
    $this->response->setHeader('Access-Control-Allow-Origin', 'http://localhost');
    $this->response->setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    $this->response->setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    $this->response->setHeader('Access-Control-Allow-Credentials', 'true');

    if ($this->request->getMethod() === 'options') {
      return $this->response->setStatusCode(200);
    }

    if ($this->request->getMethod() !== 'POST') {
      return $this->response->setStatusCode(405)->setJSON(['error' => 'Método no permitido.']);
    }

    $json = $this->request->getJSON();

    if (!isset($json->P_IDUSUARIO)) {
      return $this->response->setStatusCode(400)->setJSON(['error' => 'El parámetro P_IDUSUARIO es requerido.']);
    }

    $P_IDUSUARIO = $json->P_IDUSUARIO;

    $db = \Config\Database::connect();

    try {
      $query = $db->query("CALL PR_16_SELECT_PROVEEDORES(?)", [$P_IDUSUARIO]);
      $result = $query->getResultArray();

      if ($result) {
        // return $this->respond($result); 
        /**
         * ID_PROVEEDOR,
         * NOMBRE_PROVEEDOR
         */
        $response = [];
        foreach ($result as $row) {
          $response[] = [
            "ID_PROVEEDOR"      => $row['ID_PROVEEDOR'],
            "NOMBRE_PROVEEDOR"  => $row['NOMBRE_PROVEEDOR'],
          ];
        }

        return $this->respond([
          'success'   => true,
          'response'  => $response
        ]);
      } else {
        return $this->failNotFound('No se encontraron proveedores para este usuario.');
      }
    } catch (\Exception $e) {
      return $this->failServerError('Error al procesar la solicitud: ' . $e->getMessage());
    }
  }

  /**
   * nuevoLote()
   * PR_17_NUEVO_LOTE
   * ARREGLAR VALIDACIÓN DESDE EL PROCEDIMIENTO
   */
  public function nuevoLote()
  {
    // Configuración de cabeceras CORS
    $this->response->setHeader('Access-Control-Allow-Origin', 'http://localhost');
    $this->response->setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    $this->response->setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    $this->response->setHeader('Access-Control-Allow-Credentials', 'true');

    // Manejo de preflight request (para solicitudes de opciones CORS)
    if ($this->request->getMethod() === 'options') {
      return $this->response->setStatusCode(200);
    }

    try {
      // Obtener los datos de la petición en formato JSON
      $input = $this->request->getJSON();

      // Verificar si la solicitud es POST
      if ($this->request->getMethod() === 'POST') {
        $db = \Config\Database::connect(); // Conexión a la base de datos

        // Ejecutar el procedimiento almacenado
        $query = $db->query(
          "CALL PR_17_NUEVO_LOTE(?, ?, ?, ?, ?, ?, ?, ?)",
          [
            $input->P_NROLOTE,         // P_NROLOTE
            $input->P_IDPRODUCTO,      // P_IDPRODUCTO
            $input->P_FECHA_VENCIMIENTO, // P_FECHA_VENCIMIENTO
            $input->P_CANTIDAD,         // P_CANTIDAD
            $input->P_PRECIO_COMPRA,    // P_PRECIO_COMPRA
            $input->P_PRECIO_VENTA,     // P_PRECIO_VENTA
            $input->P_FECHA_COMPRA,     // P_FECHA_COMPRA
            $input->P_IDEMPRESA         // P_IDEMPRESA
          ]
        );

        // Obtener el resultado de la validación
        $validationResult = $query->getRowArray();

        // Verificar si el campo VALIDACION está presente en el resultado
        if (!$validationResult || !isset($validationResult['VALIDACION'])) {
          return $this->respond([
            'success' => false,
            'message' => 'No se recibió una respuesta válida del procedimiento almacenado.'
          ]);
        }

        // Manejar los valores de la validación devueltos por el procedimiento almacenado
        switch ($validationResult['VALIDACION']) {
          case 2:
            // Lote creado exitosamente
            return $this->respond([
              'success' => true,
              'message' => 'Lote creado exitosamente.'
            ]);

          case 1:
            // El lote ya existe
            return $this->respond([
              'success' => false,
              'message' => 'El lote ya existe para este producto y empresa.'
            ]);

          default:
            // Error inesperado en la validación
            return $this->respond([
              'success' => false,
              'message' => 'Ocurrió un error al validar la creación del lote.'
            ]);
        }
      } else {
        // Si no es un POST, devolver un error 405 (Método no permitido)
        return $this->response->setStatusCode(405)->setJSON([
          'success' => false,
          'message' => 'Método no permitido'
        ]);
      }
    } catch (\Exception $e) {
      // Manejo de errores del servidor
      return $this->failServerError('Ocurrió un error en el servidor: 🔴 ' . $e->getMessage());
    }
  }
}
