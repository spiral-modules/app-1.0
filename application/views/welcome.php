<extends:layouts.simple title="Welcome to Spiral Framework!"/>

<block:content>
    <img src="@{basePath}resources/images/spiral.svg" width="120px"/>

    <spiral:markdown>
        #Welcome To Spiral
    </spiral:markdown>

    <a href="${git|https://github.com/spiral-php/application}">GitHub</a>
    | <a href="https://github.com/spiral-php/documentation">[[Documentation (unfinished)]]</a>

    <br/><br/>

    <span style="font-size: 12px;">
        This view file is located in
        <a href="${git}/blob/master/application/views/welcome.php">application/views/welcome.php</a>
        and rendered by Controllers\HomeController.
    </span>
</block:content>