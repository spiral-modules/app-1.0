<?php
/**
 * Spiral Framework, SpiralScout LLC.
 *
 * @package   spiralFramework
 * @author    Anton Titov (Wolfy-J)
 * @copyright ©2009-2011
 */
define('SPIRAL_INITIAL_TIME', microtime(true));

/**
 * Error reporting.
 */
error_reporting(E_ALL | E_STRICT);
ini_set('display_errors', true);

/**
 * Location of composer files all required extensions and libraries.
 */
$libraries = dirname(__DIR__) . '/vendor';

/**
 * Application directory.
 */
$application = dirname(__DIR__) . '/application';

/**
 * Composer.
 */
require $libraries . '/autoload.php';

//Starting
Application::init(['root' => __DIR__, 'libraries' => $libraries, 'application' => $application])->start();