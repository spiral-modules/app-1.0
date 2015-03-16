<extends:layouts.simple title="Welcome to Spiral Framework!"/>
<use namespace="spiral"/>

<block:content>
    <img src="@{basePath}resources/images/spiral.svg" width="120px"/>

    <spiral:markdown>
        Welcome
        =======
    </spiral:markdown>

    <a href="https://github.com/spiral-php/application">GitHub</a>
    | <a href="https://github.com/spiral-php/documentation">Documentation (unfinished)</a>

    <br/><br/>

    <span style="font-size: 12px;">
        This view file located in /application/views/welcome.php and called by Controllers\HomeController.
    </span>

</block:content>
