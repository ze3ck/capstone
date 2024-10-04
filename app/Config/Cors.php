<?php

namespace Config;

use CodeIgniter\Config\BaseConfig;

/**
 * Cross-Origin Resource Sharing (CORS) Configuration
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
 */
class Cors extends BaseConfig
{
    /**
     * The default CORS configuration.
     *
     * @var array{
     *      allowedOrigins: list<string>,
     *      allowedOriginsPatterns: list<string>,
     *      supportsCredentials: bool,
     *      allowedHeaders: list<string>,
     *      exposedHeaders: list<string>,
     *      allowedMethods: list<string>,
     *      maxAge: int,
     *  }
     */
    public array $default = [
        // Allow all origins or specify the exact domains.
        'allowedOrigins' => [
            'http://localhost',
            'http://localhost:8080',
            'http://localhost:3000',
        ],

        // Optionally use regex patterns to allow specific domains.
        'allowedOriginsPatterns' => [],

        // Set to true if your frontend and backend use cookies or sessions.
        'supportsCredentials' => true,

        // Specify which headers can be used in requests.
        'allowedHeaders' => ['Authorization', 'Content-Type', 'X-Requested-With'],

        // Headers that can be exposed to the frontend.
        'exposedHeaders' => [],

        // Allowed HTTP methods.
        'allowedMethods' => ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],

        // Cache the preflight request for 2 hours.
        'maxAge' => 7200,
    ];
}
