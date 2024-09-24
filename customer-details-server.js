const oracledb = require('oracledb');
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { MongoClient, ObjectId } = require('mongodb');
const pdfParse = require('pdf-parse');

// Configure multer for in-memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// OracleDB connection pool settings
const dbConfig = {
    user: 'system',
    password: 'Prestwick1#',
    connectString: 'localhost/XE',
    poolMin: 10,
    poolMax: 10,
    poolIncrement: 0
};

// MongoDB connection settings
const mongoUrl = 'mongodb://localhost:27017/';
const mongoClient = new MongoClient(mongoUrl);
const dbName = 'E-Carmart';
const collectionName = 'pdfDetails';

async function initialize() {
    try {
        await oracledb.createPool(dbConfig);
        await mongoClient.connect();
        console.log('OracleDB and MongoDB connection pools started');
        const port = 30017; // or any port you prefer
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (err) {
        console.error('Error initializing database pools', err);
        process.exit(1);
    }
}

async function insertCustomer(customerData) {
let connection;
    try {
        connection = await oracledb.getConnection();
        const { firstName, lastName, email, ssn, phoneNumber, address, state, zipcode, country } = customerData;

        const result = await connection.execute(
            `INSERT INTO Customer_Details (First_Name, Last_Name, Email_Address, SSN, Phone_Number, Street_Address, State, Zip_Code, Country)
             VALUES (:firstName, :lastName, :email, :ssn, :phoneNumber, :address, :state, :zipcode, :country)`,
            {
                firstName, lastName, email, ssn, phoneNumber, address, state, zipcode, country
            },
            { autoCommit: true }
        );

        console.log('Customer inserted successfully:', result);
        return result;
    } catch (err) {
        console.error('Error inserting customer:', err);
        throw err;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error('Error closing connection:', err);
            }
        }
    }
}

// This route will handle both customer details and PDF upload
app.post('/upload-pdf', upload.single('license'), async (req, res) => {
    try {
        const customerDetails = JSON.parse(req.body.customerDetails);
        const pdfBuffer = req.file.buffer;

        // Parse text from the PDF buffer using pdf-parse
        const data = await pdfParse(pdfBuffer);
        const text = data.text;

        // Use regular expressions or text parsing to extract the desired information
        // Adjust regex according to the actual content of your PDFs
        const nameMatch = text.match(/Name: (.*)/);
        const licenseIdMatch = text.match(/License ID: (.*)/);
        const validFromMatch = text.match(/Valid From: (.*)/);
        const validThruMatch = text.match(/Valid Thru: (.*)/);

        // Insert customer details into OracleDB
        await insertCustomer(customerDetails);

        // Prepare PDF details for MongoDB insertion
        const pdfDetails = {
            _id: new ObjectId(),
            customerName: nameMatch ? nameMatch[1].trim() : null,
            licenseID: licenseIdMatch ? licenseIdMatch[1].trim() : null,
            validFrom: validFromMatch ? validFromMatch[1].trim() : null,
            validThru: validThruMatch ? validThruMatch[1].trim() : null,
            timestamp: new Date()
        };

        // Insert PDF details into MongoDB
        const db = mongoClient.db("E-Carmart");
        const collection = db.collection("pdfDetails");
        await collection.insertOne(pdfDetails);

        res.status(200).json({ message: 'Customer and PDF details inserted successfully' });
    } catch (err) {
        if (err instanceof SyntaxError) {
            res.status(400).json({ message: 'Invalid customer details JSON format', error: err.message });
        } else {
            console.error('Error:', err);
            res.status(500).json({ message: 'An error occurred while uploading the PDF.', error: err.message });
        }
    }
});

initialize();
