<?php
/**
 * Model inspections configuration. Attention, configs might include runtime code which depended on
 * environment values only.
 *
 * @see InspectionsConfig
 */
return [
    /*
     * Following keywords will raise warning in model inspections if fields wasn't included into
     * hidden list.
     */
    'blacklist' => ['password', 'hidden', 'private', 'protected', 'email', 'card', 'internal']
];