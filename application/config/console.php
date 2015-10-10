<?php
/**
 * Configuration only used to declare sequence of commands and their options to be used in
 * update and configure command.
 */
return [
    'updateSequence'    => [
        'migrate'           => [
            'options' => ['--quiet' => true],
            'footer'  => ' '
        ],
        'odm:schema'        => [
            'options' => []
        ],
        'orm:schema'        => [
            'options' => []
        ],
        'document:phpstorm' => [
            'header'  => "\n<info>Generating tooltips and hints for PHPStorm...</info>",
            'options' => []
        ],
        'inspect'           => [
            'header'  => "\n<info>Inspecting available DataEntities...</info>",
            'options' => []
        ]
    ],
    'configureSequence' => [

    ]
];