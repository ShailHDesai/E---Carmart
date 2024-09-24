document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('payment-form');
    form.onsubmit = async function (e) {
        e.preventDefault();

        // Get the card number from the individual input fields
        const cardNumberPart1 = document.getElementById('card-number-part1').value;
        const cardNumberPart2 = document.getElementById('card-number-part2').value;
        const cardNumberPart3 = document.getElementById('card-number-part3').value;
        const cardNumberPart4 = document.getElementById('card-number-part4').value;
        const fullCardNumber = cardNumberPart1 + cardNumberPart2 + cardNumberPart3 + cardNumberPart4;

        // Determine the provider based on the first digit of the card number
        let provider = '';
        switch (fullCardNumber[0]) {
            case '4':
                provider = 'Visa';
                break;
            case '5':
                provider = 'MasterCard';
                break;
            case '3':
                provider = 'American Express';
                break;
            default:
                alert('Invalid card number');
                return; // Exit the function if the card number is invalid
        }

        // Get the expiry date from the individual month and year fields
        const expiryMonth = document.getElementById('expiry-month').value;
        const expiryYear = document.getElementById('expiry-year').value;

        // Serialize the form data into an object
        let formData = {
            nameOnCard: form.nameOnCard.value,
            paymentType: form.querySelector('input[name="paymentType"]:checked').value,
            cardNumberPart1: cardNumberPart1,
            cardNumberPart2: cardNumberPart2,
            cardNumberPart3: cardNumberPart3,
            cardNumberPart4: cardNumberPart4,
            provider: provider,
            expiryMonth: expiryMonth,
            expiryYear: expiryYear,
            cvv: form.cvv.value
        };

        // POST the form data to the server
        try {
            let response = await fetch('http://localhost:30018/submit-payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                let result = await response.json();
                console.log(result.message);
                // Redirect to the delivery.html page after successful submission
                window.location.href = 'delivery.html';
            } else {
                throw new Error('Failed to submit payment method.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred during the payment process.');
        }
    };
});
