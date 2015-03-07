<?php
/**
 * Cache configuration.
 */
return array(
    'store'  => 'memcache',
    'stores' => array(
        'file'     => array(
            'class'     => 'Spiral\Components\Cache\Stores\FileStore',
            'directory' => directory('cache'),
            'extension' => 'cache'
        ),
        'xcache'   => array(
            'class'  => 'Spiral\Components\Cache\Stores\XcacheStore',
            'prefix' => 'spiral'
        ),
        'memcache' => array(
            'class'   => 'Spiral\Components\Cache\Stores\MemcacheStore',
            'prefix'  => 'spiral',
            'options' => array(),
            'servers' => array(
                array(
                    'host'       => 'localhost',
                    'port'       => 11211,
                    'persistent' => true
                )
            )
        ),
        'redis'    => array(
            'class'   => 'Spiral\Components\Cache\Stores\RedisStore',
            'enabled' => true,
            'client'  => 'default',
            'prefix'  => 'spiral'
        )
    )
);