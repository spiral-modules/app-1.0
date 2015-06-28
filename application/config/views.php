<?php
/**
 * View component configuration.
 */
return [
    'namespaces'      => [
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
    'caching'         => [
        'enabled'   => true,
        'directory' => directory("cache") . '/views/'
    ],
    'staticVariables' => [
        'language' => [
            'Spiral\\Components\\I18n\\Translator',
            'getLanguage'
        ],
        'basePath' => [
            'Spiral\\Components\\Http\\HttpDispatcher',
            'getBasePath'
        ]
    ],
    'engines'         => [
        'default' => [
            'extensions' => [
                'php'
            ],
            'compiler'   => 'Spiral\\Components\\View\\LayeredCompiler',
            'view'       => 'Spiral\\Components\\View\\View',
            'processors' => [
                'expressions'     => [
                    'class'       => 'Spiral\\Components\\View\\Processors\\ExpressionProcessor',
                    'expressions' => [
                        'static' => [
                            'pattern'  => '/@\\{(?P<name>[a-z0-9_\\.\\-]+)(?: *\\| *(?P<default>[^}]+))?}/i',
                            'callback' => [
                                'self',
                                'staticVariable'
                            ]
                        ]
                    ]
                ],
                'i18n'            => [
                    'class' => 'Spiral\\Components\\View\\Processors\\I18nProcessor'
                ],
                'templater'       => [
                    'class' => 'Spiral\\Components\\View\\Processors\\TemplateProcessor'
                ],
                'evaluator'       => [
                    'class' => 'Spiral\\Components\\View\\Processors\\EvaluateProcessor'
                ],
                'resourceManager' => [
                    'class' => 'Spiral\\Toolkit\\ResourceManager'
                ],
                'prettyPrint'     => [
                    'class' => 'Spiral\\Components\\View\\Processors\\PrettyPrintProcessor'
                ]
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