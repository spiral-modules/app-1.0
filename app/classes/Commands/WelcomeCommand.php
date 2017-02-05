<?php
/**
 * Spiral Framework.
 *
 * @license   MIT
 * @author    Anton Titov (Wolfy-J)
 */

namespace Commands;

use Spiral\Console\Command;
use Spiral\Translator\TranslatorInterface;
use Symfony\Component\Console\Input\InputOption;

/**
 * You can add new commands at any moment, simply drop command file here and
 * run "console:reload" after.
 */
class WelcomeCommand extends Command
{
    /**
     * Command name.
     *
     * @var string
     */
    const NAME = 'welcome';

    /**
     * Short command description.
     *
     * @var string
     */
    const DESCRIPTION = 'Welcome command';

    /**
     * @var array
     */
    const OPTIONS = [
        ['lang', 'l', InputOption::VALUE_OPTIONAL, 'Locale id to be used', 'en']
    ];

    /**
     * @param TranslatorInterface $translator
     */
    public function perform(TranslatorInterface $translator)
    {
        if (!empty($this->option('lang'))) {
            $translator->setLocale($this->option('lang'));
        }

        $this->writeln("<info>{$translator->trans("Welcome to Spiral Framework")}</info>");
    }
}
