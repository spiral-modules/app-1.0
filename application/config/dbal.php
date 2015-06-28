<?php

return [
    'databases'  => [
        'mysql'     => [
            'connection'  => 'mysql:host=localhost;dbname=spiral',
            'tablePrefix' => '',
            'username'    => 'root',
            'password'    => 'root',
            'options'     => []
        ],
        'postgres'  => [
            'connection'  => 'pgsql:host=localhost;dbname=spiral',
            'tablePrefix' => '',
            'username'    => 'postgres',
            'password'    => '',
            'options'     => []
        ],
        'sqlite'    => [
            'connection'  => 'sqlite::memory:',
            'tablePrefix' => '',
            'username'    => 'postgres',
            'password'    => '',
            'options'     => []
        ],
        'sqlServer' => [
            'connection'  => 'sqlsrv:Server=SPIRAL\SQLEXPRESS;Database=spiral',
            'tablePrefix' => '',
            'username'    => null,
            'password'    => null,
            'options'     => []
        ]
    ],
    'drivers'    => [
        'mysql'  => 'Spiral\Components\DBAL\Drivers\MySql\MySqlDriver',
        'pgsql'  => 'Spiral\Components\DBAL\Drivers\Postgres\PostgresDriver',
        'sqlite' => 'Spiral\Components\DBAL\Drivers\Sqlite\SqliteDriver',
        'sqlsrv' => 'Spiral\Components\DBAL\Drivers\SqlServer\SqlServerDriver'
    ],
    'aliases'    => [
        'default'  => 'mysql',
        'database' => 'mysql',
        'db'       => 'mysql'
    ],
    'migrations' => [
        'migrator'         => 'Spiral\Components\DBAL\Migrations\Migrator',
        'directory'        => directory('application') . '/migrations',
        'table'            => 'migrations',
        'safeEnvironments' => [
            'development', 'staging', 'local'
        ]
    ]
];