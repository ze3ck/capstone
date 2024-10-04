<?php

namespace App\Controllers;

use CodeIgniter\Controller;
use Config\Database;

class AuthController extends Controller
{
    public function login()
    {
        // Verificar si la solicitud es POST
        if ($this->request->getMethod() === 'post') {
            $email = strtolower($this->request->getPost('email'));
            $password = $this->request->getPost('password');

            if (!empty($email) && !empty($password)) {
                // Conectar a la base de datos y verificar las credenciales
                $db = \Config\Database::connect();
                $query = $db->query("CALL PR_01_LOGIN(?, ?)", [$email, $password]);
                $result = $query->getRowArray();

                if ($result) {
                    // Credenciales válidas, almacenar en la sesión
                    session()->set([
                        'loggedin' => true,
                        'user_id' => $result['ID_USUARIO'],
                        'email' => $result['EMAIL'],
                        'nombre_usuario' => $result['NOMBRE_USUARIO'],
                        'rol' => $result['ROL'],
                        // 'nombre' => $result['NOMBRE']
                    ]);

                    // Redirigir al dashboard o página principal
                    return redirect()->to('/dashboard');
                } else {
                    // Credenciales incorrectas
                    return redirect()->back()->with('error', 'Usuario o contraseña incorrectos.');
                }
            } else {
                // Si faltan campos
                return redirect()->back()->with('error', 'Por favor, complete todos los campos.');
            }
        }

        // Cargar la vista del formulario de login
        return view('pages/login');
    }

    public function logout()
    {
        session()->destroy();

        return redirect()->to('/login');
    }
}
