// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your Firebase configuration
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
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp); // Initialize auth
const db = getFirestore(firebaseApp); // Initialize Firestore
const storage = getStorage(firebaseApp); // Initialize Storage

// Function to update a document in Firestore
const updateEvent = async (docId, eventData) => {
    const eventRef = doc(db, "events", docId);
    try {
        await updateDoc(eventRef, eventData);
        console.log("Event updated successfully!");
    } catch (error) {
        console.error("Error updating event: ", error);
        throw error; // Rethrow error for handling in the calling function
    }
};

// Export auth, db, storage, and updateEvent
export { auth, db, storage, updateEvent };

