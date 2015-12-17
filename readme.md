Spiral RAD PSR-7 HMVC Framework (beta)
=======================
[![Latest Stable Version](https://poser.pugx.org/spiral/application/v/stable)](https://packagist.org/packages/spiral/application) [![Total Downloads](https://poser.pugx.org/spiral/application/downloads)](https://packagist.org/packages/spiral/application) [![License](https://poser.pugx.org/spiral/application/license)](https://packagist.org/packages/spiral/application) [![Build Status](https://travis-ci.org/spiral/application.svg?branch=master)](https://travis-ci.org/spiral/application)

The Spiral framework provides a simple Rapid Application Development (RAD) platform to develop web 
applications using an HMVC architecture, PSR-7, simple syntax and powerful scaffolding mechanisms (temporary in transition).

Check bundle application: **https://github.com/spiral-php/application**

Guide: https://github.com/spiral/guide

Components: https://github.com/spiral/components

**Installation**: `composer create-project spiral/application {directory}`

Examples
========

```php
class HomeController extends Controller 
{
    /**
     * Spiral can automatically deside what database/cache/storage
     * instance to provide for every action parameter.
     *
     * @param Database $database
     * @param Database $logDatabase
     * @return string
     */
    public function indexAction(Database $database, Database $logDatabase)
    {
        $logDatabase->table('log')->insert(['message' => 'Yo!']);
    
        return $this->views->render('welcome', [
            'users' => $database->table('users')->select()->all()
        ]);
    }
}
```

PSR-7 integration and method injections:

```php
public function indexAction(ResponseInterface $response)
{
    return $response->withHeader('Spiral', 'Value!');
}
```

JSON responses

```php
public function indexAction(ServerRequestInterface $request)
{
    return [
        'status' => 200,
        'uri'    => (string)$request->getUri()
    ];
}
```

StorageManger to simplify process of working with remote storages:

```php
public function uploadAction(StorageBucket $uploads)
{
    $object = $bucket->put(
        'my-upload.file',
        $this->input->files->get('upload')
    );
    
    //...
    
    echo $object->replace('amazon')->getAddress();
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
        
        //Simple relation definition
        'author'   => [self::BELONGS_TO => Author::class],
        'comments' => [self::HAS_MANY => Comment::class]
    ];
}
```

```php
$posts = Post::find()
    ->with('comments') //Automatic joins
    ->with('author')->where('author.name', 'LIKE', $authorName) //Fluent
    ->load('comments.author') //Cascade eager-loading
    ->paginate(10) //Quick and easy pagination
    ->all();

foreach($posts as $post) {
    echo $post->author->getName();
}
```

Powerful and extendable HTML templater compatible with other engines like Blade or Twig (included as well):

```html
<spiral:grid source="<?= $uploads ?>" as="upload">
    <grid:cell title="ID:" value="<?= $upload->getId() ?>"/>
    <grid:cell title="Time Created:" value="<?= $upload->getTimeCreated() ?>"/>
    <grid:cell.bytes title="Filesize:" value="<?= $upload->getFilesize() ?>"/>

    <grid:cell>
        <a href="#">Download</a>
    </grid:cell>
</spiral:grid>

<spiral:cache lifetime="10">
    <?= mt_rand(0, 100) ?>
</spiral:cache>
```

Frontend toolkit with powerful **AJAX forms** and widgets:

```html
<spiral:form action="/upload">
    <form:input label="Select your file:" type="file" name="upload"/>
</spiral:form>
```

Also included
=============

Plug and Play extensions, IDE friendly, frontend toolkit, static analysis, cache and logic cache, 
meta programing ideas, cloud storages, scaffolding, auto-indexed translator, Interop Container,
Symfony Console integration, Zend Diactoros, Symfony Translation, Monolog, Symfony Events, Twig, 
debugging/profiling tools and much more!
