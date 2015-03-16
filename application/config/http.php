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
    'basePath'     => '/',
    'exposeErrors' => true,
    'cookies'      => array(
        'subDomains' => false
    ),
    'middlewares'  => array(
        'Spiral\Profiler\Profiler',
        'Spiral\Components\Http\CsrfProtector',
        'Spiral\Components\Session\Http\SessionStarter',
        'Spiral\Components\Http\Cookies\CookieManager',
    ),
    'endpoints'    => array(),
    'router'       => array(
        'class'             => 'Spiral\Components\Http\Router\Router',
        'default'           => array(
            'pattern' => '(<controller>(/<action>(/<id>)))',
            'target'  => 'Controllers\<controller>::<action>'
        ),
        'middlewareAliases' => array(
            'crsf' => 'Spiral\Components\Http\CsrfProtector'
        )
    ),
    'headers'      => array(
        'Content-Type' => 'text/html; charset=UTF-8'
    ),
    'httpErrors'   => array(
        400 => 'spiral:http/badRequest',
        403 => 'spiral:http/forbidden',
        404 => 'spiral:http/notFound',
        500 => 'spiral:http/serverError',
    )
);