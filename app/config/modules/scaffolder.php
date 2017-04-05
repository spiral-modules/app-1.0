<?php
/**
 * Scaffolding module component configuration file. Attention, configs might include runtime code
 * which depended on environment values only.
 *
 * @see ScaffolderConfig
 */
use Spiral\Scaffolder\Declarations;

return [
    /*
     * This is set of comment lines to be applied to every scaffolded file, you can use env() function
     * to make it developer specific or set one universal pattern per project.
     */
    'header'       => [
        '{project-name}',
        '',
        '@author {author-name}'
    ],

    /*
     * Base directory for generated classes, class will be automatically localed into sub directory
     * using given namespace.
     */
    'directory'    => directory('application') . 'classes/',

    /*
     * Default namespace to be applied for every generated class.
     *
     * Example: 'namespace' => 'MyApplication'
     * Controllers: MyApplication\Controllers\SampleController
     */
    'namespace'    => '',

    /*
     * This is set of default settings to be used for your scaffolding commands.
     */
    'declarations' => [
        'controller' => [
            'namespace' => 'Controllers',
            'postfix'   => 'Controller',
            'class'     => Declarations\ControllerDeclaration::class
        ],
        'service'    => [
            'namespace' => 'Models',
            'postfix'   => 'Service',
            'class'     => Declarations\ServiceDeclaration::class
        ],
        'middleware' => [
            'namespace' => 'Middlewares',
            'postfix'   => '',
            'class'     => Declarations\MiddlewareDeclaration::class
        ],
        'command'    => [
            'namespace' => 'Commands',
            'postfix'   => 'Command',
            'class'     => Declarations\CommandDeclaration::class
        ],
        'request'    => [
            'namespace' => 'Requests',
            'postfix'   => 'Request',
            'class'     => Declarations\RequestDeclaration::class,
            'options'   => [
                //Set of default filters and validate rules for various types
                'mapping' => [
                    'int'    => [
                        'source'    => 'data',
                        'setter'    => 'intval',
                        'validates' => ['notEmpty', 'integer']
                    ],
                    'float'  => [
                        'source'    => 'data',
                        'setter'    => 'floatval',
                        'validates' => ['notEmpty', 'float']
                    ],
                    'string' => [
                        'source'    => 'data',
                        'setter'    => 'strval',
                        'validates' => ['notEmpty', 'string']
                    ],
                    'bool'   => [
                        'source'    => 'data',
                        'setter'    => 'boolval',
                        'validates' => ['notEmpty', 'boolean']
                    ],
                    'email'  => [
                        'source'    => 'data',
                        'setter'    => 'strval',
                        'validates' => ['notEmpty', 'string', 'email']
                    ],
                    'file'   => [
                        'source'    => 'file',
                        'validates' => ['file::uploaded']
                    ],
                    'image'  => [
                        'source'    => 'file',
                        'validates' => ["image::uploaded", "image::valid"]
                    ],
                    /*{{request.mapping}}*/
                ]
            ]
        ],
        'record'     => [
            'namespace' => 'Database',
            'postfix'   => '',
            'class'     => Declarations\Database\RecordDeclaration::class
        ],
        'document'   => [
            'namespace' => 'Database',
            'postfix'   => '',
            'class'     => Declarations\Database\DocumentDeclaration::class
        ],
        'migration'  => [
            'namespace' => '',
            'postfix'   => 'Migration',
            'class'     => Declarations\MigrationDeclaration::class
        ]
        /*{{elements}}*/
    ],
];