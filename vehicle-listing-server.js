const express = require('express');
const oracledb = require('oracledb');
const cors = require('cors');
const app = express();
const port = 3009;

// Enable CORS for all routes
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// OracleDB connection pool settings
oracledb.autoCommit = true;
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT; // Fetch SQL results as objects

const dbConfig = {
    user: 'system',
    password: 'Prestwick1#', // Remember to secure your passwords!
    connectString: 'localhost/XE',
    poolMin: 10,
    poolMax: 10,
    poolIncrement: 0
};

// Initialize the OracleDB connection pool
async function initialize() {
    try {
        await oracledb.createPool(dbConfig);
    } catch (err) {
        console.error('Error initializing OracleDB connection pool', err);
        process.exit(1);
    }
}

// Start the server and initialize the database pool
initialize().then(() => {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
});

// Endpoint to get vehicle and transaction data using POST
app.post('/get-vehicle-data', async (req, res) => {
    let connection;
    try {
        const vehicleId = req.body.vehicleId;
        if (typeof vehicleId !== 'number') {
            res.status(400).send('Vehicle ID must be a number');
            return;
        }

        connection = await oracledb.getConnection();

        const vehicleQuery = `
            SELECT MANUFACTURER, MODEL, YEAR, PRICE
            FROM VEHICLES_INVENTORY
            WHERE VEHICLEID = :vehicleId`;

        const vehicleResult = await connection.execute(vehicleQuery, [vehicleId], { outFormat: oracledb.OUT_FORMAT_OBJECT });

        const transactionQuery = `
            SELECT VEHICLEPRICE, PARKINGCOST, DESTINATIONCHARGES, SHIPPINGCOST, SUBTOTAL
            FROM VEHICLE_TRANSACTIONS
            WHERE VEHICLEID = :vehicleId`;

        const transactionResult = await connection.execute(transactionQuery, [vehicleId], { outFormat: oracledb.OUT_FORMAT_OBJECT });

        if (vehicleResult.rows.length === 0 || transactionResult.rows.length === 0) {
            res.status(404).send('Vehicle or transaction data not found');
            return;
        }

        res.json({
            vehicle: vehicleResult.rows[0],
            transaction: transactionResult.rows[0]
        });
    } catch (err) {
        console.error('Error fetching data', err);
        res.status(500).send('Error fetching data');
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error('Error closing OracleDB connection', err);
            }
        }
    }
});

// Placeholder for a GET endpoint if needed
// app.get('/get-vehicle-data', (req, res) => {
//     // Handle GET request
// });

