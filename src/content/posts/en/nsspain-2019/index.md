---
date: 2019-11-07
title: NSSpain 2019
tags: [development, ios, swift, engineering, conference]
image: './header.webp'
authors:
  - jiri-bucek
categories:
  - afk
---

## NSSpain 2019

NSSpain is one of the most well-known iOS conferences held in Europe. This year was its seventh year, and with over three hundred participants, the tickets got sold out even before a single speaker was announced.
Taking place in Logroňo, a beautiful city situated in the northern part of Spain, I had to take a local flight from Madrid to get there. After realizing most of the passengers in the small plane are young men all wearing Apple Watches, I knew I was on the right flight :).
The typical relaxed Spanish way of life had its stamp on the conference as well. The atmosphere was very calm, and the participants friendly and always happy to start a conversation. I made a couple of new friends at the airport, ordering a shared taxi, and continued to make more during the entire conference.
The talks were divided into two days and included a wide range of topics from the vast world of iOS. On one part of the spectrum, we could listen to some in-depth technical presentations. Some topics covered the code compilation in Xcode, building your own debugger or the way programming can be applied to solving mathematical logic.
The other part gave insight into more practical iOS programming skills like asynchronous code, self-sizing cells, accessibility, unit testing, or using Swift for scripting.
A big part of the presentations was devoted to the "softer" part of development as well. The topics covered building trust in your users, green development, or career transformation from a developer to a manager.
Let's take a look into some of the topics that caught our attention.

## Key takeaways from developing VLC for iOS

_[https://vimeo.com/362126060](https://vimeo.com/362126060)_
This presentation was one of the less technical but delivered some valuable insights into the parts of the development process that are not always in the primary focus of a developer. The key points were as follows.

1. Know your licenses
   Firstly released in 2010, VLC player remained in the App Store only for three months before being put down due to a GNU GPL license violation. GPL (general public license) is a free software license. It states that any derivative work must be open-source and distributed under the same license terms. Since App Store adds its terms of use, it violates this rule. And you can not safely use any GPL licensed work in your apps.

2. Know the local laws
   Another shutdown from the App Store came in 2014. The reason, Dolby patent violation. The VLC team was based in France, which did not recognize software patents. However, by submitting the app to the App Store, American laws were applied, and the app was taken down again. Something the VLC team did not take into consideration.

One remark worth mentioning is that during the time VLC was down from the App Store, people would actually abuse its open source license. They would put their cloned versions on the App Store and sell them to customers for money.

3. Up the bus factor
   A bus factor is a number equal to the number of team members who, if run over by a bus, would put the project in jeopardy. The lower it is, the bigger the risk. In the case of VLC, it took only one key developer to leave, and the project stopped for almost a year.

4. Write the documentation and tests
   After not being appropriately maintained for a year, the VLC crashes count quadrupled. The new team who came for a rescue found it extremely difficult to find the causes since there was no documentation and tests written for the code.

## Under the hood the debugger

_[https://vimeo.com/362136409](https://vimeo.com/362136409)_
This might not have been the easiest topic at the conference but gave us a deeper understanding of how debuggers on iOS/macOS work.

LLDB is the debugger that powers all the Xcode debugger functionality under the hood. LLDB provides the ability for reading variables, shows the frame within the backtrace. With LLDB you can set a breakpoint just as you can in Xcode. Also it provides: pauls - `process interrupt` command, resume - `process continue`, step - `thread step-in` and `thread step-out`.

What happens when we use Xcode to debug our app?
The first step that Xcode does is to launch the app. The next thing is to attach the debugger to the launch process and then maybe is pausing or hitting a breakpoint.

When we launch the application, it gets the assignment of the virtual memory map. This is an address space where the process reads and writes to and from. This is where the operating system is going to store the binary, heap, stack, and kernel space. We can read and write all over this address space except the kernel space. We have syscalls to communicate between the kernel space and the userspace. In the kernel space, we have Mach tasks. They help the debugger's process communicate with our process.
The breakpoints are just special kind of exceptions, in the Mach Task we have Exception Port which is shared between the debugged application and the debugger. In that way, the exception breakpoint is handled by the debugger.

## Swift life out of iOS

_[https://vimeo.com/362188196](https://vimeo.com/362188196)_
Probably all of us have to do repetitive things in our day to day work. Not all iOS developers feel very comfortable writing bash scripts to automate these tasks. Luckily, we can also automate this repetitive work with Swift. When you write a script in a language you are more comfortable with, you will do it faster. You can also use the tools you are familiar with, such as Xcode, Apple APIs, and your favorite 3rd party frameworks.
With the `Process()` API, we can execute terminal commands; this opens many possibilities. We can use it for Git. We can use it to run other scripts written in Bash, Python, or Ruby. We can use it to open applications, also for search. We can make our Swift scripts interactive as prompting for user input with `readLine()`. It is possible to create Pipes, if you assign an instance of `Pipe()` to the `Process()`'s `standardOutput`. You can use Swift directly as a script for this purpose. You have to put as the first line of your file `#!/usr/bin/swift`, or you can compile it, which is around 100 faster if you need speed. Another option is to use swift-sh. This is a small tool that makes the use of a scripting approach with 3rd party dependencies easy.

## We loved this conference!

Even after the talks were over for the day, the program was not. The first day a couple of buses took us all for a local winery visit. We had a chance to see the largest Europe's wine barrel storage and, of course, taste some of the fine Spanish wine. The next day was the first day of a big wine festival, and the entire city filled with people celebrating and dancing. What can be better than enjoy such an event with your iOS friends? :)

And the conclusion and overall impressions? We loved this conference! The organization was flawless, the talks were in-depth and informative, yet not tedious, and the people were always up for inspiring conversations.

If you were not lucky enough to attend, you can watch the talks here on Vimeo [https://vimeo.com/nsspain](https://vimeo.com/nsspain).
