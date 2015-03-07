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
            'pluralizer' => array(
                'countForms' => 2,
                'formula'    => '$number==1?$form[0]:$form[1]'
            )
        ),
        'ru' => array(
            'dataFolder' => directory('runtime') . '/i18n/russian/',
            'pluralizer' => array(
                'countForms' => 3,
                'formula'    => '($number%10==1&&$number%100!=11?$form[0]:($number%10>=2&&$number%10<=4&&($number%100<10||$number%100>=20)?$form[1]:$form[2]))'
            )
        )
    )
);