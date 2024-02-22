---
date: 2020-07-24
title: Using MockWebServer On Android
tags: [android, unit-test, mockwebserver]
image: './header.webp'
authors:
  - tiago-araujo
categories:
  - android
---

At some point in your code development you'll want to test how the interaction with your app and the API server is being handled, but testing with a real connection with a server is expensive and unstable.
Unit tests should be real quick and assert if your code is working as it should. When you introduce a real connection, many problems can show up: long delay on the response, offline server, API changes that were not supposed to be there. All these can raise problems in your tests that are not on your end. The code you wrote can't grant that the server will be online, so it's not something you should be testing in your code.

So, how to solve this? The answer is simple: simulate a real server connection with the expected responses, for which you know how your code should behave and what's the expected result. For this, I'm going to show a very simple usage of `MockWebServer` that can give you an idea of how to use it in your own tests.

## Setting up the dependencies

In this demo I'm going to use the following dependencies:

**MockWebServer:** The very reason of this article. It'll be used to simulate a real server api with the responses we set.
**Retrofit:** A very known library that will be used for making the requests with the fake server.
**Moshi:** Deserialization library to transform the JSON responses in objects.

These are the dependencies needed to be added in the code:

```groovy
testImplementation 'com.squareup.okhttp3:mockwebserver:4.6.0'
implementation 'com.squareup.retrofit2:converter-moshi:2.8.1'
implementation 'com.squareup.retrofit2:retrofit:2.8.1'
implementation 'com.squareup.moshi:moshi-kotlin:1.9.3'
```

## Some help

For this demo I've created a [Helper](https://github.com/Tgo1014/MockWebServerSample/blob/master/app/src/test/java/tgo1014/mockwebserver/Helper.kt) class that will make some things easier for us. I won't talk about details of what it does but if you're curious you can check the comments in the [sample repository](https://github.com/Tgo1014/MockWebServerSample).

## Preparing the tests

The first thing we need is getting some instance of the `MockWebServer` and starting it before and shutting it down after the tests, we can do it like this:

```kotlin
class MockWebServerExampleTest {
    private val mockWebServer = MockWebServer()
    @Before
    fun setup() {
        mockWebServer.start(8080)
    }
    @After
    fun shutdown() {
        mockWebServer.shutdown()
    }
}
```

Simple, right?

We also need an instance of the API, you can get it on this demo like this:

```kotlin
private val api: Api by lazy { generateRetrofit(mockWebServer).create(Api::class.java) }
```

This uses a method of the [Helper](https://github.com/Tgo1014/MockWebServerSample/blob/master/app/src/test/java/tgo1014/mockwebserver/Helper.kt) class I've added in the project, so make sure to check it out to fully understand what's happening but basically we are just creating a instance of Retrofit using our fake server and getting an instance of the Api class where we have the endpoints.

## Setting up the responses

After we have the `MockWebServer` instance we now need to add a file with the `JSON` response we want the fake server to return. For this you need to add the following command in your `build.gradle`:

```groovy
android {
	...
	sourceSets {
		test {
			resources.srcDirs += ['src/test/resources']
		}
	}
	...
}
```

This will make sure that we can find our response file when running the tests.

And now we can add the actual response we want in the assets folder. I've used the [posts](https://jsonplaceholder.typicode.com/posts) placeholder from the [JSONPlaceholder](https://jsonplaceholder.typicode.com/) website.

So it will look like this:

```json
[
	{
		"userId": 1,
		"id": 1,
		"title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
		"body": "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto"
	 },
	{
		"userId": 1,
	    "id": 2,
	    "title": "qui est esse",
		"body": "est rerum tempore vitae\nsequi sint nihil reprehenderit dolor beatae ea dolores neque\nfugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis\nqui aperiam non debitis possimus qui neque nisi nulla"
	},
    ...
]
```

Add it to the `src/test/resources` folder (create the folder if you don't have it).
You can see the final content of the file [here](https://github.com/Tgo1014/MockWebServerSample/blob/master/app/src/test/java/tgo1014/mockwebserver/response.json).

## Testing

After setting everything up, we can actually start to write our tests. In this first example we will make sure we have a success response and that after running the test the response file was actually parsed and the list of posts are not empty.

For setting the fake response, we use the following method:

```kotlin
mockWebServer.setResponse("response.json")
```

### Success

Noticed that `response.json` is the file we added to the assets folder which contains the response we expect from the server API.

The full test looks like this:

```kotlin
@Test
fun `Get Post List Should Not Be Empty`() {
	// Given A Post List Request
    val interactor = GetPostsInteractor(api)
    // When Executing The Request
	mockWebServer.setResponse("response.json")
    val postList = interactor.execute()
    // Then Posts Should Not Be Empty
	assert(postList.isNotEmpty())
}
```

### Error

In the perfect world we always would have a success response from the API, but on a real production environment many things can go wrong: no internet connection, long latencies on response, wrong response from the backend.

Having all this in mind, we need to verify if, when something wrong goes with the API, the code can handle the situation the way we expect.

For this we are going to run basically the same test, but this time returning an error response from the `MockWebServer`. We can use the following method:

```kotlin
mockWebServer.setResponse("response.json", responseCode = 404)
```

We set the response code as `404`, so the request won't be successful.

The final test look like this:

```kotlin
@Test
fun `Get Post List Should Throw Error`() {
	// Given A Post List Request
    val interactor = GetPostsInteractor(api)
    // When Executing The Request
    mockWebServer.setResponse("response.json", 404)
	try {
        val postList = interactor.execute()
        assert(false)
    } catch (e: Exception) {
        // Then An Error Should Be Thrown
	    assert(true)
    }
}
```

Notice that this time we only `asset(true)` on the `catch` as we are expending our code to raise an error when it's not a success response. If it runs even with the server returning `404` then something is wrong and we set `assert(false)` so the test fails.

## Conclusion

This is just a simple and quick example of how you can use fake servers to test your code implementation. The `MockWebServer` is way more powerful than what I've shown here, so make sure to take a look in the [GitHub repo](https://github.com/square/okhttp/tree/master/mockwebserver) for a more detailed use of all its features.

You can also take a look in the [sample repo](https://github.com/Tgo1014/MockWebServerSample) where you can understand a bit better how everything works together.

Article photo by [Taylor Vick](https://unsplash.com/@tvick) on [Unsplash](https://unsplash.com/)
