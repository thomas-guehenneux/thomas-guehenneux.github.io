---
date: 2021-09-15
title: "Ravishing Ruby: Looking back at RubyKaigi Takeout 2021"
tags: [ruby, rails, conference]
image: './header.webp'
authors:
  - sivanpayyadakath
categories:
  - afk
---

RubyKaigi Takeout 2021 was held from September 9 to 11, 2021, after the original version of the conference was replaced with this online version. A place where the whole ruby community gathered together despite the pandemic’s attempt to keep them apart. It was a bit intimidating for me as a first-time attendee, but I got into the zone very quickly, thanks to the fine lineup of talks and presentations.
I’d like to take a spin through some of the highlights of the events that made this conference so great.

## TypePorf for IDE

By Yusuke Endoh

This talk by Yusuke Endoh- San was the perfect way to kick off Rubykaigi Takeout 2021.
The talk started with small pseudo-code examples in typescript, depicting how well of a dynamically typed language it is. TypeProf enables developers to achieve the same level of user experience, at least to an extent, in a very dynamically typed language like Ruby. Providing features like on-fly reporting, go-to-definition option, auto-completion, showing hints, inferring types on the fly, etc. There will be Typeprof support from Ruby 3.1, intending to improve our developing experience. Typeprof is still very slow from an analysis point of view, which hopefully will get better in near future. Even though it is still in the experimental phase, this is definitely exciting for all fellow Rubyists.

## Rubocop in 2021: Stable and Beyond

By Koichi Ito

Rubocop has been the most famous linter/formatter for ruby, which has helped developers enforce standard ruby style guidelines in their code. The talk discusses how things have changed after the release of Rubocop 1.0 last year, providing new upgrades in areas like bug fixes, performance, new ruby syntax support, auto-correction, etc. The optional --parallel option that can improve performance by enabling parallel processing really caught my eye. I think computers with good CPU, memory resources will benefit from this. Even though Koichi Ito-San says he has no plans for the major release of Rubocop version 2.0, he agrees to the fact that this is bound to happen at some point in the future.

## Ruby Archeology

By Nick Schwaderer

This title seemed odd to me, to be honest at first, but it wasn’t long before fascination crept in. The author reflects on how ruby has evolved over time. He started with setting up the 2009/2008 environment(Ruby 1.8~) on the 2021 machine. The author really dug deep on gems from the same generation in Nokogiri, hpricot (maintainers closed the book on it), builder gem. As a person who was introduced to ruby not until recently, I found it quite fascinating. The author took us all on board on his ride to the past which made us realize how important looking at our past and knowing the history is.

## Variable width allocation: Optimizing Ruby's Memory Layout

By Peter Zhu and Matt Valentine-House

This was one of the most informative talks for me personally. Started with how Ruby lays out its memory, how it manages memory, for both small and large objects. They also explained how Ruby’s garbage collection works, including slides that depicted how the steps of marking, sweeping, and compaction are implemented. The performance overhead caused by the malloc system was also well explained.
The goals of this project were to improve the performance by enabling ruby to manage its layout rather than relying on malloc system library. Reducing the malloc calls has already shown good improvements in performance. Even though this is not production-ready yet, the prospect of variable width allocation looks really promising.

## Parsing Ruby

By Kevin Newton

This talk was about different projects that parsed Ruby code over the years. Starting with Ruby 0.06 in 1996 all the way to Ruby 3.0 in 2020. The author also shared the pictorial representation of the releases of these projects along the timeline. The talk concluded with a discussion of current ruby script parsers Ripper and RubyParser, discussing the upsides and downsides of each and how investing in these or similar kinds of libraries can help us build powerful production applications.

## Regular Expressions: Amazing and Dangerous

By Martin J. Dürst

The author Martin reflects on how strong and handy Regular expressions can get, but at the same time can leave you in a world of evil when not used correctly. Due to its unpredictable time behavior and compact syntax, we could be running a high risk of significantly slowing down our program. Even though the author sees some solutions in RegExp timeouts limits and backtracking limits, the importance of avoiding the use of RegExs unless when it’s really needed is conveyed well enough.

## PRK Firmware: Keyboard is Essentially Ruby

By Hitoshi Hasumi

PRK firmware is the first keyboard firmware framework in ruby. You can basically write your keymap in ruby for your keyboard firmware. Also, you can add extra layers to your keyboard, essentially expanding your 50% layout keyboard to a much bigger virtual layout. There are also options to set rainbow or breathing effects to make your keyboard look cooler. The level of customization doesn't end here.
The author goes the extra mile with the custom Fibonacci key, which generates the Fibonacci number, and the custom Password key which generates a password every time you click those keys. The Ruby mode on the keyboard lets you execute small ruby codes from your text editor, literally letting you carry a ruby environment with you. The keyboard is essentially ruby, Indeed.

As anticipated, the talk was able to live up to its high expectations. The fact that the author, Hasumi-San is from Monstarlab, made it extra special for me as a fellow employee. Creator truly has taken Ruby to the next level. The first keyboard firmware framework in ruby will definitely be the one for the books.

## Ractor's speed is not light-speed

By Satoshi "moris" Tagomori

Ractor is designed to run ruby code in parallel, introduced from the newer version of Ruby. Even though it is still in the experimental phase, Ruby with Ractor sounds like an exciting prospect. The talk covered how Ractor will introduce new features which will boost the execution speed. The “shareable” objects (Modules, Classes) that can be shared between the ractors, which are running in parallel on multiple CPU cores will do the job for us.
Even though Ractor sounds like a very good thing that can happen to ruby, it is still a big leap away from being production-ready.

## Do regex dream of Turing Completeness?

By Daniel Magliola

The presentation was really a treat to the eye, demonstrating Conway's game of life by using complex ruby regex expressions. Once he was able to implement it to a great extent, now he was pushing for the bigger prize, Turing completeness, with all the power vested in him by the Regex expressions. Maybe the author Daniel Magliola wouldn't have cracked the German code during world war 2, but definitely wouldn't have gone down without a fight.

## Charty: Statistical data visualization in Ruby

By Kenta Murata

Ruby is well established and has proven itself as a widely accepted general-purpose programming language. But have you ever thought of building charts and plots with ruby, making it a decent data visualization tool? This is what the creator Kenta Murata-San achieves with his library, called Charty. Charty, a statistical data visualization tool, can create scatter and line plots (Relational plots), bar and box plots (Categorical plots), and distributional plots (histogram plots) for your data. The fact that Charty can generate these plots from a table makes it extra special.

## Conclusion

If I were to define RubyKaigi in a line, it would be like this: a marathon of an amazing and diverse lineup of talks. Even for me, as a seasonal Rubyist, it got me buzzing with excitement. While 2020 hasn’t been easy for anyone, fortunately, Ruby didn’t show any signs of slowing down. What the future holds for this underrated programming language is definitely exciting. The end.

## Reference

You can watch all the talks here:
https://www.youtube.com/playlist?list=PLbFmgWm555yYgc4sx2Dkb7WWcfflbt6AP
