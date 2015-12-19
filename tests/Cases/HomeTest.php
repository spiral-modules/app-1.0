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

        //Sample middleware
        $this->assertArrayHasKey('My-Header', $home->getHeaders());
        $this->assertContains('Welcome to Spiral Framework', (string)$home->getBody());
    }

    public function testHomepageRu()
    {
        $home = $this->get('/index.html', [], [], [
            'Accept-Language' => 'ru_RU,ru,en'
        ]);

        //Sample middleware
        $this->assertArrayHasKey('My-Header', $home->getHeaders());
        $this->assertContains('Добро пожаловать в Spiral Framework', (string)$home->getBody());
    }
}