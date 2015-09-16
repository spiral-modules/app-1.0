<?php
/**
 * Configuration of reactor generators including class postfix, namespaces and output location.
 * Request mapping includes set of default mutators and validation rules for known types.
 */
return [
    'header'     => [
        '{project-name}',
        '',
        '@author    {author-name}'
    ],
    'generators' => [
        'controller' => [
            'namespace' => 'Controllers',
            'postfix'   => 'Controller',
            'directory' => directory('application') . 'classes/Controllers/'
        ],
        'service'    => [
            'namespace' => 'Services',
            'postfix'   => 'Service',
            'directory' => directory('application') . 'classes/Services/'
        ],
        'entity'     => [
            'namespace' => 'Database',
            'postfix'   => '',
            'directory' => directory('application') . 'classes/Database/'
        ],
        'command'    => [
            'namespace' => 'Commands',
            'postfix'   => 'Command',
            'directory' => directory('application') . 'classes/Commands/'
        ],
        'middleware' => [
            'namespace' => 'Middlewares',
            'postfix'   => 'Middleware',
            'directory' => directory('application') . 'classes/Middlewares/'
        ],
        'migration'  => [
            'namespace' => 'Migrations',
            'postfix'   => 'Migration',
            //We only need to write class somewhere temporary, migrator will move it to correct location
            'directory' => directory('runtime')
        ],
        'request'    => [
            'namespace' => 'Requests',
            'postfix'   => 'Request',
            'directory' => directory('application') . 'classes/Requests/',
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
                    'type'      => '\Zend\Diactoros\UploadedFile',
                    'validates' => [
                        'file::uploaded'
                    ]
                ],
                'image'  => [
                    'source'    => 'file',
                    'type'      => '\Zend\Diactoros\UploadedFile',
                    'validates' => [
                        "image::uploaded",
                        "image::valid"
                    ]
                ]
            ]
        ],
    ]
];