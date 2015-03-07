<?php

return array(
    'databases'  => array(
        'default'   => array(
            'connection'  => 'mysql:host=localhost;dbname=spiral',
            'tablePrefix' => '',
            'username'    => 'root',
            'password'    => '',
            'options'     => array()
        ),
        'postgres'  => array(
            'connection'  => 'pgsql:host=localhost;dbname=spiral',
            'tablePrefix' => '',
            'username'    => 'postgres',
            'password'    => '',
            'options'     => array()
        ),
        'sqlite'    => array(
            'connection'  => 'sqlite:' . directory('runtime') . '/my.db',
            'tablePrefix' => '',
            'username'    => 'postgres',
            'password'    => '',
            'options'     => array()
        ),
        'sqlServer' => array(
            'connection'  => 'sqlsrv:Server=SPIRAL\SQLEXPRESS;Database=spiral',
            'tablePrefix' => '',
            'username'    => null,
            'password'    => null,
            'options'     => array()
        )
    ),
    'drivers'    => array(
        'mysql'  => 'Spiral\Components\Dbal\Drivers\MySql\MySqlDriver',
        'pgsql'  => 'Spiral\Components\Dbal\Drivers\Postgres\PostgresDriver',
        'sqlite' => 'Spiral\Components\Dbal\Drivers\Sqlite\SqliteDriver',
        'sqlsrv' => 'Spiral\Components\Dbal\Drivers\SqlServer\SqlServerDriver'
    ),
    'aliases'    => array(
        'default'  => 'default',
        'database' => 'default',
        'db'       => 'default'
    ),
    'migrations' => array(
        'migrator'         => 'Spiral\Components\Dbal\Migrations\Migrator',
        'directory'        => directory('application') . '/migrations',
        'table'            => 'migrations',
        'safeEnvironments' => array(
            'development', 'staging', 'local'
        )
    )
);