const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');
const { createEvent, getAllEvents } = require('./src/firebase'); // Import Firebase functions
const eventRouter = require('./routes/Event'); // Import event routes
const app = express();
const port = 3000;

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// Set up view engine (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// File upload setup using Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Routes
app.use('/Event', eventRouter); // Correct the path to be '/Event' instead of '/route/Event'

// Homepage route
app.get('/', async (req, res) => {
    try {
        const events = await getAllEvents(); // Fetch events from Firebase
        res.render('index', { events }); // Pass events to the template
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).send('Error fetching events.');
    }
});

// Event creation form page
app.get('/CreateEvent', (req, res) => {
    res.render('CreateEvent');
});

// Endpoint for handling the event creation
app.post('/CreateEvent', upload.fields([{ name: 'schedule' }, { name: 'map' }, { name: 'media' }]), async (req, res) => {
    const { eventName, organizerUsername, description, eventDate, location, eventType, invitees, additionalInfo } = req.body;
    const { schedule, map, media } = req.files;

    const newEvent = {
        eventName,
        organizerUsername,
        description,
        eventDate,
        location,
        eventType: eventType ? true : false, // Convert to boolean if checkbox is checked
        invitees: invitees ? invitees.split(',').map(email => email.trim()) : [], // Process invitees
        additionalInfo,
        schedule: schedule ? schedule[0].path : '',
        map: map ? map[0].path : '',
        media: media ? media.map(file => file.path) : []
    };

    try {
        await createEvent(newEvent);  // Assuming this function creates an event in Firestore
        res.redirect('/Events');  // Redirect to events listing page
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).send('Error creating event.');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
