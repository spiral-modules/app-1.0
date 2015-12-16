<?php
/**
 * Spiral Framework.
 *
 * @license   MIT
 * @author    Anton Titov (Wolfy-J)
 */
return [
    'view'      => env('EXCEPTION_VIEW', 'spiral:exceptions/light/slow.php'),
    'reporting' => [
        'enabled'      => true,
        'maxSnapshots' => 20,
        'directory'    => directory('runtime') . 'snapshots/',
        'filename'     => '{date}-{name}.html',
        'dateFormat'   => 'd.m.Y-Hi.s',
    ]
];