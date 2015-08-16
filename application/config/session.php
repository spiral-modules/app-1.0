<?php
/**
 * SessionStore configuration.
 * - default session lifetime
 * - default session handler to be used, use "native" to use php sessions
 * - list of handlers associated with their class and custom options
 */
use Spiral\Session\Handlers;

return [
    'lifetime' => 86400,
    'handler'  => 'file',
    'handlers' => [
        'null'  => [
            'class' => Handlers\NullHandler::class
        ],
        'file'  => [
            'class'     => Handlers\FileHandler::class,
            'directory' => directory('runtime') . '/sessions'
        ],
        'cache' => [
            'class'  => Handlers\CacheHandler::class,
            'store'  => 'memcache',
            'prefix' => 'session'
        ]
    ]
];