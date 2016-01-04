<?php
/**
 * CacheManager component configuration file. Attention, configs might include runtime code which
 * depended on environment values only.
 *
 * @see CacheConfig
 */
use Spiral\Cache\Stores;

return [
    /*
     * Class name of default cache store to be used by application. You can all request specific
     * store class in your dependencies.
     */
    'store'  => env('CACHE_STORE', 'files'),
    'stores' => [
        /*
         * Slow cache store to be used in develop environments.
         */
        'files'    => [
            'class'     => Stores\FileStore::class,
            'directory' => directory('runtime') . 'cache/',
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
                ['host' => 'localhost', 'port' => 11211, 'persistent' => true],
                /*{{memcache.servers}}*/
            ]
        ],
        /*{{stores}}*/
    ]
];