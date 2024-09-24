document.addEventListener('DOMContentLoaded', function() {
  // Function to format currency in USD
  function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  }

  // Function to create an element with an ID if it doesn't exist
  function ensureElementExists(id) {
    let elem = document.getElementById(id);
    if (!elem) {
      elem = document.createElement('div');
      elem.id = id;
      document.body.appendChild(elem);
    }
    return elem;
  }

  // Function to update the vehicle info on the page
  function updateVehicleInfo(vehicle) {
    const vehicleInfoDiv = ensureElementExists('vehicle-info');
    vehicleInfoDiv.innerHTML = `
      <h3>${vehicle.YEAR} - ${vehicle.MANUFACTURER} ${vehicle.MODEL}</h3>
      <p>Our Price: ${formatCurrency(vehicle.PRICE)}</p>
    `;
  }

  // Function to update the transaction details on the page
  function updateTransactionDetails(transaction) {
    const transactionDetailsDiv = ensureElementExists('transaction-details');
    transactionDetailsDiv.innerHTML = `
      <div class="transaction-calculation">
        <h3>Transaction Calculation</h3>
        <ul>
          <li>Vehicle Price - ${formatCurrency(transaction.VEHICLEPRICE)}</li>
          <li>Parking Cost - ${formatCurrency(transaction.PARKINGCOST)}</li>
          <li>Destination Charges - ${formatCurrency(transaction.DESTINATIONCHARGES)}</li>
          <li>Shipping Cost - ${formatCurrency(transaction.SHIPPINGCOST)}</li>
          <li class="subtotal">Subtotal - ${formatCurrency(transaction.SUBTOTAL)}</li>
        </ul>
      </div>
    `;
  }

  // Function to fetch vehicle and transaction data from the server
  function fetchVehicleData(vehicleId) {
    // Replace with the endpoint you have set up on your server
    const url = 'http://localhost:3025/get-vehicle-data';

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ vehicleId: vehicleId }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      // Make sure to adjust the properties to match the ones your server sends back
      updateVehicleInfo(data.vehicle);
      updateTransactionDetails(data.transaction);
    })
    .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
    });
  }

  // Fetch the Honda Civic with VEHICLEID of 2
  fetchVehicleData(2);

  // Added functionality: Redirect to the payment-details.html when the "Proceed To Payment Details" button is clicked
  var proceedToPaymentBtn = document.getElementById('proceed-payment');
  if (proceedToPaymentBtn) {
    proceedToPaymentBtn.addEventListener('click', function() {
      window.location.href = 'payment-details.html';
    });
  }
});
