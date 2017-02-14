<?php
/**
 * SessionStore configuration. Attention, configs might include runtime code which depended on
 * environment values only.
 *
 * @see SessionConfig
 */
use Spiral\Session\Handlers;

return [
    /*
     * Default session lifetime is 1 day.
     */
    'lifetime' => 86400,

    /*
     * Cookie name for sessions. Used by SessionStarter middleware. Other cookie options will
     * be gathered from HttpConfig. You can combine SessionStarter with CookieManager in order
     * to protect your cookies.
     */
    'cookie'   => env('SESSION_COOKIE', 'SID'),

    /*
     * Default handler is set to 'files'. You can switch this values based on your environments.
     * SessionStore will be initiated on demand to prevent performance issues.
     *
     * You can set this value to NULL to disable custom session handler and use default php
     * mechanism.
     * 
     * @see http://php.net/manual/en/class.sessionhandlerinterface.php
     */
    'handler'  => env('SESSION_HANDLER', 'files'),

    /*
     * Session handler. You are able to use bind() function in handler options.
     */
    'handlers' => [
        //Does not do anything
        'null'  => [
            'class' => Handlers\NullHandler::class
        ],
        //File based session
        'files' => [
            'class'   => Handlers\FileHandler::class,
            'options' => [
                'directory' => directory('runtime') . 'sessions'
            ]
        ],
        /*{{handlers}}*/
    ]
];
