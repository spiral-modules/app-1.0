<extends:layouts.html5 title="[[Welcome To Spiral]]" git="https://github.com/spiral"/>

<!--Let's import our partials under tag named "links".-->
<dark:use path="partials/links" as="links"/>

<define:head>
    <yield:head/>
    <link rel="stylesheet" href="@{basePath}resources/styles/welcome.css"/>
</define:head>

<define:body>
    <div class="wrapper">
        <div class="placeholder">
            <img src="@{basePath}resources/images/spiral.svg" width="180px"/>

            <h2>[[Welcome to Spiral Framework]]</h2>

            <links git="${git}" style="font-weight: bold;"/>

            <div style="font-size: 12px; margin-top: 10px;">
                [[This view file is located in]]
                <a href="${git}/application/blob/master/app/views/welcome.dark.php">app/views/welcome.dark.php</a>
                [[and rendered by]] <b>Controllers\HomeController</b>.
            </div>
        </div>
    </div>
</define:body>
