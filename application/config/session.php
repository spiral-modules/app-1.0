<?php
/**
 * Spiral Framework.
 *
 * @license   MIT
 * @author    Anton Titov (Wolfy-J)
 * @copyright ©2009-2015
 */
return [
    'lifetime' => 86400,
    'handler'  => 'file',
    'handlers' => [
        'null'  => [
            'class' => 'Spiral\Components\Session\Handlers\NullHandler'
        ],
        'file'  => [
            'class'     => 'Spiral\Components\Session\Handlers\FileHandler',
            'directory' => directory('runtime') . '/session'
        ],
        'cache' => [
            'class'  => 'Spiral\Components\Session\Handlers\CacheHandler',
            'store'  => 'memcache',
            'prefix' => 'session'
        ]
    ]
];