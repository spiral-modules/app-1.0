<?php
/**
 * Spiral Framework.
 *
 * @license   MIT
 * @author    Anton Titov (Wolfy-J)
 */
namespace Bootloaders;

use Faker\Factory;
use Faker\Generator;
use Spiral\Core\Bootloaders\Bootloader;
use Spiral\Core\Container\SingletonInterface;
use Spiral\Http\HttpDispatcher;
use Spiral\Http\Routing\ControllersRoute;
use Spiral\Http\Routing\Route;
use Spiral\Views\ViewManager;

/**
 * Internal application bindings. All bootloaders are cachable by default so you can define needed
 * bindings in a string/array form.
 *
 * If you want to define more custom bindings use form [self::class, 'method'] as it will allow
 * spiral to defer construction and class loading until such binding will be requested.
 *
 * To re-build bootloading cache execute console command "app:reload".
 *
 * Attention, you still can use SINGLETON and INJECTOR defined classes without any bootloader!
 *
 * @see SharedTrait for ide tooltips.
 */
class AppBootloader extends Bootloader implements SingletonInterface
{
    //To be constructed only once and binded under it's own class name
    const SINGLETON = self::class;

    /**
     * Requested to be bootloaded.
     */
    const BOOT = true;

    /**
     * @return array
     */
    protected $bindings = [
        //Same binding using spiral database service
        'app'   => \App::class,
        'twig'  => [self::class, 'twig'],
        'faker' => Generator::class,
    ];

    /**
     * @var array
     */
    protected $singletons = [
        Generator::class => [self::class, 'faker']
    ];

    /**
     * @param ViewManager $views
     * @return  \Twig_Environment
     */
    public function twig(ViewManager $views)
    {
        return $views->engine('twig')->twig();
    }

    /**
     * @param Factory $factory
     * @return \Faker\Generator
     */
    public function faker(Factory $factory)
    {
        return $factory->create();
    }

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
    public function sampleRole()
    {
        //Custom application routes can be located here (this one: /twig.html, /index.html).
        $route = new Route('home', '<action>.html', 'Controllers\HomeController::<action>');

        //Middlewares can be registered as closure, class name or anything callable
        $route->middleware(function ($request, $response, $next) {
            return $next($request, $response)->withHeader('My-Header', 'Yay!');
        });

        return $route;
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
        $defaultRoute->controllers([
            //Aliases (you can register controllers with non default namespace here)
            'index' => \Controllers\HomeController::class
        ])->defaults([
            //All controller names are automatically lcased(), better logic help needed :)
            'controller' => 'index',
        ]);

        return $defaultRoute;
    }
}
