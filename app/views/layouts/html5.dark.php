<dark:use bundle="spiral:bundle"/>

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
            <toolkit:styles/>
        </yield:styles>
    </block:head>
</head>
<body>
<yield:body/>
<yield:scrips>
    <toolkit:scripts/>
</yield:scrips>
</body>
</html>