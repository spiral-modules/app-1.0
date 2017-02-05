<?php
/**
 * Storage manager configuration. Attention, configs might include runtime code which depended on
 * environment values only.
 *
 * Attention, this config is pre-placed in application, install spiral/storage to enable api layer.
 *
 * @see StorageConfig
 */
use Spiral\Storage\Servers;

return [
    /*
     * Storage server configurations.
     */
    'servers' => [
        'local'     => [
            'class'   => Servers\LocalServer::class,
            'options' => [
                'home' => directory('runtime')
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
        'gridFS'    => [
            'class'   => Servers\GridFSServer::class,
            'options' => [
                'database' => 'default'
            ]
        ],
    ],

    /*
     * Buckets define target locations for files/data to be stored in. Each bucket must have associated
     * prefix and server.
     */
    'buckets' => [
        'local'     => [
            'server'  => 'local',
            'prefix'  => 'local:',
            'options' => [
                //Directory has to be specified relatively to root directory of associated server
                'directory' => 'storage/'
            ]
        ],
        'amazon'    => [
            'server'  => 'amazon',
            'prefix'  => 'https://s3.amazonaws.com/spiralEngine/',
            'options' => [
                'public' => true,
                'bucket' => 'spiralEngine'
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
        'gridFS'    => [
            'server'  => 'gridFS',
            'prefix'  => 'gridFS:',
            'options' => [
                'collection' => 'files'
            ]
        ],
    ]
];
