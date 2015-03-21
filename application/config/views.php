<?php
/**
 * View component configuration.
 */
return array(    
'namespaces'        => array(
        'default'  => array(
            directory("application") . '/views/'
        ),
        'spiral'   => array(
            directory("application") . '/views/spiral/',
            directory("framework") . '/views/',
            directory("libraries") . '/spiral/markdown/views/',
            directory("libraries") . '/spiral/toolkit/views/'
        ),
        'profiler' => array(
            directory("libraries") . '/spiral/profiler/views/'
        )
    ),
    'caching'           => array(
        'enabled'   => true,
        'directory' => directory("cache") . '/views/'
    ),
    'variableProviders' => array(
        'i18n',
        'http'
    ),
    'processors'        => array(
        'staticVariables' => array(
            'class' => 'Spiral\\Components\\View\\Processors\\StaticProcessor'
        ),
        'localization'    => array(
            'class' => 'Spiral\\Components\\View\\Processors\\LocalizationProcessor'
        ),
        'templater'       => array(
            'class' => 'Spiral\\Components\\View\\Processors\\TemplateProcessor'
        ),
        'evaluator'       => array(
            'class' => 'Spiral\\Components\\View\\Processors\\EvaluateProcessor'
        ),
        'shortTags'       => array(
            'class' => 'Spiral\\Components\\View\\Processors\\ShortTagsProcessor'
        ),
        'prettyPrint'     => array(
            'class' => 'Spiral\\Components\\View\\Processors\\PrettyPrintProcessor'
        )
    )
);