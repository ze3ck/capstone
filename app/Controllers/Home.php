<?php

namespace App\Controllers;

class Home extends BaseController
{
    public function index()
    {
        return redirect()->to('/login');
    }

    /** 
     * login
     */
    public function login()
    {
        return view('pages/login');
    }

    /**
     * Dashboard
     */
    public function dashboard()
    {
        $session = session();

        if (!$session->has('loggedin') || !$session->get('loggedin')) {
            return redirect()->to('/login');
        }

        return view('pages/dashboard');
    }

    /**
     * perfilUsuario
     */
    public function perfilUsuario()
    {
        $session = session();

        if (!$session->has('loggedin') || !$session->get('loggedin')) {
            return redirect()->to('/login');
        }
        return view('pages/perfilUsuario');
    }

    /**
     * inventario
     */
    public function inventario()
    {
        $session = session();

        if (!$session->has('loggedin') || !$session->get('loggedin')) {
            return redirect()->to('/login');
        }
        return view('pages/inventario');
    }

    /**
     * reportes
     */
    public function reportes()
    {
        $session = session();

        if (!$session->has('loggedin') || !$session->get('loggedin')) {
            return redirect()->to('/login');
        }
        return view('pages/reportes');
    }

    /**
     * Movimientos
     */
    public function movimientos()
    {
        $session = session();

        if (!$session->has('loggedin') || !$session->get('loggedin')) {
            return redirect()->to('/login');
        }
        return view('pages/movimientos');
    }

    /**
     * logut
     */
    public function logut()
    {
        return view('pages/logut');
    }

    /**
     * Proveedores
     */
    public function proveedores()
    {
        $session = session();

        if (!$session->has('loggedin') || !$session->get('loggedin')) {
            return redirect()->to('/login');
        }

        return view('pages/proveedores');
    }
}
