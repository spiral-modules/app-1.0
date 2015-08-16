<?php
/**
 * Http dispatcher configuration. Includes:
 * - base application path
 * - exposeErrors flag, if true snapshots will be rendered to client
 * - CookieManager middleware settings, default domain and protection method
 * - headers to be used by DispatcherHeaders middleware to clarify request
 * - set of default endpoints
 * - set of default middlewares to to applied to every request and response
 * - default router class and settings
 * - association between http errors and view name to be used to render them to client
 */
return [
    'exposeErrors' => false,
    'keepOutput'   => false
];