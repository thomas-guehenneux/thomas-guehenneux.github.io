---
date: 2020-05-06
title: Differences Between Mini Program Development and Web Development
tags: [mini program, web development]
image: './header.webp'
authors:
  - li-huang
---

Web development is built using HTML, CSS and JavaScript, where HTML describes the structure of the page, CSS determines the appearance of the page, and JS defines the interaction between the page and the user.

Mini program development is built using WXML, WXSS and JavaScript, where WXML is the equivalent of HTML, but more simple than HTML, mainly reflected in simplifying and standardizing the sticky notes.

WXSS has most of the features of CSS, but incorporates some new features and modifications for the Mini Program, JS Logic Interaction only uses the core of JavaScript.

From the above, Web development and Mini program development depend on JavaScript, but there are some differences, as follows:

DOM: Document Object Model

BOM: Browser Object Model

Because there are no DOM Objects and BOM Objects in the Mini Program, it is impossible for some libraries familiar to front-end developers, such as jQuery and Zepto, to run in Mini Programs.

Web development, rendering threads and scripting threads are mutually exclusive, so long-time script running may make a page unresponsive. In a Mini Program, rendering threads and scripting threads run separately.

The former runs in JSCore without a full browser object, thus lacking the relevant DOM and BOM APIs.

Meanwhile, the JSCore environment is different from the NodeJS environment, which means that some NPM packages cannot run in Mini Programs.

The differences between the three operating environments are as follows:

Web developers work with IE/Chrome/QQ browsers on PC, and Safari/Chrome browsers as well as various WebViews on iOS or Android systems on mobile devices.

Mini Program developers work with WeChat on iOS, Android, and WeChat DevTools.

The three operating environments of the Mini Program as follows:

| Runtime Environment |  Logic Layer   |        Rendering Layer |
| ------------------- | :------------: | ---------------------: |
| iOS                 | JavaScriptCore |              WKWebView |
| Android             |       V8       | Chromium custom kernel |
| WeChat DevTools     |      NWJS      |         Chrome WebView |

When developing web pages, Web developers only need to use browsers with some auxiliary tools or editors.

The development of Mini Programs involves applying for Mini Program accounts, installing WeChat DevTools, configuring projects, and so on.

_Article Photo by [baidu](https://image.baidu.com)_
