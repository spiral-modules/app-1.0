<?php
/**
 * @package   spiralFramework
 * @author    Anton Titov (Wolfy-J)
 * @copyright ©2009-2011
 */
return array(
    'loggers'   => array(
        'containers' => array(
            'debug'   => array(
                'error' => array(
                    directory('runtime') . '/logging/errors.log', 20971520
                ),
                'all'   => array(
                    directory('runtime') . '/logging/debug.log', 20971520
                )
            ),
            'http'    => array(
                'warning' => array(
                    directory('runtime') . '/logging/httpErrors.log', 2097152
                )
            ),
            'crontab' => array(
                'info' => array(
                    directory('runtime') . '/logging/crontab.log', 2097152
                )
            )
        )
    ),
    'backtrace' => array(
        'view'      => 'spiral:exception.dark',
        'snapshots' => array(
            'enabled'    => false,
            'timeFormat' => 'd.m.Y-Hi.s',
            'directory'  => directory('runtime') . '/logging/snapshots/'
        )
    )
);