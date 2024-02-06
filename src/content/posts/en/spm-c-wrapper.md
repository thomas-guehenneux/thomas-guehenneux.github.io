---
title: "How to use C in Swift Packages"
tags: [ios, swift, spm, c]
image: "@/assets/posts/spm-c-wrapper/header.jpg"
authors:
  - tiago-bras
categories:
  - ios
date: 2024-01-02
---

C language is never going away. Not only is it portable, efficient and performant, but it's also
very easy to find a compiler for any platform.
[SQLite](https://www.sqlite.org/index.html) might be one of the most well known C library, but it's not
the only one.

- [Lua](https://www.lua.org/) scripting language.
- [curl](https://curl.se/) command-line tool for transferring data specified with URL syntax.
- [SDL](https://github.com/libsdl-org/SDL) cross-platform development library designed to
provide low-level access to audio, keyboard, mouse, joystick, and graphics hardware via OpenGL and Direct3D.

Python libraries, such as [Numpy](https://numpy.org/), also reach out to C in order
to speed up certain parts of the code.

Recently, while working with images, we discovered that UIKit can't decompress all JPEG2K images.
Since this was a mandatory requirement, we had to find a solution.
After a bit of digging, we came across [OpenJPEG](https://www.openjpeg.org/).
We did a few tests and confirmed that it was able to decompress the images that UIKit couldn't.
The only issue remaining was that **OpenJPEG** was a C library.

To use **OpenJPEG** in an iOS SDK, there were two options:

1. statically compile the library and bundle it in an XCFramework
2. wrap the source code in a Swift package

For option 1, we'd have to deal with CMake, compile it for multiple architectures, archive them in Frameworks
and finally package them in an XCFramework bundle. That seemed to be very time-consuming, so we went with option 2,
which is not without its quirks, but pretty straightforward once you understand it. So let's C how to do that, *wink* *wink*.


In this article, we're going to create a small wrapper around the Xoshiro256++ PRNG (Pseudorandom Number Generator).
This is a great PRNG, and it's about 10x to 28x faster than
`UInt64.random`.


If you wanted to implement this algorithm in Swift you could do it like this.


public final class Xoshiro256PlusPlus: RandomNumberGenerator {
    public typealias Seed = (UInt64, UInt64, UInt64, UInt64)
    private var s: Seed

    public init(seed: Seed = Xoshiro256PlusPlus.randomSeed()) {
        self.s = seed
    }

    public static func randomSeed() -> Seed {
        return (
            UInt64.random(in: UInt64.min...UInt64.max),
            UInt64.random(in: UInt64.min...UInt64.max),
            UInt64.random(in: UInt64.min...UInt64.max),
            UInt64.random(in: UInt64.min...UInt64.max)
        )
    }

    /// Generates a pseduo random number.
    public func next() -> UInt64 {
        let result = rotl(s.0 &+ s.3, 23) &+ s.0
        let t = s.1 << 17
        s.2 ^= s.0
        s.3 ^= s.1
        s.1 ^= s.2
        s.0 ^= s.3
        s.2 ^= t
        s.3 = rotl(s.3, 45)

        return result
    }

    private func rotl(_ x: UInt64, _ k: Int) -> UInt64 {
        return (x << k) | (x >> (64 - k))
    }
}
```

This is just a simple example, but it's sufficient to explain how public and private interfaces
work in C and how to structure your Swift package. The C code is still
around 10% faster than the Swift version.

You can get the original Xoshiro code at [Xoshiro Generators](https://prng.di.unimi.it/).


## How to use C in Swift packages

Before anything else let's create the library package.

```bash
$ mkdir Xoshiro && cd Xoshiro
$ swift package init --name "Xoshiro" --type library
$ open Package.swift
```

Add two new **targets**, `CLib` and `CLibTests` and create the
respective folders.

```swift
.target(
    name: "CLib"
),
.testTarget(
    name: "CLibTests",
    dependencies: ["CLib"]
),
```

Then let's add the actual code. By default, all header files added in
the include folder are public.

#### Small helper function for rotating bits left

```c
// Xoshiro/Sources/CLib/include/bitops.h
#ifndef bitops_h
#define bitops_h

#include <stdint.h>

extern uint64_t rotl(const uint64_t x, int k);

#endif /* bitops_h */
```

```c
// Xoshiro/Sources/CLib/bitops.c
#include "bitops.h"

inline uint64_t rotl(const uint64_t x, int k) {
    return (x << k) | (x >> (64 - k));
}
```

#### Xoshiro256++ PRNG

```c
// Xoshiro/Sources/CLib/include/xoshiro256.h
#ifndef xoshiro256_h
#define xoshiro256_h

#include <stdint.h>

void xoshiro256_seed(uint64_t s1, uint64_t s2, uint64_t s3, uint64_t s4);
uint64_t xoshiro256_next(void);

#endif /* xoshiro256_h */
```

```c
// Xoshiro/Sources/CLib/xoshiro256.c
#include "xoshiro256.h"
#include "bitops.h"

static uint64_t s[4];

void xoshiro256_seed(uint64_t s1, uint64_t s2, uint64_t s3, uint64_t s4) {
    s[0] = s1;
    s[1] = s2;
    s[2] = s3;
    s[3] = s4;
}

uint64_t xoshiro256_next(void) {
    const uint64_t result = rotl(s[0] + s[3], 23) + s[0];
    const uint64_t t = s[1] << 17;

    s[2] ^= s[0];
    s[3] ^= s[1];
    s[1] ^= s[2];
    s[0] ^= s[3];
    s[2] ^= t;
    s[3] = rotl(s[3], 45);

    return result;
}
```

We can easily test if this is generating uniform distributions by
creating a simple test that checks when we generate N random
numbers if all possible results share roughly the same percentage.

```swift
import XCTest
@testable import CLib

final class CLibTests: XCTestCase {
    func testXoshiro() throws {
        let s = (1...4).map { _ in UInt64.random(in: UInt64.min...UInt64.max) }

        xoshiro256_seed(s[0], s[1], s[2], s[3])

        let results = NSCountedSet()
        let options: UInt64 = 100
        let samples = 1_000_000

        for _ in 0..<samples {
            results.add(UInt8(xoshiro256_next() % options))
        }

        for option in 0..<options {
            let actual = Double(results.count(for: option)) / Double(samples)
            let expected = 1.0 / Double(options)

            XCTAssertEqual(actual, expected, accuracy: 0.01)
        }
    }
}
```

There's one problem though, we have put everything in the `include`
folder which means every function in both `bitops.h` and `xoshiro256.h`
are public.
The user doesn't need to know about `uint64_t rotl(const uint64_t x, int k)`
in `bitops.h`, so how do we make it private?


One simple way is to move it to the root folder of its target,
like this.


```commandline
Xoshiro
├── Package.swift
└── Sources
    ├── CLib
    │   ├── bitops.c
    │   ├── bitops.h
    │   ├── xoshiro256.c
    │   ├── include
    │   │   └── xoshiro256.h
    └── Xoshiro
        └── Xoshiro.swift
```

This causes a `'bitops.h' file not found` error.

![](@/assets/posts/spm-c-wrapper/FileNotFound.png)

To fix this you have to tell SPM where to search for header files
by adding a header search path.

```swift
.target(
    name: "CLib",
    cSettings: [
        .headerSearchPath(".")
    ]
),
```

Personally, I prefer being more explicit and make it clear what's
public and private by creating `private` and `public` folders.

```commandline
Xoshiro
├── Package.swift
└── Sources
    ├── CLib
    │   ├── private
    │   │   ├── bitops.c
    │   │   ├── bitops.h
    │   │   └── xoshiro256.c
    │   └── public
    │       └── xoshiro256.h
    └── Xoshiro
        └── Xoshiro.swift
```

And then explicitly set the public headers' path.

```swift
.target(
    name: "CLib",
    publicHeadersPath: "public",
    cSettings: [
        .headerSearchPath("private")
    ]
),
```

## How to add a Swift interface

Now the easiest part, wrapping the C interface with a Swift interface.

```swift
import CLib

public final class Xoshiro256: RandomNumberGenerator {
    public typealias Seed = (UInt64, UInt64, UInt64, UInt64)

    public init(seed: Seed? = nil) {
        if let seed {
            xoshiro256_seed(seed.0, seed.1, seed.2, seed.3)
        } else {
            xoshiro256_seed(
                UInt64.random(in: UInt64.min...UInt64.max),
                UInt64.random(in: UInt64.min...UInt64.max),
                UInt64.random(in: UInt64.min...UInt64.max),
                UInt64.random(in: UInt64.min...UInt64.max)
            )
        }
    }

    public func next() -> UInt64 {
        return xoshiro256_next()
    }
}
```

# Conclusion

Using C in Swift packages is pretty straightforward once you
know how to structure your code. Being able to use C is especially
useful when dealing with low-level code that needs to be performant.
Unsafe Swift syntax/API is also a bit too verbose for my liking, so I
think it's great that I get to call out to C whenever needed.

I hope this tutorial has made integrating C in Swift packages less
daunting.

### Related Articles
- [Apple - C Interoperability](https://developer.apple.com/documentation/swift/c-interoperability)
- [Apple - Unsafe Swift](https://developer.apple.com/videos/play/wwdc2020/10648/)
- [Apple - Safely manage pointers in Swift](https://developer.apple.com/videos/play/wwdc2020/10167/)


_Article Photo by [Iñaki del Olmo](https://unsplash.com/@inakihxz)_
