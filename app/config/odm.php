<?php
/**
 * ODM databases and schema builder configuration. Attention, configs might include runtime code
 * which depended on environment values only.
 *
 * @see ODMConfig
 */
use Spiral\Models\Accessors;
use Spiral\ODM\Accessors\ScalarArray;
use Spiral\ODM\Entities\MongoDatabase;
use Spiral\ODM\ODM;

return [
    /*
    * Here you can specify name/alias for database to be treated as default in your application.
    * Such database will be returned from ODM->database(null) call and also can be
    * available using $this->db shared binding.
    */
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
            'database'  => 'spiral-empty',
            'options'   => [
                'connect' => true
            ]
        ],
        /*{{databases}}*/
    ],
    'schemas'   => [
        /*
         * Set of mutators to be applied for specific field types.
         */
        'mutators'       => [
            'int'       => ['setter' => 'intval'],
            'float'     => ['setter' => 'floatval'],
            'string'    => ['setter' => 'strval'],
            'long'      => ['setter' => 'intval'],
            'bool'      => ['setter' => 'boolval'],
            'MongoId'   => ['setter' => [ODM::class, 'mongoID']],
            'array'     => ['accessor' => ScalarArray::class],
            'MongoDate' => ['accessor' => Accessors\MongoTimestamp::class],
            'timestamp' => ['accessor' => Accessors\MongoTimestamp::class],
            'storage'   => ['accessor' => Accessors\StorageAccessor::class],
            /*{{mutators}}*/
        ],
        'mutatorAliases' => [
            /*
             * Mutator aliases can be used to declare custom getter and setter filter methods.
             */
            /*{{mutators.aliases}}*/
        ]
    ]
];