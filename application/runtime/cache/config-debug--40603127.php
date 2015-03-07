<?php return array (
  'loggers' => 
  array (
    'containers' => 
    array (
      'debug' => 
      array (
        'error' => 
        array (
          0 => 'D:\\Projects\\domains\\spiral-application.dev/application/runtime/logging/errors.log',
          1 => 20971520,
        ),
        'all' => 
        array (
          0 => 'D:\\Projects\\domains\\spiral-application.dev/application/runtime/logging/debug.log',
          1 => 20971520,
        ),
      ),
      'http' => 
      array (
        'warning' => 
        array (
          0 => 'D:\\Projects\\domains\\spiral-application.dev/application/runtime/logging/httpErrors.log',
          1 => 2097152,
        ),
      ),
      'crontab' => 
      array (
        'info' => 
        array (
          0 => 'D:\\Projects\\domains\\spiral-application.dev/application/runtime/logging/crontab.log',
          1 => 2097152,
        ),
      ),
    ),
  ),
  'backtrace' => 
  array (
    'view' => 'spiral:exception.dark',
    'snapshots' => 
    array (
      'enabled' => false,
      'timeFormat' => 'd.m.Y-Hi.s',
      'directory' => 'D:\\Projects\\domains\\spiral-application.dev/application/runtime/logging/snapshots/',
    ),
  ),
);