const oracledb = require('oracledb');
const express = require('express');
const cors = require('cors');

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

const app = express();
app.use(cors());
app.use(express.json());

const dbConfig = {
    user: 'system',
    password: 'Prestwick1#',
    connectString: 'localhost/XE',
    poolMin: 10,
    poolMax: 10,
    poolIncrement: 0
};

async function verifyUser(username, password) {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const result = await connection.execute(
            `SELECT PASSWORD FROM USERCREDENTIALS WHERE USERNAME = :username`,
            [username]
        );

        if (result.rows.length === 0) {
            return false; // Username not found
        }

        const userPassword = result.rows[0].PASSWORD;

        // Compare the provided password with the stored password
        return userPassword === password;
    } catch (err) {
        console.error(err);
        throw new Error('Error verifying user');
    } finally {
        if (connection) {
            try {
                await connection.close(); // Always close connections
            } catch (err) {
                console.error(err);
            }
        }
    }
}

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const userIsValid = await verifyUser(username, password);

        if (userIsValid) {
            // Handle successful login
            res.json({ success: true, message: 'Login successful' });
        } else {
            // Handle login failure
            res.status(401).json({ success: false, message: 'Invalid username or password' });
        }
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ success: false, message: 'An error occurred during login. Please try again.' });
    }
});

const port = 3000;
app.listen(port, () => {
    console.log(`Login server is running on http://localhost:${port}`);
});
