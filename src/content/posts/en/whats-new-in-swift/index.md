---
date: 2020-06-29
title: What's new in Swift
tags: [ios, vapor, swift, wwdc20]
image: './header.webp'
authors:
  - heidi-hermann
categories:
  - ios
  - vapor
---

This year's "What's new in Swift" included a plethora of improvements and new add-ons. Some of the news are:

- better diagnostic compiler error's and hence better debugging
- improved and faster code completion
- improved auto indentation
- improved integration
- improved handling of chained method calls and property accesses
- A standardized way to delegate a program's entry point with the `@main` attribute
- Swift Numerics, an open source project bringing additional support for numeric functions to Swift
- Swift Argument Parser, build your command line tools with Swift
- `where` clauses on contextually generic declarations
- Multi-Pattern `catch` clauses
- Float16

But the list is much longer. In the following are some highlights for what is to come with Swift 5.3 and you can find a list of further reading and related videos at the bottom of the post.

## Additional Cross Platform Support and Swift AWS Lambdas

To support the Swift ecosystem Apple has added additional cross-platform support and will officially support:

- All Apple platforms
- Ubuntu 16.04, 18.04, 20.04
- CentOS
- Amazon Linux 2
- Windows (coming from Swift 5.3)

This also opens up for official support for [Swift AWS Lambdas](https://developer.apple.com/videos/play/wwdc2020/10644/). The `AWSLambdaRuntime` package is based on `SwiftNIO` and allows for both closure based Lambdas and eventloop Lambda functions. Below is an example of a closure based Lambda as presented in the talk:

```swift
import AWSLambdaRuntime
Lambda.run { (_, name: String, callback) in
    callback(.success("Hello, \(name)!"))
}
```

## Enum Improvements

This year we get two big improvements to the `enum` type:

### [Synthesized `Comparable` Conformance For `enum` Types](https://github.com/apple/swift-evolution/blob/master/proposals/0266-synthesized-comparable-for-enumerations.md)

With Swift 4.1 came synthesized, opt-in `enum` conformance for `Equatable` and `Hashable`, however conformance to `Comparable` was left out. From Swift 5.3 `Comparable` will also be included, allowing for easy sorting by the order of declaration. The synthesized, opt-in conformace only comes for `enum`s without raw values, without associated types or with comparable associated types.

```swift
enum ApplePlatform: Comparable {
    case iOS
    case ipadOS
    case macOS
    case tvOS
    case watchOS
}

[ApplePlatform.watchOS, ApplePlatform.ipadOS, ApplePlatform.macOS].sorted()
// [ApplePlatform.ipadOS, ApplePlatform.macOS, ApplePlatform.watchOS]
```

### [Enum Cases As Protocol Witnesses](https://github.com/apple/swift-evolution/blob/master/proposals/0280-enum-cases-as-protocol-witnesses.md)

Another great improvement to `enum`s in Swift is the possibility to allow for static protocol requirements to be witnessed by an `enum` case. It introduces two rules:

1. static, get-only protocol requirement can be witnessed by an enum case without an associated value
2. static func requirement can be witnessed by an enum case with one or more associated values

```swift
protocol ErrorReportable {
    static var notFound: Self { get }
    static func invalid(searchTerm: String) -> Self
}

enum UserError: ErrorReportable {
    case notFound
    case invalid(searchTerm: String)
}
```

## Multiple Trailing Closures

If you have been following along in the discussions on Swift forums, you may have come across the topic of _multiple trailing closures_. It has been thoroughly discussed and many people had their opinions on both the syntax and the final process.

Up until now it has only been possible to use a trailing closure if your method has one escaping closure. An example of that is one of the animate methods in `UIKit`

```swift
import UIKit
UIView.animate(withDuration: 0.3) {
    self.view.alpha = 0
}
```

If we instead wanted to use the animate method that also allows us to define what should happen at completion we can't use trailing closures anymore

```swift
import UIKit
UIView.animate(
    withDuration: 0.3,
    animations: { self.view.alpha = 0 },
    completion: { _ in
        self.view.removeFromSuperview()
    }
)
```

With Swift 5.3 any method can now have multiple trailing closures. The first closure will be without a label, while all remaining closures should be labeled. The animate method from before will now look like:

```swift
import UIKit
UIView.animate(withDuration: 0.3) {
    self.view.alpha = 0
} completion: { _ in
    self.view.removeFromSuperview()
}
```

## Increased Availability of Implicit `self` in Closures

Swift requires the explicit use of `self` in escaping closures which capture it. This can lead to a lot of repetitive code. With implicit `self` in closures in Swift 5.3, we can omit all `self.` inside our closures. Instead we can add `self` to the capture list of the closure. Using implicit `self` will then update our animate method from before, so we only have to specify `self` once in each closure.

```swift
import UIKit
UIView.animate(withDuration: 0.3) { [self] in
    view.alpha = 0
} completion: { [self] _ in
    view.removeFromSuperview()
}
```

## Other WWDC Articles

- [WWDC20]({{ baseurl }}2020-06-26-WWDC20-summary)
- [A first look at Apple's new Augmented Reality features]({{ baseurl }}2020-06-23-A-first-look-at-Apples-new-Augmented-Reality-features)
- [Introducing App Clips]({{ baseurl }}2020-06-26-Introducing-App-Clips)

## Recommended WWDC Sessions

- [What's new in Swift](https://developer.apple.com/videos/play/wwdc2020/10170/)
- [Explore logging in Swift](https://developer.apple.com/videos/play/wwdc2020/10168/)
- [Explore numeric computing in Swift](https://developer.apple.com/videos/play/wwdc2020/10217/)
- [Use Swift on AWS Lambda with Xcode](https://developer.apple.com/videos/play/wwdc2020/10644/)

## Resources and Further Reading

- [Keypath expressions as functions (SE-0249)](https://github.com/apple/swift-evolution/blob/master/proposals/0249-key-path-literal-function-expressions.md)
- [Callable values of user-defined nominal types (SE-0253)](https://github.com/apple/swift-evolution/blob/master/proposals/0253-callable.md)
- [String initializer with access to uninitialized storage (SE-0263)](https://github.com/apple/swift-evolution/blob/master/proposals/0263-string-uninitialized-initializer.md)
- [Standard library preview package (SE-0264)](https://github.com/apple/swift-evolution/blob/master/proposals/0264-stdlib-preview-package.md)
- [Synthesized comparable conformance for enum types (SE-0266)](https://github.com/apple/swift-evolution/blob/master/proposals/0266-synthesized-comparable-for-enumerations.md)
- [Where Clauses on contextually generic declarations (SE-0267)](https://github.com/apple/swift-evolution/blob/master/proposals/0267-where-on-contextually-generic.md)
- [Refined didSet semantics (SE-0268)](https://github.com/apple/swift-evolution/blob/master/proposals/0268-didset-semantics.md)
- [Increased availability of implicit self in closures (SE-0269)](https://github.com/apple/swift-evolution/blob/master/proposals/0269-implicit-self-explicit-capture.md)
- [Collection operations on noncontiguous elements (SE-0270)](https://github.com/apple/swift-evolution/blob/master/proposals/0270-rangeset-and-collection-operations.md)
- [Multi-pattern catch clauses (SE-0276)](https://github.com/apple/swift-evolution/blob/master/proposals/0276-multi-pattern-catch-clauses.md)
- [Float16 (SE-0277)](https://github.com/apple/swift-evolution/blob/master/proposals/0277-float16.md)
- [Multiple trailing closures (SE-0279)](https://github.com/apple/swift-evolution/blob/master/proposals/0279-multiple-trailing-closures.md)
- [Enum cases as protocol witnesses (SE-0280)](https://github.com/apple/swift-evolution/blob/master/proposals/0280-enum-cases-as-protocol-witnesses.md)
- [Type-based program entry points (SE-0281)](https://github.com/apple/swift-evolution/blob/master/proposals/0281-main-attribute.md)
- [Standard library preview](https://github.com/apple/swift-standard-library-preview)
- [Swift Numerics](https://github.com/apple/swift-numerics)
- [Swift Argument Parser](https://github.com/apple/swift-argument-parser)
- [SwiftLog](https://github.com/apple/swift-log)

_Article Photo - capture from [What's new in Swift](https://developer.apple.com/videos/play/wwdc2020/10170/) by Apple_
