document.addEventListener('DOMContentLoaded', (event) => {
  // This code runs when the document is ready

  // Event listener for the login button on the landing page
  document.querySelector('.login-button').addEventListener('click', () => {
    // Redirect the user to login.html
    window.location.href = 'login.html';
  });

  // Event listener for the 'EXPLORE OPTIONS' button
  document.querySelector('.explore-options-button').addEventListener('click', () => {
    // Logic for when the 'EXPLORE OPTIONS' button is clicked
    alert('Explore options button clicked!');
  });
});

// Event listener for the chatbot button
document.getElementById('chatbotButton').addEventListener('click', function() {
  window.open('chatbot.html', 'Chatbot', 'width=400,height=600'); // Adjust dimensions as needed
});
