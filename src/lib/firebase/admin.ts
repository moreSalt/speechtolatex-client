import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import {getStorage} from "firebase-admin/storage"
import {
  FIREBASE_ADMIN_PRIVATE_KEY,
  FIREBASE_ADMIN_CLIENT_EMAIL,
} from "$env/static/private";
import { PUBLIC_FIREBASE_PROJECT_ID } from "$env/static/public";
import pkg from "firebase-admin";
const {credential} = pkg

function makeApp() {
  const apps = getApps();
  if (apps.length > 0) {
    return apps[0]!;
  }

  return initializeApp({
    credential: credential.cert({
      privateKey: FIREBASE_ADMIN_PRIVATE_KEY,
      clientEmail: FIREBASE_ADMIN_CLIENT_EMAIL,
      projectId: PUBLIC_FIREBASE_PROJECT_ID,
    }),
    databaseURL: `https://${PUBLIC_FIREBASE_PROJECT_ID}.firebaseio.com`,
    storageBucket: `gs://${PUBLIC_FIREBASE_PROJECT_ID}.appspot.com`
  });
}
export const firebase = makeApp();
export const auth = getAuth(firebase);
export const firestore = getFirestore();
export const bucket = getStorage().bucket()