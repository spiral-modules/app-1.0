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
    'header'    => [
        '{project-name}',
        '',
        '@author {author-name}'
    ],

    /*
     * Base directory for generated classes, class will be automatically localed into sub directory
     * using given namespace.
     */
    'directory' => directory('application') . 'classes/',

    /*
     * Default namespace to be applied for every generated class.
     *
     * Example: 'namespace' => 'MyApplication'
     * Controllers: MyApplication\Controllers\SampleController
     */
    'namespace' => '',

    /*
     * This is set of default settings to be used for your scaffolding commands.
     */
    'elements'  => [
        'controller'     => [
            'namespace' => 'Controllers',
            'postfix'   => 'Controller',
            'class'     => Declarations\ControllerDeclaration::class
        ],
        'middleware'     => [
            'namespace' => 'Middlewares',
            'postfix'   => '',
            'class'     => Declarations\MiddlewareDeclaration::class
        ],
        'command'        => [
            'namespace' => 'Commands',
            'postfix'   => 'Command',
            'class'     => Declarations\CommandDeclaration::class
        ],
        'service'        => [
            'namespace' => 'Models',
            'postfix'   => 'Service',
            'class'     => Declarations\ServiceDeclaration::class
        ],
        'request'        => [
            'namespace' => 'Requests',
            'postfix'   => '',
            'class'     => Declarations\RequestDeclaration::class,
            'mapping'   => [
                'int'    => [
                    'source'    => 'data',
                    'setter'    => 'intval',
                    'validates' => [
                        'notEmpty',
                        'integer'
                    ]
                ],
                'float'  => [
                    'source'    => 'data',
                    'setter'    => 'floatval',
                    'validates' => [
                        'notEmpty',
                        'float'
                    ]
                ],
                'string' => [
                    'source'    => 'data',
                    'setter'    => 'strval',
                    'validates' => [
                        'notEmpty',
                        'string'
                    ]
                ],
                'bool'   => [
                    'source'    => 'data',
                    'setter'    => 'boolval',
                    'validates' => [
                        'notEmpty',
                        'boolean'
                    ]
                ],
                'email'  => [
                    'source'    => 'data',
                    'type'      => 'string',
                    'setter'    => 'strval',
                    'validates' => [
                        'notEmpty',
                        'string',
                        'email'
                    ]
                ],
                'file'   => [
                    'source'    => 'file',
                    'type'      => '\Psr\Http\Message\UploadedFileInterface',
                    'validates' => [
                        'file::uploaded'
                    ]
                ],
                'image'  => [
                    'source'    => 'file',
                    'type'      => '\Psr\Http\Message\UploadedFileInterface',
                    'validates' => [
                        "image::uploaded",
                        "image::valid"
                    ]
                ],
                /*{{request.mapping}}*/
            ]
        ],
        'record'         => [
            'namespace' => 'Database',
            'postfix'   => '',
            'class'     => Declarations\Database\RecordDeclaration::class
        ],
        'document'       => [
            'namespace' => 'Database',
            'postfix'   => '',
            'class'     => Declarations\Database\DocumentDeclaration::class
        ],
        'documentEntity' => [
            'namespace' => 'Database',
            'postfix'   => '',
            'class'     => Declarations\Database\DocumentEntityDeclaration::class
        ],
        /*{{elements}}*/
    ],
];