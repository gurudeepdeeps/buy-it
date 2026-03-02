import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDsZiPG86KEXsj0FoB1ImskIM8cxW9AF7k",
  authDomain: "buy-it-2514.firebaseapp.com",
  projectId: "buy-it-2514",
  storageBucket: "buy-it-2514.firebasestorage.app",
  messagingSenderId: "375235910142",
  appId: "1:375235910142:web:7c56a6b193bb1dfd8f48af",
  measurementId: "G-CJMB9FX0YR"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);