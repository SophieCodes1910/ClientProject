const express = require('express');
const { createEvent, updateEvent, deleteEvent, getEventById, getAllEvents } = require('../src/firebase'); // Import Firebase functions
const multer = require('multer'); // For handling file uploads
const path = require('path'); // Required for handling file paths
const router = express.Router();

// Set up file upload using Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Store files in 'uploads/' folder
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Use unique file names based on current timestamp
    }
});
const upload = multer({ storage: storage });

// Route to create a new event
router.post('/CreateEvent', upload.single('eventImage'), async (req, res) => {
    const { eventName, organizerUsername, description, eventDate, location, additionalInfo } = req.body;
    const eventImage = req.file ? req.file.path : ''; // Get the path of the uploaded image

    // Prepare the new event object, omitting undefined values
    const newEvent = {
        eventName: eventName || "",
        organizerUsername: organizerUsername || "",
        description: description || "",
        eventDate: eventDate || null,
        location: location || "",
        eventImage: eventImage || "",
        ...(additionalInfo && { additionalInfo }) // Only include additionalInfo if defined
    };

    try {
        await createEvent(newEvent); // Assuming the function creates an event in Firestore
        res.redirect('/Event/Events'); // Redirect to the event listing page
    } catch (error) {
        console.error('Error creating event:', error.message);
        res.status(500).send('Error creating event.');
    }
});

// Route to retrieve event details for editing
router.get('/EditEvent/:id', async (req, res) => {
    const eventId = req.params.id;

    try {
        const event = await getEventById(eventId); // Assuming this fetches an event by ID
        res.render('EditEvent', { event });
    } catch (error) {
        console.error('Error fetching event:', error.message);
        res.status(500).send('Error fetching event.');
    }
});

// Route to update event details
router.post('/EditEvent/:id', upload.single('eventImage'), async (req, res) => {
    const { eventName, organizerUsername, description, eventDate, location, additionalInfo } = req.body;
    const eventImage = req.file ? req.file.path : ''; // Get the new file path if updated
    const eventId = req.params.id;

    // Prepare the updated event object, omitting undefined values
    const updatedEvent = {
        eventName: eventName || "",
        organizerUsername: organizerUsername || "",
        description: description || "",
        eventDate: eventDate || null,
        location: location || "",
        eventImage: eventImage || "",
        ...(additionalInfo && { additionalInfo }) // Only include additionalInfo if defined
    };

    try {
        await updateEvent(eventId, updatedEvent); // Assuming the function updates the event in Firestore
        res.redirect(`/Event/EventDetails/${eventId}`); // Redirect to the event details page
    } catch (error) {
        console.error('Error updating event:', error.message);
        res.status(500).send('Error updating event.');
    }
});

// Route to delete an event
router.delete('/DeleteEvent/:id', async (req, res) => {
    const eventId = req.params.id;

    try {
        await deleteEvent(eventId); // Assuming this function deletes an event in Firestore
        res.status(200).send('Event deleted successfully');
    } catch (error) {
        console.error('Error deleting event:', error.message);
        res.status(500).send('Error deleting event.');
    }
});

// Route to fetch all events for the Events page
router.get('/Events', async (req, res) => {
    try {
        const events = await getAllEvents(); // Fetch all events from Firestore
        res.render('index', { events }); // Render the index page with events data
    } catch (error) {
        console.error('Error fetching events:', error.message);
        res.status(500).send('Error fetching events.');
    }
});

module.exports = router;
