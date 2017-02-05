<!DOCTYPE html>
<html>
<head>
    <block:head>
        <title>${title}</title>
        <script>
            window.csrfToken = "<?= app()->request->getAttribute('csrfToken') ?>";
        </script>
        <block:resources/>
        <yield:styles>
            <link rel="stylesheet" href="@{basePath}resources/styles/spiral.css"/>
        </yield:styles>
    </block:head>
</head>
<body>
<yield:body/>
<yield:scrips/>
</body>
</html>
