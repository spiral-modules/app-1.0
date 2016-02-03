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
use Spiral\Views\ViewManager;

class ServicesBootloader extends Bootloader implements SingletonInterface
{
    /**
     * @return array
     */
    protected $bindings = [
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
}