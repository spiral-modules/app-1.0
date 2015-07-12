<?php
/**
 * @var \Spiral\Profiler\Profiler $profiler
 * @var float                     $started
 */
$colors = [
    2    => 'default',
    10   => 'blue',
    30   => 'orange',
    1000 => 'red'
];
?>
<div class="plugin" id="profiler-plugin-benchmarks">
    <div class="title top-title">[[Application Profiling]]</div>
    <div class="flow" id="profiler-time-flow">
        <table>
            <thead>
            <tr>
                <th style="width: 10%">[[Record]]</th>
                <th>[[Timeline]]</th>
            </tr>
            </thead>
        </table>
        <?php
        $benchmarks = $profiler->getBenchmarks($ending);

        $profilerOffset = (microtime(true) - SPIRAL_INITIAL_TIME);
        $profilerFrame = max($ending - $started, 0.001);
        $profilerScale = $profilerOffset / $profilerFrame;

        foreach ($benchmarks as $record => $benchmark)
        {
            $lineLength = 100 * (($benchmark['elapsed']) / $profilerFrame) / $profilerScale;
            foreach ($colors as $length => $color)
            {
                if ($lineLength < $length)
                {
                    break;
                }
            }

            $lineOffset = 100 * ($benchmark['started'] - $started) / $profilerFrame / $profilerScale;
            if ($lineOffset + $lineLength > 100)
            {
                $lineLength = 100 - $lineOffset;
            }

            ?>
            <div class="timeline clearfix" onclick="this.setAttribute('status', this.getAttribute('status') == 'open' ? 'closed' : 'open')" status="closed">
                <div class="clearfix">
                    <div class="name"><?= $benchmark['name'] ?></div>
                    <div class="time <?= !empty($color) ? 'time-' . $color : '' ?>">
                        <div style="margin-left: <?= $lineOffset ?>%; width: <?= $lineLength ?>%;"></div>
                    </div>
                </div>
                <div class="details clearfix">
                    <div style="unicode-bidi: embed; white-space: pre;"><?= $benchmark['context'] ?></div>
                    <br>

                    <div style="float: right; color: #33a3fe">
                        [[Memory:]] <?= \spiral\helpers\StringHelper::formatBytes($benchmark['memory']) ?>
                    </div>

                    <div style="font-weight: bold;">
                        [[Elapsed:]] ~<?= number_format($benchmark['elapsed'] * 1000) ?> [[ms]]
                    </div>
                </div>
            </div>
        <?php
        }
        ?>
    </div>
</div>