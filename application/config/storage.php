<?php
/**
 * Storages and containers.
 */
return array(
    'servers'    => array(
        'local'     => array(
            'class'   => 'Spiral\Components\Storage\Servers\Local\LocalServer',
            'options' => array()
        ),
        'amazon'    => array(
            'class'   => 'Spiral\Components\Storage\Servers\AmazonS3\AmazonS3Server',
            'options' => array(
                'accessKey' => '',
                'secretKey' => '',
            )
        ),
        'rackspace' => array(
            'class'   => 'Spiral\Components\Storage\Servers\Rackspace\RackspaceCloudServer',
            'options' => array(
                'username'  => '',
                'accessKey' => '',
            )
        ),
        'ftp'       => array(
            'class'   => 'Spiral\Components\Storage\Servers\Ftp\FtpServer',
            'options' => array(
                'server'   => '127.0.0.1',
                'login'    => '',
                'password' => '',
                'home'     => '',
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
            'prefix'  => 'https://s3.amazonaws.com/bucket-name/',
            'options' => array(
                'public' => true,
                'bucket' => 'bucket-name'
            )
        ),
        'rackspace' => array(
            'server'  => 'rackspace',
            'prefix'  => 'rackspace:',
            'options' => array(
                'container' => 'spiral',
                'region'    => 'ORD'
            )
        ),
        'ftp'       => array(
            'server'  => 'ftp',
            'prefix'  => 'ftp:',
            'options' => array(
                'folder' => '/',
                'mode'   => \Spiral\Components\Files\FileManager::RUNTIME
            )
        )
    )
);