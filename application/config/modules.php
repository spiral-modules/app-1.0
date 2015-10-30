<?php
/**
 * This configuration file are populated with data automatically when you run "modules:install"
 * command in spiral console environment. Do not edit this configuration file by yourself (very
 * carefully).
 */
return [
    'spiral/profiler' => [
        'class'     => 'Spiral\Profiler\Profiler',
        'bootstrap' => false,
        'bindings'  => [
            'images' => 'Spiral\Profiler\Profiler'
        ]
    ],
    'spiral/toolkit'  => [
        'class'     => 'Spiral\Toolkit\ToolkitModule',
        'bootstrap' => false,
        'bindings'  => []
    ]
];