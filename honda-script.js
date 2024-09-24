// honda-script.js

var currentVehicleId; // This will hold the VehicleID of the currently viewed vehicle

document.addEventListener('DOMContentLoaded', function() {
  fetchVehicleDetails('Honda', 'Civic');
});

document.addEventListener('click', function(event) {
  if (event.target && event.target.id === 'reviews-button') {
    window.location.href = 'reviews.html';
  } else if (event.target && event.target.id === 'add-to-garage-main-button') {
    // Use the currentVehicleId that was saved when fetching vehicle details
    if (currentVehicleId) {
      addToGarage(currentVehicleId);
    } else {
      console.error('Vehicle ID not found.');
    }
  }
});

function fetchVehicleDetails(manufacturer, model) {
  var url = `http://localhost:3003/api/vehicles?manufacturer=${encodeURIComponent(manufacturer)}&model=${encodeURIComponent(model)}`;

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      if (data) {
        currentVehicleId = data.VEHICLEID; // Save the VehicleID
        updateVehicleUI(data);
      } else {
        console.log('No vehicle data found.');
      }
    })
    .catch(error => {
      console.error('Error fetching vehicle details:', error);
    });
}

function updateVehicleUI(vehicle) {
  var vehicleInfoDiv = document.getElementById('vehicle-information');
  vehicleInfoDiv.innerHTML = `
    <h1>${vehicle.YEAR} - ${vehicle.MANUFACTURER} ${vehicle.MODEL}</h1>
    <div id="price-section">Price: $${parseFloat(vehicle.PRICE).toFixed(2)}</div>
    <p>Powertrain: ${vehicle.POWERTRAIN}</p>
    <p>Exterior Color: ${vehicle.EXTERIOR_COLOR}</p>
    <p>Interior Color: ${vehicle.INTERIOR_COLOR}</p>
    <p>Transmission: ${vehicle.TRANSMISSION}</p>
    <p>Fuel Type: ${vehicle.FUEL_TYPE}</p>
    <!-- Do not add the gray 'Add to Garage' button here -->
  `;
  // Other UI updates can be done here if needed
}

function addToGarage(vehicleId) {
  var url = `http://localhost:3003/api/user-garage/add`;

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ vehicleId: vehicleId })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log('Vehicle added to garage:', data);
    alert('Record generated!');
    window.location.href = 'transaction.html';
  })
  .catch(error => {
    console.error('Error adding vehicle to garage:', error);
    alert('Failed to add vehicle to garage.');
  });
}
