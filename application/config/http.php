<?php
/**
 * Spiral Framework.
 *
 * @license   MIT
 * @author    Anton Titov (Wolfy-J)
 * @copyright ©2009-2015
 */
return array(
    'basePath'     => '/',
    'exposeErrors' => true,
    'cookies'      => array(
        'domain' => '.%s',
        'method' => 'mac'
    ),
    'headers'      => array(
        'Content-Type' => 'text/html; charset=UTF-8'
    ),
    'middlewares'  => array(
        'Spiral\Components\Http\Cookies\CookieManager',
        'Spiral\Components\Http\Middlewares\CsrfFilter',
        'Spiral\Components\Http\Middlewares\JsonParser',
        'Spiral\Components\Session\Http\SessionStarter',
        'Spiral\Profiler\Profiler'
    ),
    'endpoints'    => array(),
    'router'       => array(
        'class'        => 'Spiral\Components\Http\Router\Router',
        'primaryRoute' => array(
            'pattern'     => '(<controller>(/<action>(/<id>)))',
            'namespace'   => 'Controllers',
            'postfix'     => 'Controller',
            'defaults'    => array(
                'controller' => 'home'
            ),
            'controllers' => array(
                'index' => 'Controllers\HomeController'
            )
        )
    ),
    'httpErrors'   => array(
        400 => 'spiral:http/badRequest',
        403 => 'spiral:http/forbidden',
        404 => 'spiral:http/notFound',
        500 => 'spiral:http/serverError',
    )
);