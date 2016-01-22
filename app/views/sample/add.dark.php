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

    <!--We can reuse some elements like forms in a multiple places-->
    <sample:form url="/sample/create" entity="<?= $entity ?>" submit="[[CREATE]]"/>
</define:content>
