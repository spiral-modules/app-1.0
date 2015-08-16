<?php
/**
 * Spiral tokenizer component configuration, includes only black and white listed directories to
 * be indexed.
 */
return [
    'directories' => [
        directory('application'), directory('libraries')
    ],
    'exclude' => [
        'runtime', 'tests', 'example', 'predis', 'phpunit', 'intervention', '/_', 'symfony', 'psr', 'doctrine',
        'migrations', 'views', 'tests', 'zendframework', 'guzzle', 'slugify', 'carbon'
    ]
];