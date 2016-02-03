<?php
/**
 * Spiral Framework.
 *
 * @license   MIT
 * @author    Anton Titov (Wolfy-J)
 */
namespace Bootloaders;

use Spiral\Core\Bootloaders\Bootloader;

/**
 * Internal application bindings. All bootloaders are cachable by default so you can define needed
 * bindings in a string/array form.
 *
 * If you want to define more custom bindings use form [self::class, 'method'] as it will allow
 * spiral to defer construction and class loading until such binding will be requested.
 *
 * Attention, you still can use SINGLETON and INJECTOR defined classes without any bootloader!
 *
 * @see SharedTrait for ide tooltips.
 */
class AppBootloader extends Bootloader
{
    /**
     * @return array
     */
    protected $bindings = [
        'app' => \App::class,
    ];

    /**
     * @var array
     */
    protected $singletons = [

    ];
}
