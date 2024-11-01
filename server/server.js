const cors = require('cors');
const express = require('express');
const { auth, db, storage } = require('./src/firebase'); // Adjust the path if necessary

// Create an instance of Express
const expressApp = express();

// Define your CORS options
const corsOptions = {
    origin: ['https://sophiecodes1910.github.io'], // Allow GitHub Pages
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // Allow cookies or other credentials if needed
};

// Use CORS middleware
expressApp.use(cors(corsOptions));

// Preflight requests handling (OPTIONS method)
expressApp.options('*', cors()); // This will handle preflight requests automatically

// Use JSON parsing middleware
expressApp.use(express.json()); // For parsing application/json

// Your existing routes here...

// Example endpoint for fetching events
expressApp.get('/invitations/organizer/:email/events', async (req, res) => {
    try {
        const { email } = req.params;
        // Fetch events logic goes here
        const events = []; // Replace with actual fetching logic
        res.status(200).json({ success: true, data: events });
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({ success: false, message: "Failed to fetch events" });
    }
});

// Error handling middleware
expressApp.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Export your API
exports.api = functions.https.onRequest(expressApp); // Use the Express app
