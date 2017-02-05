<?php
/**
 * Spiral skeleton application
 *
 * @author Wolfy-J
 */

namespace Tests\Controllers;

use Tests\HttpTest;

class IndexTest extends HttpTest
{
    public function testSeeWelcome()
    {
        $response = $this->get('/');

        $this->assertSame(200, $response->getStatusCode());
        $this->assertContains('Welcome to Spiral Framework', (string)$response->getBody());
        $this->assertContains('welcome.dark.php', (string)$response->getBody());
    }

    public function testSeeWelcomeRussian()
    {
        $response = $this->get('/', [], [
            'Accept-Language' => 'ru'
        ]);

        $this->assertSame(200, $response->getStatusCode());
        $this->assertContains('Добро пожаловать в Spiral Framework', (string)$response->getBody());
        $this->assertContains('welcome.dark.php', (string)$response->getBody());
    }

    public function testSeeWelcomeTwig()
    {
        $response = $this->get('/twig.html');

        $this->assertSame(200, $response->getStatusCode());
        $this->assertContains('Welcome to Spiral Framework', (string)$response->getBody());
        $this->assertContains('hello.twig', (string)$response->getBody());
    }
}