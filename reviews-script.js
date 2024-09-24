document.addEventListener("DOMContentLoaded", function() {
    // Populate the state dropdown
    populateStateDropdown();

    // Fetch and display existing reviews
    fetchReviews();

    // Handle new review submissions
    document.getElementById("new-review-form").addEventListener("submit", function(event) {
        event.preventDefault();
        submitNewReview();
    });
});

// Function to populate the state dropdown
function populateStateDropdown() {
    const stateSelect = document.getElementById('state');
    const states = ["Indiana", "Illinois", "Ohio"]; // 3 states are added
    states.forEach(state => {
        const option = document.createElement('option');
        option.value = state;
        option.textContent = state;
        stateSelect.appendChild(option);
    });
}

// Define an array of image filenames for the profile pictures
const profileImages = [
    'images/user1.png',
    'images/user2.png',
    'images/user3.png' // Ensure these paths are correct
];

function fetchReviews() {
    fetch('http://localhost:3022/reviews')
        .then(response => response.json())
        .then(data => {
            displayReviews(data);
        })
        .catch(error => {
            console.error('Error fetching reviews:', error);
        });
}

function displayReviews(reviews) {
    const reviewsSection = document.getElementById('reviews-section');
    reviewsSection.innerHTML = ''; // Clear current reviews
    reviews.forEach(review => {
        const reviewDiv = document.createElement('div');
        reviewDiv.className = 'review-entry';
        const randomImage = profileImages[Math.floor(Math.random() * profileImages.length)];
        reviewDiv.innerHTML = `
            <img src="${randomImage}" alt="Profile Picture" class="profile-pic">
            <div>
                <div class="review-header">
                    <span class="review-name">${review.name}</span> 
                    <span class="review-vehicle">${review.vehicle}</span>
                </div>
                <div class="review-rating">${createStars(review.rating)}</div>
                <div class="review-body">${review.review}</div>
                <div class="review-footer">
                    <span class="review-date">${new Date(review.timestamp).toLocaleDateString()}</span>
                </div>
            </div>
        `;
        reviewsSection.appendChild(reviewDiv);
    });
}

function createStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += i <= rating ? '★' : '☆';
    }
    return stars;
}

function submitNewReview() {
    const state = document.getElementById('state').value; // Assuming you have a dropdown for states in your HTML
    const coordinatesMap = {
        'Indiana': [[-86.1581, 39.7684], [-86.2519, 39.8301], [-86.134, 39.791], [-86.175, 39.759]], // Example coordinates
        'Illinois': [[-87.6298, 41.8781], [-87.6237, 41.8819], [-87.6487, 41.8471], [-87.6368, 41.8927]],
        'Ohio': [[-82.9071, 40.4173], [-82.9988, 39.9612], [-83.0007, 39.962], [-82.885, 39.9613]]
    };
    // Select random coordinates for the selected state
    const selectedCoordinates = coordinatesMap[state][Math.floor(Math.random() * coordinatesMap[state].length)];

    const newReview = {
        name: document.getElementById('first-name').value + ' ' + document.getElementById('last-name').value,
        vehicleYear: document.getElementById('vehicle-year').value,
        vehicleName: document.getElementById('vehicle-name').value,
        review: document.getElementById('review').value,
        rating: getRatingFromStars(),
        timestamp: new Date().toISOString(),
        location: {
            type: "Point",
            coordinates: selectedCoordinates
        }
    };

    fetch('http://localhost:3022/reviews', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newReview),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        alert('Review submitted!');
        fetchReviews(); // Refresh the reviews
    })
    .catch(error => {
        console.error('Error submitting review:', error);
    });
}

function getRatingFromStars() {
    const rating = document.querySelector('input[name="rating"]:checked');
    return rating ? rating.value : 0;
}
