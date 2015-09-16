<?php
/**
 * Configuration of ViewManager component and view engines:
 * - list of view namespaces associated with their source directories
 * - compiled views cache location and enabled flag
 * - list of default view dependency providers (provider will be resolved using Container)
 * - view engines with specified compiler and rendered, associated with their view extension and
 *   set of engine specific options
 */
return [
    'cache' => [
        'enabled'   => true,
        'directory' => directory("cache") . 'views/'
    ],
];