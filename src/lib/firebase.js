
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAKqZmK2e5O1NAeHzKdzmApknLKaUtZ028",
  authDomain: "adventure-culture.firebaseapp.com",
  projectId: "adventure-culture",
  storageBucket: "adventure-culture.firebasestorage.app",
  messagingSenderId: "630984438405",
  appId: "1:630984438405:web:5c45a744babe9bb9ee2fec",
  measurementId: "G-9YTTWNXCZF"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, analytics, auth, db };
