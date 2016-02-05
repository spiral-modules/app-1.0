<?php
/**
 * Spiral Framework.
 *
 * @license MIT
 * @author  Anton Titov (Wolfy-J)
 */
namespace Configs;

use Spiral\Core\InjectableConfig;

/**
 * Add as many methods and logic as you need.
 */
class AppConfig extends InjectableConfig
{
    /**
     * Configuration section.
     */
    const CONFIG = 'app';

    /**
     * @var array
     */
    protected $config = [
        'timezone' => 'UTC'
    ];

    /**
     * @return string
     */
    public function getTimezone()
    {
        return $this->config['timezone'];
    }
}