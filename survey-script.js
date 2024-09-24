document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('surveyForm');

    form.onsubmit = function(event) {
        event.preventDefault(); // Prevent the default form submission

        const formData = {
            discoveryMethod: document.getElementById('discoveryMethod').value,
            purchaseInfluence: document.getElementById('purchaseInfluence').value,
            improvementSuggestion: document.getElementById('improvementSuggestion').value,
            additionalComments: document.getElementById('additionalComments').value,
            vehicleTypePreference: document.getElementById('vehicleTypePreference').value,
        };

        fetch('/submit-survey', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Redirect to index.html upon successful submission
            window.location.href = '/index.html';
        })
        .catch(error => {
            console.error('Error during fetch:', error);
            // Handle errors here, such as displaying an error message
        });
    };
});
