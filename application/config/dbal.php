<?php

return array(
    'databases'  => array(
        'mysql'     => array(
            'connection'  => 'mysql:host=localhost;dbname=spiral',
            'tablePrefix' => '',
            'username'    => 'root',
            'password'    => 'root',
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
            'connection'  => 'sqlite::memory:',
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
        'mysql'  => 'Spiral\Components\DBAL\Drivers\MySql\MySqlDriver',
        'pgsql'  => 'Spiral\Components\DBAL\Drivers\Postgres\PostgresDriver',
        'sqlite' => 'Spiral\Components\DBAL\Drivers\Sqlite\SqliteDriver',
        'sqlsrv' => 'Spiral\Components\DBAL\Drivers\SqlServer\SqlServerDriver'
    ),
    'aliases'    => array(
        'default'  => 'mysql',
        'database' => 'mysql',
        'db'       => 'mysql'
    ),
    'migrations' => array(
        'migrator'         => 'Spiral\Components\DBAL\Migrations\Migrator',
        'directory'        => directory('application') . '/migrations',
        'table'            => 'migrations',
        'safeEnvironments' => array(
            'development', 'staging', 'local'
        )
    )
);