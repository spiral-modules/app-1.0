<extends:layouts.simple title="[[Welcome to Spiral Framework!]]" git="https://github.com/spiral-php"
                        xmlns:block="http://www.w3.org/1999/html"/>

<block:body>
    <div class="wrapper">
        <div class="placeholder">
            <img src="@{basePath}resources/images/spiral.svg" width="120px"/>

            <h2>Welcome To Spiral</h2>

            <a href="${git}/application">GitHub</a> |
            <a href="${git}/documentation">Documentation (unfinished)</a>

            <div style="font-size: 12px; margin-top: 10px;">
                This view file is located in
                <a href="${git}/application/blob/master/application/views/welcome.php">application/views/welcome.php</a>
                and rendered by <b>Controllers\HomeController</b>.
            </div>
        </div>
    </div>
</block:body>