<?php
/**
 * Spiral skeleton application
 *
 * @author Wolfy-J
 */

namespace Controllers;

use Psr\Http\Message\ResponseInterface;
use Spiral\Core\Controller;
use Spiral\Encrypter\EncrypterInterface;
use Spiral\Session\SectionInterface;
use Spiral\Session\SessionInterface;

class IndexController extends Controller
{
    /**
     * @return string
     */
    public function indexAction(): string
    {
        return $this->views->render('welcome');
    }

    /**
     * @param SessionInterface $session
     * @param SectionInterface $indexSession
     *
     * @return ResponseInterface
     */
    public function scopeAction(
        SessionInterface $session,
        SectionInterface $indexSession
    ): ResponseInterface {
        //Isolated session section
        dump(++$indexSession->counter);

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

        /*
         * auth (auth module required), session, cookieQueue and other things
         * are also can be accessed via IoC scope.
         */

        //This is class which helps you to manipulate with
        //response which is active in current IoC scope
        return $this->response->html('Hello world');
    }

    /**
     * @return string
     */
    public function twigAction(): string
    {
        //dump($this->twig->getFunctions());
        return $this->views->render('default:hello.twig');
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
     * @return ResponseInterface
     */
    public function redirectAction(): ResponseInterface
    {
        return $this->response->redirect('http://google.com');
    }
}
