<?php
/**
 * Spiral Framework.
 *
 * @license   MIT
 * @author    Anton Titov (Wolfy-J)
 * @copyright ©2009-2015
 */
return array(
    'databases'     => array(
        'default' => array(
            'server'   => 'mongodb://localhost:27017',
            'database' => 'spiral',
            'options'  => array(
                'connect' => true
            )
        )
    ),
    'aliases'       => array(
        'database' => 'default',
        'db'       => 'default',
        'mongo'    => 'default'
    ),
    'documentation' => directory('runtime') . '/odmClasses.php',
    'mutators'      => array(
        'int'       => array('setter' => 'intval'),
        'float'     => array('setter' => 'floatval'),
        'string'    => array('setter' => 'string'),
        'bool'      => array('setter' => 'boolean'),
        'MongoId'   => array('setter' => 'mongoID'),
        'array'     => array('accessor' => 'Spiral\Components\ODM\Accessors\ScalarArray'),
        'MongoDate' => array('accessor' => 'Spiral\Components\ODM\Accessors\Timestamp'),
        'timestamp' => array('accessor' => 'Spiral\Components\ODM\Accessors\Timestamp'),
    ),
);