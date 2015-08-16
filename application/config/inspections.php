<?php
/**
 * Model (ORM and ODM, or any other DataEntity child) inspector configuration.
 * - list of field names to be counted as blacklisted
 */
return [
    'blacklist' => [
        'password',
        'hidden',
        'private',
        'protected',
        'email',
        'card',
        'internal'
    ]
];