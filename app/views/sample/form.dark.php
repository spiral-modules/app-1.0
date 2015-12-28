<extends:layouts.blank page="[[Add Element]]"/>
<?php
/**
 * @var \Database\Sample               $entity
 * @var \Database\Sources\SampleSource $source
 */
?>

<define:content>
    <a href="/sample">[[Back to elements list]]</a>

    <spiral:form action="/sample/save/<?= $entity->id ?>" style="margin-top: 20px;">
        <form.input label="Name" name="name" value="<?= e($entity->name) ?>"/>

        <form.select label="Status" name="status" values="<?= [
            'active'   => 'Active',
            'disabled' => 'Disabled'
        ] ?>" value="<?= $entity->status ?>"/>

        <form.textarea label="Content" name="content" value="<?= e($entity->content) ?>" rows="15"/>
        <form.input label="Value" name="value" value="<?= $entity->child->value ?>"/>

        <input type="submit" class="btn btn-default" value="<?= $entity->isLoaded() ? '[[Update]]' : '[[Create]]' ?>"/>
    </spiral:form>

    <?php if ($entity->isLoaded() && !empty($source)): ?>
        <div class="similar" style="margin-top: 20px;">
            [[Similar elements]]: <?= $source->findByValue($entity->child->value)->count() ?>
        </div>
    <?php endif; ?>
</define:content>
