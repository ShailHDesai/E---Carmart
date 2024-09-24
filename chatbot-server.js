// chatbot-server.js (Server-Side)
const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
app.use(cors());
app.use(express.json());

const port = 3001;
const mongoUrl = 'mongodb://localhost:27017/';
const client = new MongoClient(mongoUrl);
const dbName = 'E-Carmart';
const collectionName = 'chatbot';

async function findResponse(collection, userMessage) {
    userMessage = userMessage.toLowerCase();
    
    const keywords = ["schedule", "test drive", "financing options", "tesla", "warranty"];

    const pattern = keywords.join("|");
    const query = { "interaction.user_message": { $regex: new RegExp(pattern, 'i') } };
    
    const document = await collection.findOne(query);

    if (document) {
        const interactions = document.interaction;
        let mostRelevant = { score: 0, response: "" };

        interactions.forEach(interaction => {
            let score = userMessage.split(' ').reduce((score, word) => {
                return score + (interaction.user_message.toLowerCase().includes(word) ? 1 : 0);
            }, 0);

            if (score > mostRelevant.score) {
                mostRelevant = { score: score, response: interaction.bot_response };
            }
        });

        return mostRelevant.response;
    }

    return "I'm not sure how to answer that. Can you ask something else?";
}

async function main() {
    try {
        await client.connect();
        console.log("Connected successfully to MongoDB server");
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // Route handler for the root path
        app.get('/', (req, res) => {
            res.json({ message: "Welcome to the E-Carmart Chatbot API!" });
        });

        app.get('/chatbot/greet', (req, res) => {
            res.json({ message: "Hello! My name is Chatbot. How can I help you today?" });
        });

        app.post('/chatbot', async (req, res) => {
            const userMessage = req.body.message;

            let botResponse;
            if (userMessage.toLowerCase().includes("hello")) {
                botResponse = "Welcome to E-Carmart! How may I assist you today?";
            } else {
                botResponse = await findResponse(collection, userMessage);
            }

            res.json({ message: botResponse });
        });

        app.listen(port, () => {
            console.log(`Chatbot server is running at http://localhost:${port}`);
        });

    } catch (err) {
        console.error("Database connection error: ", err);
        process.exit();
    }
}

main().catch(console.error);

process.on('SIGINT', async () => {
    await client.close();
    process.exit();
});
