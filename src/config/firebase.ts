
import admin from 'firebase-admin';
import { App, getApp, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

import serviceAccount from "./keys/mindbase-app-firebase-admin.json";

let firebaseApp: App;

if (getApps().length === 0) {
  firebaseApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
} else {
  firebaseApp = getApp();
}

const firebaseAuth = getAuth(firebaseApp);

export {
  firebaseApp, firebaseAuth
};
