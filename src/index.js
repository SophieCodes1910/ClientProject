const functions = require('firebase-functions');
const cors = require('cors');
const express = require('express'); // Make sure you have Express installed
const app = express();

// Use CORS middleware
app.use(cors({ origin: true })); // Allows all origins; you can customize this as needed

// Define your endpoints
app.get('/your-endpoint', (req, res) => {
    res.send("Hello from Firebase!");
});

// Export your API
exports.api = functions.https.onRequest(app);
