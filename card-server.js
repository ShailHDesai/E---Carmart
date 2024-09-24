const oracledb = require('oracledb');
const express = require('express');
const cors = require('cors');

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
const app = express();
app.use(cors());
app.use(express.json()); // For parsing application/json

// OracleDB connection pool settings
async function startServer() {
    try {
        await oracledb.createPool({
            user: 'system',
            password: 'Prestwick1#', // This should be managed securely
            connectString: 'localhost/XE',
            poolMin: 10,
            poolMax: 10,
            poolIncrement: 0
        });

        app.post('/submit-payment', async (req, res) => {
            let connection;
            try {
                // Check if cardNumberPart1 is undefined before proceeding
                if (typeof req.body.cardNumberPart1 === 'undefined') {
                    return res.status(400).json({ message: 'Card number part 1 is undefined.' });
                }
                const cardNumberPart1 = req.body.cardNumberPart1;

                let provider = '';
                // Determine provider from card number
                if (cardNumberPart1.startsWith('4')) {
                    provider = 'Visa';
                } else if (cardNumberPart1.startsWith('5')) {
                    provider = 'MasterCard';
                } else if (cardNumberPart1.startsWith('3')) {
                    provider = 'American Express';
                } else {
                    return res.status(400).json({ message: 'Unsupported card provider.' });
                }

                // Combine the card number parts and expiry date parts
                const fullCardNumber = cardNumberPart1 + req.body.cardNumberPart2 + req.body.cardNumberPart3 + req.body.cardNumberPart4;
                const expiryDate = req.body.expiryMonth + '/' + req.body.expiryYear;

                connection = await oracledb.getConnection();
                const result = await connection.execute(
                    `INSERT INTO Payment_Methods (PaymentType, Provider, AccountNumber, ExpiryDate, CVV) 
                     VALUES (:PaymentType, :Provider, :AccountNumber, :ExpiryDate, :CVV)`,
                    {
                        PaymentType: req.body.paymentType,
                        Provider: provider,
                        AccountNumber: fullCardNumber,
                        ExpiryDate: expiryDate,
                        CVV: req.body.cvv
                    },
                    { autoCommit: true }
                );
                console.log(result);
                res.json({ message: 'Payment method added successfully.' });
            } catch (err) {
                console.error(err);
                res.status(500).json({ message: 'Error inserting into database' });
            } finally {
                if (connection) {
                    try {
                        await connection.close();
                    } catch (err) {
                        console.error(err);
                    }
                }
            }
        });

        app.listen(30018, () => {
            console.log('Server is running on port 30018');
        });
    } catch (err) {
        console.error('Error: ', err);
    }
}

startServer();
