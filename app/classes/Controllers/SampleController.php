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
    public function indexAction(SampleSource $source)
    {
        /*
         * $source == Sample::source() (automatically resolved on orm schema update)
         */
        $selector = $source->findAll()->orderBy('sample.id', 'DESC')->paginate(25);

        return $this->views->render('sample/list', [
            'selector' => $selector
        ]);
    }

    /**
     * @param SampleSource $source This is alternative way to receive record source without using
     *                             static methods.
     * @return string
     */
    public function addAction(SampleSource $source)
    {
        return $this->views->render('sample/add', [
            'entity' => $source->create() //Identical to new Sample()
        ]);
    }

    /**
     * @param string       $id
     * @param SampleSource $source
     * @return string
     */
    public function editAction($id, SampleSource $source)
    {
        //Same as Sample::findByPK($id, ['child']);
        if (empty($entity = $source->findByPK($id))) {
            throw new NotFoundException('Unable to find Sample entity');
        }

        return $this->views->render('sample/edit', [
            'entity' => $entity,
            'source' => $source
        ]);
    }

    /**
     * @param SampleSource  $source
     * @param SampleRequest $request It's not really needed in most of your CRUD controllers.
     * @return array
     */
    public function createAction(SampleSource $source, SampleRequest $request)
    {
        /**
         * @var Sample $entity
         */
        $entity = $source->create();

        //Alternatively you can ask entity to validate itself and skip request wrapper
        //or use it without populate method
        if (!$request->isValid() || !$request->populate($entity)) {
            return [
                'status' => 400,
                'errors' => $request->getErrors()
            ];
        }

        /*
         * You can move entity validations into Sample model (almost same code) and use it this way:
         *
         * $entity->setFields($this->input->data); //Can automatically fill child->value property
         */

        //Alternatives: $entity->save()
        if (!$source->save($entity, $errors)) {
            return [
                'status' => 500,
                'errors' => $errors
            ];
        }

        return [
            'status'  => 201,
            'message' => $this->say("Sample entity has been successfully created"),
            'action'  => [
                //Wait for 2 seconds
                'delay'    => 2000,
                'redirect' => $this->router->uri('sample::edit', $entity)
            ]
        ];
    }

    /**
     * @param string        $id
     * @param SampleSource  $source
     * @param SampleRequest $request
     * @return array
     */
    public function updateAction($id, SampleSource $source, SampleRequest $request)
    {
        /**
         * @var Sample $entity
         */
        if (empty($entity = $source->findByPK($id))) {
            throw new NotFoundException();
        }

        //Alternatively you can ask entity to validate itself and skip request wrapper
        //or use it without populate method
        if (!$request->isValid() || !$request->populate($entity)) {
            return [
                'status' => 400,
                'errors' => $request->getErrors()
            ];
        }

        /*
         * You can move entity validations into Sample model (almost same code) and use it this way:
         *
         * $entity->setFields($this->input->data); //Can automatically fill child->value property
         */

        if (!$source->save($entity, $errors)) {
            return [
                'status' => 500,
                'errors' => $errors
            ];
        }

        return [
            'status'  => 200,
            'message' => $this->say("Sample entity has been successfully updated")
        ];
    }
}
