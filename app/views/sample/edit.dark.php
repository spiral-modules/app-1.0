<extends:layouts.blank page="[[Add Element]]"/>
<dark:use path="sample/form" as="sample:form"/>

<?php
/**
 * @var \Database\Sample               $entity
 * @var \Database\Sources\SampleSource $source
 */
?>

<define:content>
    <a href="/sample">[[BACK]]</a>

    <!--We can simply tweak same element like form to use in multiple places-->
    <sample:form url="/sample/update/<?= $entity->id ?>" entity="<?= $entity ?>" submit="[[UPDATE]]"/>

    <div class="similar" style="margin-top: 20px;">
        [[Similar elements]]: <?= $source->findByValue($entity->child->value)->count() ?>
    </div>
</define:content>
