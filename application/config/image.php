<?php
/**
 * Image component configuration.
 */
return array(
    'processor'  => 'consoleIM',
    'processors' => array(
        'consoleIM' => array(
            'class'         => 'Spiral\Components\Image\Processors\ConsoleIMProcessor',
            'commandPrefix' => ''
        )
    )
);