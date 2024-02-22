---
date: 2020-10-07
title: API First
tags: [api, development, api-first, engineering]
image: './header.webp'
authors:
  - rasmus-ebbesen
categories:
  - solution-architecture
---

We've been building APIs for a long time, enabling our mobile software solutions to communicate with each other across their respective platforms. For years these APIs have been built as part of a "mobile first"-approach, under the guiding light of an internally defined, living document, our so called "API Manifesto", highlighting everything from how URIs are formed to response body formatting and response codes. A recent change in how we document APIs internally, from simple markdown descriptions of individual endpoints to fully fletched OpenAPI specifications and the ability to spawn mock-servers on the fly, has sparked thoughts on how APIs are treated overall in the context of project development within the organization.

Over the past 10 years, being involved with developing and maintaining APIs, I've seen a great deal of approaches to this discipline, some better than others. Some of the worst examples that comes to mind, emerges from different mindsets on how software development should be executed eg. "We need to ship this fast!" (sloppiness), "We need more developers on this to speed up the process" (messy, inconsistent) and "We don't have a mobile developer available at the moment, can we fix this in the API instead?" (platform inconsistency). With no common understanding of "how and why" and "dos and don'ts", the outcome is often disastrous. Yes, in the end it might do the job, but it is in no way a pretty sight, and maintaining these remnants can be a tedious affair.

## The Contract

Seen from the perspective of the vendor of services, executing like the examples given above can lead to an immense amount of frustration. Nothing can make a developer tick off more than when presented to source code that doesn't follow expected agreements or when being expected to build it in an unexpected way. The consumers of APIs also have different opinions to what can be expected in responses from API-services.

With an API-First approach, the involved parties make a mutual agreement on the structure and behavior of the service. This agreement is the ultimate reference, "the law", when doubt arise. It can be utilised to easen decision making regarding future development of the service, referring to original structure, as well as a tool to resolve disputes regarding data structure, response codes and HTTP methods.

## The Product

Many sources on API First underlines treating the API as a "first class citizen" when building software projects, and this is a term I really like. Basically it means that the API is, if not solely then a part of, the main product that is being developed. This means that it is being managed like other primary aspects of a project. Mark O'Neill, VP of Innovation at AXWAY explains it really well:

{{ youtube-link="RP-soXCWoIs" }}

## The Future

I can imagine a lot of the projects, large and small, I've been working on over the years would have benefited from an API development phase under strict management. Even though you can argue that many smaller productions doesn't really require a fully managed development of an API, many of the elements involved in thinking "API first" are to me quite intriguing, enabling better maintainability and transparency across the different teams involved. With a common contribution from people with multiple perspectives (vendor and consumer) on how the API behaves, it is my belief better results we be created.

I do not expect a paradigm shift like this in the company to happen over night, but this article could potentially become the starting point of such a shift. A lot of well written articles about API first already exists and can be found by a simple [google search](https://www.google.com/search?q=api+first), so these are my 5 cents on how my life could become a little better by adopting these ideas.

## Further reading and references

- [Understanding the API-First Approach to Building Products](https://swagger.io/resources/articles/adopting-an-api-first-approach/)
- [What is an API First definition?](https://apifriends.com/api-creation/api-first/)

_Header photo by [CDC on Unsplash](https://unsplash.com/photos/I-SoYkFjVI0)_
