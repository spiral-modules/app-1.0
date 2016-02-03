<?php
/**
 * Spiral Framework.
 *
 * @license   MIT
 * @author    Anton Titov (Wolfy-J)
 */
use Spiral\Core\Core;
use Spiral\Debug;

/**
 * Application core. You can rename this class to reflect your project name.
 */
class App extends Core
{
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
        \Bootloaders\ServicesBootloader::class,
        \Bootloaders\HttpBootloader::class,
    ];

    /**
     * Application core bootloading, you can configure your enviroment here.
     */
    protected function bootstrap()
    {
        /*
         * Debug mode automatically enables spiral profiler or any other bootloaders listed
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
