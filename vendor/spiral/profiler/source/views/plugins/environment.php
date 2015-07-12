<?php
/**
 * Environment definition requires some components.
 */
$container = \Spiral\Core\Container::getInstance();
$loader = \Spiral\Core\Loader::getInstance();
$http = \Spiral\Components\Http\HttpDispatcher::getInstance();
$view = \Spiral\Components\View\ViewManager::getInstance();
$file = \Spiral\Components\Files\FileManager::getInstance();
?>
<div class="plugin" id="profiler-plugin-environment">
    <div class="title top-title">[[Spiral Environment]], PHP (<?= phpversion() ?>)</div>
    <div class="narrow-col">
        <?php
        if (!$view->getConfig()['caching']['enabled'])
        {
            ?>
            <div class="error">
                [[View cache is disabled, this will slow down your application a lot.]]
                [[Do not forget to turn view cache on later.]]<br/>
                [[Cache flag located in <b>application/config/view.php</b> configuration file.]]
            </div>
        <?php
        }
        ?>
        <table>
            <tbody>
            <tr>
                <th colspan="3">[[Active HTTP Routes]]</th>
            </tr>
            <?php
            foreach ($http->getRouter()->getRoutes() as $route)
            {
                ?>
                <tr>
                    <td class="nowrap">
                        <b><?= $route->getName() ?></b>
                    </td>
                    <td>
                        <?php
                        if ($route instanceof \Spiral\Components\Http\Router\AbstractRoute)
                        {
                            echo e($route->getPattern());
                        }
                        else
                        {
                            echo '-';
                        }
                        ?>
                    </td>
                    <td>
                        <?= get_class($route); ?>
                    </td>
                </tr>
            <?php
            }
            ?>
            </tbody>
        </table>
        <table>
            <tbody>
            <tr>
                <th colspan="3">[[View Namespaces]]</th>
            </tr>
            <?php
            foreach ($view->getNamespaces() as $name => $directories)
            {
                foreach ($directories as $directory)
                {
                    ?>
                    <tr>
                        <td class="nowrap">
                            <b><?= $name ?></b>
                        </td>
                        <td>
                            <?= $file->normalizePath($directory) ?>
                        </td>
                    </tr>
                    <?php
                    $name = '';
                }
            }
            ?>
            </tbody>
        </table>
        <table>
            <tbody>
            <tr>
                <th colspan="3">[[Components]]</th>
            </tr>
            <?php
            $classIDs = [];
            foreach ($container->getBindings() as $alias => $resolver)
            {
                ?>
                <tr>
                    <td class="nowrap"><?= $alias ?></td>
                    <td>
                        <?php
                        if (is_string($resolver))
                        {
                            echo e($resolver);
                        }
                        elseif (is_array($resolver))
                        {
                            echo '<b>late resolve</b> ' . ($resolver[1] ? '(singleton)' : '');
                        }
                        elseif (is_object($resolver))
                        {
                            echo '<b class="text-blue">' . get_class($resolver) . '</b><br/>';
                        }
                        ?>

                    </td>
                    <td class="nowrap">
                        <?php
                        if (is_object($resolver))
                        {
                            //Resolving unique object id
                            if (!isset($classIDs[spl_object_hash($resolver)]))
                            {
                                $classIDs[spl_object_hash($resolver)] = count($classIDs) + 16;
                            }

                            $classID = $classIDs[spl_object_hash($resolver)];
                            echo strtoupper(dechex($classID));
                        }
                        else
                        {
                            echo '-';
                        }
                        ?>
                    </td>
                </tr>
            <?php
            }
            ?>
            </tbody>
        </table>
        <table>
            <tbody>
            <tr>
                <th colspan="2">[[Server Options]]</th>
            </tr>
            <?php
            $serverVariables = [
                '[[IP ADDRESS]]'    => 'SERVER_ADDR',
                '[[SOFTWARE]]'      => 'SERVER_SOFTWARE',
                '[[DOCUMENT ROOT]]' => 'DOCUMENT_ROOT',
                '[[PROTOCOL]]'      => 'SERVER_PROTOCOL'
            ];

            $phpVariables = [
                '[[PHP EXPOSING]]'           => '(bool)expose_php',
                '[[EXTENSIONS DIRECTORY]]'   => 'extension_dir',
                '[[FILE UPLOADS]]'           => '(bool)file_uploads',
                '[[FILE UPLOADS DIRECTORY]]' => 'upload_tmp_dir',
                '[[POST DATA SIZE LIMIT]]'   => 'post_max_size',
                '[[MAX FILESIZE]]'           => 'upload_max_filesize',
                '[[MEMORY LIMIT]]'           => 'memory_limit',
                '[[TIME LIMIT]]'             => 'max_execution_time'
            ];

            foreach ($serverVariables as $title => $variable)
            {
                if (array_key_exists($variable, $_SERVER))
                {
                    ?>
                    <tr>
                        <td align="right" class="nowrap"><?= str_replace(' ', '&nbsp;', $title) ?></td>
                        <td><?= $_SERVER[$variable] ?></td>
                    </tr>
                <?php
                }
            }

            $phpEnvironment = ini_get_all();
            foreach ($phpVariables as $title => $variable)
            {
                $variableName = preg_replace('/\(.+?\)/', '', $variable);
                if (array_key_exists($variableName, $phpEnvironment))
                {
                    if (!strncasecmp($variable, '(bool)', 6))
                    {
                        $value = $phpEnvironment[$variableName]['local_value']
                            ? '<b>[[TRUE]]</b>'
                            : '<b>[[FALSE]]</b>';
                    }
                    else
                    {
                        $value = $phpEnvironment[$variableName]['local_value'];
                    }
                    ?>
                    <tr>
                        <td align="right"><?= str_replace(' ', '&nbsp;', $title) ?></td>
                        <td><?= $value ?></td>
                    </tr>
                <?php
                }
            }
            ?>
            </tbody>
        </table>
        <table>
            <tbody>
            <tr>
                <th colspan="3">[[Available extensions]]</th>
            </tr>
            <?php
            $extensions = get_loaded_extensions();
            while ($extension = next($extensions))
            {
                ?>
                <tr>
                    <td><?= $extension ?></td>
                    <td><?= next($extensions) ?></td>
                    <td><?= next($extensions) ?></td>
                </tr>
            <?php
            }
            ?>
            </tbody>
        </table>
    </div>
    <div class="wide-col">
        <table>
            <tbody>
            <tr>
                <th colspan="2">[[Loaded Classes]]</th>
            </tr>
            <?php

            $application = $file->normalizePath(directory('application'));
            $libraries = $file->normalizePath(directory('libraries'));
            $framework = $file->normalizePath(directory('framework'));

            foreach ($loader->getClasses() as $class => $filename)
            {
                $filename = $file->normalizePath($filename);

                $color = '';
                if (strpos($filename, $application) === 0)
                {
                    $color = 'blue';
                }

                if (
                    strpos($filename, $libraries) === 0
                    && strpos($filename, $framework) === false
                )
                {
                    $color = 'yellow';
                }
                ?>
                <tr class="<?= $color ? $color . '-td' : '' ?>">
                    <td><?= $class ?></td>
                    <td><?= $file->relativePath($filename) ?></td>
                </tr>
            <?php
            }
            ?>
            </tbody>
        </table>
        <table>
            <tbody>
            <tr>
                <th colspan="2">[[Included files]]</th>
            </tr>
            <?php
            $totalSize = 0;
            foreach (get_included_files() as $filename)
            {
                if (!file_exists($filename))
                {
                    continue;
                }

                $filesize = filesize($filename);
                $totalSize += $filesize;
                ?>
                <tr>
                    <td><?= $file->normalizePath($filename) ?></td>
                    <td align="right" class="nowrap"><?= StringHelper::formatBytes($filesize) ?></td>
                </tr>
            <?php
            }
            ?>
            <tr>
                <td align="right">TOTAL:</td>
                <td align="right" class="nowrap"><?= StringHelper::formatBytes($totalSize) ?></td>
            </tr>
            </tbody>
        </table>

    </div>
</div>