<?php
/**
 * View component configuration.
 */
return [
    'namespaces'   => [
        'default'  => [
            directory("application") . '/views/'
        ],
        'spiral'   => [
            directory("application") . '/views/spiral/',
            directory("framework") . '/views/',
            directory("libraries") . '/spiral/toolkit/source/views/'
        ],
        'profiler' => [
            directory("libraries") . '/spiral/profiler/source/views/'
        ]
    ],
    'caching'      => [
        'enabled'   => true,
        'directory' => directory("cache") . '/views/'
    ],
    'dependencies' => [
        'language' => [
            'Spiral\\Components\\I18n\\Translator',
            'getLanguage'
        ],
        'basePath' => [
            'Spiral\\Components\\Http\\HttpDispatcher',
            'getBasePath'
        ]
    ],
    'engines'      => [
        'default' => [
            'extensions' => [
                'php'
            ],
            'compiler'   => 'Spiral\\Components\\View\\Compiler\\Compiler',
            'view'       => 'Spiral\\Components\\View\\View',
            'processors' => [
                'Spiral\\Components\\View\\Compiler\\Processors\\ExpressionsProcessor' => [],
                'Spiral\\Components\\View\\Compiler\\Processors\\I18nProcessor'        => [],
                'Spiral\\Components\\View\\Compiler\\Processors\\TemplateProcessor'    => [],
                'Spiral\\Components\\View\\Compiler\\Processors\\EvaluateProcessor'    => [],
                'Spiral\\Toolkit\\ResourceManager'                                     => [],
                'Spiral\\Components\\View\\Compiler\\Processors\\PrettifyProcessor'    => []
            ]
        ],
        'plain'   => [
            'extensions' => [
                'html',
                'template'
            ],
            'compiler'   => false,
            'view'       => 'Spiral\\Components\\View\\View'
        ]
    ]
];