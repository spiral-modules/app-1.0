<?php
/**
 * Spiral Framework.
 *
 * @license   MIT
 * @author    Anton Titov (Wolfy-J)
 * @copyright ©2009-2015
 */
namespace Controllers;

use Controllers\Nested\SayController;
use Spiral\Core\Controller;
use Spiral\Encrypter\EncrypterInterface;

class HomeController extends Controller
{
    /**
     * @return string
     */
    public function indexAction()
    {
        return $this->views->render('welcome');
    }

    /**
     * @return string
     */
    public function twigAction()
    {
        //dump($this->twig->getFunctions());
        return $this->views->render('default:hello.twig');
    }

    /**
     * Nested controller example
     *
     * @return mixed
     */
    public function sayAction()
    {
        //Can also be done via method injection
        return $this->app->callAction(SayController::class, 'say', [
            'say' => 'Hello world!'
        ]);
    }

    /**
     * Sample exception page
     *
     * @param EncrypterInterface $encrypter
     */
    public function exceptionAction(EncrypterInterface $encrypter)
    {
        //To output
        echo $encrypter->encrypt($data);
    }

    /**
     * Sample redirect.
     *
     * @return \Psr\Http\Message\ResponseInterface
     */
    public function redirectAction()
    {
        return $this->responder->redirect('http://google.com');
    }
}
