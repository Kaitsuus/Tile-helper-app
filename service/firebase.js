import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
import constants from 'expo-constants';

const firebaseConfig = {
  apiKey: constants.manifest.extra.apiKey,
  authDomain: constants.manifest.extra.authDomain,
  projectId: constants.manifest.extra.projectId,
  storageBucket: constants.manifest.extra.storageBucket,
  messaginSenderId: constants.manifest.extra.messagingSenderId,
  appId: constants.manifest.extra.appId,
  databaseURL: constants.manifest.extra.databaseURL,
  measurementId: constants.manifest.extra.measurementId
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const auth = getAuth();
export const database = getFirestore();
