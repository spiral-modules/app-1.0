<?php
/**
 * Spiral Framework.
 *
 * @license   MIT
 * @author    Anton Titov (Wolfy-J)
 * @copyright ©2009-2015
 */
use Spiral\Components\ORM\ActiveRecord;

return array(
    'documentation' => directory('runtime') . '/ormClasses.php',
    'mutators'      => array(
        'timestamp'  => array('accessor' => 'Spiral\Components\ORM\Accessors\Timestamp'),
        'datetime'   => array('accessor' => 'Spiral\Components\ORM\Accessors\Timestamp'),
        'php:int'    => array('setter' => 'intval'),
        'php:float'  => array('setter' => 'floatval'),
        'php:string' => array('setter' => 'string'),
        'php:bool'   => array('setter' => 'boolean')
    ),
    'relations'     => array(
        ActiveRecord::BELONGS_TO         => array(
            'class'  => 'Spiral\Components\ORM\Relations\HasOne',
            'schema' => 'Spiral\Components\ORM\Schemas\Relations\BelongsToSchema',
            'loader' => 'Spiral\Components\ORM\Selector\Loaders\HasOneLoader'
        ),
        ActiveRecord::BELONGS_TO_MORPHED => array(
            'class'  => 'Spiral\Components\ORM\Relations\HasOne',
            'schema' => 'Spiral\Components\ORM\Schemas\Relations\BelongsToMorphedSchema',
            'loader' => 'Spiral\Components\ORM\Selector\Loaders\HasOneLoader'
        ),
        ActiveRecord::HAS_ONE            => array(
            'class'  => 'Spiral\Components\ORM\Relations\HasOne',
            'schema' => 'Spiral\Components\ORM\Schemas\Relations\HasOneSchema',
            'loader' => 'Spiral\Components\ORM\Selector\Loaders\HasOneLoader'
        ),
        ActiveRecord::HAS_MANY           => array(
            'class'  => 'Spiral\Components\ORM\Relations\HasOne',
            'schema' => 'Spiral\Components\ORM\Schemas\Relations\HasManySchema',
            'loader' => 'Spiral\Components\ORM\Selector\Loaders\HasOneLoader'
        ),
        ActiveRecord::MANY_TO_MANY       => array(
            'class'  => 'Spiral\Components\ORM\Relations\HasOne',
            'schema' => 'Spiral\Components\ORM\Schemas\Relations\ManyToManySchema',
            'loader' => 'Spiral\Components\ORM\Selector\Loaders\HasOneLoader'
        ),
        ActiveRecord::MANY_TO_MORPHED    => array(
            'class'  => 'Spiral\Components\ORM\Relations\HasOne',
            'schema' => 'Spiral\Components\ORM\Schemas\Relations\ManyToMorphedSchema',
            'loader' => 'Spiral\Components\ORM\Selector\Loaders\HasOneLoader'
        ),
        ActiveRecord::MANY_THOUGHT       => array(
            'class'  => 'Spiral\Components\ORM\Relations\HasOne',
            'schema' => 'Spiral\Components\ORM\Schemas\Relations\ManyThoughtSchema',
            'loader' => 'Spiral\Components\ORM\Selector\Loaders\HasOneLoader'
        ),
    )
);