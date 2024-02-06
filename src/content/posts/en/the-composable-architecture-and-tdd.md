---
title: "The Composable architecture and TDD. Can you make it work?"
tags:
  [
    ios,
    the composable architecture,
    test driven development,
    unit testing,
  ]
image: "@/assets/posts/the-composable-architecture-and-tdd/header.png"
authors:
  - oleksandr-mochalov
categories:
  - ios
date: 2024-10-26
---

Recently, our team's attention shifted towards The Composable architecture. This is a very powerful framework to build iOS applications. The goal of this article is to show that you can build the whole app logic without creating any UI with the help of TCA and TDD. It will not cover TCA basics and will be focused more on showing testing capabilities of TCA.

### Theory walkthrough
#### TCA
If you are reading this article I would assume that you already have some knowledge about what is TCA. Anyway here below you can find a quick brief with a diagram about this architecture.
![TCA Diagram](@/assets/posts/The-Composable-architecture-and-TDD/TCA-diagram.png)
The Composable Architecture is a framework that can be used to build state-driven, testable applications. In TCA, each feature is represented by a Store that holds the feature's State and Reducer function. Feature State is updated by sending an Action to the Reducer function. The Reducer function takes the current state and action as parameters and mutates the current state to produce a new state. The View observes the state and updates itself when the state changes. \
Additionally, the Store manages feature Environment dependencies (API client, database client, location manager, etc.) that can be invoked by the Reducer function, potentially producing Effects. Effects can, in turn, trigger another action to be sent to the Reducer. This simple flow ensures that feature data flows in a unidirectional manner and decouples the View from the business logic, which is crucial when developing a mobile application. \
Keeping this in mind, we can recognise one of the key advantages of TCA - Testability. TCA strictly separates the view from business logic, enabling it to be tested without the need to create any views or provide any runtime dependencies. \
If you want to dive into the TCA basics, here is a list of available resources that you can explore:
- [TCA Documentation](https://pointfreeco.github.io/swift-composable-architecture/main/documentation/composablearchitecture)
- [GitHub repo with CaseStudies](https://github.com/pointfreeco/swift-composable-architecture)
- [Pointfree videos](https://www.pointfree.co/collections/composable-architecture) 

#### TDD
I think that the best definition of what is TDD is given in <em>Test-Driven iOS Development with Swift</em> book by Dr. Dominik Hauser: 
> As the name suggests, in TDD, tests drive the development. This means that the developer writes code only because there is a test that fails. The tests dictate whether the code has to be written, and they also provide a measure when a feature is "done" - it is done when all tests for the feature pass.

The TDD flow is simple and consists of only three steps:
- **Red** - you start by writing a failing test. It needs to test a required feature of the software product that is not already implemented or an edge case that you want to make sure is covered.
- **Green** - in the green step, you write the simplest code that makes the test pass.
- **Refactor** - in the refactor step you improve the code. You remove duplication, extract common values, and so on. You should never skip this step and always think how you can improve your code. When you came up with an improvement, first make sure it's reflected in your test and then refactor an implementation. **Not vice-versa!**

### Practice
#### Testing State changes
Let's say I want to have a TextField where user will input a name of their friend. There also will be a Discover button that should be enabled only when input name is not empty.
##### ❌ Red:
First, let's start with implementing a failing test. Here, in the screenshot below, you can see how the TCA library conveniently displays failing tests. It highlights all state changes and fields that differ from the expected output.
![Failing test](@/assets/posts/The-Composable-architecture-and-TDD/failing-test-screenshot.png)
##### ✅ Green:
Now let's make this test pass by implementing the logic:
```swift
public struct HomeFeature: Reducer {
    public struct State: Equatable {
        @BindingState var name: String = ""
        var discoverButtonDisabled: Bool = true
    }
    
    public enum Action: Equatable, BindableAction {
        case binding(BindingAction<State>)
    }
    
    public var body: some ReducerOf<Self> {
        BindingReducer()
        Reduce { state, action in
            switch action {
            case .binding(\.$name):
                state.discoverButtonDisabled = state.name.isEmpty
                return .none
            case .binding(_):
                return .none
            }
        }
    }
}
```
All good, now the test passes:
![Passing test](@/assets/posts/The-Composable-architecture-and-TDD/passing-test-screenshot.png)
##### 📈 Refactor:
I want to refactor the `discoverButtonDisabled` boolean in this section. I anticipate that in the future, this Discover button will trigger an API call and be replaced by a `ProgressView`. To prepare for this, let's convert the boolean into an enum value. Again, first start by changing your test implementation and then move to the Feature. \
**Test:**
```swift
    func testNameInput() async {
        let store = TestStore(initialState: HomeFeature.State()) { // Create test store for HomeFeature
            HomeFeature()
        }
        
        // Send action to imulate user input
        await store.send(.binding(.set(\.$name, "Steave"))) {
            // Assert name was changed to 'Steave'
            $0.name = "Steave"
            // Assert that Discover button was enabled
            $0.discoverButtonState = .enabled // Compiler error will be raised.
        }
    }
```
**Implementation:**
```swift
public struct HomeFeature: Reducer {
    enum ButtonState {
        case enabled
        case disabled
        case loading
    }
    
    public struct State: Equatable {
        @BindingState var name: String = ""
        var discoverButtonState: ButtonState = .disabled
    }

    public enum Action: Equatable, BindableAction {
        case binding(BindingAction<State>)
    }

    public var body: some ReducerOf<Self> {
        BindingReducer()
        Reduce { state, action in
            switch action {
            case .binding(\.$name):
                state.discoverButtonState = state.name.isEmpty ? .disabled : .enabled
                return .none
            case .binding(_):
                return .none
            }
        }
    }
}
```


#### Testing effects
In TCA, Effects play a big role, and it is crucial to be able to test them. Let's take a look how this is done. The logic is that when user presses the Discover button, an API request is fired in order to get the data to be shown. If the API request is successful, then a sheet showing the data should be opened. Otherwise, it should show an alert with an error message.

**Successfull response**
```swift
    func testDiscoverWishesTapped() async {
        let store = TestStore(initialState: HomeFeature.State()) {
            HomeFeature()
        } withDependencies: {
            $0.apiClient = .testValue // Use mock API client
        }
        store.exhaustivity = .off(showSkippedAssertions: true) // Test only assertions
        await store.send(.discoverWishesTapped) // Nothing happens
        
        // User inputs name
        await store.send(.binding(.set(\.$name, "Steave"))) 
        
        // expected wishes
        let expected = try! await APIClient.mock.requestWishes()
        
        // User taps discover
        await store.send(.discoverWishesTapped) {
            $0.discoverButtonState = .loading
        }
        // Receive wishes and open sheet
        await store.receive(.wishesResponse(.success(expected)), timeout: .seconds(0.1)) {
            $0.discoverButtonState = .enabled
            $0.destination = .submitWish(SubmitWishFeature.State(name: "Steave", wishes: expected.wishes))
        }
        
        // Check if we actually created scoping between two features
        // by sending an action to child store through the parant
        await store.send(.destination(.presented(.submitWish(.selectWish(0))))) {
            $0.$destination[case: /HomeFeature.Destination.State.submitWish]?
                .selectedWish = .init(id: "mock1", title: "Health", iconName: "heart.square")
        }
    }
```
**Failing response**
```swift
    func testFailingDiscoverWishes() async {
        let store = TestStore(initialState: HomeFeature.State(name: "Steave")) {
            HomeFeature()
        } withDependencies: {
            $0.apiClient = .failing // set API client to failing
        }
        
        // Request is triggered
        await store.send(.discoverWishesTapped) {
            $0.discoverButtonState = .loading
        }
        
        // Failed response, expect that apiError will be shown
        await store.receive(.wishesResponse(.failure(APIError.callUnimplemented)), timeout: .seconds(0.1)) { 
            $0.discoverButtonState = .enabled
            $0.destination = .alert(.apiError)
        }
        
        // Test that user can close the alert
        await store.send(.destination(.presented(.alert(.ok)))) {
            $0.destination = nil
        }
    }
```
Now let's focus on key TCA features that are used here:
- `.receive()` - API response produces an effect with the result, wich has to be received in the test. This method will do it for you and you will be able to make assertions agains the new State. On the other hand if there is some Effect that was not received, the test will fail.
- `withDependency` - Setting this parameter is a great way to control dependencies you provide to a test. In this example I use different API client implementations. One for mock another one for failing.
- `exhaustivity` - When this parameter is set to .on, the test framework checks whether all possible code paths and conditions in your application have been tested. If you skip an assertion for some state value, the test will fail. In cases where it's set to .off, only the assertions you make will be tested.
- `destination` - This is a `@PresentationState` value which determines a state of presented sheet/alert. Nothing is presented when it's set to `nil`. In addition, it tests whether parent and child domains can exchange actions between each other by sending the `.selectWish` action from the parent to the child. In TCA, this is basically called scoping.

#### Testing Navigation stack
As you might know, the TCA framework provides an out-of-the-box solution for stack navigation with the help of `StackState`. Essentially, it holds the states of all child domains and allows you to push and pop them, as well as send actions between them. Because it's state-driven, you can easily test it. \
In the following example, the user is presented with a list of wishes. The user is able to select only one wish and after pressing the Proceed button, they are taken to results screen. Let's take a look how this behaviour can be tested.
```swift
    func testProceedButtonTapped() async {
        let store = TestStore(initialState: SubmitWishFeature.State(name: "Steave", wishes: wishes)) {
            SubmitWishFeature()
        }
        // Nothing happens if nothing is selected
        await store.send(.proceedButtonTapped)
        
        // User selects a wish
        await store.send(.selectWish(0)) {
            $0.buttonState = .enabled
            $0.selectedWish = .init(id: "mock1", title: "Health", iconName: "heart.square")
        }
        
        // Request is sent to save selection on backend side
        await store.send(.proceedButtonTapped) {
            $0.buttonState = .loading
        }
        
        // Receive successfull response and open Result screen.
        await store.receive(.saveWishResponse(.success(.init())), timeout: .seconds(0.1)) {
            $0.buttonState = .enabled
            $0.path[id: 0] = .result(.init(name: "Steave", wish: .init(id: "mock1", title: "Health", iconName: "heart.square")))
        }
    }
```
Once response is received a new screen is pushed to navigation stack. We can test this by getting the first element from the `path` and asserting against its state. 

Moreover, with TCA you can test the navigation by sending push/pop as well as child domain actions directly. Check out the following example:
```swift
    func testResultNavigation() async {
        let store = TestStore(initialState: SubmitWishFeature.State(name: "Steave", wishes: wishes)) {
            SubmitWishFeature()
        }
      
        // Directly send push action to the store
        await store.send(.path(.push(id: 0, state: .result(ResultWishFeature.State(name: "Steave", wish: .init(id: "mock1", title: "Health", iconName: "heart.square")))))) {
            $0.path[id: 0] = .result(ResultWishFeature.State(name: "Steave", wish: .init(id: "mock1", title: "Health", iconName: "heart.square")))
        }
        
        // Send action into child domain and assert State changes.
        await store.send(.path(.element(id: 0, action: .result(.shareInMyProfileTapped)))) {
            $0.path[id: 0, case: /SubmitWishFeature.Path.State.result]?.isSharedInMyProfile = true
        }
        
        // Pop from child domain and assert navigation stack is empty
        await store.send(.path(.popFrom(id: 0))) {
            $0.path = StackState()
        }
    }
```

#### Conclusion
Here we've covered testing of the most esential parts of any iOS application:
- State changes by user input or user interaction
- State changes by Effects
- Dependency management inside tests
- Presentation of sheets and alerts
- Navigation stacks testing

All of these aspects are covered by the TCA framework out-of-the-box. Combined with a strong separation of business logic from the UI, it ensures the full testability of iOS apps. Moreover, TCA employs scoping, enabling the exchange of data and actions between different parts of the application. Essentially, it transforms the entire app into a global state, consisting of states from standalone features. This allows developers to test comprehensive scenarios involving different features rather than small, isolated parts of the app. This capability of TCA is crucial when employing Test-Driven Development for application development.
