<?php
/**
 * Spiral Framework.
 *
 * @license   MIT
 * @author    Anton Titov (Wolfy-J)
 * @copyright ©2009-2015
 */
namespace Controllers;

use Spiral\Components\Http\Response\Redirect;
use Spiral\Core\Controller;

class HomeController extends Controller
{
    /**
     * Method available by /home/index or /home or /
     *
     * @return mixed
     */
    public function index()
    {
        return $this->views->render('welcome');
    }

    /**
     * Method available by /home/json or /short-url
     *
     * @return array
     */
    public function json()
    {
        return [
            'status' => 200,
            'data' => [
                1, 2, 3, 4, 5, 6, 7,
            ]
        ];
    }

    /**
     * Method available by /home/redirect
     *
     * @return Redirect
     */
    public function redirect()
    {
        return new Redirect('http://google.com/');
    }

    /**
     * Method available by /home/internalRedirect
     *
     * @return Redirect
     */
    public function internalRedirect()
    {
        return $this->router->redirect('jsonRoute');
    }
}
