// Give the service worker access to Firebase Messaging.
import firebase from "firebase/app";
import "firebase/messaging";

var self = this;

let firebaseConfig = {
    // apiKey: "AIzaSyDKFFrKp0D_5gBsA_oztQUhrrgpKnUpyPo",
    // authDomain: "tickt-app.firebaseapp.com",
    // projectId: "tickt-app",
    // storageBucket: "tickt-app.appspot.com",
    // messagingSenderId: "795502342919",
    // appId: "1:795502342919:web:37a2294b55f69051d30ba2",
    // measurementId: "G-KT3LTB6JMT"
    apiKey: "AIzaSyDq9WSnxFSvLIkzb5ucqQdDdh6zFUicGUE",
    authDomain: "tickt-test.firebaseapp.com",
    databaseURL: "https://tickt-test-default-rtdb.firebaseio.com",
    projectId: "tickt-test",
    storageBucket: "tickt-test.appspot.com",
    messagingSenderId: "268252142860",
    appId: "1:268252142860:web:b62a9d4bd768f127237d29"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log("[firebase-messaging-sw.js] Received background message ", payload );
    // Customize notification type here => notification/data
    const title = payload.notification.title;
    const options = {
        body: payload.notification.body,
    };
   return self.registration.showNotification(title, options);
});

    self.addEventListener("notificationclick", (event) => {
    console.log(event);
    // var click_action = event.notification.data.click_action
    event.notification.close();
    event.waitUntil(
        self.clients.openWindow('http://localhost:3000/active-jobs')
    )
    // Get all the Window clients
    // event.waitUntil(self.clients.matchAll({ type: 'window' }).then(clientsArr => {
    // If a Window tab matching the targeted URL already exists, focus that;
    // const hadWindowToFocus = clientsArr.some(windowClient => windowClient.url === event.notification.data.click_action ? (windowClient.focus(), true) : false);
    // Otherwise, open a new tab to the applicable URL and focus it.
    // if (!hadWindowToFocus) self.clients.openWindow(event.notification.data.click_action).then(windowClient => windowClient ? windowClient.focus() : null);
    // }));
    })

    self.addEventListener("notificationclose", (event) => {
    console.log('notification close');
})