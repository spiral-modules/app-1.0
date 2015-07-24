<?php
/**
 * Spiral Framework.
 *
 * @license   MIT
 * @author    Anton Titov (Wolfy-J)
 * @copyright ©2009-2015
 */

//Runtime directory path
$runtime = \Spiral\Proxies\File::normalizePath(directory('runtime'));

return [
    'directories' => [
        directory('application'),
        directory('libraries')
    ],
    'exclude'     => [
        $runtime,
        'tests',
        'example',
        'predis',
        'phpunit',
        '/_',
        'symfony',
        'doctrine',
        'Test',
        'migrations',
        'views',
        'examples',
        'test',
        'Tests',
        'composer',
        'guzzle'
    ]
];