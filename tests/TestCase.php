<?php
/**
 * Spiral Framework.
 *
 * @license   MIT
 * @author    Anton Titov (Wolfy-J)
 */
namespace Tests;

use Spiral\Core\Traits\SharedTrait;

class TestCase extends \PHPUnit_Framework_TestCase
{
    /**
     * Magic properties
     */
    use SharedTrait;

    /**
     * @var \App
     */
    static public $app;

    /**
     * @return \Interop\Container\ContainerInterface
     */
    protected function container()
    {
        return self::$app->container;
    }
}