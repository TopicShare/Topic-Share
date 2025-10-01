import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBMrveVm1A-pELpEltOHmN5GHpiA-2jBKQ",
  authDomain: "topic-share-e3a46.firebaseapp.com",
  projectId: "topic-share-e3a46",
  storageBucket: "topic-share-e3a46.firebasestorage.app",
  messagingSenderId: "409924297116",
  appId: "1:409924297116:web:69531b582090196ff66859",
  measurementId: "G-R1RXQZWM30"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
//const analytics = getAnalytics(app);

export { db }
