<?php
/**
 * Spiral Framework.
 *
 * @license   MIT
 * @author    Anton Titov (Wolfy-J)
 * @copyright ©2009-2015
 */
return [
    'databases'     => [
        'default' => [
            'server'   => 'mongodb://localhost:27017',
            'database' => 'spiral',
            'options'  => [
                'connect' => true
            ]
        ]
    ],
    'aliases'       => [
        'database' => 'default',
        'db'       => 'default',
        'mongo'    => 'default'
    ],
    'documentation' => directory('runtime') . '/odmClasses.php',
    'mutators'      => [
        'int'           => ['setter' => 'intval'],
        'float'         => ['setter' => 'floatval'],
        'string'        => ['setter' => 'string'],
        'bool'          => ['setter' => 'boolean'],
        'MongoId'       => ['setter' => 'mongoID'],
        'array'         => ['accessor' => 'Spiral\Components\ODM\Accessors\ScalarArray'],
        'MongoDate'     => ['accessor' => 'Spiral\Components\ODM\Accessors\Timestamp'],
        'timestamp'     => ['accessor' => 'Spiral\Components\ODM\Accessors\Timestamp'],
        'storageObject' => ['accessor' => 'Spiral\Components\ODM\Accessors\StorageAccessor']
    ],
];