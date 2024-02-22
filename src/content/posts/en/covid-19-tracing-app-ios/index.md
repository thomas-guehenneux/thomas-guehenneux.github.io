---
date: 2020-04-03
title: Building a COVID-19 Tracing app in a week
tags: [development, covid19, engineering, swift, kotlin, tracing, proximity]
image: './header.webp'
authors:
  - nicolai-harbo
  - chris-combs
  - deniz-tuncer
categories:
  - ios
  - android
---

We wanted to create a prototype app to help people to find out if they contacted anybody infected by the COVID-19 disease. It will use wireless technologies searching near by and notify users.
In this post we're going to talk about the thoughts behind this app, why we made it native and why we think our expertise is helpful in a situation like we find ourselves in right now.
Also we're going to talk about how the app is built, what different things we had in mind, and what challenges we faced during the implementation of the prototype.

## How does proximity tracing work?

The concept is simple: We want to be able to see who a user has recently come in contact with. We can accomplish this by using bluetooth built into our phones. Bluetooth lets us send short range broadcast signals that other phones can see. When your phone detects a broadcast from another phone, we can simply make a note of the other phone's unique identifier and a timestamp of when the interaction occurred. Collecting this data creates a network, which can be used to trace interactions that people have had. During a global pandemic like COVID-19, this concept is very helpful in locating potential sources of the virus and can assist in limiting further spread.

## What about privacy?

An important part of building an application like this is prioritizing a user's privacy. We don't want to track a person's movement and location, nor do we want users to be able to see where other users have been and who they have contacted. It is necessary that the data being recorded is anonymous, and that no location, medical, or personal information is required. If a user chooses to mark themselves as infected, the network will know that an identifier is infected, not a person.

## What are the different options when working with proximity?

Proximity tracing is not a new concept, and as a result there are several options when looking into implementing a solution that needs it.

The most straightforward approach is to implement the logic yourself. Using the native bluetooth frameworks, all of the features are written from scratch. This work needs to be done for each platform and aligned to keep feature parity, and requires a large investment up front to build, and more work to maintain.

Peripherals are also an option- using technology that is already built for proximity sensing, e.g. iBeacons. The problem is that for the most part, peripherals and the protocols they use are built to only work with one platform. iBeacons can't work with Android, for example.

There are also several services that provide much of the solution for you.

[p2pkit](http://p2pkit.io/) is a multiplatform solution that provides an SDK that handles all of the implementation details for you. The application just needs to listen for broadcasts from other devices, and p2pkit reports the device ID when in range. An API call is made to verify the app with the account it is tied to (for billing reasons) but no other network requests are made. The SDK is old and could use an update, but the solution itself works well for its purpose.

Another platform solution is [NewAer](https://newaer.com/). This platform provides a vast amount of bluetooth related services, including proximity tracing. There are native SDKs for iOS and Android, although they are quite old. Pricing is set based on requests to the NewAer API.

We chose p2pkit in our implementation. Speed in setting up our product is critical, and we did not have the capacity to create a solution from scratch. The implementation is simple and we were up and running in less than half a day on both platforms. NewAer's feature set is overkill for our needs, and the old SDK code is a concern, as well as the need for network requests to their API. We may choose to write our own solution in the future, as the p2pkit SDKs are also old and created some less-than-ideal implementation details in our mobile apps.

## Why native is the right approach

When building an app that relies on device hardware, native iOS and Android is the obvious choice. Cross platform technologies rely on wrapping hardware libraries, which create extra complexity and more places for things to go wrong. It also means if you want to use an external service, you will need to write and maintain a wrapper around their platform SDKs. The advantage of cross platform technologies is code reuse between platforms, and when working with device specific features, most of that advantage is lost. So there is little benefit to gain, and many chances for problems to arise, when using a non-native cross platform framework.

## Challenges and discoveries we encountered implementing the prototype

As mentioned above, we chose to go with p2pkit for the prototype. So we started out setting up a base project, and added the framework.

### Bridging-Header

Adding this framework can be done both with CocoaPods and manually. First we added the framework with CocoaPods, but that didn't seem to work - the static classes contained in the framework weren't accessible.
Then we implemented the framework manually, including all the additional dependencies mentioned in the documentation, and then saw that a `Bridging-Header` was needed. So, using CocoaPods is easier afterall, so we decided to remove the manually added frameworks again, and add p2pkit with CocoaPods, and now include the bridging-header as well. This made the classes accessible, and we were ready to continue.
In case anyone is in doubt, a `Bridging-Header` is a bridge between Objective-C code and Swift. So if a framework is written in Objective-C and is being used in a Swift project, the bridging-header is nessesary for the framework to be recognized.

### Background work

After getting the framework up and running, we needed to find out how to still discover new devices, while being in the background, and even when the app has been force quit.
Luckily p2pkit supports the CoreBluetooth State Restoration API for iOS, which allows the app to still to continue discovering and be discovered even if the application is in the background. But - when force quitting the app, it stops broadcasting, which we had to find a solution to.

First, there's some thought that we had to keep in mind, when choosing the right approach. We want the phone to wake up while being terminated, to send out a broadcast, and also to receive a broadcast sent by another device, which also might have the app terminated. So we needed all devices with the app installed, to wake up at the same time, to send/receive this information to/from eachother.

Here's the options we went through:

#### Android

Android has started to restrict background services since Android 6. They introduced something called Doze Mode which basically prevents apps from accessing network and performing CPU-intensive work.
It is a good thing for users to extend their devices' battery life. There are few things to do to adapt our app to Doze mode.

##### 1.Foreground Service

We can not use background services since the introduction of Doze Mode. If we want to do some work even when the app is force quit, foreground services is the only way to keep the app process running.
So we attached p2pkit to a foreground service, this way we can listen to events from p2pkit when the app is in the background or closed.

##### 2.Scheduling Periodic Jobs

Android Operating System still can kill our foreground service if it needs more resources, so we need to make sure our service is running.
To check if the service is running, we scheduled 15 minutes interval periodic job. Basically this job will check if the service is running or not, and when it is not running it will start it again.  
For scheduling background jobs, we used Google's Android Jetpack library [WorkManager](https://developer.android.com/topic/libraries/architecture/workmanager).

##### Result

Because of the restrictions of the Android, we have to use both foreground service and periodic jobs to make sure our prototype will continue listening events from p2pkit.

#### iOS

##### 1.Background fetch

Background fetch will let your app run in the background for about 30 seconds at scheduled intervals. The issue with this feature in our setup is, that you can't schedule it to run at exact times. Here's a snippet from Apples documentation:

> The system waits until network and power conditions are good, so you should be able to retrieve adequate amounts of data quickly.

So basically iOS is deciding when it's the right time to open the app up and do the broadcasting. That's not good enough for us, since we need all devices to wake up at the same time - so let's move on to the next option.

##### 2.Remote (push)notifications

Remote push notifications can be used to wake up the app, even though it's terminated. So this could be a possible solution, since push notifications can be silent, which means the user won't even notice that one is received. So far it sounds promising, but - this option would take that we send out push notifications from a backend in a cronjob, e.g. every 5 minutes. That doesn't sound too clean. Also we are not guaranteed that the push messages are delivered at the exact same time to all devices, which leads us back to the issue we had with `background fetch`.

##### 3.Local notifications

Local notifications can be used in a similar way as remote push notifications, and will also open up the app shortly, and be able to run some code even though the app is terminated. Also we're able to schedule the notifications to fire every 5min in the hour, so everyone, with the same timezone at least, should receive these notifications at the same time, unless their clock on the phone is out of sync, of course. This sounds promising! Again there's a but. This time it's about the silence. We can't make a local push notification silent, as it's possible with remote notifications. So this means that the user would receive a notification from the app every 5 minutes, which probably would make them uninstall the app pretty quickly. So this wouldn't be a good solution either.

##### Result

We ended up going with local notifications, but not the recurring ones. We schedule a local notification 5 seconds after the app is terminated, reminding the user that for the app to work, is has to be running in the background. In that way, people who by mistake force quit the app are reminded to open it again. We're under the impression that people who have this app download it and use it actively because they want to participate. Also it seems more correct, letting the user decide if they want to broadcast or not, and not let the app run in the background, when they think it's properly closed.

### Distancing

When talking proximity ranging, it's hard to convert signal strength directly to distance. p2pkit provides 5 levels of proximity strength:

- `ExtremelyWeak`
- `Weak`
- `Medium`
- `Strong`
- `Immediate`

We tested `Immediate` first, to see how that worked out. At first it worked out pretty well - the distance before dropping to `Strong` was about 1.5 meters, but sometimes also even less. So we thought that it was a little too short of a distance, and tried with `Medium`. Medium seemed to reach around 5-6 meters before dropping to `Weak`, so logically we tried with `Strong` which turned out to be the best option, with a reach around 2-3 meters before dropping. So `Strong` it is!

### Customization

We wanted to added a custom alertview for when bluetooth is not enabled, to ask the user to turn it on. It turns out that it’s not as easy as it sounds, since it's only possible to go directly to the phone's bluetooth settings through the native popup provided by the `CBCentralManager` when initializing it. Since the direct path to the bluetooth settings is going through a “non-public URL scheme”, it's not possible to link to this from a custom popup, as it likely will get your app rejected by Apple.

Our solution to this is to initialize the `CBCentralManager` with an option to opt out of the native popup (`options: [CBCentralManagerOptionShowPowerAlertKey: false]`) at first, then wait for the response in the delegate method `centralManagerDidUpdateState(_ central: CBCentralManager)`, to check if the status is `poweredOff`, and if it is, we show a custom popup with some more informative information, than the one Apple provides. When the user taps the button in the custom popup, we deinitialize the `CBCentralManager`, and initialize it again with the options set to display the native popup. That way we can give the user proper information at first, and then show the native afterwards.

### Broadcasting cross platforms

For this to app to be useful, it has to be able to work cross platforms. We built an identical Android application, but found out there's some restrictions in bundleId's on Android, not allowing `-` to be used in the naming, such as `dk.nodes.my-awesome-app`. So on the Android platform it would have to be `dk.nodes.my_awesome_app`. Fine enough - we'll change the bundleId to `dk.nodes.my_awesome_app` on iOS then - until we found out that it's not possible to have `_` in the bundleId on the iOS platform. So in the end de decided to camelcase (`dk.nodes.myAwesomeApp`) the bundleId's to equalize them, since p2pkit needs the bundleId to process the broadcasts on their server properly.

## Conclusion

Since we had a week to build this app, we chose an already existing framework instead of building our own. This obviously comes with some challenges as we already mentioned in this post, but all in all p2pkit was pretty suitable for our needs. We've noticed some differences in signal strengths across platforms and other smaller inconsistencies, that we're unable to look further into, since we don't have access to the source code. This is alright for now, but in the future we're probably going to build our own framework, as having full control of the code makes it much easier to work with when proceeding.
Our prototype app is definitely functional, and we're looking forward to dig more into this project - both because of it's good purpose, but also because it's an interesting type of app and a lot of fun working on solutions like this. Stay safe out there!

Documentation:

- [https://developer.apple.com/documentation/uikit/app_and_environment/scenes/preparing_your_ui_to_run_in_the_background/updating_your_app_with_background_app_refresh](https://developer.apple.com/documentation/uikit/app_and_environment/scenes/preparing_your_ui_to_run_in_the_background/updating_your_app_with_background_app_refresh)
- [https://developer.android.com/training/monitoring-device-state/doze-standby](https://developer.android.com/training/monitoring-device-state/doze-standby)
