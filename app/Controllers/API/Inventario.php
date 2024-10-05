<?php

namespace App\Controllers\API;

use CodeIgniter\RESTful\ResourceController;
use Config\Database;

class Inventario extends ResourceController
{

  /**
   * llenadoMovimiento()
   */


  public function llenadoMovimiento()
  {
    $this->response->setHeader('Access-Control-Allow-Origin', 'https://localhost');
    $this->response->setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    $this->response->setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    $this->response->setHeader('Access-Control-Allow-Credentials', 'true');

    if ($this->request->getMethod() === 'options') {
      return $this->response->setStatusCode(200);
    }

    if ($this->request->getMethod() === 'POST') {
      $json = $this->request->getJSON();

      if (!isset($json->P_IDUSUARIO) || !is_numeric($json->P_IDUSUARIO)) {
        return $this->response->setStatusCode(400)->setJSON(['error' => 'Falta el ID del usuario o es inválido']);
      }

      $P_IDUSUARIO = $json->P_IDUSUARIO;

      try {
        $db = \Config\Database::connect();

        $query = $db->query("CALL PR_10_LLENADO_MOVIMIENTOS(?)", [$P_IDUSUARIO]);

        $result = $query->getResultArray();

        if (empty($result)) {
          return $this->response->setStatusCode(404)->setJSON(['message' => 'No se encontraron movimientos para este usuario.']);
        }

        return $this->response->setStatusCode(200)->setJSON($result);
      } catch (\Exception $e) {
        return $this->response->setStatusCode(500)->setJSON(['error' => 'Ocurrió un error al procesar la solicitud: ' . $e->getMessage()]);
      }
    }

    return $this->response->setStatusCode(405)->setJSON(['error' => 'Método no permitido']);
  }
}
