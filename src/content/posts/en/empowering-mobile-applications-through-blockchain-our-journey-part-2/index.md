---
date: 2023-08-01
title: "Empowering Mobile Applications through Blockchain: Our Journey, Part 2"
tags: [mobile, blockchain, web3, ios, android, prototype]
image: './header.webp'
authors:
  - harol-higuera
  - lindsay-diarmaid
  - vivien-fabing
  - enric-maciaslopez
categories:
  - ios
  - android
---


Welcome back to our blog series on blockchain technology! In our previous post, we explored the fundamentals of blockchain and its potential impact on various industries. If you haven't read it yet, you can find it [here](https://engineering.monstar-lab.com/en/post/2023/07/12/Empowering-Mobile-Applications-through-Blockchain-Our-Journey-Part-1/). Today, we're excited to delve deeper into the practical implementation of blockchain by discussing the development process of our prototype mobile application. The focus of this app is to provide users with a secure and transparent way to verify their pension and tax records using blockchain technology.

The main features of the app are:

- User authentication using a QR code or user id
- Logout process
- Show tax and pension details such as the paid amount, timestamp and a note with relevant information about the records made in the Blockchain.

# App + Blockchain development

By integrating blockchain into mobile apps, businesses and organizations are paving the way for a new method of handling their data. Using the core features of blockchain, such as decentralization and immutability, enables a more transparent and secure environment for recording digital transactions and managing digital assets.

In the current landscape, there are various methods and technologies available to connect mobile applications to blockchains. Here are some common approaches:

- SDKs provide developers with pre-built libraries and tools to integrate blockchain functionality into their mobile apps.
- APIs allow mobile apps to communicate with blockchain networks and access their functionalities. For example, the Coinbase API facilitates interaction with blockchain networks.
- Integration with Web3 wallets, such as MetaMask, enables seamless interaction with blockchain networks.

Currently, there are functional open-source libraries available for integration into mobile apps, regardless of whether they are natively developed or built using cross-platform technologies like Flutter. Here are some popular options:

- For iOS, [Web3swift](https://github.com/web3swift-team/web3swift) provides the necessary tools to connect to smart contracts and execute transactions directly from the app.
- For Android, [Web3j](https://github.com/web3j/web3j) is a Java library that enables Android developers to interact with Ethereum blockchains. It offers features such as wallet creation, transaction handling, and smart contract invocation.
- In the case of Flutter, [web3dart](https://pub.dev/packages/web3dart) is a library that allows developers to interact with Ethereum blockchains. It offers functionalities such as wallet creation, transaction handling, and smart contract interaction within Flutter apps.

# What can be done in mobile apps that connect to blockchain?

Here are some of the most common operations carried out in a mobile application that connects to a blockchain:

- **Wallet Management**: Apps connected to blockchains often include functionality for managing digital wallets. Users can create wallets, store their cryptographic keys securely, and manage their digital assets, such as cryptocurrencies or tokens.

- **Transaction Processing**: Apps can facilitate the initiation and processing of blockchain transactions. Users can send or receive digital assets and initiate payments from their mobile devices.

- **Asset Tracking**: Apps connected to blockchains can provide real-time tracking and monitoring of digital assets. Users can view the transaction history, balance, and ownership information of their assets on the blockchain.

- **Smart Contract Interaction**: Apps can enable interaction with smart contracts deployed on the blockchain. Users can invoke functions, participate in decentralized applications (DApps), and interact with automated contract logic.

In this article, we talk about a mobile application developed mainly to interact with Smart contracts.

# Blockchain development concepts

Before going through the details of the development, let's become familiar with some concepts that we should understand for better comprehension.

### Polygon network

The Polygon network acts as a scaling solution or a Layer 2 solution for Ethereum (check the picture below). It provides additional infrastructure and technology that helps alleviate the congestion and high fees on the Ethereum network. Transactions and activities can be offloaded from the Ethereum mainnet to the Polygon network, where they can be processed faster and with lower fees.

<figure>
<img src={{ sitePrefix }}/assets/img/articles/2023-08-01-Empowering-Mobile-Applications-through-Blockchain-Our-Journey-Part-2/image1.png>
<figcaption>Layer 2 solution representation, where orange part is a Layer 2 solution and the green part is the mainnet. Source: https://www.globalxetfs.com.au/scaling-blockchains-what-are-layer-2-solutions-and-interoperable-chains/</figcaption>
</figure>

The web-based platform called **Polygon Scan** is used to explore and monitor activities on the Polygon network.

As an interesting fact, Polygon is an [“Eco-friendly blockchain”](https://polygon.technology/blog/polygon-the-eco-friendly-blockchain-scaling-ethereum), especially compared to the heavily energy-consuming Bitcoin blockchain network.

For the project described in this article, we used Polygon Network to store records. Please refer to the smart contract development section in our last [article](https://engineering.monstar-lab.com/en/post/2023/07/12/Empowering-Mobile-Applications-through-Blockchain-Our-Journey-Part-1/) for a deeper understanding.

### Testnet

Testnets are separate blockchain networks that developers and users can use to test and experiment with applications, smart contracts, and other blockchain functionalities without using real cryptocurrencies or interacting with the mainnet (The live, production version of the blockchain).

In this project, we used Mumbai Testnet which is accessible through the [PolygonScan platform](https://mumbai.polygonscan.com/)

### Faucet

In Web3, faucet is a service or mechanism that provides users with free tokens or cryptocurrencies for testing and development purposes. It is commonly used on testnet networks to distribute tokens that hold no real-world value but can be used for experimenting with blockchain applications.

In the context of a faucet, a transaction refers to the transfer of cryptocurrency from the faucet to a user's wallet.

For this project, we acquired free tokens from the following Faucets:

- [Polygon Faucet](https://faucet.polygon.technology/)
- [Chainlist](https://chainlist.org/?search=Polygon&testnets=true)

The following is an example of a transaction from a faucet to an account created in Metamask. The only required parameter was the Wallet address which is taken from the Metamask extension.

<figure>
<img src={{ sitePrefix }}/assets/img/articles/2023-08-01-Empowering-Mobile-Applications-through-Blockchain-Our-Journey-Part-2/image2.png>
<figcaption>Faucet transaction</figcaption>
</figure>

The web-based platform called **Polygon Scan** is used to explore and monitor activities on the Polygon network.

For the project described in this article, we used Polygon Network to store records. Please refer to section about the smart contract development.

### Metamask

For the project described in this article, we created a Wallet in [Metamask](https://metamask.io/). Metamask functions as a bridge between the user and the blockchain network by a browser extension.

<figure>
<img src={{ sitePrefix }}/assets/img/articles/2023-08-01-Empowering-Mobile-Applications-through-Blockchain-Our-Journey-Part-2/image3.png>
<figcaption>Transaction details in Metamask</figcaption>
</figure>

The steps we carried out to set up the wallet in Metamask were the following:

- Install the Metamask browser extension.
- Follow the steps to generate the Password and the Secret Recovery Phrase.
- Create an account in the Metamask menu.

# Smart Contract Development

The purpose of the smart contract developed for this project is to securely store records of pension and tax transactions on the blockchain. The final deployed Smart Contract can be found [here](https://mumbai.polygonscan.com/address/0x22112abffaa55876d6ef203d1f3a5f2465c69be6#code).

### Key Features

- This smart contract acts as a decentralized ledger, ensuring the immutability and transparency of pension and tax records.

- Ability to add records to the blockchain by government officials who possess access to user identifiers.

- The smart contract provides a method that allows the mobile application to invoke and retrieve only the records that belong to a specific user, ensuring privacy and personalized access.

### Development and Deployment

These were the steps followed in the development and deployment process of the smart contract.

1. **Requirement Analysis**: We gathered and analyzed the requirements for the smart contract, such as the data to be stored, the record structure, user identification, and access control taking into account the app specifications as well.

2. **Solidity Contract Development**: We wrote the smart contract using the Solidity programming language. Defined the necessary variables and functions to implement the desired functionality.

   - Variables
     - contributionType (uint8)
     - recordNumber (uint)
     - amount (uint)
     - timestamp (uint)
     - note (string)
   - Functions
     - Function to add a single record
     - Function to retrieve all the records for a specific User
     - Function to retrieve the number the records for a specific User

3. **Remix Integration**: We used Remix, an open-source tool, to develop and test the smart contract directly from the browser. Remix provides a convenient environment for writing, compiling, and debugging Solidity contracts.

4. **Testing**: Before deploying, we use Remix to test the smart contract locally.

5. **Create a wallet in Metamask**: In order to start interacting with a blockchain network, we created a wallet in Metamask by following the required steps to set up the password and seed phrase for authentication access. Additionally, we created a couple of accounts to verify transactions and manage the token funds.

6. **Token Acquisition**: Then, we acquired free tokens from the Faucet at [Polygon Faucet](https://faucet.polygon.technology/) for deploying and interacting with a smart contract on a Testnet.

7. **Deployment on Mumbai Testnet**: We deployed the smart contract on the Mumbai Testnet provided by the PolygonScan platform. The deployed smart contract's address is [here](https://mumbai.polygonscan.com/address/0x22112abffaa55876d6ef203d1f3a5f2465c69be6#code).

### Smart Contract Response Structure

The deployed smart contract includes a method called getRecordsForUser, which is invoked from the mobile application to retrieve Pension and Tax records. The method returns a dictionary-type object with two keys: "0" and "\_success". The key "0" contains an array of tuples, as shown in the example below:

```json
[
   "0":[
      [
         2,
         0,
         13200,
         1682317471,
         "税金2022年11月。納付"
      ],
      [
         2,
         1,
         13200,
         1682416499,
         "税金2022年5月。納付"
      ],
      [
         1,
         17,
         6000,
         1682416853,
         "国民年金2023年4月。納付"
      ]
   ],
   "_success":true
]
```

Each tuple corresponds to a record. The items included are as follows:

1. Contribution type: 1 for Pension, 2 for Taxes
2. Record Number: The record number for this specific user
3. Amount: The amount of this record
4. Timestamp: The timestamp when the record was added
5. Note: A relevant note regarding the record added to the blockchain.

# Android App Development

### Application Overview

This Native Android app allows the user to “log in” which entails storing a valid GUID which exists on the Manekin Contract in the application. The application then queries the contract for the transactions associated with that GUID, and displays them to the user in categories. Querying the contract is a read-only operation and as such does not require cryptocurrency.

<figure>
<img src={{ sitePrefix }}/assets/img/articles/2023-08-01-Empowering-Mobile-Applications-through-Blockchain-Our-Journey-Part-2/image4.png>
<figcaption>Android Mobile Application screens</figcaption>
</figure>

To interact with the Smart Contract, we utilized the [Web3j Library](https://github.com/web3j/web3j) for Android. It is by far the most popular and most maintained project allowing access to multiple blockchains.

### Other Libraries used

**Firebase Remote Config**
In case the testnet changes in the future, the RPC URL and Contract address could be modified remotely, without the need to re-release the app if that information was hard coded.

**AndroidX Camera**
In order to feed information to the barcode reader, and display a camera preview.

**Google MLKit Barcode Scanner**
To recognize the QR code used to log in, and read the data inside.

**Google Accompanist**
To handle the camera permissions with ease.

### Generating the Java Smart Contract Wrapper

First, it was necessary to download the contract’s ABI from the Manekin Smart Contract page.

Then, we installed the [Web3j Command Line Tools](https://docs.web3j.io/4.10.0/command_line_tools/) (4.10.0 at time of writing).

After that, the Wrapper was generated with the following command, and placed in our `data/model` folder:

```shell
web3j generate solidity -a <abi_file> -o <output_folder> -p <java_package_name>
```

### Accessing the Polygon Mumbai Testnet

1. Define the RPC URL and Contract Address. As mentioned previously, we stored and subsequently then retrieved them from Firebase Remote Config:

```kotlin
val remoteConfigRepository: RemoteConfigRepository =
            (application as App).remoteConfigRepository

val rpcUrl = remoteConfigRepository.getRPCUrl().data ?: ""
val contractAddress = remoteConfigRepository.getContractAddress().data ?: ""
```

2. Initialize the web3j Library using the RPC URL:

```kotlin
val web3j: Web3j = Web3j.build(HttpService(rpcUrl))
```

3. Initialize a read-only Transaction Manager to retrieve the transactions, using the previous webj object:

```kotlin
val readonlyTransactionManager = ReadonlyTransactionManager(web3j, "0x0000000000000000000000000000000000000000")
```

Note that Web3j needs a wallet address, even for read only operations, so we have used a Dummy Address.

4. Load the Manekin Contract Wrapper, which was previously generated with the Web4j Command Line tools:

```kotlin
val contract: ManekinContract =
            ManekinContract.load(
                contractAddress,
                web3j,
                readonlyTransactionManager,
                DefaultGasProvider()
            )
```

5. Retrieve the records from our contract, using the function which Web4j generated:

```kotlin
Retrieve the records from our contract, using the function which Web4j generated :
```

It is assumed that `userIdentifier` has been defined or passed in, and is the GUID representing a user’s data.

# iOS App Development

### Application Overview

This is a native mobile application designed to allow users to verify their pension and tax records stored on the blockchain. The process of adding records to the blockchain is not executed in the application, but rather manually, instead this can be done in the [PolygonScan](https://mumbai.polygonscan.com/address/0x22112abffaa55876d6ef203d1f3a5f2465c69be6#writeContract) console by calling the method _writeContract_.

<figure>
<img src={{ sitePrefix }}/assets/img/articles/2023-08-01-Empowering-Mobile-Applications-through-Blockchain-Our-Journey-Part-2/image5.png>
<figcaption>iOS Mobile Application screens</figcaption>
</figure>

To interact with the smart contract, we utilized the **Web3Swift** library, which is a swift library for iOS designed for seamless integration with Ethereum's smart contracts on the blockchain. You can find the library [here](https://github.com/web3swift-team/web3swift).

We opted for this library due to its popularity, ease of integration into Swift projects, and its active maintenance. Furthermore, Web3swift offers extensive support for various smart contract operations, making it suitable for the development of complex Web3-related projects.

### Parameters required

To instantiate a smart contract deployed on the Mumbai testnet of Polygon, we needed three pieces of information:

- RPC Server Address: Mumbai Tested has multiple addresses, allowing us to choose the most convenient one. For further details, refer to [Chainlist](https://chainlist.org/).

- Chain ID: Mumbai Tesnet's chain ID is 80001. For more information, visit [Chainlist](https://chainlist.org/).

- Contract Address: This refers to the hash that is embedded in the smart [contract URL](https://mumbai.polygonscan.com/address/0x22112abffaa55876d6ef203d1f3a5f2465c69be6).

- Contract ABI: This JSON file contains the smart contract's details and can be downloaded from the polygonscan platform.

### Steps involved in retrieving records from the blockchain

1. Create a Web3 object by using RPC Server Address and Mumbai Tesnet's chain ID

```swift
let mumbaiEndpoint = URL(string: rpcUrl)
let mumbaiNetworkId = 0x13881

var provider: Web3Provider

do {
    provider = try await Web3HttpProvider(
        url: mumbaiEndpoint,
        network: Networks.fromInt(UInt(mumbaiNetworkId)))
} catch {
    return TaskResult.failure(AppError.providerGenerateError)
}

let web3 = Web3(provider: provider)
```

2. Retrieve the locally stored JSON abi file as String.

```swift
guard let contractABIURL = Bundle.main.url(forResource: "contract_abi", withExtension: "json") else {
    return TaskResult.failure(AppError.abiBundleError)
}

guard let contractABIString = try? String(contentsOf: contractABIURL, encoding: .utf8) else {
    return TaskResult.failure(AppError.abiStringParseError)
}
```

3. Create a ReadOperation object by using web3 instance, contract address , the abi string and the name of the method to invoke in the smart contract.

```swift
guard let contract = web3.contract(contractABIString, at: EthereumAddress(contractAddress)) else {
    return TaskResult.failure(AppError.contractGenerateError)
}

guard let readOperation = contract.createReadOperation(
    "getRecordsForUser",
    parameters: [userIdentifier]) else {
    return TaskResult.failure(AppError.contractWrongMethodOrParameters)
}
```

4. Execute callContractMethod and parse the data as required to display in the User Interface

```swift
do {
  // 1. Call callContractMethod
  let result = try await readOperation.callContractMethod()

  // 2. Check whether there are records added for this User
  guard let array = result["0"] as? [[Any]] else {
      return TaskResult.failure(AppError.userDoesNotExistOrNoRecords)
  }
  if !array.isEmpty {
      var records: [ContributionModel] = []

      // 3. Parse the records in the response one by one
      for subArray in array {
          if !subArray.isEmpty {

              guard let recordNumber = subArray[1] as? BigUInt,
                    let amount = subArray[2] as? BigUInt,
                    let timeStamp = subArray[3] as? BigUInt,
                    let contributionType = subArray[0] as? BigUInt else {
                  continue
              }

              var type: ContributionModelType
              if contributionType == 1  {
                  type = .pensions
              } else if contributionType == 2  {
                  type = .taxes
              } else {
                  continue
              }

              let note = subArray[4] as? String ?? ""

              let newRecord = ContributionModel(
                  recordNumber: recordNumber,
                  timeStamp: timeStamp,
                  amount: amount,
                  note: note,
                  type: type)

              records.append(newRecord)
          }
      }
      return TaskResult.success(records)
  }
  return TaskResult.failure(AppError.userDoesNotExistOrNoRecords)
} catch {
  return TaskResult.failure(AppError.userDoesNotExistOrNoRecords)
}
```

# Conclusions

Blockchain is a very new technology, therefore it is rapidly evolving and decisions we made two months ago during the development of this project may have been different today.

In conclusion, the integration of Blockchain technology into mobile apps, such as the city hall app developed, offers enhanced security, transparency, streamlined processes, and improved data integrity. Furthermore, we are sure that the future of Blockchain technology in mobile apps holds immense potential.

In this first stage, we created a simple app just retrieving some info from the Blockchain to take a first contact and understand how it works. The next step will be adding records into the Blockchain from the app itself. For this purpose, we want to create an app for our City Hall; using it, employees would be able to add records into the smart contract directly from the app. To do this, we are thinking of using a different wallet than Metamask in order to gain a more friendly user experience. But these are contents for another article, and we will surely be talking here about them when we investigate a little bit more.
