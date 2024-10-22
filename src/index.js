const functions = require('firebase-functions');
const cors = require('cors');
const express = require('express');
const { initializeApp } = require('firebase/app'); // Import Firebase methods
const { getFirestore } = require('firebase/firestore');
const { getAuth } = require('firebase/auth');
const { getStorage } = require('firebase/storage');

// Create an instance of Express
const expressApp = express(); // Renamed to avoid confusion

// Use CORS middleware with a specific origin
expressApp.use(cors({
    origin: 'https://sophiecodes1910.github.io', // Your GitHub Pages URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true // Allow cookies or other credentials if needed
}));

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
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(firebaseApp); // Firestore initialization
const auth = getAuth(firebaseApp);
const storage = getStorage(firebaseApp);

// Export Firestore and auth instances for use in other files
exports.db = db; // Use module exports instead of ES6 export
exports.storage = storage;
exports.auth = auth;

// Define your endpoints
expressApp.post('/auth/login', (req, res) => {
    // Handle login logic here
    res.send("Login successful");
});

// Export your API
exports.api = functions.https.onRequest(expressApp); // Use the renamed express app
