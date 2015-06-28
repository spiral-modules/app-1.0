<?php
/**
 * @package   spiralFramework
 * @author    Anton Titov (Wolfy-J)
 * @copyright ©2009-2011
 */
return [
    'loggers'   => [
        'containers' => [
            \Spiral\Components\Debug\Debugger::class      => [
                'error' => [
                    directory('runtime') . '/logging/errors.log', 20971520
                ],
                'all'   => [
                    directory('runtime') . '/logging/debug.log', 20971520
                ]
            ],
            \Spiral\Components\Http\HttpDispatcher::class => [
                'warning' => [
                    directory('runtime') . '/logging/httpErrors.log', 2097152
                ]
            ]
        ]
    ],
    'backtrace' => [
        'view'      => 'spiral:exception.dark',
        'snapshots' => [
            'enabled'    => false,
            'timeFormat' => 'd.m.Y-Hi.s',
            'directory'  => directory('runtime') . '/logging/snapshots/'
        ]
    ]
];