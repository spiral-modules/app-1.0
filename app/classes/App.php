<?php
/**
 * Spiral Framework.
 *
 * @license   MIT
 * @author    Anton Titov (Wolfy-J)
 * @copyright ©2009-2015
 */
use Spiral\Core\Core;
use Spiral\Debug;

/**
 * Application core.
 */
class App extends Core
{
    /**
     * Set to false if you don't want spiral to cache autoloading list. When true you will have to
     * run "app:reload" every time you doing change in your bootloader bindings.
     */
    const MEMORIZE_BOOTLOADERS = true;

    /**
     * List of classes and bootloaders to be initiated with your application.
     *
     * Attention, bootloader's bindings are compiled and cached, to reload application cache run
     * command "app:reload".
     *
     * @see \Spiral\Core\Bootloaders\Bootloader
     * @var array
     */
    protected $load = [
        //Can speed up class loading a little.
        \Spiral\Core\Loader::class,

        //Short bindings in spiral services (eg http, db, ...)
        \Spiral\Core\Bootloaders\SpiralBindings::class,

        //Application specific bindings and bootloading
        \Bootloaders\AppBootloader::class,
    ];

    /**
     * Application core bootloading, you can also put your rotes definition here.
     */
    protected function bootstrap()
    {
        /*
         * Debug mode automatically enables spiral profiler or any other added bootloader listed
         * in a following method.
         *
         * In addition, it sets different snapshot class which provides ability to render
         * error information in a nicely form.
         */
        env('DEBUG') && $this->enableDebugging();
    }

    /**
     * Debug packages.
     */
    private function enableDebugging()
    {
        //Initiating all needed binding (no need to use memory caching)
        $this->bootloader()->bootload([
            \Spiral\Profiler\ProfilerHeader::class,
            \Spiral\Profiler\ProfilerPanel::class,

            //Other debug modules, for example automatic orm/odm schema refresh middleware/service
            //can be enabled here
        ]);

        /*
         * This snapshot class provides ability to render exception trace in a nicely form, you
         * can keep this implementation enabled in your production env - rendered snapshots are stored
         * on a disk in `app/runtime/snapshots` directory, user will only see 500 error.
         */
        $this->container->bind(Debug\SnapshotInterface::class, Debug\Snapshot::class);

        //P.S. You can always overwrite method App->getSnapshot($exception)
    }
}

if (!function_exists('app')) {
    /**
     * You can change this function to any form or remove it.
     *
     * @return App
     */
    function app()
    {
        return App::sharedContainer()->get(App::class);
    }
}