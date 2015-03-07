<?php
/**
 * @package   spiralFramework
 * @author    Anton Titov (Wolfy-J)
 * @copyright ©2009-2011
 */
return array(
    'backtrace' => array(
        'view'      => 'spiral:exception.dark',
        'snapshots' => array(
            'enabled'    => true,
            'timeFormat' => 'd.m.Y-Hi.s',
            'directory'  => directory('runtime') . '/logging/snapshots/'
        )
    )
);