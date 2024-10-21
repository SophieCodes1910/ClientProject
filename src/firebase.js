//firebase.js
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Firestore import
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDFpg7vHMOo2yTu_KtXi1CZOckgSSYLK6I",
  authDomain: "huppsi-f21cd.firebaseapp.com",
  projectId: "huppsi-f21cd",
  storageBucket: "huppsi-f21cd.appspot.com",
  messagingSenderId: "110923500307",
  appId: "1:110923500307:web:506b42eb1ec98d7df2a8e6",
  measurementId: "G-B3BZ2TKK5S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app); // Firestore initialization
const auth = getAuth(app);
const storage = getStorage(app);

export { db, storage }; // Export Firestore instance for use in other files
export {auth};