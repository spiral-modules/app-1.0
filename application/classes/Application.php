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
     * Bootstrapping. Most of code responsible for routes, events and other application
     * preparations should located in this method.
     */
    public function bootstrap()
    {
        $this->http->route('short-url(/<test>)', 'Controllers\HomeController::json');
    }
}