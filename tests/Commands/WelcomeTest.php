<?php
/**
 * Spiral skeleton application
 *
 * @author Wolfy-J
 */

namespace Tests\Commands;

use Tests\BaseTest;

class WelcomeTest extends BaseTest
{
    public function testCommand()
    {
        $result = $this->app->console->run('welcome');
        $this->assertSame(0, $result->getCode());
        $this->assertContains('Welcome to Spiral Framework', $result->getOutput()->fetch());
    }
}