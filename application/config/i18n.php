<?php
/**
 * Internalization.
 */
return array(
    'default'   => 'en',
    'plurals'   => 'plural-phrases',
    'languages' => array(
        'en' => array(
            'dataFolder' => directory('runtime') . '/i18n/english/',
            'pluralizer' => 'Spiral\Components\I18n\Pluralizers\EnglishPluralizer'
        ),
        'ru' => array(
            'dataFolder' => directory('runtime') . '/i18n/russian/',
            'pluralizer' => 'Spiral\Components\I18n\Pluralizers\RussianPluralizer'
        )
    )
);