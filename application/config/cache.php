<?php
/**
 * Cache configuration.
 */
return [
    'store'  => 'memcache',
    'stores' => [
        'file'     => [
            'class'     => 'Spiral\Components\Cache\Stores\FileStore',
            'directory' => directory('cache'),
            'extension' => 'cache'
        ],
        'xcache'   => [
            'class'  => 'Spiral\Components\Cache\Stores\XcacheStore',
            'prefix' => 'spiral'
        ],
        'memcache' => [
            'class'   => 'Spiral\Components\Cache\Stores\MemcacheStore',
            'prefix'  => 'spiral',
            'options' => [],
            'servers' => [
                [
                    'host'       => 'localhost',
                    'port'       => 11211,
                    'persistent' => true
                ]
            ]
        ],
        'redis'    => [
            'class'   => 'Spiral\Components\Cache\Stores\RedisStore',
            'enabled' => true,
            'client'  => 'default',
            'prefix'  => 'spiral'
        ]
    ]
];