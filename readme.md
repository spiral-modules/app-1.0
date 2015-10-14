# Spiral 
[![Latest Stable Version](https://poser.pugx.org/spiral/application/v/stable)](https://packagist.org/packages/spiral/application) [![Total Downloads](https://poser.pugx.org/spiral/application/downloads)](https://packagist.org/packages/spiral/application) [![Latest Unstable Version](https://poser.pugx.org/spiral/application/v/unstable)](https://packagist.org/packages/spiral/application) [![License](https://poser.pugx.org/spiral/application/license)](https://packagist.org/packages/spiral/application)

[![Build Status](https://travis-ci.org/spiral/application.svg?branch=master)](https://travis-ci.org/spiral/application)

The Spiral framework provides a Rapid Application Development (RAD) platform to develop software applications using an HMVC architecture, using a simple but strong syntax similar to other popular frameworks.

Spiral will take care of database abstractions, ORM, MongoDB, working with Amazon or Rackspace, views and templates, etc. but it still compatime with any other library on a market. 

Spiral DI container will work behind the scene, in most of cases you don't even need to know about it!

```php
class HomeController extends Controller extends SingletonInterface
{
    //Now DI will automatically link this class as singleton and return 
    //same instance on every injection
    const SINGLETON = self::class;

    /**
     * Spiral can automatically deside what database/cache/storage
     * instance to provide for every action parameter.
     *
     * @param Database $database
     * @param Database $logDatabase
     * @return string
     */
    public function index(Database $database, Database $logDatabase)
    {
        $logDatabase->table('log')->insert(['message' => 'Yo!']);
    
        return $this->views->render('welcome', [
            'users' => $db->table('users')->select()->all()
        ]);
    }
}
```

PSR-7 integration and method injections:

```php
public function index(ResponseInterface $response)
{
    return $response->withHeader('Spiral', 'Value!');
}
```

JSON

```php
public function index(ServerRequestInterface $request)
{
    return [
        'status' => 200,
        'uri'    => (string)$request->getUri()
    ];
}
```

https://twitter.com/spiralphp

Use `./spiral` or `spiral` (Windows) to get list of console commands. Options `-v` and `-vv` used to get more details.

To create new spiral application execute: `composer create-project spiral/application directory`
> Your might need to update `spiral` permissions to use short cli enterpoint.
