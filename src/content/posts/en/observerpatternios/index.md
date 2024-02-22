---
date: 2019-03-19
title: A dive into the Observer Pattern in iOS applications
tags: [ios, observable, observer, software patterns]
image: './header.webp'
authors:
  - andrei-hogea
categories:
  - ios
---

Often when developing iOS applications with more complex requirements we may encounter the need to react to, and perform UI updates on, not so easily accessible UI components. Another example could be that we must update an object outside our currently focused scene, perhaps created by a scene a few levels back in our view hierarchy.

A common way to solve this is by adapting our code to a reactive approach and using a reactive framework, such as [RxSwift](https://github.com/ReactiveX/RxSwift).
But what happens when we don't need everything that these frameworks provide to us, or we just aren't comfortable with using a reactive framework?

A solution to this can be created by implementing the _Observer Pattern_.

### About the Observer Pattern

Observer is a behavioral design pattern. It specifies communication between objects: observable and observers. An observable is an object which notifies observers about the changes in its state. For example, in a shopping app, we need to always be notified when the user adds or removes a product from the cart. The user action in this case will be what changes the state of the upcoming purchase, which again causes the cart to be notified.

Today we will be going over how to implement this pattern in a simple shopping iOS application.

## Let's Get Started

Before we get started with the actual code implementation of this pattern, lets see what our requirements are.

We will need to be able to:

- Register an Observer
- Notify/Update the Observer when an event happens
- Remove the Observer and discard it when we don't need it anymore

As well I have created a demo project that can be downloaded [here](https://github.com/nodes-ios/ObserverPattern-Demo/tree/start-project). This will allow us to focus strictly on implementing the patter and the functionality related to it.

### Creating a Disposable

Because we want our Observer to auto deinitialize when we remove any scene in our app holding a reference to it, we are going to start by creating a `Disposable`. In your project go ahead and create a `Disposable.swift` file and add the following code:

```swift

import Foundation

class Disposable {

    // callback called automatically on deinit
    private let dispose: () -> ()

    // on init create a callback that we will use to remove the observer when the disposable will deinitialize
    init(_ dispose: @escaping () -> ()) {
        self.dispose = dispose
    }

    deinit {
        dispose()
    }

    // call add when having multiple Observables in the same class
    func add(to disposable: inout [Disposable]) {
        disposable.append(self)
    }
}

```

We will be using the `Disposable` to return as a reference when observing an event and as well to remove the observer when the disposable will be deinitialised.

### Creating the Oberver

For our app to be able to observe changes we need a way to register an observer and to do so we need to create it first. So let's get started.

```swift
class Observer<ObserverValue> {

    // the associated value for the observer
    private var value: ObserverValue

    init(_ value: ObserverValue) {
        self.value = value
    }
}
```

In the above snippet we have layed out the base for our observer. Here we are declaring the generic class `Observer` and create its initialiser that takes a generic value.

Now that we can create an observer, let's see how we can subsribe to a change event.

```swift

// typealias for our observer id
typealias ObserverId = UInt

// typealias for our observe callback
typealias ObservableCallback = ((ObserverValue) -> Void)

// lock will prevent the simultanious registration of observers from multiple threads.
private let lock = NSLock()

// an dictionary of all the registered observers
private var observers: [ObserverId: ObservableCallback] = [:]

private var sequentialId: ObserverId = 0

func observe(_ values: @escaping ObservableCallback) -> Disposable {
    // aquire a lock
    lock.lock()
    defer {
        // increase sequentialId to guarantee an unique identifiers for our observers
        sequentialId += 1
        // relinquishes a previously acquired lock.
        lock.unlock()
    }

    // add the observer to our observers dictionary and assign it the current value
    let id = sequentialId
    observers[id] = values
    values(value)

    let disposable = Disposable { [weak self] in
        // remove observer on deinit
        self?.observers[id] = nil
    }

    return id
}

```

Above we have created `func observe(_ values: @escaping ObservableCallback) -> Disposable`. This function will allow us to safely register an observer, that in the following step we will notify when an update to our value happens. The following `func update(_ value: ObserverValue)` we will call to update the current value of our observer. When an update events happens we then will notify all our registered observers about the update with the help of `func notify()`.

```swift
func update(_ value: ObserverValue) {
    self.value = value
    notify()
}

private func notify() {
    for observer in observers.values {
        observer(value)
    }
}
```

Once our observer is created we can now use it to subscribe to an update event. In our app we will use this to ease the way we add the items selected by the user to the cart.

### Add the Observer to Our Project

Now in our project we can start including the observer. We are going to create an observer for the user selected products in our scenes root, to be able to pass it around via initialisers to our `UIViewControllers`.

```swift
let productsObserver: Observer<[Product]> = Observer([])
```

With the observer created we now need a way to pass it to our `UIViewControllers`, so go ahead an modify the `class func instantiate(productsObserver: Observer<[Product]>)` in our `UIViewControllers` to include the `productsObserver` as a parameter, then declare the `var productsObserver: Observer<[Product]>!` in the `UIViewController` as well. Your instantiate function for `ProductCategoriesViewController` should look similar to this now.

```swift
private var productsObserver: Observer<[Product]>!

// MARK: - Init

class func instantiate(productsObserver: Observer<[Product]>) -> ProductCategoriesViewController {
    let name = "\(ProductCategoriesViewController.self)"
    let storyboard = UIStoryboard(name: name, bundle: nil)
    let vc = storyboard.instantiateViewController(withIdentifier: name) as! ProductCategoriesViewController
    vc.productsObserver = productsObserver
    return vc
}
```

### Subscribe to an Event

For our cart to update in real time, we will need to subscribe to a change event on our observer. In order to do so we need to call the `observe` function on our observer in our `SmallCartViewController`.

In the `viewDidLoad` go ahead and add the following snippet:

```swift
disposable = productsObserver.observe { (products) in
    self.productsLabel.text = "\(products.count) items"
    var price = 0.0
    products.forEach({ price += $0.price })
    self.priceLabel.text = Current.priceFormatter.string(from: price as NSNumber)!
}
```

The observe function will notify us via it's callback whenever a change in the associated value of our observer happens. As well the function returns a value of type `Int` that we will use to hold a reference to our observable.

```swift
private var disposable: Disposable!
```

### Update Observers Associated Value

Now that we are listening for events and we have the observer declared in our app, we need a way to add the user selected products to the current value of our observer. In order to do so we would need to get the current array of products and append a new product to it. Currently we don't have a way to get the current value of our observer, but by adding the following function in our `Observer` class we can do so:

```swift
func getValue() -> ObserverValue {
    return value
}
```

The `func getValue() -> ObserverValue` will return the current associated value with our observer.

Now in our `ProductsViewController` in the `didSelectRowAt` delegate function for our `UITableView` we can update the associated value:

```swift
func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
    tableView.deselectRow(at: indexPath, animated: false)
    // get the selected product
    let product = products[indexPath.row]
    // get the current products in cart
    var productsInCart = productsObserver.getValue() as [Product]
    // add new selected product to the current products
    productsInCart.append(product)
    // update the associated value
    productsObserver.update(productsInCart)
}
```

By calling `productsObserver.update(productsInCart)` we will automatically update the associated value and notify all the registered observers.

Go ahead an run your code now. Navigate to our products and select one or more of them, you will see how the cart will update with the number of selected products and the current total price for the products.

## Final Notes

You have now made it all the way to the end of this post and hopefully you will have a clear picture of how to implement the Observer pattern.

Don't forget to download our final project and compare our results. :)

[Final Project](https://github.com/nodes-ios/ObserverPattern-Demo/tree/develop)

Hope to see you next time!
