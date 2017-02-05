<?php
/**
 * Spiral Framework.
 *
 * @license   MIT
 * @author    Anton Titov (Wolfy-J)
 */

namespace Bootloaders;

use Configs\AppConfig;
use Spiral\Core\Bootloaders\Bootloader;

/**
 * Internal application bindings.
 *
 * If you want to define more custom bindings use form [self::class, 'method'] as it will allow
 * spiral to defer construction and class loading until such binding will be requested.
 *
 * @see SharedTrait for ide tooltips.
 */
class AppBootloader extends Bootloader
{
    const BOOT = true;

    /**
     * @return array
     */
    const BINDINGS = [
    ];

    /**
     * @var array
     */
    const SINGLETONS = [
        'app' => \App::class,
    ];

    /**
     * @param \App      $app
     * @param AppConfig $config
     */
    public function boot(\App $app, AppConfig $config)
    {
        $app->setTimezone($config->getTimezone());
    }
}
