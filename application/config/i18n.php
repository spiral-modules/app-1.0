<?php
/**
 * Internalization.
 */
return [
    'default'   => 'en',
    'plurals'   => 'plural-phrases',
    'languages' => [
        'en' => [
            'dataFolder' => directory('runtime') . '/i18n/english/',
            'pluralizer' => 'Spiral\Components\I18n\Pluralizers\EnglishPluralizer'
        ],
        'ru' => [
            'dataFolder' => directory('runtime') . '/i18n/russian/',
            'pluralizer' => 'Spiral\Components\I18n\Pluralizers\RussianPluralizer'
        ]
    ]
];