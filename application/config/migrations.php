<?php
/**
 * Configuration of Migrator component (located in Database component), includes:
 * - directory to store migrations in
 * - database to store information about executed migrations
 * - table to store information about executed migrations
 * - list of environments where migration commands allowed to run without user confirmation
 */
return [
    'directory'    => directory('application') . '/migrations',
    'database'     => 'default',
    'table'        => 'migrations',
    'environments' => ['development', 'testing', 'staging']
];