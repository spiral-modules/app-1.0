<?php
/**
 * Configuration of debug component and related classes:
 * - list of logger channels associated with their message handlers
 * - configuration for default debug snapshot implementation, including reporting directory and view
 *   to be used for exceptions
 */
return [
    'snapshots' => [
        'view'      => 'spiral:exception',
        'dumps'     => true,
        'reporting' => [
            'enabled'      => true,
            'maxSnapshots' => 200,
            'directory'    => directory('runtime') . '/logging/snapshots',
            'filename'     => '{date}-{exception}.html',
            'dateFormat'   => 'd.m.Y-Hi.s',
        ]
    ]
];