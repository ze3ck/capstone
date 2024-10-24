<?php

namespace App\Controllers\API;

use CodeIgniter\RESTful\ResourceController;

class Proveedores extends ResourceController
{

  /**
   * selectProveedor()
   * PR_16_SELECT_PROVEEDORES
   */
  public function selectProveedor()
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
        $query = $db->query("CALL PR_16_SELECT_PROVEEDORES(?)", [$P_IDUSUARIO]);

        // Obtener los resultados como un array
        $result = $query->getResultArray();

        // Verificar si hay resultados
        if (empty($result)) {
          return $this->response->setStatusCode(404)->setJSON(['message' => 'No se encontraron proveedores para este usuario.']);
        }

        // Procesar los resultados
        $response = [];
        foreach ($result as $row) {
          $response[] = [
            "ID_PROVEEDOR"           => $row['ID_PROVEEDOR'],
            "NOMBRE_PROVEEDOR"       => $row['NOMBRE_PROVEEDOR']

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
   * llenadoTablaProv()
   * PR_33_LLENADO_TABLA_PROVEEDORES
   */
  public function llenadoTablaProv()
  {
    // Permitir CORS
    $this->response->setHeader('Access-Control-Allow-Origin', 'http://localhost');
    $this->response->setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    $this->response->setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    $this->response->setHeader('Access-Control-Allow-Credentials', 'true');

    if ($this->request->getMethod() === 'options') {
      return $this->response->setStatusCode(200);
    }

    if ($this->request->getMethod() === 'POST') {
      $json = $this->request->getJSON();

      if (!isset($json->P_IDUSUARIO) || !is_numeric($json->P_IDUSUARIO)) {
        return $this->response->setStatusCode(400)->setJSON(['error' => 'ID del usuario no asignado o es inválido 🟡']);
      }

      $P_IDUSUARIO = $json->P_IDUSUARIO;

      try {
        $db = \Config\Database::connect();

        $query = $db->query("CALL PR_33_LLENADO_TABLA_PROVEEDORES(?)", [$P_IDUSUARIO]);

        $result = $query->getResultArray();

        if (empty($result)) {
          return $this->response->setStatusCode(404)->setJSON(['message' => 'No se proveedores para este usuario.']);
        }

        // ID_PROVEEDOR,
        // NOMBRE_PROVEEDOR,
        // NOMBRE_CONTACTO,
        // TELEFONO_CONTACTO,
        // EMAIL_CONTACTO,
        // CALLE,
        // NUMERO,
        // NOMBRE_CIUDAD,
        // ID_ESTADO
        $response = [];
        foreach ($result as $row) {
          $response[] = [
            "ID_PROVEEDOR"      => $row['ID_PROVEEDOR'],
            "NOMBRE_PROVEEDOR"  => $row['NOMBRE_PROVEEDOR'],
            "NOMBRE_CONTACTO"   => $row['NOMBRE_CONTACTO'],
            "TELEFONO_CONTACTO" => $row['TELEFONO_CONTACTO'],
            "EMAIL_CONTACTO"    => $row['EMAIL_CONTACTO'],
            "CALLE"             => $row['CALLE'],
            "NUMERO"            => $row['NUMERO'],
            "NOMBRE_CIUDAD"     => $row['NOMBRE_CIUDAD'],
            "ID_ESTADO"         => $row['ID_ESTADO'],
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
   * llenadoTablaProv()
   * PR_35_SELECT_CONTACTO
   */
  public function selectContacto()
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
        $query = $db->query("CALL PR_35_SELECT_CONTACTO(?)", [$P_IDUSUARIO]);

        // Obtener los resultados como un array
        $result = $query->getResultArray();

        // Verificar si hay resultados
        if (empty($result)) {
          return $this->response->setStatusCode(404)->setJSON(['message' => 'No se encontraron proveedores para este usuario.']);
        }

        // Procesar los resultados
        $response = [];
        foreach ($result as $row) {
          $response[] = [
            "NOMBRE_CONTACTO"  => $row['NOMBRE_CONTACTO']
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


}
