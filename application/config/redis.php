<?php
/**
 * Spiral Framework.
 *
 * @license   MIT
 * @author    Anton Titov (Wolfy-J)
 * @copyright ©2009-2015
 */
return array(
    'clients' => array(
        'default' => array(
            'servers' => array('host' => '127.0.0.1', 'port' => 6379),
            'options' => array()
        )
    ),
    'aliases' => array(
        'client' => 'default',
        'redis'  => 'default'
    )
);