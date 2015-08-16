<?php
/**
 * Configuration only used to declare sequence of commands and their options to be used in
 * update command.
 */
return [
    'updateSequence' => [
        'migrate'    => [
            'options' => ['--quiet' => true],
            'footer'  => ' '
        ],
        'orm:schema' => [
            'options' => []
        ],
        'odm:schema' => [
            'options' => []
        ],
        'inspect'    => [
            'header'  => "\n<info>Inspecting available DataEntities...</info>",
            'options' => []
        ]
    ]
];