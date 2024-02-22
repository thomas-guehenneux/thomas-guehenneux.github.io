---
date: 2020-05-06
title: Mini Programs Introduction
tags: [mini program]
image: './header.webp'
authors:
  - li-huang
---

WeChat Mini Programs are a new way of connecting users and services. It‘s a new development capability that developers can learn quickly.

They are easy to access and share on WeChat, delivering excellent user experience.

## Technical Development of a Mini Program

Rome was not built in a day, and Mini Programs were not invented in a day.

First contact Mini Program is due to in the circle of friends saw a jump to jump link, so has a doubt on the Mini Program, what is the Mini Program?

Mini Programs started with WeChat, but why does the WeChat platform develop Mini Programs?

So that developers can get a better experience with WeChat.

How Mini Programs make a better experience for developers:

- Fast loading
- More powerful capabilities
- Native experience
- Easy and secure WeChat data exposure
- Efficient and simple development

As WebView in WeChat became increasingly important as an entry to mobile web pages, that is why WeChat developed the JS APIs.

For example, demo 1：Preview images using `WeixinJSBridge`.

```javascript
WeiXinJSBridge.invoke(
  "imagePreview",
  {
    current: "http://inews.gtimg.com/newsapp_bt/0/1693121381/641",
    urls: [
      "https://img1.gtimg.com/10/1048/104857/10485726_980x1200_0.jpg",
      "https://img1.gtimg.com/10/1048/104857/10485729_980x1200_0.jpg",
      "https://img1.gtimg.com/10/1048/104857/10485731_980x1200_0.jpg",
    ],
  },
  function (res) {
    console.log(res.err_msg);
  }
);
```

Demo 1 implements a JS API that users WeChat native components to view images. This method is much simpler and more efficient than additionally introducing a JS image preview component library.

But WeChat never officially exposed such APIs, they were only provided internally for some Tencent services.

So later WeChat released a Web development kit called JS-SDK, which included dozens of APIs for such scenarios as taking photos, recording, speech recognition, QR code, map, payment, sharing, and coupons etc.

Those WeChat's native capabilities allowed web developers to do what they couldn't do before.

Demo 2 also shows how to view images by calling a native component.

```javascript
wx.previewImage({
  current: "https://img1.gtimg.com/10/1048/104857/10485726_980x1200_0.jpg",
  urls: [
    "https://img1.gtimg.com/10/1048/104857/10485726_980x1200_0.jpg",
    "https://img1.gtimg.com/10/1048/104857/10485729_980x1200_0.jpg",
    "https://img1.gtimg.com/10/1048/104857/10485731_980x1200_0.jpg",
  ],
  success: function (res) {
    console.log(res);
  },
});
```

Actually, built on WeixinJSBridge and incorporating some new features, JS-SDK was open to all developers, instead of being only available to internal developers, and became popular among developers quickly.

JS-SDK gave web developers more capabilities by exposing WeChat APIs. However, users still had an unsatisfactory experience when using mobile web pages.

When a user visited a web page, a white screen occurred before the page was displayed on the browser. On a mobile device, this problem was more severe due to lower device performance and network speed.

To help web developers solve this problem, our team designed an enhanced version of JS-SDK, which had an important feature called "WeChat Web Resource Offline Storage".

This design was somewhat similar to HTML5 Application Cache, but eliminated some of HTML5's limitations.

In internal trials, WeChat Web Resource Offline Storage could solve some problems, but white screen still occurred in some complicated cases, for example, when a page was loaded with a large number of CSS or JavaScript files.

In addition to the white screen, insufficiency of clear action feedback affected the web user experience.

This was mainly reflected in tap delay, and page switching without smooth transitions.

Because of the above problems of JS-SDK, in order to provide a better experience for developers, the Mini Program development documentation is provided in the WeChat platform.

_Article Photo by [baidu](https://image.baidu.com)_
