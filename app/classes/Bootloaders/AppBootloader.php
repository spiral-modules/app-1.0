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
 * @see SharedTrait for ide tooltips.
 */
class AppBootloader extends Bootloader implements SingletonInterface
{
    /**
     * @return array
     */
    protected $bindings = [
        'app'   => \App::class,
    ];

    /**
     * @var array
     */
    protected $singletons = [
    ];
}
