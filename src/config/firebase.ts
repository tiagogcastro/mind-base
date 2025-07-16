
import admin from 'firebase-admin';
import { App, getApp, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { ENV } from './env';

let firebaseApp: App;

const serviceAccount = {
  type: ENV.GOOGLE_FIREBASE.GOOGLE_FIREBASE_TYPE,
  projectId: ENV.GOOGLE_FIREBASE.GOOGLE_FIREBASE_PROJECT_ID,
  private_key_id: ENV.GOOGLE_FIREBASE.GOOGLE_FIREBASE_PRIVATE_KEY_ID,
  privateKey: ENV.GOOGLE_FIREBASE.GOOGLE_FIREBASE_PRIVATE_KEY,
  clientEmail: ENV.GOOGLE_FIREBASE.GOOGLE_FIREBASE_CLIENT_EMAIL,
  client_id: ENV.GOOGLE_FIREBASE.GOOGLE_FIREBASE_CLIENT_ID,
  auth_uri: ENV.GOOGLE_FIREBASE.GOOGLE_FIREBASE_AUTH_URI,
  token_uri: ENV.GOOGLE_FIREBASE.GOOGLE_FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: ENV.GOOGLE_FIREBASE.GOOGLE_FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: ENV.GOOGLE_FIREBASE.GOOGLE_FIREBASE_CLIENT_X509_CERT_URL,
  universe_domain: ENV.GOOGLE_FIREBASE.GOOGLE_FIREBASE_UNIVERSE_DOMAIN,
};

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
