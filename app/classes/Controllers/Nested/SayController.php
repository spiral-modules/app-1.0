<?php
/**
 * Spiral Framework.
 *
 * @license   MIT
 * @author    Anton Titov (Wolfy-J)
 */
namespace Controllers\Nested;

use Spiral\Core\Controller;
use Symfony\Component\Translation\TranslatorInterface;

class SayController extends Controller //see ControllerInterface
{
    /**
     * Says localized message.
     *
     * @param TranslatorInterface $translator
     * @param string              $say
     * @return array
     */
    public function sayAction(TranslatorInterface $translator, $say)
    {
        //This is how you can return json (to be written in response later)
        return [
            'status'  => 201,
            'message' => $translator->trans($say),
            'urls'    => [
                'nice'     => $this->router->uri('home', ['action' => 'say']),
                'fallback' => $this->router->uri('home::say', ['q' => 'abc']),
            ]
        ];
    }
}