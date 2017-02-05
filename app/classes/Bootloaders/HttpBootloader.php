<?php
/**
 * Spiral Framework.
 *
 * @license   MIT
 * @author    Anton Titov (Wolfy-J)
 */

namespace Bootloaders;

use Middlewares\LocaleDetector;
use Spiral\Core\Bootloaders\Bootloader;
use Spiral\Http\HttpDispatcher;
use Spiral\Http\Middlewares\CsrfFirewall;
use Spiral\Http\Routing\ControllersRoute;
use Spiral\Http\Routing\Route;

class HttpBootloader extends Bootloader
{
    /**
     * Requested to be bootloaded.
     */
    const BOOT = true;

    /**
     * Spiral will automatically populate requested method injections for boot method.
     *
     * @param HttpDispatcher $http
     */
    public function boot(HttpDispatcher $http)
    {
        //Register route in a default http router (you can change router using setRouter() method)
        $http->addRoute($this->sampleRole());

        //Default route used as "fallback" when no other route work
        $http->defaultRoute($this->defaultRoute());

        //Locale detection middleware, application specific
        $http->pushMiddleware(LocaleDetector::class);
    }

    /**
     * html like urls
     *
     * @return Route
     */
    private function sampleRole(): Route
    {
        //Custom application routes can be located here (this one: /twig.html, /index.html).
        $route = new Route(
            'index',
            '<action>.html',
            'Controllers\IndexController::<action>'
        );

        //Middlewares can be registered as closure, class name or anything callable
        return $route->withMiddleware([
            //Custom middleware
            function ($request, $response, $next) {
                return $next($request, $response)->withHeader('My-Header', 'Yay!');
            },
            //CSRF protection
            CsrfFirewall::class
        ]);
    }

    /**
     * Default (fallback) application route, this route can handle
     * many controller and action pairs, so you don't need to create
     * custom route for every new controller (unless you want to define
     * custom path, middleware or pattern).
     *
     * @return ControllersRoute
     */
    private function defaultRoute(): ControllersRoute
    {
        //Default route points to controllers located in namespace "Controllers" but not deeper
        $defaultRoute = new ControllersRoute(
            'default',                          //Route name
            '[<controller>[/<action>[/<id>]]]', //Pattern [] braces define optional segment
            'Controllers'                       //Default namespace
        );

        //Here we can define controller aliases and default controller
        return $defaultRoute->withDefaults([
            //Default controller to be called on / url
            'controller' => 'index',
        ])->withMiddleware([
            //CSRF protection
            CsrfFirewall::class
        ]);
    }
}
