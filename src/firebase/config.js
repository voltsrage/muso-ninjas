import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {};

// Initialize Firebase
let app;
let db;
let auth;
let timestamp;
let storage;

if (!getApps().length) {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    storage = getStorage(app)
    timestamp = serverTimestamp();
} else {
    app = getApp()
}

export {
    db,
    auth,
    timestamp,
    storage
}