<?php

namespace App\Controllers\API;

use App\Models\UsuarioModel;
use CodeIgniter\RESTful\ResourceController;

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
   * Autenticacion [LOGIN]
   */
  public function login()
  {
    try {
      $input = $this->request->getJSON();

      if (!isset($input->email) || !isset($input->contrasenia)) {
        return $this->failValidationErrors('Correo o contraseña no proporcionados');
      }

      $usuario = $this->model->where('EMAIL', $input->email)->first();

      if ($usuario === null) {
        return $this->failNotFound('Usuario no encontrado con el correo proporcionado');
      }

      if ($input->contrasenia !== $usuario['CONTRASENIA']) {
        return $this->failValidationErrors('Contraseña incorrecta');
      }

      // Login exitoso
      return $this->respond([
        'success' => true,
        'message' => 'Login exitoso',
        'user' => [
          'ID_USUARIO' => $usuario['ID_USUARIO'],
          'NOMBRE_USUARIO' => $usuario['NOMBRE_USUARIO'],
          'ESTADO' => $usuario['ESTADO']
        ]
      ]);
    } catch (\Exception $e) {
      return $this->failServerError('Ocurrió un error en el servidor');
    }
  }


  // Recuperacion de credenciales * PENDIENTE
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
      return $this->failServerError($data); // Muestra el error en caso de fallar
    }
  }
}
