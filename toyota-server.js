// honda-server.js

const oracledb = require('oracledb');
const express = require('express');
const cors = require('cors');

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
const app = express();
app.use(cors());
app.use(express.json()); // For parsing application/json

// OracleDB connection pool settings
const dbConfig = {
    user: 'system',
    password: 'Prestwick1#',
    connectString: 'localhost/XE',
    poolMin: 10,
    poolMax: 10,
    poolIncrement: 0
};

// Initialize database connection pool
async function initialize() {
    try {
        await oracledb.createPool(dbConfig);
        console.log('Connection pool started');
        // Start the Express server here if the pool is successfully created
        const port = 3004; // or any port you prefer
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (err) {
        console.error('Error initializing database pool', err);
        process.exit(1);
    }
}

initialize();

// Endpoint to get vehicle details by manufacturer and model
app.get('/api/vehicles', async (req, res) => {
    let connection;
    try {
        // Destructuring query parameters
        const { manufacturer, model } = req.query;
        
        // Get connection from the pool
        connection = await oracledb.getConnection();
        
        const result = await connection.execute(
            `SELECT * FROM VEHICLES_INVENTORY WHERE MANUFACTURER = :manufacturer AND MODEL = :model`,
            [manufacturer, model] // Bind parameters to avoid SQL injection
        );

        // Assuming there is at least one Honda Civic in the inventory
        const vehicle = result.rows[0] || {};

        res.json(vehicle);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while fetching vehicle details' });
    } finally {
        if (connection) {
            try {
                // Always close connections
                await connection.close(); 
            } catch (err) {
                console.error(err);
            }
        }
    }
});

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('Received SIGTERM, shutting down gracefully');
    await oracledb.getPool().close();
    process.exit(0);
});
