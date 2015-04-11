<?php
/**
 * Spiral Framework.
 *
 * @license   MIT
 * @author    Anton Titov (Wolfy-J)
 * @copyright ©2009-2015
 */
/**
 * Spiral Framework.
 *
 * @license   MIT
 * @author    Anton Titov (Wolfy-J)
 * @copyright ©2009-2015
 */
return array(
    'basePath'         => '/',
    'exposeErrors'     => true,
    'cookies'          => array(
        'path'       => '/',
        'subDomains' => false
    ),
    'headers'          => array(
        'Content-Type' => 'text/html; charset=UTF-8'
    ),
    'middlewares'      => array(
        'Spiral\Components\Http\Middlewares\CsrfToken',
        'Spiral\Components\Session\Http\SessionStarter',
        'Spiral\Components\Http\Cookies\CookieManager',
        'Spiral\Profiler\Profiler'
    ),
    'endpoints'        => array(),
    'router'           => array(
        'class'        => 'Spiral\Components\Http\Router\Router',
        'defaultRoute' => array(
            'pattern'  => '(<controller>(/<action>(/<id>)))',
            'target'   => 'Controllers\<controller>Controller::<action>',
            'defaults' => array(
                'controller' => 'home'
            )
        )
    ),
    'routeMiddlewares' => array(),
    'httpErrors'       => array(
        400 => 'spiral:http/badRequest',
        403 => 'spiral:http/forbidden',
        404 => 'spiral:http/notFound',
        500 => 'spiral:http/serverError',
    )
);