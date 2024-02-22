---
date: 2019-10-08
title: Droidcon Berlin 2019
tags: [android, conference, kotlin]
image: './header.webp'
authors:
  - roman-levinzon
categories:
  - afk
---

## Droidcon Berlin 2019

Back in July, Lucas and I took a trip to Berlin for the Droidcon 2019 conference. It was the second mobile development conference that I've been to and the first one entirely dedicated to Android, so I had high hopes. In this blog I'd like to highlight some of the talks I chose to attend.

## Quick facts

1. 3 days filled with talks and workshops
2. 100+ talks & workshops
3. 5 tracks running in parallel, so you always have a choice for what to see next.
4. Website https://www.de.droidcon.com/

### You get a talk. And you. Everyone gets a talk.

Straightaway, I was surprised by the Keynotes. Not sure if it is Droidcon tradition, or it is something newly introduced, but anyone from the audience could pitch a talk he/she was interested in giving.

Here's how it works: everyone interested in giving a talk had about 30 seconds to introduce himself and his/her topic. So whether you were declined with the opportunity of being a speaker, or you were late in the applying process, or you simply have something you want to share or discuss - you could've totally done that! The newly introduced speaker then received a time slot, and the timetable was updated accordingly. This led to a lot of new exciting talks and discussions. So thumbs up for that!

## Android Development in 5 years.

This was not as much of talk as a discussion between very opinionated people. Long story short, we are pretty safe out here.

They have started with speculating how Android development could change after the next five years. There were no doubts whether Android will still be a popular technology used - the Android community is constantly growing, and the platform evolves rather rapidly. So it's a good thing.

Then the speculations started. It included even more automation in the development process, new wearables, and new ways to interact with devices like hovering gestures and audio interactions. Another thing that was discussed and for us to consider is a change to UI/UX: Morphing screen states to replace classic screen-to-screen navigation.

Another part of the discussion was related to other solutions like PWAs and cross-platform frameworks. They argued that all these solutions provide a different user experience and won't replace native Android development. Still, it shouldn't -- it is its own solution and the rule "Right tool for the right job" still applies.

Lastly, some of the skills that could be useful in the near future:

- Stop separating designers and developers
- Pairing Backend and Frontend developers
  These two can be seen as motivation for us to work more closely together, know the constraints of different platforms, and make decisions accordingly.
- Soft Skills (well how else without them)
- Checking WEB frameworks and trends once in a while
  Web development is a very fast-growing field, and some of the trends could easily make it to Android in some way or another, and some have already done it.

## Diving into Jetpack Compose

Next talk was my second introduction to the Jetpack Compose. If anything, that talk got me a bit more excited about this new UI framework than a recent glimpse I had at a Google I/O. Using the simple example of the counter widget, the speaker talked about the philosophy behind Jetpack Compose and made a couple of points about how its introduction might help the developers.

- `UI = F(s)` or declaring the UI as the function of the state. This allows us to declare stateless widgets and promote a single source of truth without trying to figure out where should the updated state be stored.

- Code structure matches view hierarchy with the state located the closest to the root

- No `Views` references - we only have `@Composable` functions to draw the UI on Canvas for us

## MVI made for Android

We have already started to use MVI in our projects at Nodes, so I was quite interested to see how others approached this. The talk started with an introduction to Model-View-Intent pattern and slowly transformed into the speaker describing their solution to the problem: Roxie library. Roxie is the Android implementation of principles introduced by Redux and all of its concepts:

- State - a `data class` that represents the UI,
- Change - a `sealed class` that represents the result of the domain interaction (i.e. `Interactor` result)
- Action - User interactions with the UI, which may result in triggering a change
- Reducer - a function that combines State and the Change to produce a new State.
- `ViewModel` is then declared as follows: `BaseViewModel<Action, State>`

I am eager to try this approach in my upcoming projects, and there is also [a branch in the Nodes Kotlin Template](https://github.com/nodes-android/kotlin-template/tree/feature/redux) that shows how it could work with our template. There it uses `Channel` and `Flow` from Kotlin Coroutines instead of `RxJava`. You can also check out [my fork](https://github.com/levinzonr/roxie) of this library for more examples of using this approach.

Also if I got any of you interested, you could check this [article](https://proandroiddev.com/unidirectional-data-flow-with-roxie-bec546c18598) with some examples and excellent points about readability and writing tests.

## Why SKY failed at modularising their application

This is the kind of talk where you get to listen about other people failures and mistakes, which is always fun but still, you get to learn from their experiences.
Having a rather big flavor-based application, at some point, they have decided to start splitting it into modules by features.

The very first problem they have encountered was a problem defining what is a feature. SKY have started by trying to separate the most complicated part of the app ( failed ), then the simplest one (splash, success, not that it helps anyone). Turns out, this approach was a mistake, so they continued by separating the parts of the app that would be most valuable to have in modules.
At some point, they have also encountered problems with circled dependencies, resource conflicts, etc. So here is a word of advice from them when it comes to modularizing Android applications:

- Treat each feature module as a library that you can outsource... maybe.
- Your first feature module must serve as the blueprint for all the others module, so don't compromise on them and integrate it as fast as you can.

## Wrapping up

Three days long conference contains a large number of talks -- far more that I would be able to summarize in one blog post. I tried to highlight the ones that I found the most interesting. A small part of the talks, the ones that were dedicated to Architecture Components, I found pretty repetitive, mostly because they were covered pretty well during Google I/O. All in all, it was a great experience, and I'd recommend attending one of the Droidcons for anyone interested.

_Article Photo by @droidconBerlin_
