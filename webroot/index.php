<?php
/**
 * Spiral Framework
 *
 * @package   spiralFramework
 * @author    Anton Titov (Wolfy-J)
 * @copyright ©2009-2011
 */
define('SPIRAL_INITIAL_TIME', microtime(true));

//No comments
mb_internal_encoding('UTF-8');

//Error reporting
error_reporting(E_ALL | E_STRICT);
ini_set('display_errors', false);

//Root directory
$root = dirname(__DIR__) . '/';

//Composer
require $root . 'vendor/autoload.php';

//Forcing work directory
chdir($root);

//Initiating shared container, bindings, directories and etc
$application = App::init([
    'root'        => $root,
    'runtime'     => $root . 'runtime/',
    'libraries'   => $root . 'vendor/',
    'application' => $root . 'app/',
    //other directories calculated based on default pattern, @see Core::__constructor()
]);

//Let's start!
$application->start();
