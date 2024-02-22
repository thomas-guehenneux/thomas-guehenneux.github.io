---
date: 2022-04-15
title: Connecting specialized doctors to refugee camps with the help of artificial intelligence
tags: [monstarhacks2022]
image: './header.webp'
authors:
  - faisal-ahmed
  - abu-farhad
  - shafin-ashraf
categories:
  - monstar-hacks
---

This year's [MonstarHacks](https://www.linkedin.com/showcase/monstarhacks) main theme was Life Science and three selected goals were:

1. Assure equitable health care for everybody
2. Keep the “human touch” in digital healthcare solutions in isolating times
3. Connect refugees with medical support in times of crisis (with a focus on low energy consuming solutions)

Our team `PartTimeHackers` decided to tackle the problem of "Connect refugees with medical support in times of crisis" by building a mobile application that will connect health care professionals with people seeking medical care. We think the challenge is important because the problem is so general. Everyone has this problem. Everyone needs to have some diagnosis. Of course not once or twice a year, but frequently, even daily if possible. And if we could solve it then the life of doctors, rural people, and refugees will be a lot easier.


## Problem statement
We believe there are good people on earth and we want to help those people who want to do good for others. For example if a doctor wants to voluntarily help any person in a refugee camp with medical consultancy, he/she simply can’t or he/she has to overcome a lot of issues. We identified some of those issues as follows:

1. Where to meet
2. When to meet
3. Who to meet

For most of the issues the main cause is, there is no organized way for a doctor to connect to a person who needs help.


## The proposed solution
To solve this organizational problem our team came up with the idea of MonstarCare. `MonstarCare` is an app that connects a person in a refugee camp who needs medical help to a specialized doctor.

## How does it work
A doctor uses our app to notify others at which place and time he/she will be available for volunteering with medical consultancy. And also in which medical sector he is specialized in. Any person from a refugee camp makes a request from our app letting us know what kind of problems they have. After that our machine learning algorithm matches a doctor to the refugee who needs help. Then those people who are matched to a doctor are notified by SMS at what time and place the doctor will visit their refugee camp zone.

## Our Tech stack
- [React native](https://reactnative.dev/) (App) - Allowed us to prototype our app faster than any other solution. None of our team members was familiar with app development. But react native was very easy to learn.
- [Go](https://go.dev/) (Backend) -  If we want to scale our solution globally Go helps in that area.
- [Python](https://www.python.org/) (Machine Learning Model) -  Industry standard and huge community support.
- [Figma](https://www.figma.com/) - Intuitive tool for mocking and designing app flow.


### Links to app demo
- 🎨 Design: [Figma file ](https://www.figma.com/file/OGlbDeyIYyDZAnm2fUJASe/hacks2022?node-id=0%3A1)
- 💻 Demo Implementation: [Published expo (React Native)](https://expo.dev/@shafin_ashraf/mht?serviceType=classic&distribution=expo-go)


_Article Photo by [samaritanspurse.ca](https://www.samaritanspurse.ca/article/bc-nurse-offering-helping-hands-to-displaced-in-bangladesh/)_
