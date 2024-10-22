// server.js
const functions = require('firebase-functions');
const cors = require('cors');
const express = require('express');
const { auth, db, storage } = require('./src/firebase'); // Adjust the path if necessary

// Create an instance of Express
const expressApp = express();

// Use CORS middleware with a specific origin
expressApp.use(cors({
    origin: 'https://sophiecodes1910.github.io', // Your GitHub Pages URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true // Allow cookies or other credentials if needed
}));

// Define your endpoints
expressApp.post('/auth/login', (req, res) => {
    // Handle login logic here
    res.send("Login successful");
});

// Export your API
exports.api = functions.https.onRequest(expressApp); // Use the Express app
