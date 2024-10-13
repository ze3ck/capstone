<?php

namespace App\Controllers\API;

use App\Models\UsuarioModel;
use CodeIgniter\RESTful\ResourceController;
use Config\Database;
// use Firebase\JWT\JWT;
// use Firebase\JWT\Key;

class Usuarios extends ResourceController
{
  // contructor
  public function __construct()
  {
    $this->model = $this->setModel(new UsuarioModel());
  }

  /**
   * llamar toda la data
   */
  public function index()
  {
    $usuarios = $this->model->findAll();
    return $this->respond($usuarios);
  }

  /**
   * crear usuario *
   */
  public function create()
  {
    try {
      $usuarios = $this->request->getJSON();
      if ($this->model->insert($usuarios)):
        $usuarios->id = $this->model->insertID();
        // creado un recurso dentro del restful API
        return $this->respondCreated($usuarios);
      else:
        return $this->failValidationErrors($this->model->validation->listErrors());
      endif;
    } catch (\Exception $e) {
      return $this->failServerError('🔴 Ha ocurrido un error en el servidor 🔴');
    }
  }

  /**
   * llamar data para edit
   */
  public function edit($id = null)
  {
    try {
      if ($id == null) {
        return $this->failValidationErrors('No se ha podido encontrar un Id válido');
      }

      $usuarios = $this->model->find($id);
      if ($usuarios == null) {
        return $this->failNotFound('No se ha encontrado el usuarios con id: ' . $id);
      }

      return $this->respond($usuarios);
    } catch (\Exception $e) {
      return $this->failServerError('🔴 Ha ocurrido un error en el servidor 🔴');
    }
  }

  /**
   * update data - actualizar campos de un usuario
   */
  public function update($id = null)
  {
    try {
      if ($id == null)
        return $this->failValidationErrors('No se ha podido encontrar un Id válido');

      $usuarioVerificado = $this->model->find($id);
      if ($usuarioVerificado == null)
        return $this->failNotFound('No se ha encontrado el usuario con id: ' . $id);

      $usuario = $this->request->getJSON();

      if ($this->model->update($id, $usuario)):
        $usuario->id = $id;
        // creado un recurso dentro del restful API
        return $this->respondUpdated($usuario);
      else:
        return $this->failValidationErrors($this->model->validation->listErrors());
      endif;
    } catch (\Exception $e) {
      return $this->failServerError('🔴 Ha ocurrido un error en el servidor 🔴');
    }
  }

  /**
   * Autenticacion [LOGIN] sin procedimiento
   * NOMBRE_USUARIO
   */
  // public function login()
  // {
  //   try {
  //     // Obtener el JSON de la solicitud
  //     $input = $this->request->getJSON();

  //     // Validar que se proporciona el nombre de usuario o el correo y la contraseña
  //     if ((!isset($input->email) && !isset($input->nombre_usuario)) || !isset($input->contrasenia)) {
  //       return $this->failValidationErrors('Usuario/Correo o contraseña no proporcionados');
  //     }

  //     // Buscar al usuario por correo o por nombre de usuario
  //     $usuario = null;
  //     if (isset($input->email)) {
  //       // Convertir el correo a minúsculas para buscar sin distinción de mayúsculas
  //       $usuario = $this->model->where('LOWER(EMAIL)', strtolower($input->email))->first();
  //     } elseif (isset($input->nombre_usuario)) {
  //       // Convertir el nombre de usuario a minúsculas para buscar sin distinción de mayúsculas
  //       $usuario = $this->model->where('LOWER(nombre_usuario)', strtolower($input->nombre_usuario))->first();
  //     }

  //     // Si no encuentra un usuario con el correo o nombre de usuario proporcionado
  //     if ($usuario === null) {
  //       return $this->failNotFound('Usuario no encontrado con los datos proporcionados');
  //     }

  //     // Validar la contraseña
  //     if ($input->contrasenia !== $usuario['CONTRASENIA']) {
  //       return $this->failValidationErrors('Contraseña incorrecta');
  //     }

  //     // Login exitoso
  //     return $this->respond([
  //       'success' => true,
  //       'message' => 'Login exitoso',
  //       'user' => [
  //         'ID_USUARIO' => $usuario['ID_USUARIO'],
  //         'NOMBRE_USUARIO' => $usuario['NOMBRE_USUARIO'],
  //         'ESTADO' => $usuario['ESTADO']
  //       ]
  //     ]);
  //   } catch (\Exception $e) {
  //     return $this->failServerError('Ocurrió un error en el servidor');
  //   }
  // }




  /**
   * Validación de Login mediante procedimiento almacenado => email
   */
  // public function login()
  // {
  //   // session_start();
  //   // Iniciar la sesión
  //   $session = session();

  //   // Obtener los datos del formulario
  //   $email = $this->request->getVar('email');
  //   $password = $this->request->getVar('contrasenia');

  //   // Validar que los campos no estén vacíos
  //   if (empty($email) || empty($password)) {
  //     return $this->response->setJSON(['status' => 'error', 'message' => 'Los campos email y contraseña son obligatorios.']);
  //   }

  //   // Conectar a la base de datos
  //   $db = Database::connect();

  //   // Llamar al procedimiento almacenado para verificar las credenciales
  //   $query = $db->query("CALL LOGIN(?, ?)", [$email, $password]);
  //   $result = $query->getRow();

  //   // Verificar si la consulta devolvió un resultado válido
  //   if ($result && $result->VALIDACION == 1) {

  //     // Establecer los datos de la sesión
  //     $sessionData = [
  //       'email' => $email,
  //       'contrasenia' => $password,
  //       'session_status' => true
  //     ];
  //     $session->set($sessionData); // Guardar datos en la sesión

  //     // Verificar si la sesión fue correctamente establecida
  //     if ($session->get('email')) {
  //       return $this->response->setJSON(['status' => 'success', 'message' => 'Inicio de sesión exitoso']);
  //     } else {
  //       // Si por alguna razón la sesión no se establece correctamente
  //       return $this->response->setJSON(['status' => 'error', 'message' => 'Error al establecer la sesión.']);
  //     }
  //   } else {
  //     // Responder con un mensaje de error si las credenciales son incorrectas
  //     return $this->response->setJSON(['status' => 'error', 'message' => 'Credenciales incorrectas o usuario no encontrado.']);
  //   }
  // }


  /**
   * crearNuevoUsuario()
   * PR_07_NUEVO_USUARIO
   */
  public function crearNuevoUsuario()
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
        !isset($json->p_NOMBRE_USUARIO) || !isset($json->p_EMAIL) || !isset($json->p_CONTRASENIA) ||
        !isset($json->p_NOMBRE) || !isset($json->p_APATERNO) || !isset($json->p_AMATERNO) ||
        !isset($json->p_TELEFONO) || !isset($json->p_IDESTADO) || !isset($json->p_IDEMPRESA) ||
        !isset($json->P_IDROL)
      ) {
        return $this->response->setStatusCode(400)->setJSON(['error' => 'Faltan parámetros requeridos.']);
      }

      $db = \Config\Database::connect();

      try {
        $db->transBegin();

        $db->query("CALL PR_07_NUEVO_USUARIO(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [
          $json->p_NOMBRE_USUARIO,
          $json->p_EMAIL,
          $json->p_CONTRASENIA,
          $json->p_NOMBRE,
          $json->p_APATERNO,
          $json->p_AMATERNO,
          $json->p_TELEFONO,
          $json->p_IDESTADO,
          $json->p_IDEMPRESA,
          $json->P_IDROL
        ]);

        if ($db->transStatus() === false) {
          $db->transRollback();
          return $this->response->setStatusCode(500)->setJSON(['error' => 'Error al crear el nuevo usuario en la base de datos.']);
        } else {
          $db->transCommit();
          return $this->response->setStatusCode(200)->setJSON([
            'success' => true,
            'message' => 'Usuario creado correctamente.'
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
   * actualizarEstado
   * PR_06_ACTUALIZAR_ESTADO_USUARIO
   */
  public function actualizarEstado()
  {
    $this->response->setHeader('Access-Control-Allow-Origin', 'https://localhost');
    $this->response->setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    $this->response->setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    $this->response->setHeader('Access-Control-Allow-Credentials', 'true');

    if ($this->request->getMethod() === 'options') {
      return $this->response->setStatusCode(200);
    }

    try {
      $input = $this->request->getJSON();

      if (!is_array($input)) {
        return $this->failValidationErrors('Se esperaba un arreglo de usuarios. 🟡');
      }

      $db = \Config\Database::connect();
      $results = [];

      foreach ($input as $usuario) {
        if (!isset($usuario->id_usuario) || !isset($usuario->ID_ESTADO)) {
          return $this->failValidationErrors('ID_ESTADO y ID_USUARIO son requeridos para cada usuario. 🟡');
        }

        // Ejecutamos el procedimiento almacenado para cada usuario
        $query = $db->query("CALL PR_06_ACTUALIZAR_ESTADO_USUARIO(?, ?)", [$usuario->id_usuario, $usuario->ID_ESTADO]);
        $result = $query->getRowArray();

        if ($result && isset($result['VALIDACION'])) {
          $results[] = [
            'id_usuario'  => $usuario->id_usuario,
            'VALIDACION'  => $result['VALIDACION'],
            'message'     => $result['VALIDACION'] == 1 ? 'Actualización exitosa' : 'No se pudo actualizar'
          ];
        } else {
          $results[] = [
            'id_usuario'  => $usuario->id_usuario,
            'VALIDACION'  => 0,
            'message'     => 'Error al ejecutar el procedimiento o usuario no encontrado.'
          ];
        }
      }

      return $this->respond([
        'success'   => true,
        'response'  => $results,
      ]);
    } catch (\Exception $e) {
      return $this->failServerError('Error al actualizar el perfil' . $e->getMessage());
    }
  }



  /**
   * llenarEstadoUsuario
   * Llama al procedimiento almacenado PR_04_LISTA_ESTADOS
   */
  public function llenarEstadoUsuario()
  {
    // Configurar CORS
    $this->response->setHeader('Access-Control-Allow-Origin', 'http://localhost');
    $this->response->setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    $this->response->setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    $this->response->setHeader('Access-Control-Allow-Credentials', 'true');

    if ($this->request->getMethod() === 'options') {
      return $this->response->setStatusCode(200);
    }

    $db = \Config\Database::connect();

    $gestionQuery = $db->query("CALL PR_04_LISTA_ESTADOS()");

    $results = $gestionQuery->getResultArray();

    if (empty($results)) {
      return $this->failValidationErrors('No se encontraron estados 🟡');
    }

    return $this->respond([
      'success' => true,
      'data'    => $results
    ]);
  }



  /**
   * gestionarUsuarios()
   * PR_03_TABLA_GESTION_USUARIOS
   */

  public function gestionarUsuarios()
  {
    $this->response->setHeader('Access-Control-Allow-Origin', 'http://localhost');
    $this->response->setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    $this->response->setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    $this->response->setHeader('Access-Control-Allow-Credentials', 'true');

    if ($this->request->getMethod() === 'options') {
      return $this->response->setStatusCode(200);
    }

    $input = $this->request->getJSON();

    if (!isset($input->ID_USUARIO)) {
      return $this->failValidationErrors('ID_USUARIO es requerido 🟡');
    }

    $db = \Config\Database::connect();

    $idUsuario = $input->ID_USUARIO;

    $gestionQuery = $db->query("CALL PR_03_TABLA_GESTION_USUARIOS(?)", [$idUsuario]);

    $results = $gestionQuery->getResultArray();

    if (empty($results)) {
      return $this->failValidationErrors('Datos no gestionados correctamente o no se encontraron usuarios 🔴');
    }

    // Formatear la respuesta
    $usuarios = [];
    foreach ($results as $result) {
      $usuarios[] = [
        "ID_USUARIO"      => $result['ID_USUARIO'],
        "NOMBRE_USUARIO"  => $result['NOMBRE_USUARIO'],
        "EMAIL"           => $result['EMAIL'],
        "ESTADO"          => $result['ESTADO'],
      ];
    }

    return $this->respond([
      'success'   => true,
      'response'  => $usuarios
    ]);
  }


  /**
   * CALL PR_05_ACTUALIZAR_USUARIO_DATOS
   * actualizarPerfil()
   */
  public function actualizarPerfil()
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

      $db = \Config\Database::connect();

      $updateQuery = $db->query(
        "CALL PR_05_ACTUALIZAR_USUARIO_DATOS(?, ?, ?, ?, ?, ?, ?)",
        [
          $input->ID_USUARIO,
          $input->NOMBRE_USUARIO,
          $input->EMAIL,
          $input->NOMBRE,
          $input->APATERNO,
          $input->AMATERNO,
          $input->TELEFONO
        ]
      );

      $validationResult = $updateQuery->getRowArray();

      if (!$validationResult) {
        return $this->failValidationErrors('Perfil/Datos no encontrados');
      }

      return $this->respond([
        'success'   => true,
        'response'  => [
          'VALIDACION' => $validationResult['VALIDACION'],
        ]
      ]);
    } catch (\Exception $e) {
      return $this->failServerError('Error al actualizar el perfil: ' . $e->getMessage());
    }
  }



  /**
   * crear nueva fuincion - endpooint para guardarDatosPerfil
   */


  public function rellenarPerfil()
  {
    $this->response->setHeader('Access-Control-Allow-Origin', 'http://localhost');
    $this->response->setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    $this->response->setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    $this->response->setHeader('Access-Control-Allow-Credentials', 'true');

    // Manejo de preflight request
    if ($this->request->getMethod() === 'options') {
      return $this->response->setStatusCode(200);
    }

    try {
      $input = $this->request->getJSON();

      if ($this->request->getMethod() === 'post' && isset($input->actualizar)) {
        $db = \Config\Database::connect();

        $updateQuery = $db->query(
          "CALL PR_05_ACTUALIZAR_USUARIO_DATOS(?, ?, ?, ?, ?, ?)",
          [
            $input->id_usuario,          // ID del usuario
            $input->nombre_usuario,      // Nombre de usuario
            $input->email,               // Email
            $input->nombre,              // Primer nombre
            $input->apaterno,            // Apellido paterno
            $input->amaterno,            // Apellido materno
            $input->telefono             // Teléfono
          ]
        );

        $validationResult = $updateQuery->getRowArray();

        if (isset($validationResult['VALIDACION']) && $validationResult['VALIDACION'] == 1) {
          return $this->respond([
            'success' => true,
            'message' => 'Datos actualizados correctamente'
          ]);
        } else {
          return $this->respond([
            'success' => false,
            'message' => 'No se pudo actualizar los datos del usuario'
          ]);
        }
      }

      // Si no es actualización, se procede a rellenar el perfil con PR_02_LLENADO_PERFIL
      // Conexión a la base de datos
      $db = \Config\Database::connect();

      // Ejecutar el procedimiento almacenado PR_02_LLENADO_PERFIL
      $query = $db->query("CALL PR_02_LLENADO_PERFIL(?)", [$input->id_usuario]);

      $result = $query->getRowArray();

      // Verificar si se trae la información del perfil
      if (!$result) {
        return $this->failValidationErrors('Perfil/Datos no encontrados 🔴');
      }

      // Devolver los datos del perfil
      return $this->respond([
        'success' => true,
        // 'descripcion_estado' => $result['DESCRIPCION_ESTADO'],
        'perfil' => [
          'nombre_usuario' =>     $result['NOMBRE_USUARIO'],
          'email' =>              $result['EMAIL'],
          'nombre' =>             $result['NOMBRE'],
          'apaterno' =>           $result['APATERNO'],
          'amaterno' =>           $result['AMATERNO'],
          'telefono' =>           $result['TELEFONO'],
          'rol' =>                $result['ROL'],
        ]
      ]);
    } catch (\Exception $e) {
      return $this->failServerError('Ocurrió un error en el servidor: 🔴' . $e->getMessage());
    }
  }


  /**
   * login()
   * PR_01_LOGIN
   */
  public function login()
  {
    $this->response->setHeader('Access-Control-Allow-Origin', 'http://localhost');
    $this->response->setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    $this->response->setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    $this->response->setHeader('Access-Control-Allow-Credentials', 'true');

    if ($this->request->getMethod() === 'options') {
      return $this->response->setStatusCode(200);
    }

    try {
      $session = session();

      $input = $this->request->getJSON();

      // Validar si el email o contraseña no se proporcionaron
      if (!isset($input->email) || !isset($input->contrasenia)) {
        return $this->failValidationErrors('Correo o contraseña no proporcionados 🔴');
      }

      $db = \Config\Database::connect();

      // Ejecutar el procedimiento almacenado
      $query = $db->query("CALL PR_01_LOGIN(?, ?)", [$input->email, $input->contrasenia]);

      $result = $query->getRowArray();

      // Verificar si no se encontró ningún resultado
      if (!$result) {
        return $this->failValidationErrors('Credenciales de Acceso Incorrectas');
      }

      // Verificar si el procedimiento almacenado devuelve un estado específico
      if (isset($result['estado']) && $result['estado'] == 2) {
        // Si el estado es 2, el usuario está inactivo
        return $this->failValidationErrors('Usuario inactivo, no tiene acceso');
      }

      // Verificar si los datos del usuario están completos
      if (!isset($result['ID_USUARIO']) || !isset($result['EMAIL']) || !isset($result['NOMBRE_USUARIO']) || !isset($result['ROL']) || !isset($result['NOMBRE']) || !isset($result['APATERNO'])) {
        return $this->failValidationErrors('Datos incompletos del usuario, por favor contacte al soporte 🔴');
      }

      // Si el estado es 1 (Activo), proceder con el inicio de sesión
      $session->set([
        'loggedin'        => true,
        'user_id'         => $result['ID_USUARIO'],
        'email'           => $result['EMAIL'],
        'nombre_usuario'  => $result['NOMBRE_USUARIO'],
        'rol'             => $result['ROL'],
        'nombre'          => $result['NOMBRE'],
        'apaterno'        => $result['APATERNO']
      ]);

      return $this->respond([
        'success' => true,
        'message' => 'Login exitoso',
        'user'    => [
          'id_usuario'      => $result['ID_USUARIO'],
          'email'           => $result['EMAIL'],
          'nombre_usuario'  => $result['NOMBRE_USUARIO'],
          'rol'             => $result['ROL'],
          'nombre'          => $result['NOMBRE'],
          'apaterno'        => $result['APATERNO']
        ]
      ]);
    } catch (\Exception $e) {
      log_message('error', 'Login Error: ' . $e->getMessage());
      return $this->failServerError('Ocurrió un error en el servidor: 🔴' . $e->getMessage());
    }
  }







  /**
   * Guardar Sesión
   * 
   */
  public function guardarSesion()
  {
    $session = session();

    $data = $this->request->getJSON();

    if (!empty($data->email)) {
      // Guardar los datos en la sesión
      $session->set([
        'email'     => $data->email,
        'loggedin'  => true,
      ]);

      return $this->response->setJSON(['status' => 'success']);
    } else {
      return $this->response->setJSON(['status' => 'error', 'message' => 'No se enviaron los datos correctos.']);
    }
  }

  public function logout()
  {
    // Inicia la sesión
    $session = session();
    $email = $session->get('email');

    // Conexión a la base de datos
    $db = Database::connect();

    // Actualizar el estado de la sesión en la tabla 'ci_sessions'
    $db->query("UPDATE ci_sessions SET session_status = ? WHERE email = ?", [false, $email]);

    // Destruye la sesión
    $session->destroy();

    return $this->response->setJSON(['status' => 'success', 'message' => 'Sesión cerrada']);
  }



  /** 
   * Validacion Login Mediante procedimiento almacenado => usuario
   */

  // public function login()
  // {
  //   try {
  //     $input = $this->request->getJSON();

  //     if (!isset($input->usuario) || !isset($input->contrasenia)) {
  //       return $this->failValidationErrors('Usuario o contraseña no proporcionados');
  //     }

  //     $db = \Config\Database::connect();

  //     $query = $db->query("CALL LOGIN(?, ?)", [strtolower($input->usuario), $input->contrasenia]);

  //     $result = $query->getRowArray();

  //     if (!$result || !isset($result['VALIDACION']) || $result['VALIDACION'] != 1) {
  //       return $this->failValidationErrors('Usuario no encontrado o contraseña incorrecta');
  //     }

  //     return $this->respond([
  //       'success' => true,
  //       'message' => 'Login exitoso',
  //       'user' => [
  //         'usuario' => strtolower($input->usuario)
  //       ]
  //     ]);
  //   } catch (\Exception $e) {
  //     return $this->failServerError('Ocurrió un error en el servidor: ' . $e->getMessage());
  //   }
  // }




  // Recuperacion de credenciales
  public function enviarCorreo()
  {
    $email = \Config\Services::email();

    $email->setTo('destinatario@example.com'); // Correo destinatario
    $email->setFrom('contacto@optiflow.cl', 'Optiflow');
    $email->setSubject('Asunto del Correo');
    $email->setMessage('Este es el contenido del correo'); // Contenido del mensaje, HTML si se usa esa opción

    if ($email->send()) {
      return $this->respond(['message' => 'Correo enviado correctamente']);
    } else {
      $data = $email->printDebugger(['headers']);
      return $this->failServerError($data);
    }
  }
}
