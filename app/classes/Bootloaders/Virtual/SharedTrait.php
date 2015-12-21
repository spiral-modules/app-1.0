<?php
/**
 * Spiral Framework.
 *
 * @license   MIT
 * @author    Anton Titov (Wolfy-J)
 */
namespace Spiral\Core\Traits;

use Interop\Container\ContainerInterface as InteropContainer;
use Spiral\Core\Exceptions\Container\AutowireException;
use Spiral\Core\Exceptions\SugarException;

/**
 * Twin original SharedTrait, include it and your component will get access to all shared bindings
 * of your application.
 *
 * Here you list your own virtual bindings to help your IDE:
 *
 * @see AppBootloader
 * @see SpiralBindings
 *
 * Application bindings:
 *
 * @property-read \Twig_Environment                        $twig       See AppBootloader
 * @property-read \App                                     $app        See AppBootloader
 * @property-read \Faker\Generator                         $faker      See AppBootloader
 *
 * Spiral shared bindings.
 * @property-read \Spiral\Core\HippocampusInterface        $memory     See SpiralBindings
 * @property-read \Spiral\Debug\Debugger                   $debugger   See SpiralBindings
 *
 * Container:
 * @property-read \Spiral\Core\ContainerInterface          $container  See SpiralBindings
 *
 * Dispatchers:
 * @property-read \Spiral\Console\ConsoleDispatcher        $console    See SpiralBindings
 * @property-read \Spiral\Http\HttpDispatcher              $http       See SpiralBindings
 *
 * Shared components:
 * @property-read \Spiral\Encrypter\EncrypterInterface     $encrypter  See SpiralBindings
 * @property-read \Spiral\Files\FilesInterface             $files      See SpiralBindings
 * @property-read \Spiral\Tokenizer\TokenizerInteface      $tokenizer  See SpiralBindings
 * @property-read \Spiral\Tokenizer\ClassLocatorInteface   $locator    See SpiralBindings
 * @property-read \Spiral\Translator\Translator            $translator See SpiralBindings
 * @property-read \Spiral\Views\ViewManager                $views      See SpiralBindings
 * @property-read \Spiral\Storage\StorageInterface         $storage    See SpiralBindings
 *
 * Databases and models:
 * @property-read \Spiral\Database\DatabaseManager         $dbal       See SpiralBindings
 * @property-read \Spiral\ODM\ODM                          $odm        See SpiralBindings
 * @property-read \Spiral\ORM\ORM                          $orm        See SpiralBindings
 *
 * Shared entities:
 * @property-read \Spiral\Cache\CacheStore                 $cache      See SpiralBindings
 * @property-read \Spiral\Database\Entities\Database       $db         See SpiralBindings
 * @property-read \Spiral\ODM\Entities\MongoDatabase       $mongo      See SpiralBindings
 *
 * Scope dependent:
 * @property-read \Spiral\Session\SessionInterface         $session    See SpiralBindings
 * @property-read \Spiral\Http\Input\InputManager          $input      See SpiralBindings
 * @property-read \Spiral\Http\Cookies\CookieManager       $cookies    See SpiralBindings
 * @property-read \Spiral\Http\Routing\RouterInterface     $router     See SpiralBindings
 * @property-read \Spiral\Http\Responses\Responder         $responses  See SpiralBindings
 *
 * @property-read \Psr\Http\Message\ServerRequestInterface $request    See SpiralBindings
 */
trait SharedTrait
{
    /**
     * Shortcut to Container get method.
     *
     * @see ContainerInterface::get()
     * @param string $alias
     * @return mixed|null|object
     * @throws AutowireException
     * @throws SugarException
     */
    public function __get($alias)
    {
        if ($this->container()->has($alias)) {
            return $this->container()->get($alias);
        }

        throw new SugarException("Unable to get property binding '{$alias}'.");

        //no parent call, too dangerous
    }

    /**
     * @return InteropContainer
     */
    abstract protected function container();
}
