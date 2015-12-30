<?php
/**
 * Spiral Framework.
 *
 * @license   MIT
 * @author    Anton Titov (Wolfy-J)
 */
namespace Database\Sources;

use Database\Sample;
use Spiral\Core\Container\SingletonInterface;
use Spiral\ORM\Entities\RecordSource;

class SampleSource extends RecordSource implements SingletonInterface
{
    /**
     * One instance only per container
     */
    const SINGLETON = self::class;

    /**
     * This constant helps ORM automatically link this class to 
     * your entity which makes possible to use it like:
     * 
     * Sample::source()->findByValue();
     * 
     * P.S. You still better request it via DI. :)
     */
    const RECORD = Sample::class;

    /**
     * @return \Spiral\ORM\Entities\RecordSelector
     */
    public function findAll()
    {
        return $this->find()->load('child');
    }

    /**|PaginableInterface
     */
    public function findActive()
    {
        return $this->find(['status' => 'active'])->load('child');
    }

    /**
     * Active records with specific value in child table.
     *
     * @param int $value
     * @return \Spiral\ORM\Entities\RecordSelector
     */
    public function findByValue($value)
    {
        //Alternative: ->where('child.value', '=', new Parameter($value, \PDO::PARAM_INT))
        return $this->findAll()->with('child')->where('child.value', '=', (int)$value);
    }

    /**
     * @param Sample $entity
     * @param array  $errors Reference
     * @return bool
     */
    public function save(Sample $entity, &$errors = null)
    {
        if (!$entity->save()) {
            $errors = $entity->getErrors();

            return false;
        }

        return true;
    }
}
