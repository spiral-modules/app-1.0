<?php
/**
 * Configuration of StorageManager components with it's servers and containers.
 * - list of servers with their adapter class and options to associated with buckets
 * - list of buckets with their server id, prefix value and adapter specific options
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
                'verify'    => false,
                'accessKey' => '',
                'secretKey' => '',
            ]
        ],
        'rackspace' => [
            'class'   => Servers\RackspaceServer::class,
            'options' => [
                'verify'   => false,
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
        ]
    ],
    'buckets' => [
        'local'     => [
            'server'  => 'local',
            'prefix'  => 'local:',
            'options' => [
                //Temporary location
                'directory' => 'application/runtime/storage/'
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
        ]
    ]
];