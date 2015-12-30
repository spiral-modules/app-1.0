<?php
/**
 * Spiral Framework.
 *
 * @license   MIT
 * @author    Anton Titov (Wolfy-J)
 */
namespace Commands;

use Database\Sample;
use Spiral\Console\Command;
use Symfony\Component\Console\Helper\ProgressBar;

class SeedCommand extends Command
{
    /**
     * Command name.
     *
     * @var string
     */
    protected $name = 'seed';

    /**
     * Short command description.
     *
     * @var string
     */
    protected $description = 'Generate sample models';

    /**
     * Run with "-vvv" flag to see all generated SQL commands.
     */
    public function perform()
    {
        $this->writeln("Seeding sample entities...");

        $progress = new ProgressBar($this->output, 100);
        for ($i = 0; $i < 100; $i++) {

            $entity = new Sample();
            $entity->name = $this->faker->name;
            $entity->content = $this->faker->text(mt_rand(100, 5000));
            $entity->status = $this->faker->randomElement(['active', 'disabled']);

            //HAS ONE embedded model
            $entity->child->value = $this->faker->numberBetween(1, 1000);

            $entity->save() && $progress->advance();
        }
    }
}
