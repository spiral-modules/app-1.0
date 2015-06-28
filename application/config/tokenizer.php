<?php
/**
 * Spiral Framework.
 *
 * @license   MIT
 * @author    Anton Titov (Wolfy-J)
 * @copyright ©2009-2015
 */
return [
    'directories' => [
        directory('application'), directory('libraries')
    ],
    'exclude'     => [
        \Spiral\Facades\File::normalizePath(directory('runtime')), 'tests', 'example', 'predis', 'phpunit', '/_', 'symfony',
        'doctrine', 'Test', 'migrations', 'views', 'examples', 'test', 'Tests', 'composer'
    ]
];