<?php
/**
 * Http dispatcher configuration. Includes:
 * - base application path
 * - isolation mode, when isolation is enable http component will handle all inner exceptions using
 *   snapshots, in opposite case exceptions will be passed on higher level and can be handled
 *   using default exception handler, when isolation is turned off some middlewares may not
 *   finish their work
 * - exposeErrors flag, if true snapshots will be rendered to client
 * - CookieManager middleware settings, default domain and protection method
 * - headers for initial http response
 * - set of default middlewares to to applied to every request and response
 * - default router class and settings
 * - association between http errors and view name to be used to render them to client
 */
return [
    'exposeErrors' => false
];