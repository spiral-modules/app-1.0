<?php
/**
 * Configuration of spiral DatabaseProvider.
 * - default database alias/name
 * - list of databases associated with their PDO connection string, profiling mode, credentials and
 *   table prefix
 * - list of database name aliases used for injections and other operations
 * - list of drivers associated with PDO connection string scheme
 */
use Spiral\Database\Drivers;

return [
    'default'   => 'default',
    'databases' => [
        'mysql'     => [
            'connection'  => 'mysql:host=localhost;dbname=demo',
            'profiling'   => true,
            'tablePrefix' => '',
            'username'    => 'root',
            'password'    => 'root',
            'options'     => []
        ],
        'postgres'  => [
            'connection'  => 'pgsql:host=localhost;dbname=spiral',
            'profiling'   => true,
            'tablePrefix' => 'pgprefix_',
            'username'    => 'postgres',
            'password'    => '',
            'options'     => []
        ],
        'sqlite'    => [
            'connection'  => 'sqlite:spiral.db',
            'profiling'   => true,
            'tablePrefix' => 'db_',
            'username'    => 'sqlite',
            'password'    => '',
            'options'     => []
        ],
        'sqlServer' => [
            'connection'  => 'sqlsrv:Server=SPIRAL\SQLEXPRESS;Database=spiral',
            'profiling'   => true,
            'tablePrefix' => 'sqlServer_',
            'username'    => null,
            'password'    => null,
            'options'     => []
        ]
    ],
    'aliases'   => [
        'default'  => 'mysql',
        'database' => 'mysql',
        'db'       => 'mysql'
    ],
    'drivers'   => [
        'mysql'  => Drivers\MySQL\MySQLDriver::class,
        'pgsql'  => Drivers\Postgres\PostgresDriver::class,
        'sqlite' => Drivers\Sqlite\SqliteDriver::class,
        'sqlsrv' => Drivers\SqlServer\SqlServerDriver::class
    ]
];