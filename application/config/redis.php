<?php
/**
 * Spiral Framework.
 *
 * @license   MIT
 * @author    Anton Titov (Wolfy-J)
 * @copyright ©2009-2015
 */
return [
    'clients' => [
        'default' => [
            'servers' => ['host' => '127.0.0.1', 'port' => 6379],
            'options' => []
        ]
    ],
    'aliases' => [
        'client' => 'default',
        'redis'  => 'default'
    ]
];