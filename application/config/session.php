<?php
/**
 * Spiral Framework.
 *
 * @license   MIT
 * @author    Anton Titov (Wolfy-J)
 * @copyright ©2009-2015
 */
return array(
    'lifetime' => 86400,
    'handler'  => 'file',
    'handlers' => array(
        'null'  => array(
            'class' => 'Spiral\Components\Session\Handlers\NullHandler'
        ),
        'file'  => array(
            'class'     => 'Spiral\Components\Session\Handlers\FileHandler',
            'directory' => directory('runtime') . '/session'
        ),
        'cache' => array(
            'class'  => 'Spiral\Components\Session\Handlers\CacheHandler',
            'store'  => 'memcache',
            'prefix' => 'session'
        )
    )
);