import firebase from "firebase/app";
import "firebase/messaging";
import 'firebase/auth';
import 'firebase/database';
import 'firebase/firestore';

import moment from 'moment';
import storageService from "../utils/storageService";

let devFirebaseConfig = {
    apiKey: "AIzaSyDq9WSnxFSvLIkzb5ucqQdDdh6zFUicGUE",
    authDomain: "tickt-test.firebaseapp.com",
    databaseURL: "https://tickt-test-default-rtdb.firebaseio.com",
    projectId: "tickt-test",
    storageBucket: "tickt-test.appspot.com",
    messagingSenderId: "268252142860",
    appId: "1:268252142860:web:b62a9d4bd768f127237d29"
};

var qaStgFirebaseConfig = {
    apiKey: "AIzaSyDKFFrKp0D_5gBsA_oztQUhrrgpKnUpyPo",
    authDomain: "tickt-app.firebaseapp.com",
    databaseURL: "https://tickt-app-default-rtdb.firebaseio.com",
    projectId: "tickt-app",
    storageBucket: "tickt-app.appspot.com",
    messagingSenderId: "795502342919",
    appId: "1:795502342919:web:37a2294b55f69051d30ba2",
    measurementId: "G-KT3LTB6JMT"
};

if (!firebase.apps.length) {
    firebase.initializeApp(qaStgFirebaseConfig);
}
export const auth = firebase.auth();
export const messaging = firebase.messaging();
export var db = firebase.database();
//export var db = firebase.firestore();
const usersRef = db.ref('users');

const CHAT_TYPE = 'single';
const FIREBASE_COLLECTION = {
    ROOM_INFO: "room_info",
    JOBS: "jobs",
    INBOX: "inbox",
    MESSAGES: "messages",
    LAST_MESSAGES: "lastMessage",
    USERS: "users",
}
let loggedInuserId = "";
let msgListnerObj;
// let totalPendingCounter = 0;
let inboxListner;


const getRegisterToken = () => {
    return new Promise((resolve, reject) => {
        messaging.getToken({
            vapidKey: 'BHtgSVj0gw6YQDd6ByTPx_gyRtBWKlHBVYKFsemnv1t6bTH9efAseLWaoJx2GvTu0NW314ZF4DOj_eJ7tub9kHI'
        }).then((currentToken) => {
            if (currentToken) {
                console.log("FCM token fetched successsfully", currentToken);
                sessionStorage.setItem("FCM token", currentToken);
                resolve({ success: true, deviceToken: currentToken });
            } else {
                console.log('No registration token available.');
                setTokenSentToServer(false);
                resolve({ success: false });
            }
        }).catch((err) => {
            console.log('An error occurred while retrieving token. ', err);
            setTokenSentToServer(false);
            reject({ success: false });
        });
    })
}

const setTokenSentToServer = (sent) => {
    storageService.setItem('sentToServer', sent ? '1' : '0');
}

const isTokenSentToServer = () => {
    return storageService.getItem('sentToServer') === '1';
}

export function requestPermission() {
    return new Promise((resolve, reject) => {
        Notification.requestPermission().then((permission) => {
            if (permission === 'granted' && isTokenSentToServer()) {
                getRegisterToken();
                console.log('Token Already sent');
                resolve({ success: false });
            } else if (permission === 'granted' && !isTokenSentToServer()) {
                const data = getRegisterToken();
                resolve(data);
            }
        })
            .catch((err) => {
                console.log('Unable to get permission to show notification : ', err);
                reject({ success: false });
            });
    })
}

export function deleteToken() {
    messaging.deleteToken().then(() => {
        console.log('Token deleted.');
        // ...
    }).catch((err) => {
        console.log('Unable to delete token. ', err);
    });
}

export const firebaseSignUpWithEmailPassword = async ({ email, password, id, fullName, user_type }) => {
    try {
        let ref = await auth.createUserWithEmailAndPassword(email, password);
        if (ref) {
            await ref.user.updateProfile({
                displayName: fullName,
                // photoURL: '',
                // roleId: user_type,
            });

            await db.ref(`${FIREBASE_COLLECTION.USERS}/${id}`).set({
                email: email,
                image: '',
                name: fullName,
                // uid: ref.user["$"]["W"],
                userId: id,
                onlineStatus: true,
                userType: user_type,
            });
            console.log("firebase authentication success")
        }
    } catch (err) {
        console.log("firebase authentication failure: ", { err });
    }
};

export const firebaseLogInWithEmailPassword = async (authData, loginRes) => {
    try {
        let response = await auth.signInWithEmailAndPassword(authData.email, authData.password);
        if (response) {
            console.log('firebase auth login success: ');
            await db.ref(`${FIREBASE_COLLECTION.USERS}/${loginRes?._id}`).set({
                email: loginRes?.email,
                image: '',
                name: loginRes?.userName,
                userId: loginRes?._id,
                onlineStatus: true,
                userType: loginRes?.user_type,
            });
        }
    } catch (err) {
        console.log('firebase auth login failure: ');
    }
}

////////////////////////  firebase chat

export const loginAnonymously = () => {
    // debugger;
    auth.signInAnonymously()
        .then(() => alert("anonymous signed in success"))
        .catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            if (errorCode === 'auth/operation-not-allowed') {
                alert('You must enable Anonymous auth in the Firebase Console.');
            } else {
                console.error(error);
            }
        });
}

export const getLoggedInuserId = () => {
    if (!loggedInuserId) {
        let userInfo = storageService.getItem("userInfo");
        if (userInfo) {
            loggedInuserId = userInfo._id;
        } else {
            loggedInuserId = '';
        }
    }
    return loggedInuserId;
}

export const createRoom = async (jobId, tradieId, builderId, jobName) => {

    const roomID = `${jobId}_${tradieId}_${builderId}`;

    if (await checkRoomExist(roomID)) {
        return;
    }

    let roomInfoObj = {
        id: roomID,
        chatRoomType: CHAT_TYPE,
        chatLastUpdate: firebase.database.ServerValue.TIMESTAMP,
    };
    let chatLastUpdates = {};
    chatLastUpdates[tradieId] = tradieId === loggedInuserId ? firebase.database.ServerValue.TIMESTAMP : 0;
    chatLastUpdates[loggedInuserId] = firebase.database.ServerValue.TIMESTAMP;

    let chatRoomMembers = {};
    chatRoomMembers[tradieId] = {
        memberDelete: firebase.database.ServerValue.TIMESTAMP,
        memberJoin: firebase.database.ServerValue.TIMESTAMP,
        memberLeave: 0
    }

    chatRoomMembers[builderId] = {
        memberDelete: firebase.database.ServerValue.TIMESTAMP,
        memberJoin: firebase.database.ServerValue.TIMESTAMP,
        memberLeave: 0
    }
    roomInfoObj.chatRoomMembers = chatRoomMembers;
    roomInfoObj.chatLastUpdates = chatLastUpdates;

    console.log(roomInfoObj);
    await db.ref(`${FIREBASE_COLLECTION.ROOM_INFO}/${roomID}/`).set(roomInfoObj);
    // await createItem(itemInfo);
    //loggedin user inbox
    await createInbox(tradieId, roomID, jobId, builderId, jobName);
    // supplier user inbox
    await createInbox(builderId, roomID, jobId, tradieId, jobName);
    return roomInfoObj;
}

export const checkRoomExist = async (roomID) => {
    let room = await db.ref(`${FIREBASE_COLLECTION.ROOM_INFO}/${roomID}/`).once('value');
    return room.exists();
}

export const createJob = async (jobInfo) => {
    await db.ref(`${FIREBASE_COLLECTION.JOBS}/${jobInfo.jobId}/`).set(jobInfo);
}

export const createInbox = async (userid, roomId, jobId, oppuserid, jobName) => {
    const inboxKey = `${oppuserid}_${jobId}`;
    await db.ref(`${FIREBASE_COLLECTION.INBOX}/${userid}/${inboxKey}`).set({
        jobId: jobId,
        jobName: jobName,
        roomId: roomId,
        unreadMessages: 0
    });
}

export const getFirebaseInboxData = async (listner) => {
    console.log(listner, "listner firebaseInboxData")
    // debugger;
    let userId = getLoggedInuserId();
    if (!userId) {
        listner([]);
        return;
    }
    let dbRef = `${FIREBASE_COLLECTION.INBOX}/${userId}`;
    console.log("getFirebaseIndexData", dbRef);
    if (inboxListner) {
        db.ref(dbRef).off();
        db.ref(dbRef).off('value', msgListnerObj);
    }
    inboxListner = db.ref(dbRef).on("value", async (snapshot) => {
        let indexlist = [];
        snapshot.forEach((snap) => {
            indexlist.push(snap.val());
        });
        let items = [];
        let users = [];
        for (let i = 0; i < indexlist.length; i++) {
            // let itemIndex = items.findIndex((item) => item.jobId === indexlist[i].jobId);
            // if (itemIndex == -1) {
            //     let room = await db.ref(`${FIREBASE_COLLECTION.JOBS}/${indexlist[i].jobId}`).once('value');
            //     if (room.exists()) {
            //         let lastMsg = await db.ref(`${FIREBASE_COLLECTION.LAST_MESSAGES}/${indexlist[i].roomId}/chatLastMessage`).once('value');
            //         indexlist[i].item = room.val();
            //         if (lastMsg.exists())
            //             indexlist[i].lastMsg = lastMsg.val();
            //         items.push(room.val());
            //     }
            // } else {
            //     indexlist[i].item = items[itemIndex];
            // }
            let lastMsg = await db.ref(`${FIREBASE_COLLECTION.LAST_MESSAGES}/${indexlist[i].roomId}/chatLastMessage`).once('value');
            if (lastMsg.exists()) {
                indexlist[i].lastMsg = lastMsg.val();
            }
            let oppUserId = '';
            if (storageService.getItem('userType') === 1) {
                oppUserId = indexlist[i].roomId.split('_')[2];
            } else {
                oppUserId = indexlist[i].roomId.split('_')[1];
            }
            let userIndex = users.findIndex((item) => item.userId === oppUserId);
            if (userIndex == -1) {
                let oppUserInfo = await db.ref(`${FIREBASE_COLLECTION.USERS}/${oppUserId}`).once('value');
                if (oppUserInfo.exists()) {
                    indexlist[i].oppUserInfo = oppUserInfo.val();
                    users.push(oppUserInfo.val());
                }
            } else {
                indexlist[i].oppUserInfo = users[userIndex];
            }
        }
        setPendingCounter(indexlist);
        await listner(indexlist);
    });
}

export const setPendingCounter = (indexlist) => {
    let count = 0;
    let unreadMsg = indexlist.filter((d) => d.unreadMessages > 0)
    unreadMsg.length === 0 ? count = 0 : count = unreadMsg.length
    // store.dispatch({
    //     type: INBOX_COUNTER_SET,
    //     payLoad: count
    // });
}

// export const getFirebaseItemsData = async () => {
//     let itemlist = [];
//     db.ref(`${FIREBASE_COLLECTION.JOBS}`).on("value", (snapshot) => {
//         snapshot.forEach((snap) => {
//             itemlist.push(snap.val());
//         });
//     });
//     return itemlist;
// }

// export const getFirebaseRoomInfoData = async () => {
//     let roomlist = [];
//     db.ref(`${FIREBASE_COLLECTION.ROOM_INFO}`).on("value", (snapshot) => {
//         snapshot.forEach((snap) => {
//             roomlist.push(snap.val());
//         });
//     });
//     return roomlist
// }

export const getMessagesOfRoom = async (roomId, listner) => {
    //getPreviousMessages check KT file
    //.limitToLast(10)

    // if (msgListnerObj) {
    //     await db.ref(`${FIREBASE_COLLECTION.MESSAGES}/${roomId}`).off('value', msgListnerObj);
    // }

    msgListnerObj = db.ref(`${FIREBASE_COLLECTION.MESSAGES}/${roomId}`).orderByChild('messageTimestamp').on("value", (snapshot) => {
        let itemlist = [];
        snapshot.forEach((snap) => {
            itemlist.push(snap.val());
        });
        listner(itemlist);
    });
}

export const stopListeningOfRoom = async (roomId) => {

    if (msgListnerObj) {
        db.ref(`${FIREBASE_COLLECTION.MESSAGES}/${roomId}`).off('value', msgListnerObj);
        db.ref(`${FIREBASE_COLLECTION.MESSAGES}/${roomId}`).off();
    }
    console.log("Stop listening Of Room");
}

export const sendTextMessage = async (roomId, message) => {
    let senderId = getLoggedInuserId();
    let roomids = roomId.split("_");
    let jobId = "";
    let receiverId = "";
    if (roomids.length == 3) {
        if (roomids[1] == senderId) {
            receiverId = roomids[2];
        } else {
            receiverId = roomids[1];
        }
        jobId = roomids[0];
    }

    let dbRef = db.ref(`${FIREBASE_COLLECTION.MESSAGES}/${roomId}`);
    const newMsgRef = dbRef.push();
    // Get the unique key generated by push()
    const messageID = newMsgRef.key;

    let msgData = {
        "isBlock": false,
        "isDeleted": false,
        "mediaDuration": "",
        "mediaUrl": "",
        "messageCaption": "",
        "messageId": messageID,
        "messageRoomId": roomId,
        "messageStatus": "send",
        "messageText": message,
        "messageTimestamp": firebase.database.ServerValue.TIMESTAMP,
        "messageType": "text",
        "progress": 0,
        "receiverId": receiverId,
        "senderId": senderId,
        "thumbnail": ""
    };
    await db.ref(`${FIREBASE_COLLECTION.LAST_MESSAGES}/${roomId}/chatLastMessage`).set(msgData);
    await db.ref(`${FIREBASE_COLLECTION.MESSAGES}/${roomId}/${messageID}`).set(msgData);

    //TODO Implement Update Message Counter
    //https://stackoverflow.com/questions/42276881/increment-firebase-value-from-javascript-subject-to-constraint
    let inboxId = `${senderId}_${jobId}`;
    await db.ref(`${FIREBASE_COLLECTION.INBOX}/${receiverId}/${inboxId}`).child('unreadMessages').set(firebase.database.ServerValue.increment(1));
}

export const sendImageVideoMessage = async (roomId, url, type) => {
    let senderId = getLoggedInuserId();
    let roomids = roomId.split("_");
    let jobId = "";
    let receiverId = "";
    if (roomids.length == 3) {
        if (roomids[1] == senderId) {
            receiverId = roomids[2];
        } else {
            receiverId = roomids[1];
        }
        jobId = roomids[0];
    }

    let dbRef = db.ref(`${FIREBASE_COLLECTION.MESSAGES}/${roomId}`);
    const newMsgRef = dbRef.push();
    // Get the unique key generated by push()
    const messageID = newMsgRef.key;

    let msgData = {
        "isBlock": false,
        "isDeleted": false,
        "mediaDuration": "",
        "mediaUrl": url,
        "messageCaption": "",
        "messageId": messageID,
        "messageRoomId": roomId,
        "messageStatus": "send",
        "messageText": "",
        "messageTimestamp": firebase.database.ServerValue.TIMESTAMP,
        "messageType": type === "image" ? "image" : "video",
        "progress": 0,
        "receiverId": receiverId,
        "senderId": senderId,
        "thumbnail": url
    };
    await db.ref(`${FIREBASE_COLLECTION.LAST_MESSAGES}/${roomId}/chatLastMessage`).set(msgData);
    await db.ref(`${FIREBASE_COLLECTION.MESSAGES}/${roomId}/${messageID}`).set(msgData);

    //TODO Implement Update Message Counter
    //https://stackoverflow.com/questions/42276881/increment-firebase-value-from-javascript-subject-to-constraint
    let inboxId = `${senderId}_${jobId}`;
    await db.ref(`${FIREBASE_COLLECTION.INBOX}/${receiverId}/${inboxId}`).child('unreadMessages').set(firebase.database.ServerValue.increment(1));
}

export const resetUnreadCounter = async (roomId) => {
    let senderId = getLoggedInuserId();
    let roomids = roomId.split("_");
    let jobId = "";
    let receiverId = "";
    if (roomids.length === 3) {
        if (roomids[1] == senderId) {
            receiverId = roomids[2];
        } else {
            receiverId = roomids[1];
        }
        jobId = roomids[0];
    }
    let inboxId = `${receiverId}_${jobId}`;
    await db.ref(`${FIREBASE_COLLECTION.INBOX}/${senderId}/${inboxId}`).child('unreadMessages').set(0);
}

export default firebase;