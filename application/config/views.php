<?php
/**
 * Configuration of ViewManager component and view engines:
 * - compiled view cache state and location
 * - view namespaces associated with list of source directories
 * - list of view dependencies, used by default compiler to create unique cache name
 * - list of view engines associated with their extension, compiler and default view class
 */
return [
    'cache'        => [
        'enabled'   => true,
        'directory' => directory("cache") . 'views/'
    ],
    'namespaces'   => [
        'default'  => [
            directory("application") . 'views/'
        ],
        'spiral'   => [
            directory("application") . 'views/spiral/',
            directory("libraries") . 'spiral/framework/source/views/',
            directory("libraries") . 'spiral/toolkit/source/views/'
        ],
        'profiler' => [
            directory("libraries") . 'spiral/profiler/source/views/'
        ]
    ],
    'dependencies' => [
        'language' => [
            'i18n',
            'getLanguage'
        ],
        'basePath' => [
            'http',
            'basePath'
        ]
    ],
    'engines'      => [
        'default' => [
            'extensions' => [
                'php'
            ],
            'compiler'   => 'Spiral\Views\Compiler',
            'view'       => 'Spiral\Views\View',
            'processors' => [
                'Spiral\Views\Processors\ExpressionsProcessor' => [],
                'Spiral\Views\Processors\TranslateProcessor'   => [],
                'Spiral\Views\Processors\TemplateProcessor'    => [],
                'Spiral\Views\Processors\EvaluateProcessor'    => [],
                'Spiral\Views\Processors\PrettifyProcessor'    => [],
                'Spiral\Toolkit\ResourceManager'                => []
            ]
        ]
    ]
];