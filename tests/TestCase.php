<?php
/**
 * Spiral Framework.
 *
 * @license   MIT
 * @author    Anton Titov (Wolfy-J)
 */
namespace Tests;

class TestCase extends \PHPUnit_Framework_TestCase
{
    /**
     * @return \App
     */
    protected function application()
    {
        return \App::sharedContainer()->get(\App::class);
    }
}