import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAJ2WsPik41G3R8FP2vyoJEjGuS5BY2QLU',
  authDomain: 'imagigram-b4fdb.firebaseapp.com',
  projectId: 'imagigram-b4fdb',
  storageBucket: 'imagigram-b4fdb.appspot.com',
  messagingSenderId: '461137256661',
  appId: '1:461137256661:web:10634977cb16cf1601c25c',
};

export const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
