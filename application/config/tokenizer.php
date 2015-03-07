<?php
/**
 * Spiral Framework.
 *
 * @license   MIT
 * @author    Anton Titov (Wolfy-J)
 * @copyright ©2009-2015
 */
return array(
    'directories' => array(
        directory('application'), directory('libraries')
    ),
    'exclude'     => array(
        \Spiral\Facades\File::normalizePath(directory('runtime')), 'tests', 'example', 'predis', 'phpunit', '/_', 'symfony',
        'doctrine', 'Test', 'migrations', 'views', 'examples', 'test', 'Tests', 'composer'
    )
);