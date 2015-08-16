<?php
/**
 * Validation configuration includes:
 * - set of empty conditions, you must include at least one condition like that into field validation
 *   to ensure that field value will be set
 * - validation checker classes
 * - validation rule aliases for convenience
 */
use Spiral\Validation\Checkers;

return [
    'emptyConditions' => [
        "notEmpty",
        "required",
        "type::notEmpty",
        "required::with",
        "required::without",
        "required::withAll",
        "required::withoutAll",
        "file::exists",
        "file::uploaded",
        "image::exists",
        "image::uploaded"
    ],
    'checkers'        => [
        "type"     => Checkers\TypeChecker::class,
        "required" => Checkers\RequiredChecker::class,
        "number"   => Checkers\NumberChecker::class,
        "mixed"    => Checkers\MixedChecker::class,
        "address"  => Checkers\AddressChecker::class,
        "string"   => Checkers\StringChecker::class,
        "file"     => Checkers\FileChecker::class,
        "image"    => Checkers\ImageChecker::class
    ],
    'aliases'         => [
        "notEmpty"   => "type::notEmpty",
        "required"   => "type::notEmpty",
        "datetime"   => "type::datetime",
        "timezone"   => "type::timezone",
        "bool"       => "type::boolean",
        "boolean"    => "type::boolean",
        "cardNumber" => "mixed::cardNumber",
        "regexp"     => "string::regexp",
        "email"      => "address::email",
        "url"        => "address::url",
        "file"       => "file::exists",
        "uploaded"   => "file::uploaded",
        "filesize"   => "file::size",
        "image"      => "image::valid",
        "array"      => "is_array",
        "callable"   => "is_callable",
        "double"     => "is_double",
        "float"      => "is_float",
        "int"        => "is_int",
        "integer"    => "is_integer",
        "long"       => "is_long",
        "null"       => "is_null",
        "object"     => "is_object",
        "real"       => "is_real",
        "resource"   => "is_resource",
        "scalar"     => "is_scalar",
        "string"     => "is_string"
    ]
];