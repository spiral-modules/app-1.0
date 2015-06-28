<?php
/**
 * Storages and containers.
 */
return array(
    'servers'    => array(
        'local'     => array(
            'class'   => 'Spiral\Components\Storage\Servers\LocalServer',
            'options' => array()
        ),
        'amazon'    => array(
            'class'   => 'Spiral\Components\Storage\Servers\AmazonServer',
            'options' => array(
                'verify'    => false,
                'accessKey' => '',
                'secretKey' => ''
            )
        ),
        'rackspace' => array(
            'class'   => 'Spiral\Components\Storage\Servers\RackspaceServer',
            'options' => array(
                'verify'   => false,
                'username' => '',
                'apiKey'   => ''
            )
        ),
        'ftp'       => array(
            'class'   => 'Spiral\Components\Storage\Servers\FtpServer',
            'options' => array(
                'host'     => '127.0.0.1',
                'login'    => '',
                'password' => '',
                'home'     => '/home'
            )
        ),
        'sftp'      => array(
            'class'   => 'Spiral\Components\Storage\Servers\SftpServer',
            'options' => array(
                'host'       => '127.0.0.1',
                'home'       => '/home',

                //pubkey, password, none
                'authMethod' => 'pubkey',
                'username'   => 'lachezis',
                'password'   => '',
                'publicKey'  => 'PUB KEY LOCATION',
                'privateKey' => 'PRIV KEY LOCATION'
            )
        ),
        'gridFs'    => array(
            'class'   => 'Spiral\Components\Storage\Servers\GridfsServer',
            'options' => array(
                'database' => 'default'
            )
        )
    ),
    'containers' => array(
        'local'     => array(
            'server'  => 'local',
            'prefix'  => 'local:',
            'options' => array(
                'folder' => directory('runtime') . '/storage/'
            )
        ),
        'amazon'    => array(
            'server'  => 'amazon',
            'prefix'  => 'https://s3.amazonaws.com/spiral/',
            'options' => array(
                'public' => true,
                'bucket' => 'spiral'
            )
        ),
        'rackspace' => array(
            'server'  => 'rackspace',
            'prefix'  => 'rackspace:',
            'options' => array(
                'container' => 'container-name',
                'region'    => 'ORD'
            )
        ),
        'ftp'       => array(
            'server'  => 'ftp',
            'prefix'  => 'ftp:',
            'options' => array(
                'folder' => 'remote-folder',
                'mode'   => \Spiral\Components\Files\FileManager::RUNTIME
            )
        ),
        'sftp'      => array(
            'server'  => 'sftp',
            'prefix'  => 'sftp:',
            'options' => array(
                'folder' => 'remote-folder',
                'mode'   => \Spiral\Components\Files\FileManager::RUNTIME
            )
        ),
        'gridfs'    => array(
            'server'  => 'gridfs',
            'prefix'  => 'gridfs:',
            'options' => array(
                'collection' => 'files'
            )
        )
    )
);