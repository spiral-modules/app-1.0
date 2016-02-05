<?php
/**
 * Spiral Framework.
 *
 * @license   MIT
 * @author    Anton Titov (Wolfy-J)
 */
namespace Middlewares;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Spiral\Core\Service;
use Spiral\Http\MiddlewareInterface;

/**
 * @see app/config/http.php
 */
class LocaleDetector extends Service implements MiddlewareInterface
{
    /**
     * {@inheritdoc}
     */
    public function __invoke(Request $request, Response $response, callable $next)
    {
        $supported = $this->translator->getLocales();

        foreach ($this->fetchLocales($request) as $locale) {
            if (in_array($locale, $supported)) {
                $this->translator->setLocale($locale);
                break;
            }
        }

        return $next(
            $request->withAttribute('locale', $this->translator->getLocale()),
            $response
        );
    }

    /**
     * @param Request $request
     * @return array
     */
    public function fetchLocales(Request $request)
    {
        $header = $request->getHeaderLine('accept-language');
        foreach (explode(',', $header) as $value) {

            if (strpos($value, ';') !== false) {
                yield substr($value, 0, strpos($value, ';'));
            }

            yield $value;
        }
    }
}
