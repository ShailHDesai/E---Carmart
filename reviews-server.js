// chatbot-server.js (Server-Side)
const express = require('express');
const cors = require('cors'); // Import CORS module
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const app = express();
app.use(cors()); // Use CORS for all routes
app.use(express.json());
app.use(express.static('public')); // Serve static files from the 'public' directory

const port = 3022; // Ensure this port is not in use by another service
const mongoUrl = 'mongodb://localhost:27017/';
const client = new MongoClient(mongoUrl);
const dbName = 'E-Carmart';
const collectionName = 'user_reviews';

// Connect to the MongoDB client
client.connect().then(() => {
    console.log('Connected successfully to MongoDB server');
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Endpoint to GET reviews from the MongoDB collection
    app.get('/reviews', async (req, res) => {
        try {
            const reviews = await collection.find({}).toArray();
            res.status(200).json(reviews);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching reviews', error });
        }
    });

    // Endpoint to POST a new review to the MongoDB collection
    app.post('/reviews', async (req, res) => {
        try {
            const newReview = req.body;
            // Optionally add validation for `newReview` here
            const result = await collection.insertOne(newReview);
            res.status(201).json({ message: 'Review added', _id: result.insertedId });
        } catch (error) {
            res.status(500).json({ message: 'Error adding review', error });
        }
    });

}).catch(console.error);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
