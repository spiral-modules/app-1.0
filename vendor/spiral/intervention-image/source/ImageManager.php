<?php
/**
 * Spiral Framework.
 *
 * @license   MIT
 * @author    Anton Titov (Wolfy-J)
 * @copyright ©2009-2015
 */
namespace Spiral\Components\Image;

use Intervention\Image\Image;
use Psr\Http\Message\StreamInterface;
use Psr\Http\Message\UploadedFileInterface;
use Spiral\Components\Files\StreamContainerInterface;
use Spiral\Components\Modules\Module;
use Spiral\Components\Files\StreamWrapper;
use Spiral\Components\Modules\Definition;
use Spiral\Components\Modules\Installer;
use Spiral\Core\Component\SingletonTrait;
use Spiral\Core\ConfiguratorInterface;
use Spiral\Support\Generators\Config\ConfigWriter;
use Intervention\Image\ImageManager as InterventionManager;

class ImageManager extends Module
{
    /**
     * This is singleton.
     */
    use SingletonTrait;

    /**
     * Declaring singleton to IoC.
     */
    const SINGLETON = __CLASS__;

    /**
     * Intervention ImageManager.
     *
     * @var InterventionManager
     */
    protected $interventionManager = null;

    /**
     * Configuring module.
     *
     * @param ConfiguratorInterface $configurator
     */
    public function __construct(ConfiguratorInterface $configurator)
    {
        $this->interventionManager = new InterventionManager($configurator->getConfig('image'));
    }

    /**
     * Overrides configuration settings.
     *
     * @param array $config
     * @return static
     */
    public function configure(array $config = [])
    {
        $this->interventionManager->configure($config);

        return $this;
    }

    /**
     * Initiates an Image instance from different input types. Method support UploadedFiles,
     * StorageObjects, Streams, local files, resources and binary strings.
     *
     * @param mixed|UploadedFileInterface|StreamInterface|StreamContainerInterface $data
     * @return Image
     */
    public function open($data)
    {
        if ($data instanceof UploadedFileInterface || $data instanceof StreamContainerInterface)
        {
            $data = $data->getStream();
        }

        if ($data instanceof StreamInterface)
        {
            $data = StreamWrapper::getUri($data);
        }

        return $this->interventionManager->make($data);
    }

    /**
     * Creates an empty image canvas.
     *
     * @param  integer $width
     * @param  integer $height
     * @param  mixed   $background
     * @return Image
     */
    public function canvas($width, $height, $background = null)
    {
        return $this->interventionManager->canvas($width, $height, $background);
    }

    /**
     * Create new cached image and run callback (requires additional package intervention/imagecache).
     *
     * @param \Closure $callback
     * @param integer  $lifetime
     * @param boolean  $returnObj
     * @return Image
     */
    public function cache(\Closure $callback, $lifetime = null, $returnObj = false)
    {
        return $this->interventionManager->cache($callback, $lifetime, $returnObj);
    }

    /**
     * Module installer responsible for operations like copying resources, registering configs, view
     * namespaces and declaring that bootstrap() call is required.
     * This method is static as it should be called without constructing module object.
     *
     * @param Definition $definition Module definition fetched or generated of composer file.
     * @return Installer
     */
    public static function getInstaller(Definition $definition)
    {
        $installer = parent::getInstaller($definition);

        $imageConfig = ConfigWriter::make([
            'name'   => 'image',
            'method' => ConfigWriter::MERGE_REPLACE
        ])->readConfig(
            $definition->getLocation() . '/config'
        );

        //Adding config file
        return $installer->registerConfig($imageConfig);
    }
}