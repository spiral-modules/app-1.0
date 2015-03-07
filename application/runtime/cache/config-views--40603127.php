<?php return array (
  'namespaces' => 
  array (
    'default' => 
    array (
      0 => 'D:\\Projects\\domains\\spiral-application.dev/application/views/',
    ),
    'spiral' => 
    array (
      0 => 'D:\\Projects\\domains\\spiral-application.dev/application/views/spiral/',
      1 => 'D:\\Projects\\domains\\spiral-application.dev\\libraries\\spiral\\framework\\framework/views/',
      2 => 'D:\\Projects\\domains\\spiral-application.dev/application/classes/Spiral/Markdown/views/',
    ),
  ),
  'caching' => 
  array (
    'enabled' => true,
    'directory' => 'D:\\Projects\\domains\\spiral-application.dev/application/runtime/cache/views/',
  ),
  'variableProviders' => 
  array (
    0 => 'i18n',
  ),
  'processors' => 
  array (
    'staticVariables' => 
    array (
      'class' => 'Spiral\\Components\\View\\Processors\\StaticProcessor',
    ),
    'i18n' => 
    array (
      'class' => 'Spiral\\Components\\View\\Processors\\I18nProcessor',
    ),
    'templater' => 
    array (
      'class' => 'Spiral\\Components\\View\\Processors\\TemplateProcessor',
    ),
    'evaluator' => 
    array (
      'class' => 'Spiral\\Components\\View\\Processors\\EvaluateProcessor',
    ),
    'shortTags' => 
    array (
      'class' => 'Spiral\\Components\\View\\Processors\\ShortTagsProcessor',
    ),
    'prettyPrint' => 
    array (
      'class' => 'Spiral\\Components\\View\\Processors\\PrettyPrintProcessor',
    ),
  ),
);