---
date: 2021-01-08
title: Using JWT in Laravel
tags: [php, laravel, jwt]
image: './header.webp'
authors:
  - tianxiang-yang
---

Json web token [JWT](https://jwt.io/introduction/), it is a JSON-based open standard that is implemented to transfer statements between web application environment(RFC 7519).The token is designed to be compact and safe, JWT statements are generally used to pass authenticated user identity information between identity providers and service providers, In order to obtain resources from the resource server, you can also add some additional declaration information necessary for other business logic.The token can also be used directly for authentication or encrypted.

### Laravel-JWT Installation and basic configuration

- Install using composer

```
composer require tymon/jwt-auth 1.*@rc
```

- Publish configuration file

```
# This command will add a jwt.php configuration file under config
php artisan vendor:publish --provider="Tymon\JWTAuth\Providers\LaravelServiceProvider"
```

- Generate encryption key

```
# This command will generate an encryption key in the .env file, such as:JWT_SECRET=jwt
php artisan jwt:secret
```

- Update your model

If you use the default User table to generate tokens, you need to add a piece of code under the model

```
<?php

namespace App;

use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable implements JWTSubject
{
    use Notifiable;

    // Rest omitted for brevity

    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [];
    }
}

```

- Register two Facade

**config/app.php**

These two facades are not necessary, but using them will bring a little convenience to your code writing.

```
'aliases' => [
        ...
        // Add the following two lines
        'JWTAuth' => 'Tymon\JWTAuth\Facades\JWTAuth',
        'JWTFactory' => 'Tymon\JWTAuth\Facades\JWTFactory',
],
```

**If you don’t use these two Facades, you can use the helper function auth()**

auth() is an auxiliary function that returns a guard, which can be regarded as an Auth Facade for the time being.

```
// If you don’t use Facade, you can write like this
auth('api')->refresh();
// Use JWTAuth Facade
JWTAuth::parseToken()->refresh();
```

- Modify auth.php

**config/auth.php**

These two facades are not necessary, but using them will bring a little convenience to your code writing.

```
'guards' => [
    'web' => [
        'driver' => 'session',
        'provider' => 'users',
    ],

    'api' => [
        'driver' => 'jwt',        // change token to jwt
        'provider' => 'users',
    ],
],
```

- Register some routes

These two facades are not necessary, but using them will bring a little convenience to your code writing.

```
Route::group([

    'prefix' => 'auth'

], function ($router) {

    Route::post('login', 'AuthController@login');
    Route::post('logout', 'AuthController@logout');
    Route::post('refresh', 'AuthController@refresh');
    Route::post('me', 'AuthController@me');

});
```

- Create token controller

```
php artisan make:controller AuthController
```

**AuthController**

```
<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;

class AuthController extends Controller
{
    /**
     * Create a new AuthController instance.
     * Email and password are required (data source users table)
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login']]);
    }

    /**
     * Get a JWT via given credentials.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function login()
    {
        $credentials = request(['email', 'password']);

        if (! $token = auth('api')->attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        return $this->respondWithToken($token);
    }

    /**
     * Get the authenticated User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function me()
    {
        return response()->json(auth('api')->user());
    }

    /**
     * Log the user out (Invalidate the token).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout()
    {
        auth('api')->logout();

        return response()->json(['message' => 'Successfully logged out']);
    }

    /**
     * Refresh a token.
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh()
    {
        return $this->respondWithToken(auth('api')->refresh());
    }

    /**
     * Get the token array structure.
     *
     * @param  string $token
     *
     * @return \Illuminate\Http\JsonResponse
     */
    protected function respondWithToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth('api')->factory()->getTTL() * 60
        ]);
    }
}
```

_Article Photo by [Dillon Shook](https://unsplash.com/photos/0jKuUj3vUTg)_
