<?php
/**
 * Spiral Framework.
 *
 * @license   MIT
 * @author    Anton Titov (Wolfy-J)
 */
namespace Requests;

use Database\Sample;
use Spiral\Http\Request\RequestFilter;

class SampleRequest extends RequestFilter
{
    /**
     * @var array
     */
    protected $schema = [
        'name'    => 'data:name',
        'status'  => 'data:status',
        'content' => 'data:content',
        'value'   => 'data:value',
    ];

    /**
     * @var array
     */
    protected $setters = [
        'name'    => 'trim',
        'status'  => 'trim',
        'content' => 'trim',
        'value'   => 'intval'
    ];

    /**
     * @var array
     */
    protected $validates = [
        'name'    => [
            ['notEmpty', 'error' => '[[Name is required]]'],
        ],
        'status'  => [
            'notEmpty',
            ['in_array', ['active', 'disabled'], 'error' => '[[Invalid status value]]']
        ],
        'content' => [
            'notEmpty',
            ['string::shorter', 5000]
        ],
        'value'   => [
            'notEmpty',
            'integer'
        ]
    ];

    /**
     * @param Sample $entity
     * @return bool
     */
    public function populate(Sample $entity)
    {
        //Copying public fields
        $entity->setFields($this);

        //Custom mapping
        $entity->child->value = $this->value;

        return $this->isValid();
    }
}