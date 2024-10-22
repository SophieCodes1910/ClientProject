const functions = require('firebase-functions');
const cors = require('cors');
const express = require('express');
const app = express();

// Use CORS middleware
app.use(cors({ origin: 'https://sophiecodes1910.github.io' })); // Specify your front-end URL

// Enable preflight requests
app.options('/auth/login', cors());

// Define your endpoints
app.post('/auth/login', (req, res) => {
    // Handle login logic here
    res.send("Login endpoint");
});

// Export your API
exports.api = functions.https.onRequest(app);
