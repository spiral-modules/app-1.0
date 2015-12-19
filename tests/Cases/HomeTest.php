<?php
/**
 * Spiral Framework.
 *
 * @license   MIT
 * @author    Anton Titov (Wolfy-J)
 */
namespace Tests\Cases;

use Tests\TestCase;
use Tests\Traits\HttpTrait;

class HomeTest extends TestCase
{
    use HttpTrait;

    public function testHomepage()
    {
        $home = $this->get('/index.html');

        $this->assertArrayHasKey('My-Header', $home->getHeaders());
        $this->assertContains('Welcome to Spiral Framework', (string)$home->getBody());
    }
}