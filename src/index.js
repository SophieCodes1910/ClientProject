const functions = require('firebase-functions');
const cors = require('cors');
const express = require('express');
const app = express();

// Use CORS middleware with a specific origin
app.use(cors({
    origin: 'https://sophiecodes1910.github.io', // Your GitHub Pages URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true // Allow cookies or other credentials if needed
}));

// Define your endpoints
app.post('/auth/login', (req, res) => {
    // Handle login logic here
    res.send("Login successful");
});

// Export your API
exports.api = functions.https.onRequest(app);
