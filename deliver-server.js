const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// MongoDB connection string and connection
const mongoConnectionString = 'mongodb://localhost:27017/E-Carmart';
mongoose.connect(mongoConnectionString, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('error', (error) => console.error('MongoDB connection error:', error));

// Schema definition using GeoJSON for coordinates and including vehicleType
const deliverySchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  vehicleType: {
    type: String,
    enum: ['SUV', 'Sedan', 'Compact', 'Sports', 'EV'],
    required: true
  },
  coordinates: {
    type: { type: String, enum: ['Point'], required: true },
    coordinates: {
      type: [Number], // format: [longitude, latitude]
      required: true
    }
  },
  deliveryType: String
});

// This will Create a geospatial index on the 'coordinates' field
deliverySchema.index({ coordinates: '2dsphere' });

const Delivery = mongoose.model('CarDeliveryType', deliverySchema);

app.use(cors());
app.use(bodyParser.json());

app.post('/submit-delivery-form', async (req, res) => {
  try {
    // User's submitted coordinates in GeoJSON format
    const userLocation = {
      type: 'Point',
      coordinates: [parseFloat(req.body.longitude), parseFloat(req.body.latitude)] // longitude, latitude
    };

    // Define the dealership coordinates
    const dealershipLocation = {
      type: 'Point',
      coordinates: [-86.176338, 39.773884] // longitude, latitude
    };

    // Maximum distance in meters (50 miles)
    const distanceLimit = 80467;

    // Check if the user's location is within 50 miles of the dealership
    const withinRange = await Delivery.findOne({
      coordinates: {
        $near: {
          $geometry: userLocation,
          $maxDistance: distanceLimit
        }
      }
    });

    // Prepare the delivery entry
    const deliveryEntry = new Delivery({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      vehicleType: req.body.vehicleType,
      coordinates: userLocation,
      deliveryType: req.body.deliveryType
    });

    // The response logic is conditional based on the range check
    if (withinRange) {
      // Save the delivery entry to MongoDB since the user is within range
      const savedEntry = await deliveryEntry.save();
      res.status(200).send({ message: 'You qualify for free delivery', data: savedEntry });
    } else {
      res.status(200).send({ message: 'You do not qualify for free delivery' });
    }

  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while processing your request.');
  }
});

const PORT = 2431;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
