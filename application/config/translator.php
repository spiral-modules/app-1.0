<?php
/**
 * Translator component options.
 * - default language to be used
 * - bundle name to store plural phrases
 * - language options, including bundle storage directory (memory location) and pluralizer class
 */
use Spiral\Translator\Pluralizers;

return [
    'default'   => 'en',
    'plurals'   => 'plural-phrases',
    'languages' => [
        'en' => [
            'directory'  => directory('runtime') . '/i18n/english/',
            'pluralizer' => Pluralizers\EnglishPluralizer::class
        ],
        'by' => [
            'directory'  => directory('runtime') . '/i18n/belarus/',
            'pluralizer' => Pluralizers\RussianPluralizer::class
        ]
    ]
];