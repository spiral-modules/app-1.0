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
        $this->assertContains('Edit element', (string)$response->getBody());
    }

    public function testElement()
    {
        $response = $this->get('/sample/edit/1');
        $this->assertEquals(200, $response->getStatusCode());
    }

    public function testBadElement()
    {
        $response = $this->get('/sample/edit/abc');
    }

    public function tearDown()
    {
        $this->orm->cache()->flushCache();
    }
}
