---
date: 2018-11-22
title: JWT auth in Go
tags: [software engineering, api, golang, jwt]
image: './header.webp'
authors:
  - tanveer-hassan
---

Authentication is the most fundamental building block of any application. Whenever we start building a new app, we consider how users authenticate in the very beginning. In the olden days, we used to implement session based authentication and transmitted the data using cookies. We had to store the session data somewhere. That used to make our apps stateful. This also came with a problem. We had to make database calls whenever we wanted to authenticate someone. This causes huge overhead and does not scale well. It can also create a bottleneck in our application.
Using JSON Web Tokens can mitigate this issue. We don’t have to store any session data in our database or anywhere because JWTs can carry information with them in JSON format. Although they can be encrypted, we will be focusing on signed tokens which carry the authenticated user’s information. As you will see later in this article, we don’t have to query the database for the requesting user’s information for making restricted api calls. Signed tokens cannot be tampered or else the signature will not match.

I highly recommend going through the following writing to learn more about the structure of JWTs:

[**JWT.IO - JSON Web Tokens Introduction**  
JSON Web Token (JWT) is a compact URL-safe means of representing claims to be transferred between two parties. Learn…](https://jwt.io/introduction/ "https://jwt.io/introduction/")[](https://jwt.io/introduction/)

> Go is an open source programming language that makes it easy to build simple, reliable, and efficient software. — [https://golang.org](https://golang.org)

If you are new to Go, check out the Golang official blog:

[**The Go Programming Language Blog**  
Today marks the ninth anniversary of the day we open-sourced our initial sketch of Go. On each anniversary we like to…](https://blog.golang.org "https://blog.golang.org")[](https://blog.golang.org)

#### What you will learn in this article

- Set up a basic Golang application using the Echo framework.
- Generate signed JWTs with expiration.
- Set claims in the JWTs to be able to identify the user.
- An overview of JWT structure and how to use them.
- Create new or use framework provided middlewares to validate tokens and restrict apis.

To get started, we need to create a new Go application:

_Make the path appropriate for your workspace._

mkdir -p go/src/github.com/war1oc/jwt-auth

I use [Dep](https://github.com/golang/dep) for dependency management.

```shellscript
dep init
```

I will be using the [Echo Framework](https://echo.labstack.com/). It’s a very minimalist framework which has the essentials baked in. Let’s create the main.go file by taking the code from the [Echo Guide](https://echo.labstack.com/guide). This will be our starting point.

_main.go:_

```go
package main

import (
    "net/http"
    "github.com/labstack/echo"
)

func main() {
    e := echo.New()
    e.GET("/", func(c echo.Context) error {
        return c.String(http.StatusOK, "Hello, World!")
    })
    e.Logger.Fatal(e.Start(":1323"))}
```

Run `dep ensure` to install the newly added dependency (“github.com/labstack/echo”).

If you run the application now, echo fires up a server and listens on the `:1323` port. A basic hello world application.

Let’s create the login handler:

_handler.go:_

```go
package main

import (
    "net/http"
    "time"

    "github.com/dgrijalva/jwt-go"
    "github.com/labstack/echo"
)

type handler struct{}

// Most of the code is taken from the echo guide
// [https://echo.labstack.com/cookbook/jwt](https://echo.labstack.com/cookbook/jwt)
func (h *handler) login(c echo.Context) error {
    username := c.FormValue("username")
    password := c.FormValue("password")

    // Check in your db if the user exists or not
    if username == "jon" && password == "password" {
        // Create token
        token := jwt.New(jwt.SigningMethodHS256)

        // Set claims
        // This is the information which frontend can use
        // The backend can also decode the token and get admin etc.
        claims := token.Claims.(jwt.MapClaims)
        claims["name"] = "Jon Doe"
        claims["admin"] = true
        claims["exp"] = time.Now().Add(time.Hour * 72).Unix()

        // Generate encoded token and send it as response.
        // The signing string should be secret (a generated UUID          works too)
        t, err := token.SignedString([]byte("secret"))
        if err != nil {
            return err
        }
        return c.JSON(http.StatusOK, map[string]string{
            "token": t,
        })
    }

    return echo.ErrUnauthorized
}
```

Since database connection and querying is not in the scope of this article, I checked the username and password this way.

This is a very minimal application describing the core of JWT in Go.

We need to add a route for login:

_main.go:_

```go
package main

import (
    "net/http"

    "github.com/labstack/echo"
)

func main() {
    e := echo.New()
    e.GET("/", func(c echo.Context) error {
        return c.String(http.StatusOK, "Hello, World!")
    })

    h := &handler{}
    e.POST("/login", h.login)

    e.Logger.Fatal(e.Start(":1323"))
}
```

Run the app `go run *.go`

```shellscript
curl -X POST localhost:1323/login -d "username=jon&password=password"

{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6dHJ1ZSwiZXhwIjoxNTQyNjkwMjQ3LCJuYW1lIjoiSm9uIERvZSJ9.OqsaJ76nYhiaiVPcAr13\_vMPyTfRcv6eKFm06O3n8fE"}
```

You should get the token in the response when you hit the api with the correct username and password.

Incorrect username and password will throw an unauthorised error.

```shellscript
curl -X POST localhost:1323/login -d "username=jon&password=nope"

{"message":"Unauthorized"}
```

Since the token is being generated using _exp_ (expiration), it will be unique everytime.

Let’s inspect how our token looks when decoded, head over to [jwt.io](https://jwt.io) and paste the token:

_Header:_

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

_Payload:_

```json
{
  "admin": true,
  "exp": 1542690247,
  "name": "Jon Doe"
}
```

Both front and backend can use the payload to identify the user.

Now we can restrict apis and require users to be logged in. This can be accomplished by middlewares. We can also restrict by claims such as if a user is an admin or not.

Take a look at echo’s JWT middleware:

[**JWT Middleware - Echo - High performance, minimalist Go web framework**  
JWT middleware for Echo - Echo is a high performance, extensible, minimalist web framework for Go (Golang).](https://echo.labstack.com/middleware/jwt "https://echo.labstack.com/middleware/jwt")[](https://echo.labstack.com/middleware/jwt)

We create a middleware of our own which is basically just the echo jwt middleware, but we can now use it with our handlers.

_middleware.go:_

```go
package main

import (
    "github.com/labstack/echo/middleware"
)

var IsLoggedIn = middleware.JWTWithConfig(middleware.JWTConfig{
    SigningKey: []byte("secret"),
})
```

The signing key has to match the signing key used when issuing the token. It’s better to keep it in a configuration file or environment variable.

Let’s create a restricted api:

In _main.go:_

```go
e.GET("/private", h.private, isLoggedIn)
```

In _handler.go:_

```go
// Most of the code is taken from the echo guide
// [https://echo.labstack.com/cookbook/jwt](https://echo.labstack.com/cookbook/jwt)
func (h \*handler) private(c echo.Context) error {
    user := c.Get("user").(\*jwt.Token)
    claims := user.Claims.(jwt.MapClaims)
    name := claims["name"].(string)
    return c.String(http.StatusOK, "Welcome "+name+"!")
}
```

Run the app `go run *.go`

If we now hit the private api without any token we get an error:

```shellscript
curl localhost:1323/private

{"message":"missing or malformed jwt"}
```

With token:

```shellscript
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6dHJ1ZSwiZXhwIjoxNTQyNjkwMjQ3LCJuYW1lIjoiSm9uIERvZSJ9.OqsaJ76nYhiaiVPcAr13\_vMPyTfRcv6eKFm06O3n8fE" localhost:1323/private

Welcome Jon Doe!
```

And there you have it! Authentication with JWT. As you may have already noticed, we did not make a database call but got the user’s name from the token itself. This has tremendous performance advantages over making db query for every api call the client makes. We can extract necessary information such as user ID and role from the token to decide whether we want to allow the user access to the api or not.

Now that we have a basic jwt auth system running, let’s go a step further and create a middleware for admin (isAdmin).

_middleware.go:_

```go
func isAdmin(next echo.HandlerFunc) echo.HandlerFunc {
    return func(c echo.Context) error {
        user := c.Get("user").(*jwt.Token)
        claims := user.Claims.(jwt.MapClaims)
        isAdmin := claims["admin"].(bool)

        if isAdmin == false {
            return echo.ErrUnauthorized
        }

        return next(c)
    }
}
```

_main.go:_

```go
e.GET("/admin", h.private, isLoggedIn, isAdmin)
```

Middlewares are also like handler functions, and you can add as many as you want. In this case, the _isLoggedIn_ middleware sets the user to the context and thus we can use it in our _isAdmin_ middleware which only checks whether the user is an admin or not.

Change the claim admin to false in the login handler:

```go
claims["admin"] = false
```

Log in again and using the new token try hitting the /admin api:

```shellscript
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6ZmFsc2UsImV4cCI6MTU0MjgwMjIwMywibmFtZSI6IkpvbiBEb2UifQ.kuypz\_fyVlnvMOweU6izkjuKTKOjPlJTYV-q3iT3pHg" localhost:1323/admin

{"message":"Unauthorized"}
```

However, the private api still works fine:

```go
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6ZmFsc2UsImV4cCI6MTU0MjgwMjIwMywibmFtZSI6IkpvbiBEb2UifQ.kuypz\_fyVlnvMOweU6izkjuKTKOjPlJTYV-q3iT3pHg" localhost:1323/private

Welcome Jon Doe!
```

Changing the claim to insert admin as true, you will be able to access the /admin api:

```go
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6dHJ1ZSwiZXhwIjoxNTQyODAyMzk5LCJuYW1lIjoiSm9uIERvZSJ9.K-uDZN\_XX0J9PaUJXeRGjHmtfDwLr9StGZG1FOIa5Hc" localhost:1323/admin

Welcome Jon Doe!
```

You can create middlewares which satisfy your business use cases and give access to users accordingly.

#### Where to go from here

This was a very primitive implementation of JWT in Go. In a production environment you will definitely have to be more thoughtful.

Check out the full source code here:

[**war1oc/jwt-auth**  
A tutorial for implementing JWT authentication in Golang - war1oc/jwt-auth](https://github.com/war1oc/jwt-auth "https://github.com/war1oc/jwt-auth")[](https://github.com/war1oc/jwt-auth)

There are a lot more to learn on this topic. I will list down a few for giving you guys a head start in your search:

- Refresh tokens (access tokens should be short lived and refresh tokens long lived; refresh tokens are used to issue new access tokens for valid users)
- How to have a global logout/panic button (logs out all users) in case of an emergency or breach
- Using JWTs in microservices
- Using App keys for microservices to talk to each other

These are just a few things you might want to check out to build a more robust and secure application. While wading through these dark waters you may find a lot more clues what to study next. Good luck!

_Article Photo by [Markus Spiske](https://unsplash.com/photos/SSAbwzqz2Kc)_
