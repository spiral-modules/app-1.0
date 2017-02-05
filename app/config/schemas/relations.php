<?php
/**
 * ORM configuration and mapping.
 * - relation classes including schema generators, loaders and relation representers
 */
use Spiral\ORM\Configs\RelationsConfig;
use Spiral\ORM\Entities\Loaders;
use Spiral\ORM\Entities\Relations;
use Spiral\ORM\Record;
use Spiral\ORM\Schemas;

return [
    Record::BELONGS_TO         => [
        RelationsConfig::SCHEMA_CLASS => Schemas\Relations\BelongsToSchema::class,
        RelationsConfig::LOADER_CLASS => Loaders\BelongsToLoader::class,
        RelationsConfig::ACCESS_CLASS => Relations\BelongsToRelation::class
    ],
    Record::HAS_ONE            => [
        RelationsConfig::SCHEMA_CLASS => Schemas\Relations\HasOneSchema::class,
        RelationsConfig::LOADER_CLASS => Loaders\HasOneLoader::class,
        RelationsConfig::ACCESS_CLASS => Relations\HasOneRelation::class
    ],
    Record::HAS_MANY           => [
        RelationsConfig::SCHEMA_CLASS => Schemas\Relations\HasManySchema::class,
        RelationsConfig::LOADER_CLASS => Loaders\HasManyLoader::class,
        RelationsConfig::ACCESS_CLASS => Relations\HasManyRelation::class
    ],
    Record::MANY_TO_MANY       => [
        RelationsConfig::SCHEMA_CLASS => Schemas\Relations\ManyToManySchema::class,
        RelationsConfig::LOADER_CLASS => Loaders\ManyToManyLoader::class,
        RelationsConfig::ACCESS_CLASS => Relations\ManyToManyRelation::class
    ],
    Record::BELONGS_TO_MORPHED => [
        RelationsConfig::SCHEMA_CLASS => Schemas\Relations\BelongsToMorphedSchema::class,
        RelationsConfig::ACCESS_CLASS => Relations\BelongsToMorphedRelation::class
    ],
    Record::MANY_TO_MORPHED    => [
        RelationsConfig::SCHEMA_CLASS => Schemas\Relations\ManyToMorphedSchema::class,
        RelationsConfig::ACCESS_CLASS => Relations\ManyToMorphedRelation::class
    ],
    /*{{relations}}*/
];