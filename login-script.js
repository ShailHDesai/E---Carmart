document.addEventListener('DOMContentLoaded', (event) => {
  // Check if the user is already logged in and redirect
  if (sessionStorage.getItem('userName')) {
    window.location.href = 'dashboard.html';
    return; // Stop the further execution of the script
  }

  // Grab the form element by its ID
  const loginForm = document.getElementById('loginForm');

  if (loginForm) {
    // Attach an event listener to the form's 'submit' event
    loginForm.addEventListener('submit', function (e) {
      // Prevent the default form submission behavior
      e.preventDefault();

      // Collect the username and password from the form inputs
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;

      // Create a POST request with the username and password as JSON in the body
      // The fetch URL must include the server's address with the correct port number
      fetch('http://127.0.0.1:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })
      .then(response => {
        // Check if the response status code indicates a successful login
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // If the login was successful, set the username in the session storage
        if (data.success) {
          sessionStorage.setItem('userName', username);
          window.location.href = 'dashboard.html';
        } else {
          // If the login failed, alert the user
          alert('Login failed: ' + data.message);
        }
      })
      .catch((error) => {
        // Log any errors to the console and alert the user
        console.error('Login error:', error);
        alert('An error occurred during login. Please try again.');
      });
    });
  } else {
    console.error('Login form not found');
  }
});
