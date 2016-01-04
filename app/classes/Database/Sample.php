<?php
/**
 * Spiral Framework.
 *
 * @license   MIT
 * @author    Anton Titov (Wolfy-J)
 */
namespace Database;

use Spiral\Models\Traits\TimestampsTrait;
use Spiral\ORM\Record;

class Sample extends Record
{
    //time_created, time_updated
    use TimestampsTrait;

    /**
     * @var string
     */
    protected $database = 'sandbox';

    /**
     * @var array
     */
    protected $schema = [
        'id'      => 'primary',
        'status'  => 'enum(active,disabled)',
        'name'    => 'string',
        'content' => 'text',

        'child'   => [self::HAS_ONE => SampleChild::class],
    ];

    /**
     * @var array
     */
    protected $fillable = [
        'status',
        'name',
        'content'
    ];

    /**
     * @var array
     */
    protected $defaults = [
        'status' => 'disabled'
    ];

    /**
     * @var array
     */
    protected $indexes = [
        [self::INDEX, 'status']
    ];

    /**
     * @return int
     */
    public function getValue()
    {
        return $this->child->value;
    }
}
