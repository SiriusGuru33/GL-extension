import { FIREBASE_REG_ID } from "../../constants";
export { }
var pnData = 'asdfasdf';

// function tokenRegistered(registration_id) {
//     // The token can be used to send messages specifically to this
//     // user. So you can store it server side and when you need to send
//     // a message, you can do so.
//     chrome.storage.sync.set({ [FIREBASE_REG_ID]: registration_id }, function () {
//         console.log('Store firebase reg ID');
//     });
//     if (chrome.runtime.lastError) {
//         console.log("failed")
//         return
//     }
// }

// // You can find this ID by going to your Firebase project settings
// // and going to the "Cloud Messaging" tab.
// chrome.gcm.register(["209550883114"], tokenRegistered)

// // This will execute whenever FCM sends a message to this extension.
// // Even when the service worker is inactive
// chrome.gcm.onMessage.addListener((message) => {
//     console.log("message");
//     console.log(message);
//     pnData = message;
// })