<extends:layouts.simple title="[[Welcome to Spiral Framework!]]" git="https://github.com/spiral-php"/>

<block:content>
    <img src="@{basePath}resources/images/spiral.svg" width="120px"/>

    <spiral:markdown>#Welcome To Spiral</spiral:markdown>

    <a href="${git}/application">GitHub</a> |
    <a href="${git}/documentation">Documentation (unfinished)</a>

    <div style="font-size: 12px; margin-top: 10px;">
        This view file is located in
        <a href="${git}/application/blob/master/application/views/welcome.php">application/views/welcome.php</a>
        and rendered by <b>Controllers\HomeController</b>.
    </div>
</block:content>