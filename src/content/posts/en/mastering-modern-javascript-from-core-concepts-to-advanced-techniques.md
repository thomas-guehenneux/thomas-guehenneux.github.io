---
title: "Mastering Modern JavaScript: From Core Concepts to Advanced Techniques" 
tags: [frontend, development, engineering]
image: "@/assets/posts/mastering-modern-javascript-from-core-concepts-to-advanced-techniques/header.jpg"
authors:
  - genita-tahiri
categories:
  - frontend
date: 2023-12-06
--- 

Welcome, fellow developers! Here's a deep dive into the core concepts of JavaScript and how TypeScript could enhance them. Regardless of the level of knowledge, mastering the foundations of JavaScript is essential. We want to delve deep into the core concepts of JavaScript and understand how TypeScript changes them. A superset of JavaScript, TypeScript delivers substantial enhancements that give us a full view of the language's capabilities.

This journey's goal is to teach you a thorough understanding of JavaScript's underpinnings as well as the significant enhancements made by TypeScript. By the time you complete reading this article, you will have the knowledge required to apply both in your development projects. Now let's start this illuminating voyage.

# **Basic principles of JavaScript**

JavaScript was first primarily used as a simple scripting language to improve web interactivity. However, it lacked a number of sophisticated capabilities found in contemporary programming languages. JavaScript has now evolved into a potent tool for front-end and back-end development with the addition of TypeScript.

Static typing, interfaces, enums, and generics are among the fundamental concepts introduced by TypeScript, a statically typed superset of JavaScript.

It is now an essential component of contemporary online and application development and supports functional, object-oriented, and asynchronous programming paradigms.

There are three main parts to a core JavaScript engine:
- Call stack 
- Memory/variable environment 
- Thread of execution

We will address each of these elements in turn in the following sections, offering in-depth analyses for a thorough grasp of how TypeScript improves JavaScript development.

### Unlocking the Power of Reusable Code: Exploring JavaScript Functions with TypeScript

Within the realm of programming, functions perform as standalone programs when utilised, particularly in JavaScript (which is now further enhanced by TypeScript), and also code becomes more robust and dependable with greater type safety.

Two key considerations need to be made in order for this to function in TypeScript:

- **Thread of Execution:** This idea entails going through the TypeScript code for the function line by line, much like when you follow a recipe to the letter.

- **Memory:** This memory space enables the function to handle and store crucial information or data needed for its activities, much like a defined storage area. Type annotations in TypeScript facilitate the definition and administration of data structures, improving memory management.

**Execution context** is the term used in TypeScript to describe the confluence of these two fundamental components. To ensure that the function does its assigned tasks precisely and type-safely, this framework serves as its TypeScript operating environment.

### A Detailed Overview of JavaScript and TypeScript Function Definition and Usage

JavaScript and its powerful extension TypeScript both employ the 'function' keyword and the function name to build functions. The syntax for the short arrow function (=>) is an alternative.

Just remember that in order to use a function in TypeScript—that is, to call, execute, or run it—it must always be enclosed in parenthesis. Code reliability and maintainability are enhanced when appropriate types of arguments are passed, thanks to TypeScript's type system. With TypeScript, you may define and use functions with more confidence that your code is valid.

### Tracking Functions in the JavaScript CallStack

The "global" main function in JavaScript is where all code runs. To comprehend how JavaScript manages this global environment during the execution of a function, consider the "Call Stack".

The stack of plates that represents the call stack is made up of individual function calls. As an illustration:

```javascript
function greet(name) {
  console.log(`Hello, ${name}!`);
}

function sayHello() {
  greet("Alice");
  greet("Bob");
}

sayHello();
```

- The execution of `sayHello()` adds to the call stack. Two calls performed inside of `sayHello()` to `greet()` have also been added to the Call Stack. The Call Stack tracks the order in which functions are executed.
- Handling Nested Functions: The Call Stack efficiently handles nested function management. Every function is removed from the stack after it is finished. For example:
  - `sayHello()` is now included in the Call Stack.
  - `sayHello()` now includes `greet("Alice")`.
  - `greet("Alice")` terminates and is removed.
  - An additional `greet("Bob")` is attached.
  - `greet("Bob")` terminates and is removed.
  - Upon completion of `sayHello()`, the Call Stack is cleaned.

The Call Stack is essential for debugging and code optimisation since it ensures that functions in JavaScript's global context are executed in a logical order.

# **Comprehending Higher Order Functions & the JavaScript Callback**

Passing a function as an argument to another function can look strange, especially when execution happens later. However, **"callback functions."** is the foundation for asynchronous programming with TypeScript and JavaScript.

Callback functions, or functions that are passed as arguments, are crucial for managing asynchronous tasks in JavaScript and TypeScript. For example, they specify what should happen after an API request is processed or a user activity is finished.

These days, higher-order functions like map, filter, and reduce are part of the toolkit in TypeScript and JavaScript. Also, Promises and the succinct async/await syntax have strong type support in TypeScript.

### Demystifying JavaScript's Functional Programming: Unleashing Pro-Level Functions and Technical Interview Success.

Using functions, which makes it possible to use strong pro-level functions like reduce, filter, and map, is one of the most misunderstood topics in JavaScript. Functions are important to functional programming. A function is the foundation of a professional mid- to senior-level engineering interview and the means by which our code becomes more declarative and legible in Codesmith. 

Using the following syntax, one could write a function that returns the square of 10:

```javascript
function tenSquared() {
  return 10*10;
}

tenSquared() // 100
```

```javascript
function nineSquared() {
  return 9*9;
}

nineSquared() // 81 😞

// And an 8 squared function? 125 squared?
// What principle are we breaking? DRY (Don't Repeat Yourself)
```

```javascript
// We can generalize the function to make it reusable
function squareNum(num) {
  return num*num;
}

squareNum(10); // 100
squareNum(9);  // 81
squareNum(8);  // 64
```

### Generalizing Functions

Code flexibility in JavaScript and TypeScript is largely dependent on the idea of generalising functions. "Parameters" (placeholders) allow us to perform our functionality on any data without having to decide on it beforehand.

When we run the function, supply a real value ('argument').

This same approach applies to higher-order functions.

- Until we run our function, we might not want to decide exactly what part of our functionality is.

### Understanding Higher-Order Functions in JavaScript & TypeScript

Higher-order functions are essential to TypeScript and functional programming alike. They take functions as parameters and return functions as outcomes, which improves the flexibility and reusability of the code.
Code is kept DRY (Don't Repeat Yourself) by using these utilities to simplify it. They make legible code possible through reduce, filter, and map operations. Add to this combination type safety with TypeScript.

Knowing higher-order functions is essential for professional interviews. Additionally, they are essential to asynchronous JavaScript, supporting ideas like async/await and Promises.

Whether for interviews or contemporary online programmes, knowing higher-order functions is essential to becoming proficient in JavaScript and TypeScript.

Understanding JavaScript's Arrow Functions:

```javascript
// Introducing arrow functions - a shorthand way to save functions

function multiplyBy2(input) { return input * 2; }

const multiplyBy2 = (input) => { return input*2 }

const multiplyBy2 = (input) => input*2

const multiplyBy2 = input => input*2

const output = multiplyBy2(3) // 6
```

`createMultiplier`, a higher-order function, uses arrow syntax to return another function. This function multiplies a number by a predetermined amount. One specific example of a `createMultiplier` that doubles any input integer is `multiplyBy2`. By utilising `multiplyBy2(3)`, it is evident that arrow functions can be employed to generate specialised functions that exhibit elegant behaviour, such as returning 6.

# **Understanding JavaScript Closures (Scope and Execution Context)**

A closure in JavaScript is a function that works even after the outer function has finished running, allowing it to access variables from its outer scope.

In JavaScript, a closure is a function that returns from the execution of the outer function with access to variables from its outer scope.

Closures are highly helpful even though they were once regarded to be tough. They are now commonly understood. In order to construct reusable modules and improve code structure, they are usually required to maintain private and well-organized data. The usage and understanding of closures in modern JavaScript has increased.

Closures perform Memory-Related tasks

- We establish a live store of data (local memory/variable environment/state) for the function's execution context when our functions are invoked.
- After the function has finished running, its local memory is removed (apart from the returned value).

But what if our functions could save real-time data between calls?

This would allow our function definitions to be linked to a cache or permanent memory.

But it all starts with us returning a function from another function.

The Connection:

Upon definition, a function is bound to the Local Memory (sometimes called the "Variable Environment") in which it is defined.

The "Backpack":

```javascript
function outer() {
    let counter = 0;
    function incrementCounter() {
        counter++;
    }
    return incrementCounter;
}

const myNewFunction = outer();
myNewFunction();
myNewFunction();

const anotherFunction = outer();
anotherFunction();
anotherFunction();
```

We obtain `incrementCounter's` function definition from `outer` and give it a new name, `myNewFunction`.

- The link to `outer's` live local memory is maintained; it is 'returned out' and attached to `incrementCounter's` function definition.
- As a result, the function `outer's` local memory is still linked to `myNewFunction` even if its execution context has long ago terminated.
- Running `myNewFunction` in global mode causes it to look first in its own local memory and then in its `"backpack"`, as would be expected.

Thanks to closure, our functions now have enduring memory and an entire new toolkit for writing well-written code.

# **Understanding Asynchronous and Event Loop in JavaScript and TypeScript**

Using TypeScript and JavaScript for asynchronous programming is necessary to create applications that are responsive and efficient. Asynchronous operations enable activities to be completed concurrently without interfering with the main thread of processing, in contrast to synchronous operations that run code one after the other.

An essential part of TypeScript and JavaScript, the event loop makes sure that asynchronous operations are carried out without blocking, resulting in responsive behaviour and economical use of resources.

Promises, the async/await syntax, and the event loop simplify asynchronous tasks in modern JavaScript and TypeScript. This improves the readability and maintainability of the code while guaranteeing smooth performance.

**Important elements in this procedure consist of:**

One essential ES6 feature that makes writing asynchronous programming easier is promises.
- Asynchronicity: The ability to handle concurrent tasks is what enables dynamic web applications.
- Event Loop: The asynchronous task management triage mechanism built into JavaScript.
Web browser APIs, microtask queues, and callback queues are crucial parts of asynchronous process management.

The three primary components of the JavaScript engine are as follows:
- Thread of execution 
- Memory and variable environment
- Call stack

Beyond the capabilities of ECMAScript 5 (ES5), advancements such as Promises and a more efficient Event Loop have been included in more recent iterations of JavaScript and TypeScript. In comparison to the ES5 era, these improvements increase the efficiency and maintainability of handling asynchronous operations and apply to both Node.js and web browsers.

**ES6+ Solution with Promises**

Promises provide a two-pronged approach to asynchronous task handling in modern JavaScript and TypeScript.
They start web browser work in the background.
- Without delay, they provide a placeholder object, or promise.

These Promises adhere to the following guidelines for running code that is deferred asynchronously:
A microtask queue is used to store promise-deferred functions, and a task queue (called the Callback queue) is used for callback functions once the associated Web Browser Feature (API) has finished.
Functions are added to the Call stack (that is, executed) once all global code has run and the Call stack is empty. This state is kept an eye on by the Event Loop.

Promises let JavaScript and TypeScript do the following things when used with Web APIs, Callback & Microtask Queues, and the Event Loop:
- Develop non-blocking programmes that enable the execution of multiple threads of code concurrently without waiting.
- Take care of scheduling the completion of Browser features automatically, guaranteeing effective code execution.
Act as the foundation for contemporary online applications, making it possible to create web solutions quickly and without stuttering.

# **Classes & Prototypes (OOP)**

For object-oriented programming, JavaScript has historically employed prototypes, which may be confusing to developers used to working with class-based systems. 

However, object-oriented programming in JavaScript became more recognisable to developers of other languages with the release of ECMAScript 6 (ES6), which introduced a class syntax. Although JavaScript classes still use prototypes internally, the new syntax offers a more organised and understandable method for generating and extending objects.

Important things to remember:

- Classes are a commonly used paradigm for structuring complex code in TypeScript and JavaScript.
- Prototype chain, an efficient tool in and of itself that enables the replication of Object-Oriented Programming (OOP), is one such background-working component.
- The difference between __prototype__ and __proto__ must be understood for effective OOP in JavaScript and TypeScript.
- Programming is made easier by using the `new` and `class` keywords, which automate the generation of objects and methods.

# __proto__:

Every JavaScript object, including arrays, functions, and other objects, has a property called __proto__. JavaScript initially verifies that a property or function on an object actually exists before allowing you to access it.

# __prototype__:

In TypeScript and JavaScript, every function has the property prototype. The prototype property of a constructor function becomes the prototype of the newly generated object when it is defined and instances are created using the new keyword. 

A Guide for Writing and Using Code
1. Save data (for example, user 1 and user 2's quiz scores).
2. Use the data to run code (functions) (e.g., enhance user 2's score)

Simple! Then why is development challenging? I have to save a lot of users in a quiz game, along with administrators, quiz questions, quiz results, league tables, and other data and functionality.

Where's the functionality when I need it in 100,000 lines of code?
- How can I ensure that the functionality is only applied to appropriate data?

To make things simple, let's say I save each user's specific data in my app:

| User  | Name       | Score |
|-------|------------|-------|
| user1 | Tim        | 3     |
| user2 | Stephanie  | 5     |

<br>
And (simplifying again!) the features I have for every user are: greater functionality (there would actually be a multitude of features!).

How might my entire set of features and information be in one place?

```javascript
// Solution 1. Generate objects using a function

function userCreator(name, score) {
    const newUser = {};
    newUser.name = name;
    newUser.score = score;
    newUser.increment = function() {
        newUser.score++;
    };
    return newUser;
}

const user1 = userCreator("Will", 3);
const user2 = userCreator("Tim", 5);
user1.increment();
```
**Problems**: Our computer has to allocate memory for all of our data and features each time we add a new user. But all we are doing is copying functions. Does a better approach exist?

**Advantages**: It's easy to understand and consider!

```javascript
// Solution 2: Using the prototype chain

function userCreator(name, score) {
    const newUser = Object.create(userFunctionStore);
    newUser.name = name;
    newUser.score = score;
    return newUser;
}

const userFunctionStore = {
    increment: function() { this.score++; },
    login: function() { console.log("Logged in"); }
};

const user1 = userCreator("Will", 3);
const user2 = userCreator("Tim", 5);
user1.increment();
```

## Understanding TypeScript to Enhance JavaScript Development

We studied the hard JavaScript sections as well as the basic concepts and challenges of this dynamic language. All things considered, the rise in popularity of TypeScript, is one of the most significant advancements in JavaScript lately.

Adding TypeScript to a project has several advantages:

1. Maintainability of Code
2. Enhanced Developer Productivity
3. Improved Collaboration
4. Scalability
5. Reduced Number of Bugs
6. Ecosystem and Community

Furthermore, TypeScript facilitates faster code reviews, more comprehensible code, and easier onboarding of new team members—all of which enhance developer collaboration.

# Conclusion

As a result of our thorough investigation of JavaScript and its potent extension, TypeScript, we have gained a profound understanding of the underlying ideas that underpin this adaptable programming language. We have studied the management of intricate processes by JavaScript, thanks to its asynchronous features such as callbacks and higher-order functions. The event loop and closures, which are crucial to comprehending JavaScript's execution mechanism, have also been clarified.

We are more equipped to take on challenging coding tasks as we continue to explore the nuances of JavaScript, enhanced by TypeScript's extensions. Our objective is to develop applications that are resilient, adaptable, and scalable to the demands of the ever-changing digital landscape. So, fellow coders, let's embrace TypeScript and JavaScript to the fullest and use their combined strength to innovate and change the digital landscape.

Happy Coding!



_Article Photo by [Unsplash](https://unsplash.com)_
