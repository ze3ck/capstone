<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use Dotenv\Dotenv;

require '../vendor/autoload.php';

$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

if ($_SERVER["REQUEST_METHOD"] === "POST") {
  $email = filter_var($_POST['emailSoporte'], FILTER_SANITIZE_EMAIL);
  $motivo = htmlspecialchars($_POST['motivoSoporte'], ENT_QUOTES, 'UTF-8');

  if (empty($email) || empty($motivo)) {
    echo json_encode(["success" => false, "message" => "Faltan campos requeridos."]);
    exit;
  }

  $mail = new PHPMailer(true);

  try {
    $mail->isSMTP();
    $mail->Host = $_ENV['SMTP_HOST'];
    $mail->SMTPAuth = true;
    $mail->Username = $_ENV['SMTP_USERNAME'];
    $mail->Password = $_ENV['SMTP_PASSWORD'];
    $mail->SMTPSecure = 'ssl';
    $mail->Port = $_ENV['SMTP_PORT'];

    $mail->setFrom($_ENV['SMTP_FROM_EMAIL'], $_ENV['SMTP_FROM_NAME']);
    $mail->addAddress($_ENV['SMTP_TO_EMAIL']);

    $mail->isHTML(false);
    $mail->Subject = 'Solicitud de Soporte Técnico';
    $mail->Body = "Correo del usuario: " . $email . "\n\nMotivo:\n" . $motivo;

    $mail->send();
    echo json_encode(["success" => true, "message" => "Correo enviado correctamente."]);
  } catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Error al enviar el correo: {$mail->ErrorInfo}"]);
  }
}
