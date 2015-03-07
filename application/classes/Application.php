<?php
/**
 * Spiral Framework.
 *
 * @license   MIT
 * @author    Anton Titov (Wolfy-J)
 * @copyright ©2009-2015
 */
use Spiral\Core\Core;

class Application extends Core
{
    /**
     * Initial application timezone. Can be redefined in child core realization.
     *
     * @var string
     */
    protected $timezone = 'UTC';

    /**
     * Bootstrapping. Most of code responsible for routes, events and other application
     * preparations should located in this method.
     */
    public function bootstrap()
    {
        //Custom bootstrap code
    }
}