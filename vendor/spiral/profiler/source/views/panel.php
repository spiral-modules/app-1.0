<?php
use Spiral\Helpers\StringHelper;

/**
 * @var float $elapsed
 */
$elapsed = max($elapsed, 0.001);
?>
<!-- Profiler panel beginning. -->
<div id="spiral-profiler">
    <use path="self:plugins" namespace="plugins"/>
    <link rel="stylesheet" type="text/css" href="@{basePath}resources/styles/profiler/profiler.css"/>
    <script type="text/javascript" src="@{basePath}resources/scripts/profiler/profiler.js"></script>

    <div id="dbg-prf" class="profiler">
        <div id="dbg-prf-shadow" class="shadow"></div>
        <a class="spiral-link" id="dbg-prf-link"></a>

        <div id="dbg-prf-options" class="options">
            <div id="dbg-prf-option-elapsed" class="option elapsed">
                <?= number_format(1000 * $elapsed) ?> [[ms]]
            </div>

            <div id="dbg-prf-option-memory" class="option memory">
                <?= StringHelper::formatBytes(memory_get_peak_usage()) ?>
            </div>

            <!-- Plugins. -->
            <div id="dbg-profiler-plugin-environment" class="option environment" plugin="environment">
                <a title="[[Environment]]"></a>
            </div>

            <div id="dbg-profiler-plugin-variables" class="option variables" plugin="variables">
                <a title="[[Application Variables]]"></a>
            </div>

            <div id="dbg-profiler-plugin-benchmarks" class="option benchmarks" plugin="benchmarks">
                <a title="[[Application Profiling]]"></a>
            </div>

            <div id="dbg-profiler-plugin-logging" class="option logging" plugin="logging">
                <a title="[[Log Messages]]"></a>
            </div>
            <!-- End of Plugins. -->

            <div id="dbg-prf-options-option-close" class="option close option-close"></div>
        </div>

        <div id="dbg-prf-content" class="content">
            <div id="dbg-prf-content-option-close" class="option close option-close"></div>
            <div class="inner-modal">
                <plugins:environment/>
                <plugins:variables/>
                <plugins:benchmarks/>
                <plugins:logging/>
            </div>
        </div>
        <div id="dbg-js-content" class="content">
            <div id="dbg-js-content-option-close" class="option close option-close"></div>
        </div>
    </div>
</div>