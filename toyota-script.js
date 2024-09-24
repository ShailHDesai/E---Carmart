// honda-script.js

document.addEventListener('DOMContentLoaded', function() {
    fetchVehicleDetails('Toyota', 'Grand Highlander');
  });
  
  function fetchVehicleDetails(manufacturer, model) {
    var url = `http://localhost:3004/api/vehicles?manufacturer=${encodeURIComponent(manufacturer)}&model=${encodeURIComponent(model)}`;
  
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if(data) {
          updateVehicleUI(data);
        } else {
          console.log('No vehicle data found.');
          // Handle case where no data is found
        }
      })
      .catch(error => {
        console.error('Error fetching vehicle details:', error);
        // Here you might want to update the UI to show the error
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
    `;
  
    // Now you don't need to select the priceSectionDiv because it is part of the template literal above.
  }
  