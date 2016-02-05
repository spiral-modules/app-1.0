Spiral, modular RAD Framework (beta)
=======================
[![Latest Stable Version](https://poser.pugx.org/spiral/application/v/stable)](https://packagist.org/packages/spiral/application) [![Total Downloads](https://poser.pugx.org/spiral/application/downloads)](https://packagist.org/packages/spiral/application) [![License](https://poser.pugx.org/spiral/application/license)](https://packagist.org/packages/spiral/application) [![Build Status](https://travis-ci.org/spiral/application.svg?branch=master)](https://travis-ci.org/spiral/application) [![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/spiral/hotline)

<img src="https://raw.githubusercontent.com/spiral/guide/master/resources/logo.png" height="200px" alt="Spiral Framework" align="left"/>

The Spiral framework provides a modular Rapid Application Development (RAD) platform to develop web applications using an HMVC architecture, separation of database and service layers, code re-usability, modern practices, PSR-7, simple syntax and customizable scaffolding mechanisms.

[**Spiral Framework**](https://github.com/spiral/spiral) | [Guide](https://github.com/spiral/guide) | [**Forum**](https://groups.google.com/forum/#!forum/spiral-framework) | [Components](https://github.com/spiral/components) | [**Installation Notes**](https://github.com/spiral/guide/blob/master/installation.md)

<br/><br/>

Installation
============
Execute `./spiral up` and `./spiral seed` after installation to create and populate database.

You can play with sample entities using url "/sample", to get view or current request scope open "/home/scope".

Modules
=======
[Scaffolder](https://github.com/spiral-modules/scaffolder) - provides set of console commands and extendable class declarations for application scaffolding.

[Security Layer](https://github.com/spiral-modules/security) - flat RBAC security layer with Role-Permission-Rule association mechanism. 

[Vault](https://github.com/spiral-modules/vault) - friendly and extendable administration panel based on Materialize CSS and Security component.

[Auth](https://github.com/spiral-modules/auth) - authentication layer with multiple token operators and firewall middlewares.
