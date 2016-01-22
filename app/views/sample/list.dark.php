<extends:layouts.blank page="[[Sample Grid Page]]" title="[[Sample Grid]]"/>
<?php
/**
 * This block will never be executed or included into template. You can find compiled template in
 * "application/runtime/cache/views/".
 *
 * @var \Spiral\ORM\Entities\RecordSelector $selector
 * @var \Database\Sample                    $sample
 */
?>

<!--You can get much nicer and flexible layout using Vault module.-->
<define:content>
    <a href="/sample/add">[[+ ADD ELEMENT]]</a>

    <spiral:grid source="<?= $selector ?>" as="sample" style="margin-top: 20px;">
        <!-- Simple grids only need column title and value-->
        <grid:cell title="ID" value="<?= $sample->id ?>"/>

        <!-- Custom classes, styles and etc are still possible and behave as in regular tags -->
        <grid:cell title="Status" value="<?= $sample->status ?>" style="font-weight: bold;"/>

        <!-- We can use short function e() to escape unsafe values -->
        <grid:cell title="Name" value="<?= e($sample->name) ?>"/>

        <!-- Size of property "content" in bytes, this is prepared cell type (see bool, bytes and number) -->
        <grid:cell.bytes title="Content Size" value="<?= strlen($sample->content) ?>"/>

        <!-- Most of elements can be used using multiple aliases (grid: vs grid.) -->
        <grid:cell.number title="Sample value" value="<?= $sample->child->value ?>"/>

        <!-- Some cells can be defined using tag context -->
        <grid:cell style="text-align: center;">
            <a href="<?= uri('sample::edit', ['id' => $sample->id]) ?>">[[EDIT]]</a>
        </grid:cell>
    </spiral:grid>
</define:content>