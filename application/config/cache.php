<?php
/**
 * CacheManager configuration:
 * - default cache store
 * - list of cache stored associated with their name, store class and set of custom options
 */
use Spiral\Cache\Stores;

return [
    'store'  => 'memcache',
    'stores' => [
        'file'     => [
            'class'     => Stores\FileStore::class,
            'directory' => directory('cache'),
            'extension' => 'cache'
        ],
        'xcache'   => [
            'class'  => Stores\XCacheStore::class,
            'prefix' => 'spiral:'
        ],
        'apc'      => [
            'class'  => Stores\APCStore::class,
            'prefix' => 'spiral:'
        ],
        'memcache' => [
            'class'   => Stores\MemcacheStore::class,
            'prefix'  => 'spiral:',
            'options' => [],
            'servers' => [
                ['host' => 'localhost', 'port' => 11211, 'persistent' => true]
            ]
        ]
    ]
];