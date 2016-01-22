<?php
/**
 * Spiral Framework.
 *
 * @license   MIT
 * @author    Anton Titov (Wolfy-J)
 */
namespace Database\Sources;

use Database\Sample;
use Spiral\ORM\Entities\RecordSelector;
use Spiral\ORM\Entities\RecordSource;

class SampleSource extends RecordSource
{
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
     * @param int|string $id
     * @return null|Sample
     */
    public function findByPK($id)
    {
        return $this->find()->load('child')->findByPK((int)$id);
    }

    /**
     * @return RecordSelector
     */
    public function findAll()
    {
        return $this->find()->load('child');
    }

    /**
     * @return RecordSelector
     */
    public function findActive()
    {
        return $this->find(['status' => 'active'])->load('child');
    }

    /**
     * Active records with specific value in child table.
     *
     * @param int $value
     * @return RecordSelector
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

    /**
     * @param Sample $entity
     */
    public function delete(Sample $entity)
    {
        //Perfect spot to implement soft deletes in combination with find() method altering
        $entity->delete();
    }
}
