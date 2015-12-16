<dark:use bundle="spiral:bundle"/>

<!DOCTYPE html>
<html>
<head>
    <block:head>
        <title>${title}</title>
        <script>
            window.csrfToken = "<?= spiral('request')->getAttribute('csrfToken') ?>";
        </script>
        <asset:style href="resources/styles/spiral/spiral.css"/>
        <block:resources/>
        <!--[STYLES]-->
    </block:head>
</head>
<body>
<yield:body/>
<!--[SCRIPTS]-->
</body>
</html>