# Spiral 
[![Latest Stable Version](https://poser.pugx.org/spiral/application/v/stable)](https://packagist.org/packages/spiral/application) [![Total Downloads](https://poser.pugx.org/spiral/application/downloads)](https://packagist.org/packages/spiral/application) [![Latest Unstable Version](https://poser.pugx.org/spiral/application/v/unstable)](https://packagist.org/packages/spiral/application) [![License](https://poser.pugx.org/spiral/application/license)](https://packagist.org/packages/spiral/application)

[![Build Status](https://travis-ci.org/spiral/application.svg?branch=master)](https://travis-ci.org/spiral/application)

The Spiral framework provides a Rapid Application Development (RAD) platform to develop software applications using an HMVC architecture, simple modern syntax and `HippocampusInterface`.

Spiral will take care of database abstractions, ORM, MongoDB, working with Amazon or Rackspace, Views and Templates, etc.
It will help you to mount external libraries by providing simple API or design your application using **Services** and **DataEntities**.

Spiral DI container will work behind the scene, in most of cases you don't even need to know about it!

```php
class HomeController extends Controller extends SingletonInterface
{
    //Now DI will automatically link this class as singleton and return 
    //same instance on every injection - "I want to be a Singleton" constant.
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

JSON responses

```php
public function index(ServerRequestInterface $request)
{
    return [
        'status' => 200,
        'uri'    => (string)$request->getUri()
    ];
}
```

Simple but powerful ORM with automatic scaffolding for MySQL, PostgresSQL, SQLite, SQLServer

```php
class Post extends Record 
{
    use TimestampsTrait;

    protected $schema = [
        'id'     => 'bigPrimary',
        'title'  => 'string(64)',
        'status' => 'enum(published,draft)',
        'body'   => 'text',
        
        'author'   => [self::BELONGS_TO => Author::class],
        'comments' => [self::HAS_MANY => Comment::class]
    ];
}
```

```php
$posts = Post::find()
    ->with('comments') //Automatic joins
    ->with('author')->where('author.name', 'LIKE', $authorName)
    ->load('comments.author') //Cascade eager-loading
    ->all();

foreach($posts as $post)
{
    echo $post->author->getName();
}
```

https://twitter.com/spiralphp

Use `./spiral` or `spiral` (Windows) to get list of console commands. Options `-v` and `-vv` used to get more details.

To create new spiral application execute: `composer create-project spiral/application directory`
> Your might need to update `spiral` permissions to use short cli enterpoint.
