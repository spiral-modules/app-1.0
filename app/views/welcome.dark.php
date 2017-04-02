<extends:layouts.html5 title="[[Welcome To Spiral]]" git="https://github.com/spiral"/>

<dark:use path="partials/links" as="homepage:links"/>

<define:styles>
    <yield:styles/>
    <asset:style src="/resources/styles/welcome.css"/>
</define:styles>

<define:body>
    <div class="wrapper">
        <div class="placeholder">
            <img src="@{basePath}resources/images/spiral.svg" width="180px"/>

            <h2>[[Welcome to Spiral Framework]]</h2>

            <homepage:links git="${git}" style="font-weight: bold;"/>

            <div style="font-size: 12px; margin-top: 10px;">
                [[This view file is located in]]
                <a href="${git}/application/blob/master/app/views/welcome.dark.php">app/views/welcome.dark.php</a>
                [[and rendered by]] <b>Controllers\IndexController</b>.
            </div>
        </div>
    </div>
</define:body>
