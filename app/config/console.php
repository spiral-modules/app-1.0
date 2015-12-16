<?php
/**
 * Configuration used by spiral console toolkit to declare set of configuration and update commands.
 * Attention, configs might include runtime code which depended on environment values only.
 *
 * @see ConsoleConfig
 */
return [
    /*
     * This set of commands will be executed when command "configure" run. You can declare command
     * options, header and footer.
     */
    'configureSequence' => [
        'views:compile' => ['options' => []],
        /*{{sequence.configure}}*/
    ],
    /*
     * Set of commands executed inside "update" command. If you want to use any external migration
     * tool like https://phinx.org/ - you can add it's command right here and combine it with orm
     * models with passive schemas.
     */
    'updateSequence'    => [
        //'odm:schema' => ['options' => ['--sync' => true]],
        'orm:schema' => ['options' => ['--sync' => true]],
        /*{{sequence.update}}*/
    ]
];