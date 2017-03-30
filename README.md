Spiral, PSR7/PHP7 Framework
=======================
[![Latest Stable Version](https://poser.pugx.org/spiral/application/v/stable)](https://packagist.org/packages/spiral/application) [![Total Downloads](https://poser.pugx.org/spiral/application/downloads)](https://packagist.org/packages/spiral/application) [![License](https://poser.pugx.org/spiral/application/license)](https://packagist.org/packages/spiral/application) [![Build Status](https://travis-ci.org/spiral/application.svg?branch=master)](https://travis-ci.org/spiral/application)

<img src="https://raw.githubusercontent.com/spiral/guide/master/resources/logo.png" height="170px" alt="Spiral Framework" align="left"/>

The Spiral framework provides open and modular Rapid Application Development (RAD) platform to create applications using DDD architecture, database tools, code re-usability, extremely friendly [IoC](https://github.com/container-interop/container-interop), PSR-7, simple syntax and customizable scaffolding mechanisms. 

[**Spiral Framework**](https://github.com/spiral/spiral) | [*Modules and Packages*](https://github.com/spiral-modules) | [Guide](https://github.com/spiral/guide) | [**Installation Notes**](https://github.com/spiral/guide/blob/master/installation.md) | [Forum](https://groups.google.com/forum/#!forum/spiral-framework)
<br/><br/><br/>

Server Requiments
--------
Make sure that your server is configured with following PHP version and extensions:
* PHP 7.0+
* node.js 6.9+ 
* OpenSSL Extension
* MbString Extension
* Tokenizer Extension
* PDO Extension with desired database drivers

Installation
--------

```
composer install
npm install
```

Note: npm needs public key configured for fetching from repositories.
To specify manually, run it like so: `ssh-agent bash -c 'ssh-add path/to/key; npm install'`

```
composer create-project spiral/application
```

Once application installed you can ensure that it was configured properly by executing:
```
./spiral configure && phpunit
```

Available Components:
--------
- [ODM](https://github.com/spiral/odm) - MongoDB strict schema ODM
- [Storage](https://github.com/spiral/storage) - File storage abstraction layer

Available Modules:
--------
- [Auth](https://github.com/spiral-modules/auth) - Token based user authentication
- [Profiler Panel](https://github.com/spiral-modules/profiler) - Profiler panel/middleware for Spiral Applications (pre-installed)
- [IDE Helper](https://github.com/spiral-modules/ide-helper) - IDE autocomplete generator: ORM, ODM, RequestFilters, Container  (pre-installed)
- [Hybrid DB](https://github.com/spiral-modules/hybrid-db) - ORM-to-ODM relation bridge with transactions support
- [Scaffolder](https://github.com/spiral-modules/scaffolder) - Help commands for scaffolding parts of your application
- [Toolkit](https://github.com/spiral-modules/toolkit) - View widgets (pre-installed)
- [Vault](https://github.com/spiral-modules/vault) - HMVC Core with RBAC and visual layout

Frontend Modules:
--------

- [SF](https://github.com/sfjs/sf.js) - Base SpiralScout FrontEnd Framework
- [sf-module-cropper](https://github.com/sfjs/sf-module-cropper) - SF module for uploading pictures with cropping them

- [redaxtor](https://github.com/redaxtor/redaxtor-spiral-bridge) - Spiral-specific bundle of Redaxtor - overlay inline content editor for websites


Building Frontend:
--------

By default front-end is built into a minified production ready bundles:

To build front end execute `npm install` if that is first installation. Build will happen automatically.

To update npm dependencies or code run `npm update` and `npm run build`. This will update bundles code.


Developing With Frontend:
--------

During development building production every change code is slow. Unfortunately HMR has no good support for PHP yet (without a need to run many servers)
 
However watcher is possible

Run `npm run build:dev` and then run `npm run watch` - that will produce a "development" package with non-minified code and inline sourcemaps. `watch` will watch for changes in files and rebuild bundles immediately. 

If you also want page to be reloaded automatically, prepend `<script src="http://localhost:35729/livereload.js"></script>` to page scripts




Configuring Linters:
--------

By default