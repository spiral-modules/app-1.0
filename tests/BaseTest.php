<?php
/**
 * Spiral skeleton application
 *
 * @author Wolfy-J
 */

namespace Tests;

class BaseTest extends TestCase
{
    /**
     * @var \App
     */
    protected $app;

    public function setUp()
    {
        $root = dirname(__DIR__) . '/';

        $app = $this->app = \App::init([
            'root'        => $root,
            'libraries'   => $root . 'vendor/',
            'application' => $root . 'app/',
        ], null, null, false);

        //Monolog love to write to CLI when no handler set
        $this->app->logs->debugHandler(new NullHandler());
    }

    /**
     * This method performs full destroy of spiral environment.
     */
    public function tearDown()
    {
        if (class_exists('Mockery')) {
            //Mockery defines it's own static container to be destructed
            \Mockery::close();
        }

        //Forcing destruction
        $this->app = null;

        gc_collect_cycles();
        clearstatcache();
    }

    /**
     * @return \Spiral\Core\ContainerInterface
     */
    protected function iocContainer()
    {
        return $this->app->container;
    }
}