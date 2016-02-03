<?php
/**
 * Spiral Framework.
 *
 * @license   MIT
 * @author    Anton Titov (Wolfy-J)
 */
namespace Bootloaders;

use Controllers\HomeController;
use Spiral\Core\Bootloaders\Bootloader;
use Spiral\Http\HttpDispatcher;
use Spiral\Http\Middlewares\CsrfFilter;
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
    }

    /**
     * html like urls
     *
     * @return Route
     */
    private function sampleRole()
    {
        //Custom application routes can be located here (this one: /twig.html, /index.html).
        $route = new Route('home', '<action>.html', 'Controllers\HomeController::<action>');

        //Middlewares can be registered as closure, class name or anything callable
        return $route->withMiddleware([
            //Custom middleware
            function ($request, $response, $next) {
                return $next($request, $response)->withHeader('My-Header', 'Yay!');
            },
            //CSRF protection
            CsrfFilter::class
        ]);
    }

    /**
     * Default (fallback) application route
     *
     * @return ControllersRoute
     */
    private function defaultRoute()
    {
        //Default route points to controllers located in namespace "Controllers" but not deeper
        $defaultRoute = new ControllersRoute(
            'default',                          //Route name
            '[<controller>[/<action>[/<id>]]]', //Pattern [] braces define optional segment
            'Controllers'                       //Default namespace
        );

        //Here we can define controller aliases and default controller
        return $defaultRoute->withControllers([
            //Aliases (you can register controllers with non default namespace here)
            'index' => HomeController::class
        ])->withDefaults([
            'controller' => 'index',
        ])->withMiddleware([
            //CSRF protection
            CsrfFilter::class
        ]);
    }
}