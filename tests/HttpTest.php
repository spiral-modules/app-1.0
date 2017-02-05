<?php
/**
 * Spiral skeleton application
 *
 * @author Wolfy-J
 */

namespace Tests;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\UriInterface;
use Zend\Diactoros\ServerRequest;

/**
 * Provides ability to query application via HttpDispatcher.
 */
abstract class HttpTest extends BaseTest
{
    /**
     * Execute GET query.
     *
     * @param string|UriInterface $uri
     * @param array               $query
     * @param array               $headers
     * @param array               $cookies
     *
     * @return ResponseInterface
     */
    protected function get(
        $uri,
        array $query = [],
        array $headers = [],
        array $cookies = []
    ): ResponseInterface {
        return $this->app->http->perform(
            $this->createRequest($uri, 'GET', $query, $headers, $cookies)
        );
    }

    /**
     * Execute POST query.
     *
     * @param string|UriInterface $uri
     * @param array               $data
     * @param array               $headers
     * @param array               $cookies
     *
     * @return ResponseInterface
     */
    protected function post(
        $uri,
        array $data = [],
        array $headers = [],
        array $cookies = []
    ): ResponseInterface {
        return $this->app->http->perform(
            $this->createRequest($uri, 'POST', [], $headers, $cookies)->withParsedBody($data)
        );
    }

    /**
     * @param string|UriInterface $uri
     * @param string              $method
     * @param array               $query
     * @param array               $headers
     * @param array               $cookies
     *
     * @return ServerRequest
     */
    protected function createRequest(
        $uri,
        string $method = 'GET',
        array $query = [],
        array $headers = [],
        array $cookies = []
    ): ServerRequest {
        return new ServerRequest([], [], $uri, $method, 'php://input', $headers, $cookies, $query);
    }

    /**
     * Fetch array of cookies from response.
     *
     * @param ResponseInterface $response
     *
     * @return array
     */
    protected function fetchCookies(ResponseInterface $response)
    {
        $result = [];

        foreach ($response->getHeader('Set-Cookie') as $line) {
            $cookie = explode('=', $line);
            $result[$cookie[0]] = rawurldecode(substr($cookie[1], 0, strpos($cookie[1], ';')));
        }

        return $result;
    }
}