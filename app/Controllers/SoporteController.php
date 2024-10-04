<?php

namespace App\Controllers;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use CodeIgniter\Controller;

class SoporteController extends Controller
{
  public function enviarSoporte()
  {
    // Habilitar el manejo de errores
    error_reporting(E_ALL);
    ini_set('display_errors', 1);

    // Cargar los datos del POST
    $email = $this->request->getPost('emailSoporte');
    $motivo = $this->request->getPost('motivoSoporte');

    // Validar campos
    if (empty($email) || empty($motivo)) {
      return $this->response->setJSON(['success' => false, 'message' => 'Faltan campos requeridos.']);
    }

    // Usar PHPMailer
    $mail = new PHPMailer(true);

    try {
      // Configuración del servidor SMTP
      $mail->isSMTP();
      $mail->Host = getenv('SMTP_HOST');    // Obtén las variables del archivo .env
      $mail->SMTPAuth = true;
      $mail->Username = getenv('SMTP_USERNAME');
      $mail->Password = getenv('SMTP_PASSWORD');
      $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
      $mail->Port = getenv('SMTP_PORT');

      // Destinatarios y contenido del correo
      $mail->setFrom(getenv('SMTP_FROM_EMAIL'), getenv('SMTP_FROM_NAME'));
      $mail->addAddress(getenv('SMTP_TO_EMAIL'));

      $mail->isHTML(false);
      $mail->Subject = 'Solicitud de Soporte Técnico';
      $mail->Body = "Correo del usuario: " . $email . "\n\nMotivo:\n" . $motivo;

      // Enviar el correo
      $mail->send();
      return $this->response->setJSON(['success' => true, 'message' => 'Correo enviado correctamente.']);
    } catch (Exception $e) {
      return $this->response->setJSON(['success' => false, 'message' => "Error al enviar el correo: {$mail->ErrorInfo}"]);
    }
  }
}
