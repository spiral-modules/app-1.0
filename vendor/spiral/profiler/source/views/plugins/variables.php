<div class="plugin" id="profiler-plugin-variables">
    <div class="title top-title">[[Request and Environment Variables]]</div>
    <?
    /**
     * @var \Psr\Http\Message\ServerRequestInterface $request
     */

    $session = \Spiral\Components\Session\SessionStore::getInstance();
    ?>
    <div class="tabs-block">
        <div class="tab-navigation">
            <ul id="profiler-tabs">
                <li>
                    <b>[[Incoming Request]]</b>
                </li>
                <li>
                    <a href="#request-attributes">[[Attributes]]</a>
                </li>
                <li>
                    <a href="#request-headers">[[Headers]]</a>
                </li>
                <li>
                    <a href="#request-query">[[Query]]</a>
                </li>
                <li>
                    <a href="#request-data">[[Data]]</a>
                </li>
                <li>
                    <a href="#request-cookies">[[Cookies]]</a>
                </li>
                <li>
                    <a href="#request-files">[[Uploaded Files]]</a>
                </li>
                <li>
                    <a href="#user-session">[[User Session]]</a>
                </li>
                <li>
                    <b>[[Environment]]</b>
                </li>
                <li>
                    <a href="#server-information">[[Server Information]]</a>
                </li>
            </ul>
        </div>
        <div class="tab-content">
            <div class="tab-block" id="request-attributes">
                <?php dump($request->getAttributes()) ?>
            </div>

            <div class="tab-block" id="request-data">
                <?php dump($request->getParsedBody()) ?>
            </div>

            <div class="tab-block" id="request-query">
                <?php dump($request->getQueryParams()) ?>
            </div>

            <div class="tab-block" id="request-headers">
                <?php dump($request->getHeaders()) ?>
            </div>

            <div class="tab-block" id="request-cookies">
                <?php dump($request->getCookieParams()) ?>
            </div>

            <div class="tab-block" id="request-files">
                <?php dump($request->getUploadedFiles()) ?>
            </div>

            <div class="tab-block" id="server-information">
                <?php dump($request->getServerParams()) ?>
            </div>

            <div class="tab-block" id="user-session">
                <?php
                if (!$session->isStarted())
                {
                    echo "[[User session has not been started.]]";
                }
                else
                {
                    dump($session->all());
                }
                ?>
            </div>

        </div>
    </div>
</div>