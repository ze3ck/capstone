<?php

namespace App\Controllers\API;

use CodeIgniter\RESTful\ResourceController;

class Movimientos extends ResourceController
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
          return $this->response->setStatusCode(404)->setJSON(['message' => 'No se encontraron movimientos para: ' . $P_IDMOVIMIENTO]);
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
   * selectCatMovimiento()
   * PR_19_SELECT_CATEGORIA_MOVIMIENTO
   */
  public function selectCatMovimiento()
  {
    $this->response->setHeader('Access-Control-Allow-Origin', 'http://localhost');
    $this->response->setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    $this->response->setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    $this->response->setHeader('Access-Control-Allow-Credentials', 'true');

    if ($this->request->getMethod() === 'options') {
      return $this->response->setStatusCode(200);
    }

    if ($this->request->getMethod() === 'GET') {
      $json = $this->request->getJSON();

      try {
        // Conectar a la base de datos
        $db = \Config\Database::connect();

        // Ejecutar el procedimiento almacenado con el ID del usuario
        $query = $db->query("CALL PR_19_SELECT_CATEGORIA_MOVIMIENTO()");

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
            "ID_CATEGORIA" => $row['ID_CATEGORIA'],
            "DESCRIPCION"  => $row['DESCRIPCION'],
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
  }
  /**
   * selectRespoinsables()
   * PR_21_SELECT_RESPONSABLES
   */
  public function selectResponsables()
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
      // Validar que el ID de usuario exista y sea numérico
      if (!isset($json->P_IDUSUARIO) || !is_numeric($json->P_IDUSUARIO)) {
        return $this->response->setStatusCode(400)->setJSON(['error' => 'Falta el P_IDUSUARIO o es inválido']);
      }

      $P_IDUSUARIO = $json->P_IDUSUARIO;
      try {
        // Conectar a la base de datos
        $db = \Config\Database::connect();

        // Ejecutar el procedimiento almacenado con el ID del usuario
        $query = $db->query("CALL PR_21_SELECT_RESPONSABLES(?)", [$P_IDUSUARIO]);

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
            "ID_USUARIO" => $row['ID_USUARIO'],
            "NOMBRE"  => $row['NOMBRE'],
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
  }


  /**
   * selectCatGastoOperativoMovimiento()
   * PR_22_SELECT_CATGASTOOPERACIONAL
   */
  public function selectCatGastoOperativoMovimiento()
  {
    $this->response->setHeader('Access-Control-Allow-Origin', 'http://localhost');
    $this->response->setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    $this->response->setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    $this->response->setHeader('Access-Control-Allow-Credentials', 'true');

    if ($this->request->getMethod() === 'options') {
      return $this->response->setStatusCode(200);
    }

    if ($this->request->getMethod() === 'GET') {
      $json = $this->request->getJSON();

      try {
        // Conectar a la base de datos
        $db = \Config\Database::connect();

        // Ejecutar el procedimiento almacenado con el ID del usuario
        $query = $db->query("CALL PR_22_SELECT_CATGASTOOPERACIONAL()");

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
            "DESCRIPCION_CATEGORIA" => $row['DESCRIPCION_CATEGORIA']
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
  }

  /**
   * Generar Gastooperativo()
   * PR_23_NUEVO_GASTO_OPERACIONAL
   */
  public function generarGastoOperativo()
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
      // Validar que el ID de usuario exista y sea numérico
      if (!isset($json->P_DESCRIPCION) || is_numeric($json->P_DESCRIPCION)) {
        return $this->response->setStatusCode(400)->setJSON(['error' => 'Falta el P_DESCRIPCION o es inválido']);
      }
      if (!isset($json->P_MONTO) || !is_numeric($json->P_MONTO)) {
        return $this->response->setStatusCode(400)->setJSON(['error' => 'Falta el P_MONTO o es inválido']);
      }
      if (!isset($json->P_CATEGORIA) || is_numeric($json->P_CATEGORIA)) {
        return $this->response->setStatusCode(400)->setJSON(['error' => 'Falta el P_CATEGORIA o es inválido']);
      }
      if (!isset($json->P_IDUSUARIO) || !is_numeric($json->P_IDUSUARIO)) {
        return $this->response->setStatusCode(400)->setJSON(['error' => 'Falta el P_IDUSUARIO o es inválido']);
      }

      $P_DESCRIPCION = $json->P_DESCRIPCION;
      $P_MONTO = $json->P_MONTO;
      $P_CATEGORIA = $json->P_CATEGORIA;
      $P_IDUSUARIO = $json->P_IDUSUARIO;

      try {
        // Conectar a la base de datos
        $db = \Config\Database::connect();

        // Ejecutar el procedimiento almacenado con el ID del usuario
        $query = $db->query("CALL PR_23_NUEVO_GASTO_OPERACIONAL(?,?,?,?)", [$P_DESCRIPCION, $P_MONTO, $P_CATEGORIA, $P_IDUSUARIO]);

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
            "VALIDACION" => $row['VALIDACION']
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

    if ($this->request->getMethod() === 'POST') {
      $json = $this->request->getJSON();
      // Validar que el ID de usuario exista y sea numérico
      if (!isset($json->P_IDUSUARIO) || !is_numeric($json->P_IDUSUARIO)) {
        return $this->response->setStatusCode(400)->setJSON(['error' => 'Falta el P_IDUSUARIO o es inválido']);
      }

      $P_IDUSUARIO = $json->P_IDUSUARIO;
      try {
        // Conectar a la base de datos
        $db = \Config\Database::connect();

        // Ejecutar el procedimiento almacenado con el ID del usuario
        $query = $db->query("CALL PR_14_SELECT_PRODUCTOS(?)", [$P_IDUSUARIO]);

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
            "ID_PRODUCTO" => $row['ID_PRODUCTO'],
            "NOMBRE_PRODUCTO"  => $row['NOMBRE_PRODUCTO'],
            "DESCRIPCION_PRODUCTO"  => $row['DESCRIPCION_PRODUCTO'],
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
  }

  /**
   * selectRespoinsables()
   * PR_24_CANTIDAD_TOTAL_PRODUCTO
   */
  public function cant_total()
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
      // Validar que el ID de usuario exista y sea numérico
      if (!isset($json->P_PRODUCTO) || !is_numeric($json->P_PRODUCTO)) {
        return $this->response->setStatusCode(400)->setJSON(['error' => 'Falta el P_PRODUCTO o es inválido']);
      }
      if (!isset($json->P_IDUSUARIO) || !is_numeric($json->P_IDUSUARIO)) {
        return $this->response->setStatusCode(400)->setJSON(['error' => 'Falta el P_IDUSUARIO o es inválido']);
      }

      $P_PRODUCTO = $json->P_PRODUCTO;
      $P_IDUSUARIO = $json->P_IDUSUARIO;

      try {
        // Conectar a la base de datos
        $db = \Config\Database::connect();

        // Ejecutar el procedimiento almacenado con el ID del usuario
        $query = $db->query("CALL PR_24_CANTIDAD_TOTAL_PRODUCTO(?,?)", [$P_PRODUCTO, $P_IDUSUARIO]);

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
            "CANTIDAD" => $row['CANTIDAD'],
            "PRECIO_VENTA" => $row['PRECIO_VENTA'],

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
  }

  /**
   * PR_26_SALIDA_MERMA_PRODUCTOS_USUARIO
   * salidaMermaProductos
   */
  public function salidaMermaProductos()
  {
    // Configurar los encabezados CORS
    $this->response->setHeader('Access-Control-Allow-Origin', 'http://localhost');
    $this->response->setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    $this->response->setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    $this->response->setHeader('Access-Control-Allow-Credentials', 'true');

    // Manejar solicitudes de tipo OPTIONS (preflight request)
    if ($this->request->getMethod() === 'options') {
      return $this->response->setStatusCode(200);
    }

    // Manejar la solicitud POST
    if ($this->request->getMethod() === 'POST') {
      // Obtener los datos JSON enviados
      $json = $this->request->getJSON();

      // Validar que el ID de usuario y el ID de producto existan y sean numéricos
      if (!isset($json->P_IDUSUARIO) || !is_numeric($json->P_IDUSUARIO)) {
        return $this->response->setStatusCode(400)->setJSON(['error' => 'Falta el P_IDUSUARIO o es inválido']);
      }

      if (!isset($json->P_IDPRODUCTO) || !is_numeric($json->P_IDPRODUCTO)) {
        return $this->response->setStatusCode(400)->setJSON(['error' => 'Falta el P_IDPRODUCTO o es inválido']);
      }

      // Asignar los valores de usuario y producto a las variables
      $P_IDUSUARIO = $json->P_IDUSUARIO;
      $P_IDPRODUCTO = $json->P_IDPRODUCTO;

      try {
        // Conectar a la base de datos
        $db = \Config\Database::connect();

        // Ejecutar el procedimiento almacenado con los parámetros de usuario y producto
        $query = $db->query("CALL PR_26_SALIDA_MERMA_PRODUCTOS_USUARIO(?, ?)", [$P_IDUSUARIO, $P_IDPRODUCTO]);

        // Obtener los resultados como un array
        $result = $query->getResultArray();

        // Verificar si se encontraron resultados
        if (empty($result)) {
          return $this->response->setStatusCode(404)->setJSON(['message' => 'No se encontraron lotes para este producto y usuario, o el producto no está activo o ha caducado.']);
        }

        // Procesar los resultados
        $response = [];
        foreach ($result as $row) {
          $response[] = [
            "ID_LOTE"           => $row['ID_LOTE'],
            "ID_PRODUCTO"       => $row['ID_PRODUCTO'],
            "NOMBRE_PRODUCTO"   => $row['NOMBRE_PRODUCTO'],
            "FECHA_VENCIMIENTO" => $row['FECHA_VENCIMIENTO'],
            "CANTIDAD"          => $row['CANTIDAD'],
          ];
        }

        // Devolver los resultados procesados como JSON
        return $this->respond([
          'success' => true,
          'response' => $response
        ]);
      } catch (\Exception $e) {
        // Manejar excepciones en la base de datos
        return $this->response->setStatusCode(500)->setJSON(['error' => 'Ocurrió un error al procesar la solicitud: ' . $e->getMessage()]);
      }
    }
  }

  /**
   * obtenerRazonesMerma()
   * PR_27_OBTENER_RAZONES_MERMA
   */
  public function obtenerRazonesMerma()
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
      $query = $db->query("CALL PR_27_OBTENER_RAZONES_MERMA()");

      $result = $query->getResultArray();

      if (empty($result)) {
        return $this->response->setStatusCode(404)->setJSON(['message' => 'No se encontraron razones de merma.']);
      }

      $response = [];
      foreach ($result as $row) {
        $response[] = [
          "ID_RAZON_MERMA" => $row['ID_RAZON_MERMA'],
          "DESCRIPCION_RAZON" => $row['DESCRIPCION_RAZON'],
        ];
      }

      return $this->respond([
        'success' => true,
        'response' => $response
      ]);
    } catch (\Exception $e) {
      return $this->response->setStatusCode(500)->setJSON(['error' => 'Ocurrió un error al procesar la solicitud: ' . $e->getMessage()]);
    }
  }

  /**
   * PR_30_OBTENER_PRECIO_COMPRA_LOTE
   * obtenerPrecioCompraLote()
   */

  public function obtenerPrecioCompraLote()
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

    if (!isset($json->ID_LOTE)) {
      return $this->response->setStatusCode(400)->setJSON(['error' => 'ID_LOTE es requerido']);
    }

    $id_lote = $json->ID_LOTE;

    $db = \Config\Database::connect();

    try {
      // Llamada al procedimiento almacenado PR_OBTENER_PRECIO_COMPRA_LOTE
      $query = $db->query("CALL PR_30_OBTENER_PRECIO_COMPRA_LOTE(?)", [$id_lote]);
      $result = $query->getRowArray();

      if (!$result) {
        return $this->response->setStatusCode(404)->setJSON(['message' => 'Lote no encontrado']);
      }

      return $this->respond([
        'success' => true,
        'PRECIO_COMPRA' => $result['PRECIO_COMPRA']
      ]);
    } catch (\Exception $e) {
      return $this->response->setStatusCode(500)->setJSON(['error' => 'Error al procesar la solicitud: ' . $e->getMessage()]);
    }
  }


  /**
   * PR_31_OBTENER_COSTO_MERMA
   * obtenerCostoMerma()
   */
  public function obtenerCostoMerma()
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

    if (!isset($json->ID_LOTE) || !isset($json->ID_PRODUCTO)) {
      return $this->response->setStatusCode(400)->setJSON(['error' => 'ID_LOTE y ID_PRODUCTO son requeridos']);
    }

    $id_lote = $json->ID_LOTE;
    $id_producto = $json->ID_PRODUCTO;

    $db = \Config\Database::connect();

    try {
      // Consulta para obtener el costo de merma
      $query = $db->query("CALL PR_31_OBTENER_COSTO_MERMA(?,?)", [$id_lote, $id_producto]);
      $result = $query->getRowArray();

      if (!$result) {
        return $this->response->setStatusCode(404)->setJSON(['message' => 'No se encontró el PRECIO_COMPRA de merma para el lote y producto seleccionados']);
      }

      return $this->respond([
        'success' => true,
        'PRECIO_COMPRA' => $result['PRECIO_COMPRA']
      ]);
    } catch (\Exception $e) {
      return $this->response->setStatusCode(500)->setJSON(['error' => 'Error al procesar la solicitud: ' . $e->getMessage()]);
    }
  }

  /**
   * guardarMerma()
   * PR_32_GUARDAR_MERMA
   */
  public function guardarMerma()
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
        !isset($json->p_id_lote) || !isset($json->p_id_producto) ||
        !isset($json->p_cantidad) || !isset($json->p_razon) ||
        !isset($json->p_descripcion) || !isset($json->p_costo_merma)
      ) {
        return $this->response->setStatusCode(400)->setJSON(['error' => 'Faltan parámetros requeridos.']);
      }

      $db = \Config\Database::connect();

      try {
        $db->transBegin();

        $db->query("CALL PR_32_GUARDAR_MERMA(?, ?, ?, ?, ?, ?)", [
          $json->p_id_lote,
          $json->p_id_producto,
          $json->p_cantidad,
          $json->p_razon,
          $json->p_descripcion,
          $json->p_costo_merma
        ]);

        if ($db->transStatus() === false) {
          $db->transRollback();
          return $this->response->setStatusCode(500)->setJSON(['error' => 'Error al registrar la merma en la base de datos.']);
        } else {
          $db->transCommit();
          return $this->response->setStatusCode(200)->setJSON([
            'success' => true,
            'message' => 'Merma registrada correctamente.'
          ]);
        }
      } catch (\Exception $e) {
        $db->transRollback();
        return $this->response->setStatusCode(500)->setJSON(['error' => 'Ocurrió un error al procesar la solicitud: ' . $e->getMessage()]);
      }
    }

    return $this->response->setStatusCode(405)->setJSON(['error' => 'Método no permitido.']);
  }

  public function GenerarMovimientoCompleto()
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
        $idUsuario = $json->P_IDUSUARIO;
        $tipoPago = $json->P_ID_TIPOPAGO;
        $detalles = $json->Detalles;

        try {
            // Conectar a la base de datos
            $db = \Config\Database::connect();
            $db->transStart(); // Iniciar una transacción para garantizar atomicidad

            // Llamar al procedimiento PR_28_INSERTAR_MOVIMIENTO
            $db->query("CALL PR_28_INSERTAR_MOVIMIENTO($idUsuario, $tipoPago, @P_ID_MOVIMIENTO)");
            
            // Obtener el ID del movimiento generado
            $query = $db->query("SELECT @P_ID_MOVIMIENTO as P_ID_MOVIMIENTO");
            $result = $query->getRowArray();
            if (!$result) {
                $db->transRollback(); // Revertir la transacción si falla
                return $this->response->setStatusCode(500)->setJSON(['error' => 'No se pudo generar el movimiento.']);
            }

            $idMovimiento = $result['P_ID_MOVIMIENTO'];

            // Ahora procesar cada detalle de los productos con el procedimiento PR_29_INSERTAR_DETALLE_MOVIMIENTO
            foreach ($detalles as $detalle) {
                $idProducto = $detalle->P_ID_PRODUCTO;
                $cantidadTotal = $detalle->P_CANTIDAD_TOTAL;
                $precio = $detalle->P_PRECIO;
                $descuento = $detalle->P_DESCUENTO;

                // Llamar al procedimiento para insertar el detalle del movimiento
                $db->query("CALL PR_29_INSERTAR_DETALLE_MOVIMIENTO($idMovimiento, $idProducto, $cantidadTotal, $precio, $idUsuario, $descuento)");
            }

            // Confirmar la transacción si todo ha ido bien
            $db->transComplete();

            if ($db->transStatus() === FALSE) {
                // Si algo falló, revertir la transacción
                return $this->response->setStatusCode(500)->setJSON(['error' => 'Error al procesar la transacción.']);
            }

            // Responder con éxito si todo fue correcto
            return $this->respond([
                'success' => true,
                'P_ID_MOVIMIENTO' => $idMovimiento,
                'message' => 'Movimiento y detalles generados exitosamente.'
            ]);

        } catch (\Exception $e) {
            // Si ocurre una excepción, revertir la transacción
            $db->transRollback();
            return $this->response->setStatusCode(500)->setJSON(['error' => 'Error al procesar la solicitud: ' . $e->getMessage()]);
        }
    }
}



}
