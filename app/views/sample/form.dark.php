<dark:use bundle="spiral:bundle"/>
<?php #compile
/**
 * This php block will only be executed at moment of view compilation (see #compile flag).
 *
 * @var \Database\Sample $sample
 */

/*
 * Following block of code is only allowed inside #comple php blocks,
 * at moment of compilation runtime variable named $sample will be created
 * using 'entity' attribute value.
 *
 * Example:
 *
 * <sample:form entity="<?= $entity ?>" uri="update/url" submit="UPDATE"/>
 *
 * OR
 *
 * <sample:form entity="<?= new Entity() ?>" uri="create/url" submit="CREATE"/>
 *
 * Since this form defines context block you can use it this way as well:
 *
 * <sample:form entity="<?= new Entity() ?>" uri="create/url" submit="CREATE">
 *    <form:input label="Some page specific form element"/>
 * </sample:form>
 */
$this->runtimeVariable('sample', '${entity}');
?>

<spiral:form action="${url}" style="margin-top: 20px;">
    <form:input label="Name" name="name" value="<?= e($sample->name) ?>"/>

    <form:select label="Status" name="status" value="<?= $sample->status ?>" values="<?= [
        'active'   => 'Active',
        'disabled' => 'Disabled'
    ] ?>"/>

    <form:textarea label="Content" name="content" value="<?= e($sample->content) ?>" rows="15"/>
    <form:input label="Value" name="value" value="<?= $sample->child->value ?>"/>

    ${context}

    <input type="submit" class="btn btn-default" value="${submit|[[SAVE]]}"/>
</spiral:form>