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
    'store'  => env('CACHE_STORE'),
    'stores' => [
        /*
         * Slow cache store to be used in develop environments.
         */
        Stores\FileStore::class     => [
            'directory' => directory('runtime') . 'data-cache/',
            'extension' => 'cache'
        ],
        /*
         * Only when xCache is installed.
         */
        Stores\XCacheStore::class   => [
            'prefix' => 'spiral:'
        ],
        /*
         * Can work APC and APCU extensions.
         */
        Stores\APCStore::class      => [
            'prefix' => 'spiral:'
        ],
        /*
         * Can work with memcached and memcache extensions.
         */
        Stores\MemcacheStore::class => [
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