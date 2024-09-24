// This function is called when the user clicks the search button
function searchVehicles() {
    const searchTerm = document.getElementById('search-bar').value.toLowerCase();

    // This will redirect to specific pages based on the search term
    if (searchTerm === 'honda' || searchTerm === 'honda civic') {
        window.location.href = 'honda.html';
    } else if (searchTerm === 'toyota' || searchTerm === 'grand highlander') {
        window.location.href = 'toyota.html';
    } else {
        // Proceed with normal search if the term doesn't match any specific cases
        sendSearchQuery(searchTerm);
    }
}

// This function sends the search query to the server and handles the response
function sendSearchQuery(searchTerm) {
    // Here you'd send the searchTerm to your backend API endpoint '/search'
    fetch('/search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: searchTerm }),
    })
    .then(response => response.json())
    .then(data => {
        // Handle the response data by updating the front end with the search results
        displaySearchResults(data);
    })
    .catch((error) => {
        console.error('Error:', error);
        // Handle any errors here, such as by showing an error message to the user
    });
}

// This function is called when the manufacturer button is clicked
function filterVehicles(manufacturer) {
    const lowerCaseManufacturer = manufacturer.toLowerCase();
    
    // Redirect to specific pages based on the manufacturer
    if (lowerCaseManufacturer === 'honda') {
        window.location.href = 'honda.html';
    } else if (lowerCaseManufacturer === 'toyota' || lowerCaseManufacturer.includes('grand highlander')) {
        window.location.href = 'toyota.html';
    } else {
        // Proceed with normal filter if the manufacturer doesn't match any specific cases
        sendFilterQuery(lowerCaseManufacturer);
    }
}

// This function sends the filter query to the server and handles the response
function sendFilterQuery(manufacturer) {
    // Here you'd send the manufacturer to your backend API endpoint '/filter'
    fetch('/filter', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ manufacturer: manufacturer }),
    })
    .then(response => response.json())
    .then(data => {
        // Handle the response data by updating the front end with the filtered vehicles
        displayVehicles(data);
    })
    .catch((error) => {
        console.error('Error:', error);
        // Handle any errors here, such as by showing an error message to the user
    });
}

// This function takes the filtered vehicle data and updates the DOM to display them
function displayVehicles(vehicles) {
    const vehicleListContainer = document.getElementById('vehicle-list-container');
    vehicleListContainer.innerHTML = ''; // Clear previous vehicle listings

    // Create and append the vehicle listings to the vehicle list container
    vehicles.forEach(vehicle => {
        const vehicleDiv = document.createElement('div');
        vehicleDiv.className = 'vehicle-item';
        vehicleDiv.innerHTML = `
            <h2>${vehicle.model}</h2>
            <p>${vehicle.details}</p>
            <p>Price: ${vehicle.price}</p>
            <!-- Add more vehicle details here -->
        `;
        vehicleListContainer.appendChild(vehicleDiv);
    });
}

// Add click event listeners to the manufacturer buttons
document.querySelectorAll('.manufacturer-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        filterVehicles(this.textContent);
    });
});
