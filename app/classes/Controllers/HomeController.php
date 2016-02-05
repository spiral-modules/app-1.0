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
use Spiral\Session\SessionInterface;

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
     * @param SessionInterface $session
     * @return \Psr\Http\Message\MessageInterface
     */
    public function scopeAction(SessionInterface $session)
    {
        //This is request active in current IoC scope
        dump($this->request);

        //This is input service which uses this request
        //to provide set of simple methods
        dump($this->input->query);
        dump($this->input->data);
        dump($this->input->headers);
        dump($this->input->files);
        dump($this->input->attributes);

        //Some instances can be accessed without request,
        //for example session;

        dump($this->session);

        //This approaches are identical
        dump($this->session === $this->request->getAttribute('session'));
        dump($this->session === $session);

        //This is class which helps you to manipulate with
        //response which is active in current IoC scope
        return $this->responder->html('Hello world');
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
