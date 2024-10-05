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
        return view('pages/dashboard');
    }

    /**
     * perfilUsuario
     */
    public function perfilUsuario()
    {
        return view('pages/perfilUsuario');
    }
    /**
     * inventario
     */

    public function inventario()
    {
        return view('pages/inventario');
    }

    /**
     * reportes
     */
    public function reportes(){
        return view('pages/reportes');
    }
    /**
     * logut
     */

    public function logut()
    {
        return view('pages/logut');
    }

      /**
     * Movimientos
     */

     public function movimientos()
     {
         return view('pages/movimientos');
     }
}
