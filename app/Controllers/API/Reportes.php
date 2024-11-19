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
}
