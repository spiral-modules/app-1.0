<?php
/**
 * Storage manager configuration. Attention, configs might include runtime code which depended on
 * environment values only.
 *
 * @see StorageConfig
 */
use Spiral\Storage\Servers;

return [
    'servers' => [
        'local'     => [
            'class'   => Servers\LocalServer::class,
            'options' => [
                'home' => directory('root')
            ]
        ],
        'amazon'    => [
            'class'   => Servers\AmazonServer::class,
            'options' => [
                'accessKey' => '',
                'secretKey' => '',
            ]
        ],
        'rackspace' => [
            'class'   => Servers\RackspaceServer::class,
            'options' => [
                'username' => '',
                'apiKey'   => ''
            ]
        ],
        'ftp'       => [
            'class'   => Servers\FtpServer::class,
            'options' => [
                'host'     => '127.0.0.1',
                'login'    => 'Wolfy-J',
                'password' => '',
                'home'     => '/'
            ]
        ],
        'sftp'      => [
            'class'   => Servers\SftpServer::class,
            'options' => [
                'host'       => 'hostname.com',
                'home'       => '/home/',
                'authMethod' => 'pubkey',
                'username'   => '',
                'password'   => '',
                'publicKey'  => '',
                'privateKey' => ''
            ]
        ],
        'gridfs'    => [
            'class'   => Servers\GridfsServer::class,
            'options' => [
                'database' => 'default'
            ]
        ],
        /*{{servers}}*/
    ],
    'buckets' => [
        'local'     => [
            'server'  => 'local',
            'prefix'  => 'local:',
            'options' => [
                //Directory has to be specified relatively to root directory of associated server
                'directory' => 'application/runtime/storage/'
            ]
        ],
        'uploads'   => [
            'server'  => 'local',
            'prefix'  => '/uploads/',
            'options' => [
                //Directory has to be specified relatively to root directory of associated server
                'directory' => 'webroot/uploads/'
            ]
        ],
        'amazon'    => [
            'server'  => 'amazon',
            'prefix'  => 'https://s3.amazonaws.com/my-bucket/',
            'options' => [
                'public' => true,
                'bucket' => 'my-bucket'
            ]
        ],
        'rackspace' => [
            'server'  => 'rackspace',
            'prefix'  => 'rackspace:',
            'options' => [
                'container' => 'container-name',
                'region'    => 'DFW'
            ]
        ],
        'ftp'       => [
            'server'  => 'ftp',
            'prefix'  => 'ftp:',
            'options' => [
                'directory' => '/',
                'mode'      => \Spiral\Files\FilesInterface::RUNTIME
            ]
        ],
        'sftp'      => [
            'server'  => 'sftp',
            'prefix'  => 'sftp:',
            'options' => [
                'directory' => 'uploads',
                'mode'      => \Spiral\Files\FilesInterface::RUNTIME
            ]
        ],
        'gridfs'    => [
            'server'  => 'gridfs',
            'prefix'  => 'gridfs:',
            'options' => [
                'collection' => 'files'
            ]
        ],
        /*{{buckets}}*/
    ]
];