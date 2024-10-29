<?php

namespace App\Controllers\API;

use CodeIgniter\RESTful\ResourceController;

class Proveedores extends ResourceController
{

  /**
   * selectProveedor()
   * PR_37_SELECT_PRODUCTOS_FILTRO
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
        $query = $db->query("CALL PR_37_SELECT_PRODUCTOS_FILTRO(?)", [$P_IDUSUARIO]);

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

  /**
   * actualizarEstadoProv()
   * PR_36_ACTUALIZAR_ESTADO_PROVEEDOR
   */
  public function actualizarEstadoProv()
  {
    $this->response->setHeader('Access-Control-Allow-Origin', 'http://localhost');
    $this->response->setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    $this->response->setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    $this->response->setHeader('Access-Control-Allow-Credentials', 'true');

    if ($this->request->getMethod() === 'options') {
      return $this->response->setStatusCode(200);
    }

    try {
      $input = $this->request->getJSON();

      if ($this->request->getMethod() === 'POST') {
        $db = \Config\Database::connect();

        $query = $db->query(
          "CALL PR_36_ACTUALIZAR_ESTADO_PROVEEDOR(?, ?)",
          [
            $input->P_IDPROVEEDOR,
            $input->P_IDESTADO
          ]
        );

        // Verificar si se afectó alguna fila
        if ($db->affectedRows() > 0) {
          return $this->respond([
            'success' => true,
            'message' => 'Estado del proveedor actualizado correctamente.',
          ], 200);
        } else {
          // No se realizaron cambios
          return $this->respond([
            'success' => false,
            'message' => 'No se realizaron cambios en el estado del proveedor.',
          ], 200);
        }
      }
    } catch (\Exception $e) {
      return $this->failServerError('Ocurrió un error en el servidor: ' . $e->getMessage());
    }
  }

  /**
   * selectRegion()
   * PR_38_SELECT_REGION
   */
  public function selectRegion()
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

      try {
        $db = \Config\Database::connect();

        $query = $db->query("CALL PR_38_SELECT_REGION()");

        $result = $query->getResultArray();

        if (empty($result)) {
          return $this->response->setStatusCode(404)->setJSON(['message' => 'No se encontraron regiones disponibles.']);
        }

        $response = [];
        foreach ($result as $row) {
          $response[] = [
            "ID_REGION"           => $row['ID_REGION'],
            "NOMBRE_REGION"       => $row['NOMBRE_REGION']

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

    // Si el método no es POST, devolver error 405
    return $this->response->setStatusCode(405)->setJSON(['error' => 'Método no permitido']);
  }

  /**
   * selectComuna()
   * PR_39_SELECT_COMUNA
   */
  public function selectComuna()
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

      if (!isset($json->P_IDREGION) || !is_numeric($json->P_IDREGION)) {
        return $this->response->setStatusCode(400)->setJSON(['error' => 'Falta el ID de la región o es inválido']);
      }

      $P_IDREGION = $json->P_IDREGION;

      try {
        $db = \Config\Database::connect();

        $query = $db->query("CALL PR_39_SELECT_COMUNA(?)", [$P_IDREGION]);

        $result = $query->getResultArray();

        if (empty($result)) {
          return $this->response->setStatusCode(404)->setJSON(['message' => 'No se encontraron comunas para la id seleccionada.']);
        }

        $response = [];
        foreach ($result as $row) {
          $response[] = [
            "ID_COMUNA"           => $row['ID_COMUNA'],
            "NOMBRE_COMUNA"       => $row['NOMBRE_COMUNA']

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

    return $this->response->setStatusCode(405)->setJSON(['error' => 'Método no permitido']);
  }

  /**
   * selectCiudad()
   * PR_40_SELECT_CIUDAD
   */
  public function selectCiudad()
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

      if (!isset($json->P_IDCOMUNA) || !is_numeric($json->P_IDCOMUNA)) {
        return $this->response->setStatusCode(400)->setJSON(['error' => 'Falta el ID de la comuna o es inválido']);
      }

      $P_IDCOMUNA = $json->P_IDCOMUNA;

      try {
        $db = \Config\Database::connect();

        $query = $db->query("CALL PR_40_SELECT_CIUDAD(?)", [$P_IDCOMUNA]);

        $result = $query->getResultArray();

        if (empty($result)) {
          return $this->response->setStatusCode(404)->setJSON(['message' => 'No se encontraron ciudades con la id de la comuna.' . $P_IDCOMUNA]);
        }

        $response = [];
        foreach ($result as $row) {
          $response[] = [
            "ID_CIUDAD"           => $row['ID_CIUDAD'],
            "NOMBRE_CIUDAD"       => $row['NOMBRE_CIUDAD']

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

    return $this->response->setStatusCode(405)->setJSON(['error' => 'Método no permitido']);
  }


  /**
   * nuevoProveedor()
   * PR_41_NUEVO_PROVEEDOR
   */
  public function nuevoProveedor()
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

      // Definir los parámetros requeridos y su tipo
      $requiredFields = [
        'P_IDUSUARIO'         => 'numeric',
        'P_NOMBRE_PROVEEDOR'  => 'string',
        'P_NOMBRE_CONTACTO'   => 'string',
        'P_TELEFONO'          => 'string',
        'P_EMAIL'             => 'string',
        'P_NOMBRE_CALLE'      => 'string',
        'P_NUMERO_CALLE'      => 'numeric',
        'P_ID_REGION'         => 'numeric',
        'P_ID_COMUNA'         => 'numeric',
        'P_ID_CIUDAD'         => 'numeric'
      ];

      // Validar los parámetros
      foreach ($requiredFields as $field => $type) {
        if (!isset($json->$field)) {
          return $this->response->setStatusCode(400)->setJSON(['error' => "Falta el $field o es inválido"]);
        }

        // Validación según tipo
        if ($type === 'numeric' && !is_numeric($json->$field)) {
          return $this->response->setStatusCode(400)->setJSON(['error' => "El campo $field debe ser numérico"]);
        }
        if ($type === 'string' && !is_string($json->$field)) {
          return $this->response->setStatusCode(400)->setJSON(['error' => "El campo $field debe ser texto"]);
        }
      }

      // Asignación de parámetros
      $P_IDUSUARIO          = $json->P_IDUSUARIO;
      $P_NOMBRE_PROVEEDOR   = $json->P_NOMBRE_PROVEEDOR;
      $P_NOMBRE_CONTACTO    = $json->P_NOMBRE_CONTACTO;
      $P_TELEFONO           = $json->P_TELEFONO;
      $P_EMAIL              = $json->P_EMAIL;
      $P_NOMBRE_CALLE       = $json->P_NOMBRE_CALLE;
      $P_NUMERO_CALLE       = $json->P_NUMERO_CALLE;
      $P_ID_REGION          = $json->P_ID_REGION;
      $P_ID_COMUNA          = $json->P_ID_COMUNA;
      $P_ID_CIUDAD          = $json->P_ID_CIUDAD;

      try {
        $db = \Config\Database::connect();

        // Ejecutar el procedimiento almacenado para insertar un nuevo proveedor
        $db->query(
          "CALL PR_41_NUEVO_PROVEEDOR(?,?,?,?,?,?,?,?,?,?)",
          [
            $P_IDUSUARIO,
            $P_NOMBRE_PROVEEDOR,
            $P_NOMBRE_CONTACTO,
            $P_TELEFONO,
            $P_EMAIL,
            $P_NOMBRE_CALLE,
            $P_NUMERO_CALLE,
            $P_ID_REGION,
            $P_ID_COMUNA,
            $P_ID_CIUDAD
          ]
        );

        return $this->respond([
          'success' => true,
          'message' => 'Proveedor insertado correctamente'
        ]);
      } catch (\Exception $e) {
        return $this->response->setStatusCode(500)->setJSON(['error' => 'Ocurrió un error al procesar la solicitud: ' . $e->getMessage()]);
      }
    }

    return $this->response->setStatusCode(405)->setJSON(['error' => 'Método no permitido']);
  }

  /**
   * actualizarProv()
   * PR_42_ACTUALIZAR_PROVEEDOR
   */
  public function actualizarProv()
  {
    $this->response->setHeader('Access-Control-Allow-Origin', 'http://localhost');
    $this->response->setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    $this->response->setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    $this->response->setHeader('Access-Control-Allow-Credentials', 'true');

    if ($this->request->getMethod() === 'options') {
      return $this->response->setStatusCode(200);
    }

    if ($this->request->getMethod() === 'POST') {
      $json = $this->request->getJSON();

      if (!isset($json->P_IDPROVEEDOR) || !is_numeric($json->P_IDPROVEEDOR)) {
        return $this->response->setStatusCode(400)->setJSON(['error' => 'Falta el ID del proveedor o es inválido']);
      }

      $P_IDPROVEEDOR = $json->P_IDPROVEEDOR;
      $P_NOMBRE_PROVEEDOR = $json->P_NOMBRE_PROVEEDOR;
      $P_NOMBRE_CONTACTO = $json->P_NOMBRE_CONTACTO;
      $P_TELEFONO = $json->P_TELEFONO;
      $P_IDCOMUNA = $json->P_IDCOMUNA;
      $P_EMAIL = $json->P_EMAIL;
      $P_NOMBRE_CALLE = $json->P_NOMBRE_CALLE;
      $P_NUMERO_CALLE = $json->P_NUMERO_CALLE;
      $P_IDCIUDAD = $json->P_IDCIUDAD;
      $P_IDREGION = $json->P_IDREGION;

      try {
        $db = \Config\Database::connect();

        // Ejecutar el procedimiento almacenado para actualizar el proveedor
        $query = $db->query("CALL PR_42_ACTUALIZAR_PROVEEDOR(?,?,?,?,?,?,?,?,?,?,?)", [
          $P_IDPROVEEDOR,
          $P_NOMBRE_PROVEEDOR,
          $P_NOMBRE_CONTACTO,
          $P_TELEFONO,
          $P_IDCOMUNA,
          $P_EMAIL,
          $P_NOMBRE_CALLE,
          $P_NUMERO_CALLE,
          $P_IDCIUDAD,
          $P_IDCOMUNA,
          $P_IDREGION
        ]);

        $result = $query->getResultArray();

        if (empty($result)) {
          return $this->response->setStatusCode(404)->setJSON(['message' => 'No se encontraron datos para la actualización.']);
        }

        $response = [];
        foreach ($result as $row) {
          $response[] = [
            "VALIDACION" => $row['VALIDACION']
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

    return $this->response->setStatusCode(405)->setJSON(['error' => 'Método no permitido']);
  }
}
