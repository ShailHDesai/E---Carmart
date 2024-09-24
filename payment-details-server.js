const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const oracledb = require('oracledb');
const ObjectId = require('mongodb').ObjectId;

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

const app = express();
app.use(cors());
app.use(express.json()); // For parsing application/json
app.use(express.static('public')); // Serve static files from the 'public' directory

const port = 3011; // Ensure this port is not in use by another service
const mongoUrl = 'mongodb://localhost:27017/';
const mongoClient = new MongoClient(mongoUrl);
const dbName = 'E-Carmart';
const collectionName = 'package_selection';

// OracleDB connection pool settings
const dbConfig = {
    user: 'system',
    password: 'Prestwick1#',
    connectString: 'localhost/XE',
    poolMin: 10,
    poolMax: 10,
    poolIncrement: 0
};

// Middleware to establish a new database connection for each HTTP request
app.use(async (req, res, next) => {
    try {
        req.dbConnection = await oracledb.getConnection(dbConfig);
        next();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error connecting to Oracle database' });
    }
});

// API to get the current user's details
app.get('/api/current-user', async (req, res) => {
    try {
        const username = req.query.username;
        const result = await req.dbConnection.execute(
            `SELECT USERID, USERNAME FROM USERCREDENTIALS WHERE USERNAME = :username`,
            [username]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching user details' });
    } finally {
        if (req.dbConnection) {
            try {
                await req.dbConnection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
});

// API to get the vehicle ID for the current user
app.get('/api/user-vehicle', async (req, res) => {
    try {
        const userID = req.query.userID;
        const result = await req.dbConnection.execute(
            `SELECT VEHICLEID FROM USER_GARAGE WHERE USERID = :userID`,
            [userID]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching vehicle ID' });
    } finally {
        if (req.dbConnection) {
            try {
                await req.dbConnection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
});

// API to post the selected package for the user
app.post('/api/select-package', async (req, res) => {
    try {
        const { packageType, vehicleID, userName } = req.body;
        const mongoDb = mongoClient.db(dbName);
        const collection = mongoDb.collection(collectionName);

        const customerResult = await req.dbConnection.execute(
            `SELECT USERID FROM USERCREDENTIALS WHERE USERNAME = :userName`,
            [userName]
        );

        const customerID = customerResult.rows[0] ? customerResult.rows[0].USERID : null;
        if (!customerID) {
            return res.status(404).json({ error: 'User not found' });
        }

        const insertResult = await collection.insertOne({
            PackageType: packageType,
            CustomerID: `CRM${customerID.toString().padStart(2, '0')}`,
            VehicleID: vehicleID,
            UserName: userName
        });

        res.json({ insertedId: insertResult.insertedId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error inserting package selection' });
    }
});

// Middleware to close the Oracle connection
app.use((req, res, next) => {
    if (req.dbConnection) {
        req.dbConnection.close().catch(console.error);
    }
    next();
});

// Start the server
app.listen(port, async () => {
    try {
        await mongoClient.connect();
        console.log(`Server is running on port ${port}`);
    } catch (err) {
        console.error('Error connecting to MongoDB', err);
    }
});
