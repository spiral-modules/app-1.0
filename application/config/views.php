<?php
/**
 * View component configuration.
 */
return array(
    'namespaces'      => array(
        'default'  => array(
            directory("application") . '/views/'
        ),
        'spiral'   => array(
            directory("application") . '/views/spiral/',
            directory("framework") . '/views/',
            directory("libraries") . '/spiral/toolkit/views/'
        ),
        'profiler' => array(
            directory("libraries") . '/spiral/profiler/views/'
        )
    ),
    'caching'         => array(
        'enabled'   => true,
        'directory' => directory("cache") . '/views/'
    ),
    'staticVariables' => array(
        'language' => array(
            'i18n',
            'getLanguage'
        ),
        'basePath' => array(
            'http',
            'getBasePath'
        )
    ),
    'engines'         => array(
        'default' => array(
            'extensions' => array('php'),
            'compiler'   => 'Spiral\Components\View\LayeredCompiler',
            'view'       => 'Spiral\Components\View\View',
            'processors' => array(
                'variables'   => array(
                    'class' => 'Spiral\\Components\\View\\Processors\\VariablesProcessor'
                ),
                'i18n'        => array(
                    'class' => 'Spiral\\Components\\View\\Processors\\I18nProcessor'
                ),
                'templater'   => array(
                    'class' => 'Spiral\\Components\\View\\Processors\\TemplateProcessor'
                ),
                'evaluator'   => array(
                    'class' => 'Spiral\\Components\\View\\Processors\\EvaluateProcessor'
                ),
                'shortTags'   => array(
                    'class' => 'Spiral\\Components\\View\\Processors\\ShortTagsProcessor'
                ),
                'prettyPrint' => array(
                    'class' => 'Spiral\\Components\\View\\Processors\\PrettyPrintProcessor'
                )
            )
        ),
        'plain'   => array(
            'extensions' => array('html', 'template'),
            'compiler'   => false,
            'view'       => 'Spiral\Components\View\View'
        )
    )
);