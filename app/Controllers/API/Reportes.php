<?php

namespace App\Controllers\API;

use App\Models\UsuarioModel;
use CodeIgniter\RESTful\ResourceController;
use Config\Database;

class Reportes extends ResourceController
{

  /**
   * datosLotes()
   * PR_43_DATOS_LOTES
   */
  public function datosLotes()
  {
    // Configurar las cabeceras CORS
    $this->response->setHeader('Access-Control-Allow-Origin', 'http://localhost');
    $this->response->setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    $this->response->setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    $this->response->setHeader('Access-Control-Allow-Credentials', 'true');

    if ($this->request->getMethod() === 'options') {
      return $this->response->setStatusCode(200);
    }

    if ($this->request->getMethod() === 'POST') {
      $json = $this->request->getJSON();

      // Validar los parámetros requeridos
      if (!isset($json->P_IDPRODUCTO) || !isset($json->P_IDLOTE)) {
        return $this->response->setStatusCode(400)->setJSON([
          'error' => 'Los parámetros P_IDPRODUCTO y P_IDLOTE son requeridos.'
        ]);
      }

      try {
        $P_IDPRODUCTO = $json->P_IDPRODUCTO;
        $P_IDLOTE = $json->P_IDLOTE;

        $db = \Config\Database::connect();

        $query = $db->query("CALL PR_43_DATOS_LOTES(?, ?)", [$P_IDPRODUCTO, $P_IDLOTE]);

        $result = $query->getResultArray();

        if (empty($result)) {
          return $this->response->setStatusCode(404)->setJSON([
            'message' => 'No se encontraron datos para el lote y producto especificados.'
          ]);
        }

        $response = [];
        foreach ($result as $row) {
          $response[] = [
            "CANTIDAD"          => $row['CANTIDAD'],
            "PRECIO_COMPRA"     => $row['PRECIO_COMPRA'],
            "PRECIO_VENTA"      => $row['PRECIO_VENTA'],
            "FECHA_VENCIMIENTO" => $row['FECHA_VENCIMIENTO'],
            "FECHA_COMPRA"      => $row['FECHA_COMPRA']
          ];
        }

        return $this->respond([
          'success'  => true,
          'response' => $response
        ]);
      } catch (\Exception $e) {
        return $this->response->setStatusCode(500)->setJSON([
          'error' => 'Ocurrió un error al procesar la solicitud: ' . $e->getMessage()
        ]);
      }
    }

    return $this->response->setStatusCode(405)->setJSON([
      'error' => 'Método no permitido. Usa POST.'
    ]);
  }

  /**
   * tablaNiveles()
   * PR_44_TABLA_NIVELES
   */
  public function tablaNiveles()
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

      // Validar el parámetro requerido P_IDUSUARIO
      if (!isset($json->P_IDUSUARIO)) {
        return $this->response->setStatusCode(400)->setJSON([
          'error' => 'El parámetro P_IDUSUARIO es requerido.'
        ]);
      }

      try {
        $P_IDUSUARIO = $json->P_IDUSUARIO;

        $db = \Config\Database::connect();

        $query = $db->query("CALL PR_44_TABLA_NIVELES(?)", [$P_IDUSUARIO]);

        $result = $query->getResultArray();

        if (empty($result)) {
          return $this->response->setStatusCode(404)->setJSON([
            'message' => 'No se encontraron niveles para los productos del usuario especificado.'
          ]);
        }

        $response = [];
        foreach ($result as $row) {
          $response[] = [
            "ID_PRODUCTO"     => $row['ID_PRODUCTO'],
            "NOMBRE_PRODUCTO" => $row['NOMBRE_PRODUCTO'],
            "CANTIDAD"        => $row['CANTIDAD'],
            "ESTADO"          => $row['ESTADO'],
            "IDEAL"           => $row['IDEAL']
          ];
        }

        return $this->respond([
          'success'  => true,
          'response' => $response
        ]);
      } catch (\Exception $e) {
        return $this->response->setStatusCode(500)->setJSON([
          'error' => 'Ocurrió un error al procesar la solicitud: ' . $e->getMessage()
        ]);
      }
    }

    return $this->response->setStatusCode(405)->setJSON([
      'error' => 'Método no permitido. Usa POST.'
    ]);
  }

  /**
   * reporteMovimientos()
   * PR_45_REPORTE_MOVIMIENTOS
   * */
  public function reporteMovimientos()
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
        return $this->response->setStatusCode(400)->setJSON([
          'error' => 'El parámetro P_IDUSUARIO es requerido.'
        ]);
      }

      try {
        $P_IDUSUARIO = $json->P_IDUSUARIO;

        $db = \Config\Database::connect();

        $query = $db->query("CALL PR_45_REPORTE_MOVIMIENTOS(?)", [$P_IDUSUARIO]);

        $result = $query->getResultArray();

        if (empty($result)) {
          return $this->response->setStatusCode(404)->setJSON([
            'message' => 'No se encontraron movimientos para los productos del usuario especificado.'
          ]);
        }

        $response = [];
        foreach ($result as $row) {
          $response[] = [
            "ID_PRODUCTO"     => $row['ID_PRODUCTO'],
            "NOMBRE_PRODUCTO" => $row['NOMBRE_PRODUCTO'],
            "NUM_MOVIMIENTOS" => $row['NUM_MOVIMIENTOS'],
            "ESTADO"          => $row['ESTADO']
          ];
        }

        return $this->respond([
          'success'  => true,
          'response' => $response
        ]);
      } catch (\Exception $e) {
        // Manejo de errores
        return $this->response->setStatusCode(500)->setJSON([
          'error' => 'Ocurrió un error al procesar la solicitud: ' . $e->getMessage()
        ]);
      }
    }

    return $this->response->setStatusCode(405)->setJSON([
      'error' => 'Método no permitido. Usa POST.'
    ]);
  }

  /**
   * topGanancias()
   * PR_46_TOP_GANANCIAS
   * */
  public function topGanancias()
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
        return $this->response->setStatusCode(400)->setJSON([
          'error' => 'El parámetro P_IDUSUARIO es requerido.'
        ]);
      }

      try {
        $P_IDUSUARIO = $json->P_IDUSUARIO;

        $db = \Config\Database::connect();

        $query = $db->query("CALL PR_46_TOP_GANANCIAS(?)", [$P_IDUSUARIO]);

        $result = $query->getResultArray();

        if (empty($result)) {
          return $this->response->setStatusCode(404)->setJSON([
            'message' => 'No se encontraron productos con ganancias para el usuario especificado.'
          ]);
        }

        $response = [];
        foreach ($result as $row) {
          $response[] = [
            "NOMBRE_PRODUCTO" => $row['NOMBRE_PRODUCTO'],
            "GANANCIA"        => $row['GANANCIA']
          ];
        }

        return $this->respond([
          'success'  => true,
          'response' => $response
        ]);
      } catch (\Exception $e) {
        return $this->response->setStatusCode(500)->setJSON([
          'error' => 'Ocurrió un error al procesar la solicitud: ' . $e->getMessage()
        ]);
      }
    }

    return $this->response->setStatusCode(405)->setJSON([
      'error' => 'Método no permitido. Usa POST.'
    ]);
  }


  /**
   * topVentas()
   * PR_47_TOP_VENTAS
   * */
  public function topVentas()
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
        return $this->response->setStatusCode(400)->setJSON([
          'error' => 'El parámetro P_IDUSUARIO es requerido.'
        ]);
      }

      try {
        $P_IDUSUARIO = $json->P_IDUSUARIO;

        $db = \Config\Database::connect();

        $query = $db->query("CALL PR_47_TOP_VENTAS(?)", [$P_IDUSUARIO]);

        $result = $query->getResultArray();

        if (empty($result)) {
          return $this->response->setStatusCode(404)->setJSON([
            'message' => 'No se encontraron productos con ventas para el usuario especificado.'
          ]);
        }

        $response = [];
        foreach ($result as $row) {
          $response[] = [
            "NOMBRE_PRODUCTO" => $row['NOMBRE_PRODUCTO'],
            "CANTIDAD"        => $row['CANTIDAD']
          ];
        }

        return $this->respond([
          'success'  => true,
          'response' => $response
        ]);
      } catch (\Exception $e) {
        return $this->response->setStatusCode(500)->setJSON([
          'error' => 'Ocurrió un error al procesar la solicitud: ' . $e->getMessage()
        ]);
      }
    }

    return $this->response->setStatusCode(405)->setJSON([
      'error' => 'Método no permitido. Usa POST.'
    ]);
  }

  /**
   * gananciasTotales()
   * PR_48_GANANCIAS_TOTALES
   * */
  public function gananciasTotales()
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
        return $this->response->setStatusCode(400)->setJSON([
          'error' => 'El parámetro P_IDUSUARIO es requerido.'
        ]);
      }

      try {
        $P_IDUSUARIO = $json->P_IDUSUARIO;

        $db = \Config\Database::connect();

        $query = $db->query("CALL PR_48_GANANCIAS_TOTALES(?)", [$P_IDUSUARIO]);

        $result = $query->getResultArray();

        if (empty($result)) {
          return $this->response->setStatusCode(404)->setJSON([
            'message' => 'No se encontraron ganancias totales para el usuario especificado.'
          ]);
        }

        $response = [];
        foreach ($result as $row) {
          $response[] = [
            "GANANCIA" => $row['GANANCIA']
          ];
        }

        return $this->respond([
          'success'  => true,
          'response' => $response
        ]);
      } catch (\Exception $e) {
        return $this->response->setStatusCode(500)->setJSON([
          'error' => 'Ocurrió un error al procesar la solicitud: ' . $e->getMessage()
        ]);
      }
    }

    return $this->response->setStatusCode(405)->setJSON([
      'error' => 'Método no permitido. Usa POST.'
    ]);
  }



  /**
   * totalVentas()
   * PR_49_TOTAL_VENTAS
   * */
  public function totalVentas()
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
        return $this->response->setStatusCode(400)->setJSON([
          'error' => 'El parámetro P_IDUSUARIO es requerido.'
        ]);
      }

      try {
        $P_IDUSUARIO = $json->P_IDUSUARIO;

        $db = \Config\Database::connect();

        $query = $db->query("CALL PR_49_TOTAL_VENTAS(?)", [$P_IDUSUARIO]);

        $result = $query->getRowArray();

        if (empty($result) || $result['VENTA'] === null) {
          return $this->response->setStatusCode(404)->setJSON([
            'message' => 'No se encontraron ventas totales para el usuario especificado.'
          ]);
        }

        $response = [
          "VENTA" => $result['VENTA']
        ];

        return $this->respond([
          'success'  => true,
          'response' => $response
        ]);
      } catch (\Exception $e) {
        return $this->response->setStatusCode(500)->setJSON([
          'error' => 'Ocurrió un error al procesar la solicitud: ' . $e->getMessage()
        ]);
      }
    }

    return $this->response->setStatusCode(405)->setJSON([
      'error' => 'Método no permitido. Usa POST.'
    ]);
  }

  /**
   * ventasPorUsuario()
   * PR_50_VENTAS_POR_USUARIO
   */
  public function ventasPorUsuario()
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
        return $this->response->setStatusCode(400)->setJSON([
          'error' => 'El parámetro P_IDUSUARIO es requerido.'
        ]);
      }

      try {
        $P_IDUSUARIO = $json->P_IDUSUARIO;

        $db = \Config\Database::connect();

        $query = $db->query("CALL PR_50_VENTAS_POR_USUARIO(?)", [$P_IDUSUARIO]);

        $result = $query->getResultArray();

        if (empty($result)) {
          return $this->response->setStatusCode(404)->setJSON([
            'message' => 'No se encontraron ventas para el usuario especificado.'
          ]);
        }

        $response = [];
        foreach ($result as $row) {
          $response[] = [
            "NOMBRE"   => $row['NOMBRE'],
            "APELLIDO" => $row['APELLIDO'],
            "VENTA"    => $row['VENTA']
          ];
        }

        return $this->respond([
          'success'  => true,
          'response' => $response
        ]);
      } catch (\Exception $e) {
        return $this->response->setStatusCode(500)->setJSON([
          'error' => 'Ocurrió un error al procesar la solicitud: ' . $e->getMessage()
        ]);
      }
    }

    return $this->response->setStatusCode(405)->setJSON([
      'error' => 'Método no permitido. Usa POST.'
    ]);
  }

  /**
   * reporteMermas()
   * PR_51_REPORTE_MERMAS
   */
  public function reporteMermas()
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
        return $this->response->setStatusCode(400)->setJSON([
          'error' => 'El parámetro P_IDUSUARIO es requerido.'
        ]);
      }

      try {
        $P_IDUSUARIO = $json->P_IDUSUARIO;

        $db = \Config\Database::connect();

        $query = $db->query("CALL PR_51_REPORTE_MERMAS(?)", [$P_IDUSUARIO]);

        $result = $query->getResultArray();

        if (empty($result)) {
          return $this->response->setStatusCode(404)->setJSON([
            'message' => 'No se encontraron mermas para el usuario especificado.'
          ]);
        }

        $response = [];
        foreach ($result as $row) {
          $response[] = [
            "ID_PRODUCTO"       => $row['ID_PRODUCTO'],
            "ID_LOTE"           => $row['ID_LOTE'],
            "NOMBRE_PRODUCTO"   => $row['NOMBRE_PRODUCTO'],
            "CANTIDAD_MERMA"    => $row['CANTIDAD_VENCIDA'] ?? $row['CANTIDAD'], // Cantidad puede venir de productos_vencidos o productos_merma
            "FECHA_VENCIMIENTO" => $row['FECHA_VENCIMIENTO'],
            "COSTO_MERMA"       => $row['COSTO_MERMA'],
            "RAZON_MERMA"       => $row['RAZON_MERMA'] ?? $row['DESCRIPCION_RAZON'] // Razon puede venir de diferentes tablas
          ];
        }

        return $this->respond([
          'success'  => true,
          'response' => $response
        ]);
      } catch (\Exception $e) {
        return $this->response->setStatusCode(500)->setJSON([
          'error' => 'Ocurrió un error al procesar la solicitud: ' . $e->getMessage()
        ]);
      }
    }

    return $this->response->setStatusCode(405)->setJSON([
      'error' => 'Método no permitido. Usa POST.'
    ]);
  }
}
