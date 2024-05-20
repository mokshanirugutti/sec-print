import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

import * as firebaseEnv from '../apikeys';

const firebaseConfig = {
  apiKey: firebaseEnv.REACT_APP_FIREBASE_API_KEY,
  authDomain: firebaseEnv.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: firebaseEnv.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: firebaseEnv.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: firebaseEnv.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: firebaseEnv.REACT_APP_FIREBASE_APP_ID,
};

export default firebaseConfig;

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
