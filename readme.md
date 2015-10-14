# Spiral 
[![Latest Stable Version](https://poser.pugx.org/spiral/application/v/stable)](https://packagist.org/packages/spiral/application) [![Total Downloads](https://poser.pugx.org/spiral/application/downloads)](https://packagist.org/packages/spiral/application) [![Latest Unstable Version](https://poser.pugx.org/spiral/application/v/unstable)](https://packagist.org/packages/spiral/application) [![License](https://poser.pugx.org/spiral/application/license)](https://packagist.org/packages/spiral/application)
[![Build Status](https://travis-ci.org/spiral/application.svg?branch=master)](https://travis-ci.org/spiral/application)

The Spiral framework provides a Rapid Application Development (RAD) platform to develop software applications using an HMVC architecture, using a simple but strong syntax similar to other popular frameworks. Framework will take care of database abstractions, ORM, MongoDB, working with Amazon or Rackspace, views and templates, etc. It's container does not require any configuring so you can start creating immediately!

```php
class HomeController extends Controller
{
    public function index(Database $db)
    {
        return $this->views->render('welcome', [
            'users' => $db->table('users')->select()->all()
        ]);
    }
}
```

https://twitter.com/spiralphp

Use `./spiral` or `spiral` (Windows) to get list of console commands. Options `-v` and `-vv` used to get more details.

To create new spiral application execute: `composer create-project spiral/application directory`
> Your might need to update `spiral` permissions to use short cli enterpoint.
