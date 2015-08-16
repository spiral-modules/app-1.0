<?php
/**
 * RedisManager configuration including client configurations, default client id and set of client
 * name aliases used in controllable injections.
 */
return [
    'default' => 'default',
    'clients' => [
        'default' => [
            'servers' => [
                'host' => '127.0.0.1',
                'port' => 6379
            ],
            'options' => []
        ]
    ],
    'aliases' => [
        'client' => 'default',
        'redis'  => 'default'
    ]
];