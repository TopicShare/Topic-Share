import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCmkGCVOcgxihgrxDAW4hSKureKHUxkW7M",
  authDomain: "topic-share-28f8c.firebaseapp.com",
  projectId: "topic-share-28f8c",
  storageBucket: "topic-share-28f8c.firebasestorage.app",
  messagingSenderId: "965604077811",
  appId: "1:965604077811:web:42fe0bed93ae7423534786",
  measurementId: "G-1V0WBWM4CB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
//const analytics = getAnalytics(app);

import { getFunctions } from "firebase/functions";
const functions = getFunctions(app);

export { db, functions }
