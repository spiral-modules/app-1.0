<?php
/**
 * ODM component configuration and mapping.
 * - default database alias/name
 * - list of database name aliases used for injections and other operations
 * - list of mongo databases associated with their server, name, profiling mode and options
 * - ODM SchemaBuilder configuration
 *      - set of default mutators associated with field type
 *      - mutator aliases to be used in model definitions
 */
use Spiral\Models\Accessors;
use Spiral\ODM\Accessors\ScalarArray;
use Spiral\ODM\Entities\MongoDatabase;
use Spiral\ODM\ODM;

return [
    'default'   => 'default',
    'aliases'   => [
        'database' => 'default',
        'db'       => 'default',
        'mongo'    => 'default'
    ],
    'databases' => [
        'default' => [
            'server'    => 'mongodb://localhost:27017',
            'profiling' => MongoDatabase::PROFILE_SIMPLE,
            'database'  => 'spiral',
            'options'   => [
                'connect' => true
            ]
        ]
    ],
    'schemas'   => [
        'mutators'       => [
            'int'       => ['setter' => 'intval'],
            'float'     => ['setter' => 'floatval'],
            'string'    => ['setter' => 'strval'],
            'bool'      => ['setter' => 'boolval'],
            'MongoId'   => ['setter' => [ODM::class, 'mongoID']],
            'array'     => ['accessor' => ScalarArray::class],
            'MongoDate' => ['accessor' => Accessors\ODMTimestamp::class],
            'timestamp' => ['accessor' => Accessors\ODMTimestamp::class],
            'storage'   => ['accessor' => Accessors\StorageAccessor::class]
        ],
        'mutatorAliases' => [
        ]
    ]
];