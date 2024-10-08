<?php

namespace App\Controllers;

use CodeIgniter\Controller;
use Config\Session;

class SessionController extends Controller
{
  public function getSessionTime()
  {
    $session = session();

    /** @var Session $sessionConfig */
    $sessionConfig = config('Session');

    $maxLifetime = $sessionConfig->expiration;
    $lastActivity = $session->get('lastActivity') ?? time();

    $timeRemaining = $maxLifetime - (time() - $lastActivity);

    return $this->response->setJSON(['timeRemaining' => $timeRemaining]);
  }

  public function updateLastActivity()
  {
    $session = session();
    $session->set('lastActivity', time());
    return $this->response->setJSON(['status' => 'ok']);
  }
}
