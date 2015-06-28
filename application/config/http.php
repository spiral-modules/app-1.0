<?php
/**
 * Spiral Framework.
 *
 * @license   MIT
 * @author    Anton Titov (Wolfy-J)
 * @copyright ©2009-2015
 */
return [
    'basePath'     => '/',
    'exposeErrors' => true,
    'cookies'      => [
        'domain' => '.%s',
        'method' => 'mac'
    ],
    'headers'      => [
        'Content-Type' => 'text/html; charset=UTF-8'
    ],
    'middlewares'  => [
        'Spiral\Components\Http\Cookies\CookieManager',
        'Spiral\Components\Http\Middlewares\CsrfFilter',
        'Spiral\Components\Http\Middlewares\JsonParser',
        'Spiral\Components\Session\Http\SessionStarter',
        'Spiral\Profiler\Profiler'
    ],
    'endpoints'    => [],
    'router'       => [
        'class'        => 'Spiral\Components\Http\Router\Router',
        'primaryRoute' => [
            'pattern'     => '(<controller>(/<action>(/<id>)))',
            'namespace'   => 'Controllers',
            'postfix'     => 'Controller',
            'defaults'    => [
                'controller' => 'home'
            ],
            'controllers' => [
                'index' => 'Controllers\HomeController'
            ]
        ]
    ],
    'httpErrors'   => [
        400 => 'spiral:http/badRequest',
        403 => 'spiral:http/forbidden',
        404 => 'spiral:http/notFound',
        500 => 'spiral:http/serverError',
    ]
];