import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD-85_2oWXfsKcPu0dep4PuO47idxww0Gc",
  authDomain: "sementha-196ec.firebaseapp.com",
  projectId: "sementha-196ec",
  storageBucket: "sementha-196ec.firebasestorage.app",
  messagingSenderId: "397825724452",
  appId: "1:397825724452:web:d1d2337e25c4701566c8b1"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);