import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser'; // Import body-parser

const app = express();

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Enable CORS for specific origin
app.use(cors({
    origin: 'https://sophiecodes1910.github.io', // Change to your frontend URL
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Your routes here
app.post('/auth/login', (req, res) => {
    const { email, password } = req.body;

    // Add your login logic here

    res.status(200).json({ message: 'Login successful' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

