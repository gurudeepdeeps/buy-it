import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const fallbackFirebaseConfig = {
  apiKey: "AIzaSyDsZiPG86KEXsj0FoB1ImskIM8cxW9AF7k",
  authDomain: "buy-it-2514.firebaseapp.com",
  projectId: "buy-it-2514",
  storageBucket: "buy-it-2514.firebasestorage.app",
  messagingSenderId: "375235910142",
  appId: "1:375235910142:web:7c56a6b193bb1dfd8f48af",
  measurementId: "G-CJMB9FX0YR"
};

const firebaseConfig = window.BUYIT_FIREBASE_CONFIG || fallbackFirebaseConfig;

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);