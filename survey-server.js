const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');

const app = express();
const port = 2313;

app.use(bodyParser.json());

// Redirect the root route to survey.html instead of index.html
// This needs to be before the static middleware
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/survey.html');
});

// Serve static files from the root directory
// This line serves all static files in the directory
app.use(express.static('./'));

const url = 'mongodb://localhost:27017/';
const dbName = 'E-Carmart';
const collectionName = 'SurveyResponses';

// Route for handling survey submissions
app.post('/submit-survey', async (req, res) => {
    const client = new MongoClient(url);

    try {
        await client.connect();
        console.log("Connected to MongoDB");

        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const insertResult = await collection.insertOne(req.body);
        console.log('Survey Response Inserted', insertResult.insertedId);

        res.status(200).json({ success: true, id: insertResult.insertedId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    } finally {
        await client.close();
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
