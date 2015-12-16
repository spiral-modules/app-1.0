<?php
/**
 * Spiral Framework.
 *
 * @license   MIT
 * @author    Anton Titov (Wolfy-J)
 */
namespace Database;

use Spiral\ORM\Record;

class SampleChild extends Record
{
    /**
     * @var string
     */
    protected $database = 'sandbox';

    /**
     * @var array
     */
    protected $schema = [
        'id'    => 'primary',
        'value' => 'int'
    ];
}