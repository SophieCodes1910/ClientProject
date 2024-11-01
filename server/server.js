// server.js
const functions = require('firebase-functions');
const cors = require('cors');
const express = require('express');
const { auth, db, storage } = require('./src/firebase'); // Adjust the path if necessary

// Create an instance of Express
const expressApp = express();

// Replace with your actual Ngrok URL (make sure to remove leading/trailing spaces)
const ngrokUrl = 'https://5544-80-233-56-174.ngrok-free.app'; // Your Ngrok tunnel URL

// Use CORS middleware with specific origins
expressApp.use(cors({
    origin: [ngrokUrl, 'https://sophiecodes1910.github.io'], // Allow both Ngrok and GitHub Pages
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true // Allow cookies or other credentials if needed
}));

// Preflight requests handling (OPTIONS method)
expressApp.options('*', cors()); // This will handle preflight requests automatically

// Use JSON parsing middleware
expressApp.use(express.json()); // For parsing application/json

// Define your endpoints
expressApp.post('/auth/auth', async (req, res) => {
    try {
        // Implement your login logic
        res.status(200).send("Login successful");
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).send("Login failed");
    }
});

// Example endpoint for fetching events
expressApp.get('/EventDetails', async (req, res) => {
    try {
        // Logic to fetch events from Firestore
        const events = []; // Replace with actual fetching logic
        res.status(200).json(events);
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).send("Failed to fetch events");
    }
});

// Error handling middleware
expressApp.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Export your API
exports.api = functions.https.onRequest(expressApp); // Use the Express app
