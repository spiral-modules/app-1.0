<?php
/**
 * Spiral Framework.
 *
 * @license   MIT
 * @author    Anton Titov (Wolfy-J)
 */
namespace Controllers;

use Database\Sample;
use Database\Sources\SampleSource;
use Requests\SampleRequest;
use Spiral\Core\Controller;
use Spiral\Http\Exceptions\ClientExceptions\NotFoundException;
use Spiral\Translator\Traits\TranslatorTrait;

class SampleController extends Controller
{
    use TranslatorTrait;

    /**
     * @see SeedCommand
     * @return string
     */
    public function indexAction()
    {
        /*
         * Sample::source() == SampleSource (automatically resolved on orm schema update)
         */
        $selector = Sample::source()->findAll()->orderBy('sample.id', 'DESC')->paginate(25);

        return $this->views->render('sample/list', [
            'selector' => $selector
        ]);
    }

    /**
     * @param SampleSource $source This is alternative way to receive record source without using
     *                             static methods.
     * @return string
     */
    public function createAction(SampleSource $source)
    {
        return $this->views->render('sample/form', [
            'entity' => $source->create()
        ]);
    }

    /**
     * Shortcuts.
     *
     * @param string $id
     * @return string
     */
    public function editAction($id)
    {
        //You can do the same thing using source by overwriting findByPK method
        if (empty($entity = Sample::findByPK($id, ['child']))) {
            throw new NotFoundException();
        }

        return $this->views->render('sample/form', [
            'entity' => $entity,
            'source' => Sample::source()
        ]);
    }

    /**
     * Create or update entity.
     *
     * @param string        $id
     * @param SampleRequest $request
     * @return array
     */
    public function saveAction($id, SampleRequest $request)
    {
        /**
         * @var Sample $entity
         */
        if (!empty($id)) {
            if (empty($entity = Sample::findByPK($id, ['child']))) {
                throw new NotFoundException();
            }
        } else {
            $entity = new Sample();
        }

        //Alternatively you can ask entity to validate itself and skip request wrapper
        //or use it without populate method
        if (!$request->isValid() || !$request->populate($entity)) {
            return [
                'status' => 400,
                'errors' => $request->getErrors()
            ];
        }

        //Alternatives: $source->save($entity) or Sample::source()->save($entity), see SampleSource
        if (!$entity->save()) {
            return [
                'status' => 500,
                'errors' => $entity->getErrors()
            ];
        }

        if (!empty($id)) {
            return [
                'status'  => 200,
                'message' => $this->say("Sample entity has been successfully updated.")
            ];
        }

        return [
            'status'  => 201,
            'message' => $this->say("Sample entity has been successfully created."),
            'action'  => [
                //Wait for 2 seconds
                'delay'    => 2000,
                'redirect' => $this->router->uri('sample::edit', [
                    'id' => $entity->primaryKey()
                ])
            ]
        ];
    }
}
