<?php
/**
 * Configuration of spiral DatabaseProvider.
 * - default database alias/name
 * - list of database name aliases used for injections and other operations
 * - list of databases associated with their source connection
 * - list of connections associated with their driver and connection options
 * - list of drivers associated with PDO connection string scheme
 */
use Spiral\Database\Drivers;

return [
    'default'     => 'default',
    'aliases'     => [
        'default'  => 'primary',
        'database' => 'primary',
        'db'       => 'primary'
    ],
    'databases'   => [
        'primary'     => [
            'connection'  => 'mysql',
            'tablePrefix' => 'primary_'
        ],
        'secondary' => [
            'connection'  => 'postgres',
            'tablePrefix' => 'secondary_',
        ],
    ],
    'connections' => [
        'mysql'     => [
            'driver'     => Drivers\MySQL\MySQLDriver::class,
            'connection' => 'mysql:host=127.0.0.1;dbname=demo',
            'profiling'  => true,
            'username'   => 'root',
            'password'   => 'root',
            'options'    => []
        ],
        'postgres'  => [
            'driver'     => Drivers\Postgres\PostgresDriver::class,
            'connection' => 'pgsql:host=127.0.0.1;dbname=spiral',
            'profiling'  => true,
            'username'   => 'postgres',
            'password'   => '',
            'options'    => []
        ],
        'sqlite'    => [
            'driver'     => Drivers\Sqlite\SqliteDriver::class,
            'connection' => 'sqlite:spiral.db',
            'profiling'  => true,
            'username'   => 'sqlite',
            'password'   => '',
            'options'    => []
        ],
        'sqlServer' => [
            'driver'     => Drivers\SqlServer\SqlServerDriver::class,
            'connection' => 'sqlsrv:Server=SPIRAL\SQLEXPRESS;Database=spiral',
            'profiling'  => true,
            'username'   => null,
            'password'   => null,
            'options'    => []
        ]
    ]
];