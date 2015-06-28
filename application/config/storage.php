<?php
/**
 * Storages and containers.
 */
return [
    'servers'    => [
        'local'     => [
            'class'   => 'Spiral\Components\Storage\Servers\LocalServer',
            'options' => []
        ],
        'amazon'    => [
            'class'   => 'Spiral\Components\Storage\Servers\AmazonServer',
            'options' => [
                'verify'    => false,
                'accessKey' => '',
                'secretKey' => ''
            ]
        ],
        'rackspace' => [
            'class'   => 'Spiral\Components\Storage\Servers\RackspaceServer',
            'options' => [
                'verify'   => false,
                'username' => '',
                'apiKey'   => ''
            ]
        ],
        'ftp'       => [
            'class'   => 'Spiral\Components\Storage\Servers\FtpServer',
            'options' => [
                'host'     => '127.0.0.1',
                'login'    => '',
                'password' => '',
                'home'     => '/home'
            ]
        ],
        'sftp'      => [
            'class'   => 'Spiral\Components\Storage\Servers\SftpServer',
            'options' => [
                'host'       => '127.0.0.1',
                'home'       => '/home',

                //pubkey, password, none
                'authMethod' => 'pubkey',
                'username'   => 'lachezis',
                'password'   => '',
                'publicKey'  => 'PUB KEY LOCATION',
                'privateKey' => 'PRIV KEY LOCATION'
            ]
        ],
        'gridFs'    => [
            'class'   => 'Spiral\Components\Storage\Servers\GridfsServer',
            'options' => [
                'database' => 'default'
            ]
        ]
    ],
    'containers' => [
        'local'     => [
            'server'  => 'local',
            'prefix'  => 'local:',
            'options' => [
                'folder' => directory('runtime') . '/storage/'
            ]
        ],
        'amazon'    => [
            'server'  => 'amazon',
            'prefix'  => 'https://s3.amazonaws.com/spiral/',
            'options' => [
                'public' => true,
                'bucket' => 'spiral'
            ]
        ],
        'rackspace' => [
            'server'  => 'rackspace',
            'prefix'  => 'rackspace:',
            'options' => [
                'container' => 'container-name',
                'region'    => 'ORD'
            ]
        ],
        'ftp'       => [
            'server'  => 'ftp',
            'prefix'  => 'ftp:',
            'options' => [
                'folder' => 'remote-folder',
                'mode'   => \Spiral\Components\Files\FileManager::RUNTIME
            ]
        ],
        'sftp'      => [
            'server'  => 'sftp',
            'prefix'  => 'sftp:',
            'options' => [
                'folder' => 'remote-folder',
                'mode'   => \Spiral\Components\Files\FileManager::RUNTIME
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