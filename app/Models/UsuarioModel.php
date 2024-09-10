<?php

namespace App\Models;

use CodeIgniter\Model;

class UsuarioModel extends Model
{
  protected $table = 'USUARIOS';
  protected $primaryKey = 'ID_USUARIO';

  protected $returnType = 'array';

  // campos permitidos para manejar la data
  protected $allowedFields = [
    'NOMBRE_USUARIO',
    'EMAIL',
    'CONTRASENIA',
    'NOMBRE',
    'APATERNO',
    'AMATERNO',
    'TELEFONO',
    'ESTADO'
  ];

  // auditoría de fechas de creacion - ctualización
  protected $useTimestamps = true;
  protected $createdField = 'CREADO_EN';
  protected $updatedField = 'ACTUALIZADO_EN';

  //  reglas de validación columnas de tabla 'usuarios'
  protected $validationRules = [
    "NOMBRE_USUARIO" => "required|alpha_space|min_length[3]|max_length[50]",
    "EMAIL"          => "required|valid_email|max_length[100]",
    "CONTRASENIA"    => "required|min_length[8]|max_length[255]",
    "NOMBRE"         => "required|alpha_space|min_length[3]|max_length[50]",
    "APATERNO"       => "required|regex_match[/^[\p{L}\s]+$/u]|min_length[3]|max_length[50]",
    "AMATERNO"       => "required|regex_match[/^[\p{L}\s]+$/u]|min_length[3]|max_length[50]",
    "TELEFONO"       => "required|numeric|exact_length[9]",
    "ESTADO"         => "required|in_list[ACTIVO,INACTIVO,BLOQUEADO]"
  ];

  protected $skipValidation = false;
}
