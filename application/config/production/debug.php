<?php
/**
 * @package   spiralFramework
 * @author    Anton Titov (Wolfy-J)
 * @copyright ©2009-2011
 */
return [
    'backtrace' => [
        'view'      => 'spiral:exception.dark',
        'snapshots' => [
            'enabled'    => true,
            'timeFormat' => 'd.m.Y-Hi.s',
            'directory'  => directory('runtime') . '/logging/snapshots/'
        ]
    ]
];