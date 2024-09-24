document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('deliveryForm');
    const qualificationMessage = document.getElementById('qualificationMessage');
  
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Gather form data, now including the vehicle type
        const formData = {
            firstName: form.firstName.value,
            lastName: form.lastName.value,
            vehicleType: form.vehicleType.value,
            latitude: parseFloat(form.latitude.value),
            longitude: parseFloat(form.longitude.value),
            deliveryType: form.querySelector('input[name="deliveryType"]:checked').value
        };

        // Perform an AJAX call to submit the form data
        fetch('http://localhost:2431/submit-delivery-form', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Display the response message on the page
            qualificationMessage.textContent = data.message;
            qualificationMessage.classList.add('visible');

            // Redirect the user to the survey.html page after 5 seconds
            setTimeout(() => {
                window.location.href = 'survey.html';
            }, 5000);
        })
        .catch(error => {
            console.error('Error:', error);

            // Display the error on the page
            qualificationMessage.textContent = 'An error occurred while submitting your form.';
            qualificationMessage.classList.add('visible');

            // Optionally alert the user that the data was not sent
            alert("An error occurred and the data was not sent to the server.");
        });
    });
});
