<?php
use Spiral\Components\Debug\Logger;

/**
 * @var \Spiral\Profiler\Profiler $profiler
 */

?>
<div class="plugin" id="profiler-plugin-logging">
    <div class="title top-title">[[Log Messages]]</div>
    <table id="debug-messages-table">
        <thead>
        <tr>
            <th>
                <select id="debug-messages"></select>
            </th>
            <th>[[Level]]</th>
            <th>[[Message]]</th>
        </tr>
        </thead>
        <tbody>
        <?php
        $colors = [
            'warning'  => 'yellow',
            'notice'   => 'yellow',
            'critical' => 'red',
            'alert'    => 'red',
            'error'    => 'red'
        ];

        foreach ($profiler->logMessages() as $message)
        {
            $class = '';
            if (isset($colors[$message[Logger::MESSAGE_LEVEL]]))
            {
                $class = $colors[$message[Logger::MESSAGE_LEVEL]] . '-td';
            }

            ?>
            <tr class="caller-<?= $message[Logger::MESSAGE_CONTAINER] ?> <?= $class ?>">
                <td class="nowrap">
                    <b><?= $message[Logger::MESSAGE_CONTAINER] ?></b>
                </td>
                <td class="nowrap">
                    <?= strtoupper($message[Logger::MESSAGE_LEVEL]) ?>
                </td>
                <td style="unicode-bidi: embed; white-space: pre;" width="100%"><?php
                    echo $profiler->formatMessage(
                        $message[Logger::MESSAGE_CONTAINER],
                        $message[Logger::MESSAGE_BODY],
                        $message[Logger::MESSAGE_CONTEXT]
                    );
                    ?>
                </td>
            </tr>
        <?php
        }

        if (!$profiler->logMessages())
        {
            ?>
            <tr>
                <td colspan="3" align="center" style="padding: 20px;">
                    [[No log messages were created while performing this user request.]]
                </td>
            </tr>
        <?php
        }
        ?>
        </tbody>
    </table>
</div>