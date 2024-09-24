// Function that gets called when a category is selected on the dashboard
function selectCategory(category) {
    console.log("Category selected:", category);
    alert('You have selected ' + category + ' cars.');
    // Redirect to the vehicle-listings page without any query parameters for filtering
    window.location.href = 'vehicle-listing.html';
}
