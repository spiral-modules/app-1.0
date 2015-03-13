<?php
/**
 * View component configuration.
 */
return array(    
'namespaces'        => array(
        'default' => array(
            directory("application") . '/views/'
        ),
        'spiral'  => array(
            directory("application") . '/views/spiral/',
            directory("framework") . '/views/',
            directory("libraries") . '/spiral/markdown/views/'
        )
    ),
    'caching'           => array(
        'enabled'   => true,
        'directory' => directory("cache") . '/views/'
    ),
    'variableProviders' => array(
        'i18n'
    ),
    'processors'        => array(
        'staticVariables' => array(
            'class' => 'Spiral\\Components\\View\\Processors\\StaticProcessor'
        ),
        'i18n'            => array(
            'class' => 'Spiral\\Components\\View\\Processors\\I18nProcessor'
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