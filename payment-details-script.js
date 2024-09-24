// This function will be called when a package button is clicked
function selectPackage(packageType) {
  // the username is stored in session storage after the user logs in
  // 
  const userName = sessionStorage.getItem('userName');

  // This will Check if we have the userName, if not, we can't associate the package with a user
  if (!userName) {
    alert('User is not logged in.');
    return;
  }

  //  
  fetch(`http://127.0.0.1:3011/api/current-user?username=${encodeURIComponent(userName)}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(userDetails => {
      // 
      const user = userDetails[0];
      if (!user) {
        throw new Error('User details not found');
      }
      const customerID = user.USERID;

      // Fetch vehicleID from the USER_GARAGE table using the new endpoint
      return fetch(`http://127.0.0.1:3011/api/user-vehicle?userID=${encodeURIComponent(customerID)}`);
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok when fetching vehicle ID');
      }
      return response.json();
    })
    .then(vehicleDetails => {
      // Assuming we're interested in the first vehicle entry
      const vehicleID = vehicleDetails[0].VEHICLEID;
      if (!vehicleID) {
        throw new Error('Vehicle ID not found');
      }

      // Proceed with posting the package selection
      return fetch('http://127.0.0.1:3011/api/select-package', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ packageType, vehicleID, userName }),
      });
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok when sending package selection');
      }
      return response.json();
    })
    .then(data => {
      console.log('Package selected:', data);
      alert('Package selection saved successfully.');
      
      // Redirect to customer-details.html after package selection
      window.location.href = 'customer-details.html';
    })
    .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
      alert('Error selecting package. Please try again.');
    });
}
