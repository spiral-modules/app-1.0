<?php
/**
 * Spiral Framework.
 *
 * @license   MIT
 * @author    Anton Titov (Wolfy-J)
 */
namespace Tests\Traits;

use Interop\Container\ContainerInterface;
use Psr\Http\Message\UriInterface;
use Spiral\Http\HttpDispatcher;
use Spiral\Http\Uri;
use Zend\Diactoros\ServerRequest;

/**
 * Emulates http request
 */
trait HttpTrait
{
    /**
     * @param string $uri
     * @param array  $query
     * @param array  $cookies
     * @param array  $headers
     * @return \Psr\Http\Message\ResponseInterface
     */
    public function get($uri, array $query = [], array $cookies = [], array $headers = [])
    {
        $request = $this->request(new Uri($uri), 'GET', [], $query, $cookies, $headers);

        return $this->http()->perform($request);
    }

    /**
     * @param string $uri
     * @param array  $data
     * @param array  $query
     * @param array  $cookies
     * @param array  $headers
     * @return \Psr\Http\Message\ResponseInterface
     */
    public function post(
        $uri,
        array $data = [],
        array $query = [],
        array $cookies = [],
        array $headers = []
    ) {
        $request = $this->request(new Uri($uri), 'POST', $data, $query, $cookies, $headers);

        return $this->http()->perform($request);
    }

    /**
     * @param UriInterface $uri
     * @param string       $method
     * @param array        $data
     * @param array        $query
     * @param array        $cookies
     * @param array        $headers
     * @return ServerRequest
     */
    protected function request(
        UriInterface $uri,
        $method,
        array $data = [],
        array $query = [],
        array $cookies = [],
        array $headers = []
    ) {
        $request = new ServerRequest([], [], $uri, $method, 'php://temp', $headers);

        return $request->withParsedBody($data)->withQueryParams($query)->withCookieParams($cookies);
    }

    /**
     * @return HttpDispatcher
     */
    private function http()
    {
        return $this->container()->get(HttpDispatcher::class);
    }

    /**
     * @return ContainerInterface
     */
    protected abstract function container();
}