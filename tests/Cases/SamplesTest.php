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

class SamplesTest extends TestCase
{
    use HttpTrait;

    public function testList()
    {
        $response = $this->get('/sample');
        $this->assertContains('EDIT', (string)$response->getBody());
    }

    public function testElement()
    {
        for ($i = 1; $i < 100; $i++) {
            $response = $this->get("/sample/edit/{$i}");
            $this->assertEquals(200, $response->getStatusCode());
        }
    }

    public function testBadElement()
    {
        $response = $this->get('/sample/edit/abc');
        $this->assertEquals(404, $response->getStatusCode());
    }
}