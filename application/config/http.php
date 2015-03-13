<?php
/**
 * Spiral Framework.
 *
 * @license   MIT
 * @author    Anton Titov (Wolfy-J)
 * @copyright ©2009-2015
 */
return array(
    'basePath'      => '/',
    'showSnapshots' => true,
    'cookies'       => array(
        'subDomains' => true
    ),
    'filters'       => array(
        'Spiral\Components\Http\CsrfChecker',
        'Spiral\Components\Http\Cookies\CookieManager',
        'Spiral\Profiler\Profiler'
    ),
    'endpoints'     => array(),
    'routes'        => array(
        'default' => array(
            'pattern' => '(<controller>(/<action>(/<id>)))',
            'target'  => 'Controllers\<controller>::<action>'
        ),
        'filters' => array(
            'crsf' => 'Spiral\Components\Http\CsrfChecker'
        )
    ),
    'httpErrors'    => array(
        400 => 'spiral:http/badRequest',
        403 => 'spiral:http/forbidden',
        404 => 'spiral:http/notFound',
        500 => 'spiral:http/serverError',
    )
);