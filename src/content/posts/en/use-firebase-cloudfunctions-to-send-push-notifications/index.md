---
date: 2021-02-09
title: How to use Firebase Cloud functions to send push notifications
tags: [nodejs, serverless, firebase]
image: './header.webp'
authors:
  - kun-luo
categories:
  - nodejs
---

This article provides a quick introduction on how to use [Firebase Cloud Functions](https://firebase.google.com/docs/functions) to send push notifications. There are 2 main advantages in using them:

1. A small amount of code can send iOS and Android push notifications at the same time.
2. There is no need for server-side coding as it is a server-less solution.

Before starting, we need to complete the configuration of the development environment:

### 1. Create the Firebase project

In the Firebase console, click [Add project](https://firebase.google.com/docs/functions/get-started?authuser=0#create-a-firebase-project) and select or enter a Project name (for example: `firebase-cloudfunction-demo`).

### 2. Add the Cloud messaging config

Complete the configuration of Firebase Cloud messaging:

- [iOS instructions](https://firebase.google.com/docs/cloud-messaging/ios/client?authuser=0)
- [Android instructions](https://firebase.google.com/docs/cloud-messaging/android/client?authuser=0)

When the configuration is done, we also need to save the `FCMToken` (Firebase Cloud Messaging) in the realtime database or Firestore, to be used for push notifications.

### 3. Set up Node.js and the Firebase CLI

Open your own command line and create a new folder, then use:

```
npm install firebase-functions@latest firebase-admin@latest --save
npm install -g firebase-tools
```

### 4. Initialize your project

Run the following command:

```
firebase login
```

Your browser will open and you can use your Firebase account login and wait for the redirect. Then you will be able to see this:

```
Waiting for authentication...
✔  Success! Logged in as *******
```

Run the following command:

```
firebase init functions
```

Select JavaScript and when the Cloud functions setup is finished, this is how your folder will look like:

```
+- .firebaserc
 +- firebase.json
 +- functions/
      +- package.json
      +- index.js
      +- node_modules/
```

### 5. Add Cloud functions for push notifications

We only need to edit the `functions/index.js` file.

There are two ways to send push notifications, through HTTP request or by adding a listener to the realtime database or Firestore.

```
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

//http request method
exports.sendHttpPushNotification = functions.https.onRequest((req, res) => {
    const userId = req.body.userId; //get params like this
    	...

//listener method
exports.sendListenerPushNotification = functions.database.ref('/sendMessage/{userId}/').onWrite((data, context) => {
	const userId = context.params.userId; //get params like this
		...
```

Assume that the `FCMToken` is stored in this location of the realtime database：

```
/FCMToken/${userId}
```

You could get the `FCMToken` like this:

```
const FCMToken = admin.database().ref(`/FCMTokens/${userId}`).once('value');
```

To send a notification, use the following code:

```
const payload = {
	token: FCMToken,
    notification: {
        title: 'cloud function demo',
        body: message
    },
    data: {
        body: message,
    }
};

admin.messaging().send(payload).then((response) => {
    // Response is a message ID string.
    console.log('Successfully sent message:', response);
    return {success: true};
}).catch((error) => {
    return {error: error.code};
});
```

### 6. Deploy the functions to a production environment

Run this command to deploy your functions:

```
firebase deploy --only functions
```

If you add HTTP request functions, a function URL you should see:

```
Function URL (sendHttpPushNotification): https://us-central1-firebase-cloudfunction-demo.cloudfunctions.net/sendHttpPushNotification
```

If you want to debug your cloud functions, you could use this command:

```
firebase emulators:start
```

When the Cloud functions are deployed, you can send push notifications by making a request to the Function URL, or just set the data into the Firebase realtime database and the Cloud functions will be triggered by the data listener.

### Resources

- [Cloud Functions for Firebase](https://firebase.google.com/docs/functions)
- [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging)
