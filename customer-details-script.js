document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.customer-form');
    const countrySelect = document.getElementById('country');

    // Populate the country dropdown
    ['USA', 'Canada', 'Mexico'].forEach(country => {
        const option = document.createElement('option');
        option.value = country;
        option.textContent = country;
        countrySelect.appendChild(option);
    });

    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        const formData = new FormData(form);

        // Compile the non-file inputs into a customerDetails object
        // Ensure that the property names match the server-side expectations
        const customerDetails = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            ssn: document.getElementById('ssn').value,
            phoneNumber: document.getElementById('phone').value, // changed from 'phone' to 'phoneNumber'
            address: document.getElementById('address1').value + (document.getElementById('address2').value ? ' ' + document.getElementById('address2').value : ''), // combined 'address1' and 'address2' into 'address'
            state: document.getElementById('state').value,
            zipcode: document.getElementById('zipcode').value,
            country: document.getElementById('country').value
        };

        // Convert customerDetails object to a JSON string and add to formData
        formData.append('customerDetails', JSON.stringify(customerDetails));

        try {
            const uploadResponse = await fetch('http://localhost:30017/upload-pdf', {
                method: 'POST',
                body: formData,
            });

            if (uploadResponse.ok) {
                // Upon successful submission, redirect to 'card.html' page
                window.location.href = 'card.html';
            } else {
                const uploadResult = await uploadResponse.json();
                alert('Failed to upload PDF. Please try again.');
                console.error(uploadResult);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while uploading the PDF.');
        }
    });
});
