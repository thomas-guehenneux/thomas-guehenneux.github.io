---
date: 2022-07-13
title: Navigation parameters, and dynamic startDestination with Jetpack Compose
tags: [android, compose, kotlin, navigation]
image: './header.webp'
authors:
  - lindsay-diarmaid
categories:
  - android
---

Our team was recently given the opportunity to work with Jetpack Compose on a brand new project in collaboration with a client who required two separate Android applications. It was successfully released and the client was very satisfied with the end product.
I am making this blog post to share some of the learnings gained along the way, specifically involving dealing with parameters in Jetpack Compose Navigation, which was quite tricky at first.

As of writing, the latest Jetpack Compose Navigation version is **[2.5.0](https://mvnrepository.com/artifact/androidx.navigation/navigation-compose/2.5.0 "2.5.0")**, which is what we used.

All code has been stripped of any custom business logic, down to the bare minimum, and only used for educational purposes.

# Our App's Design

## Logic Flow

On the Login Screen, after successful login, the database is checked for the presence of a flag indicating whether it is the user's first login or not. In the case of first login, the user is sent to the "Change Password Screen" to change their password. Otherwise, they are sent to the "Home Screen".

![Login Flow Design](/assets/img/articles/2022-07-13-Navigation-parameters-with-Jetpack-Compose/project_login_flow.png "Login Flow Design")

The Change Password screen can however also be accessed from the Home Screen at any time.

![Home Screen to Change Password](/assets/img/articles/2022-07-13-Navigation-parameters-with-Jetpack-Compose/change_password_home.png "Home Screen to Change Password")

In the Change Password screen, if `firstLogin` is **false**, then the user is asked to first enter their current password. If **true**, they are not required to enter their current password.

## Main Challenge : Dynamic `startDestination`

Google defines the `startDestination` as :

> the first screen the user sees when they launch your app from the launcher. This destination is also the last screen the user sees when they return to the launcher after pressing the Back button.

And furthermore, they specify that : 

> Every app you build has a [fixed start destination](https://developer.android.com/guide/navigation/navigation-principles#fixed_start_destination).

However, the design of our app specifies that :

>If the user presses the Android Back button on the Change Password Screen.
> - If firstLogin == true, exit app.
> - If firstLogin == false, go back as normal (to the Home Screen). 
 
And thus we must find a way to change the `startDestination`.

# Navigation in Jetpack Compose

## Basic Project Layout

The basic structure of our Jetpack Compose project (without parameters) might thus look something like this : 

```kotlin
@Composable
fun MainScreen(
    mainViewModel: MainViewModel = viewModel()
) {
    val navController = rememberNavController()

    Scaffold {
        val startDestination = mainViewModel.startDestination.collectAsState().value

        NavHost(
            navController = navController,
            startDestination = startDestination
        ) {
            composable(AppRoute.LOGIN.route) {
                LoginScreen(
                    navController = navController
                )
            }
            composable(AppRoute.HOME.route) {
                HomeScreen(
                    navController = navController
                )
            }
            composable(AppRoute.CHANGE_PASSWORD.route) {
                ChangePasswordScreen(
                    navController = navController
                )
            }
        }
    }
}

@Composable
fun LoginScreen(navController: NavController) { ... }

@Composable
fun HomeScreen(navController: NavController) { ... }

@Composable
fun ChangePasswordScreen(navController: NavController) { ... }

```

In this context, the `MainViewModel` is as follows : 

```kotlin
class MainViewModel(application: Application) : AndroidViewModel(application) {
    private val _startDestination = MutableStateFlow(AppRoute.LOGIN.route)
    val startDestination: StateFlow<String> get() = _startDestination

    private fun updateStartDestination(value: String) {
        _startDestination.value = value
    }
}
```

And the `AppRoute` enum is defined as follows : 

```kotlin
enum class AppRoute(
    val route: String
) {
    LOGIN("login"),
    HOME("home"),
    CHANGE_PASSWORD("change_password")
}
```

In this setup, the default `startDestination` is set to `AppRoute.LOGIN.route`, so the App will boot up and show the Login Screen.

## Adding Parameters

In case we wish to add multiple parameters in future, it is a good idea to store all parameters in a data class. Data classes can then be conveniently very easily converted/parsed to/from JSON using the [GSON library](https://github.com/google/gson).

```kotlin
data class ChangePasswordScreenArguments(
    val isFirstLogin: Boolean
)
```

Convenience JSON/String extension file to abstract the JSON serialisation/deserialisation : 

```kotlin
object ExtensionJSON {
    fun ChangePasswordScreenArguments.toJson(): String =
        URLEncoder.encode(Gson().toJson(this), StandardCharsets.UTF_8.toString())

    fun String.toChangePasswordScreenArguments(): ChangePasswordScreenArguments =
        Gson().fromJson(this, ChangePasswordScreenArguments::class.java)
}
```

A parameter must be now added to the Change Password Screen NavHost composable definition to represent first login: 

```kotlin
NavHost(/**/) {
	/**/
	composable("${AppRoute.CHANGE_PASSWORD.route}/{${AppRouteParameter.CHANGE_PASSWORD_SCREEN_ARGS.value}}") { backStackEntry ->
        val changePasswordScreenJson =
                        backStackEntry.arguments?.get(AppRouteParameter.CHANGE_PASSWORD_SCREEN_ARGS.value) as String
        ChangePasswordScreen(
            navController = navController,
            arguments = changePasswordScreenJson.toChangePasswordScreenArguments()
        )
    }			
}

@Composable
fun ChangePasswordScreen(navController: NavController, arguments: ChangePasswordScreenArguments) { /**/ }
```

With the addition of this parameter, we can then implement the business logic in the `ChangePasswordScreen` which depends on this parameter. However, we have still not resolved the matter of dynamic `startDestination`.

## startDestination which has parameters

### First attempt : Crash

In the `MainViewModel`, we will add code to the `init` block which retrieves the value of `firstLogin` for the current logged in user, after the app has booted, and update the startDestination accordingly.

```kotlin
class MainViewModel(application: Application) : AndroidViewModel(application) {
    // Repo for Firestore collection containing user data. Contents not pertinent to this blog.
    private val userRepository: UserRepository =
        getApplication<App>().userRepository

    init {
        viewModelScope.launch {
            if (userRepository.isFirstLogin()) {
                updateStartDestination(
                    "${AppRoute.CHANGE_PASSWORD.route}/{${AppRouteParameter.CHANGE_PASSWORD_SCREEN_ARGS.value}}"
                )
            } else {
                updateStartDestination(AppRoute.HOME.route)
            }
        }
    }
}
```

Now, when `firstLogin` is set to `false`, the app successfully navigates to the Home Screen.
However, when `firstLogin` is set to `true`, the app crashes with the following exception : 

```
java.lang.IllegalArgumentException: navigation destination change_password/{isFirstLogin:true} is not a direct child of this NavGraph

```

After some investigation, it seems that Jetpack Compose Navigation requires the composable's definition in the Navhost to match with the `startDestination`, which makes things complicated when the route contains arguments.

### Second attempt : Success

The solution? You need to specify a `defaultValue` for the arguments to be used as a startDestination, as well as their `type`. In our case, our arguments are JSON, which is String.

```kotlin
composable(
    route = "${AppRoute.CHANGE_PASSWORD.route}/{${AppRouteParameter.CHANGE_PASSWORD_SCREEN_ARGS.value }}",
    arguments = listOf(navArgument(AppRouteParameter.CHANGE_PASSWORD_SCREEN_ARGS.value ) {
        //The required changes are the following 2 lines
        type = NavType.StringType; defaultValue = ChangePasswordScreenArguments(
            isFirstLogin = true
        ).toJson()
})
) {
    backStackEntry ->
    val changePasswordScreenJson =
        backStackEntry.arguments?.get(AppRouteParameter.CHANGE_PASSWORD_SCREEN_ARGS.value) as String
    ChangePasswordScreen(
        navController = navController,
        arguments = changePasswordScreenJson.toChangePasswordScreenArguments()
    )
}
```

# Credits

_Article Photo by [Leue, Holger](https://www.lookphotos.com/en-us/search?photographer=f5520)_

_Jetpack Compose logo [Google Developers](https://developers-jp.googleblog.com/2019/06/whats-new-with-android-jetpack.html)_

_Sextant Image [Freepik](https://www.freepik.com/free-photos-vectors/sextant)_
