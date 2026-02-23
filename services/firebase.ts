import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCK8cAytnI00lI8amOOT5oiDmApluHCiHc",
  authDomain: "what-will-eat-36a7f.firebaseapp.com",
  projectId: "what-will-eat-36a7f",
  storageBucket: "what-will-eat-36a7f.firebasestorage.app",
  messagingSenderId: "13278521659",
  appId: "1:13278521659:web:ffe7710aac79fd53332f1e"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
