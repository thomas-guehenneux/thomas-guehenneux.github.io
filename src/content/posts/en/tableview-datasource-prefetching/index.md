---
date: 2022-01-14
title: UITableView DataSource Prefetching
tags: [ios, swift, uitableview, uicollectionview, datasource]
image: './header.webp'
authors:
- rokon-uddin
categories:
- ios
---

Apple has introduced an API for prefetching the data for a _UITableView_ or _UICollectionView_ in iOS 10. This is a short story about how to implement the _UITableViewDataSourcePrefetching_ protocol. Let's learn how to make our apps buttery smooth, richer, and faster by using new features in _UITableView_ and its sibling, _UICollectionView_.

### Overview

To implement prefetching, we conform to the _UITableViewDataSourcePrefetching_ protocol in our ViewController, just like _UITableViewDataSource_ and _UITableViewDelegate_. That enables UITableView’s data source to begin loading data for cells before _tableView(\_:cellForRowAt:)_ data source method is called.

### Getting Started

Set your ViewController to TableView prefetch datasource

```swift
tableView.prefetchDataSource = self
```

Initiate asynchronous loading of the data required for the cells at the specified index paths in your implementation of _tableView(\_:prefetchRowsAt:)_

```swift
func tableView(_ tableView: UITableView, prefetchRowsAt indexPaths: [IndexPath]) {
	for indexPath in indexPaths {
		if let _ = loadingOperations[indexPath] { return }
		if let dataLoader = dataStore.loadImage(at: indexPath.row) {
			loadingQueue.addOperation(dataLoader)
			loadingOperations[indexPath] = dataLoader
		}
	}
}
```

Cancel pending data load operations when the TableView informs you that the data is no longer required in the _tableView(\_:cancelPrefetchingForRowsAt:)_ method

```swift
func tableView(_ tableView: UITableView, cancelPrefetchingForRowsAt indexPaths: [IndexPath]) {
	for indexPath in indexPaths {
		if let dataLoader = loadingOperations[indexPath] {
			dataLoader.cancel()
			loadingOperations.removeValue(forKey: indexPath)
		}
	}
}
```

### Loading Data Asynchronously

Unlike _tableView(\_:cellForRowAt:)_, the _tableView(\_:prefetchRowsAt:)_ method is not necessarily called for every cell in the TableView. It is called for cells that are not visible on the screen. Implementation of _tableView(\_:cellForRowAt:)_, therefore, must be able to handle the following potential situations

*   Data has been loaded via the prefetch request and is ready to be displayed.

```swift
...  
// Has the data already been loaded?  
if let image = dataLoader.image {
	cell.updateAppearanceFor(image)
	loadingOperations.removeValue(forKey: indexPath)  
}  
...
```

*   Data is currently being prefetched but is not yet available.

```swift
...  
else {
	// No data loaded yet, so add the completion closure to update the cell once the data arrives
	dataLoader.loadingCompleteHandler = updateCellClosure  
}  
...
```

*   Data has not yet been requested.

```swift
...
// Need to create a data loaded for this index path  
if let dataLoader = dataStore.loadImage(at: indexPath.row) {
	// Provide the completion closure, and kick off the loading operation
	dataLoader.loadingCompleteHandler = updateCellClosure
	loadingQueue.addOperation(dataLoader)
	loadingOperations\[indexPath\] = dataLoader  
}
...
```

To handle all of these situations Operation is used to load the data for each row. We create the Operation object and store it in the prefetch method. The data source method can then either retrieve the operation and result or create a new operation if doesn’t exist.

```swift
class DataLoadOperation: Operation {
	var image: UIImage?
	var loadingCompleteHandler: ((UIImage?) -> ())?
	private let imageModel: ImageModel

	init(_ imageModel: ImageModel) {
		self.imageModel = imageModel
	}

	override func main() {
		if isCancelled { return }
		guard let url = imageModel.url else { return }
		downloadImageFrom(url) { (image) in
			DispatchQueue.main.async() { [weak self] in
				guard let `self` = self else { return }
				if self.isCancelled { return }
				self.image = image
				self.loadingCompleteHandler?(self.image)
			}
		}
	}
}
```

<figure>
  {{ youtube-link="aD1EKjRoDks" }}
  <figcaption style="text-align: center;">
  	Seamless Prefetching...!!!
  </figcaption>
</figure>

### Conclusion

I hope this blog helped you understand how to implement the prefetching protocol. I tried to be very brief and focused. If you want to know more about it, I encourage you to [watch Apple’s WWDC session](https://developer.apple.com/videos/play/wwdc2016/219/) on the prefetching protocol.

👑 [KEEP CALM AND HERE IS MY CODE](https://github.com/rokon-mlbd/TableViewDataSourcePrefetching)
