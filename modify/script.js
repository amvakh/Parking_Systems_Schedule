 // Function to retrieve account details
 function getAccountDetails(accountId) {
    // Replace this logic with your actual data retrieval logic
    var randomName = generateRandomName();
    var role = generateRandomRole();

    return { fullName: randomName, role: role };
}

// Function to generate a random name
function generateRandomName() {
    var names = ["John Doe", "John Smith", "John", "Jane Doe", "Jane"];
    return names[Math.floor(Math.random() * names.length)];
}

// Function to generate a random role
function generateRandomRole() {
    var roles = ["Admin", "Staff (Employee)"];
    return roles[Math.floor(Math.random() * roles.length)];
}

// Variable to store the GeoJSON layer
var landLayer;

// Event listener for when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
    // Create a Leaflet map
    var map = L.map('map').setView([40.7051, -98.5795], 4);
    // Add a tile layer to the map
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    // Create a custom icon for markers
    var carIcon = L.icon({
        iconUrl: 'redcar.png',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -8]
    });

    // GeoJSON data representing a polygon
    var yourGeoJSONData = {
        "type": "Feature",
        "geometry": {
            "type": "Polygon",
            "coordinates": [
                [
                    [-125, 25],
                    [-65, 25],
                    [-65, 50],
                    [-125, 50],
                    [-125, 25]
                ]
            ]
        }
    };

    // Add GeoJSON layer representing land areas
    landLayer = L.geoJSON(yourGeoJSONData).addTo(map);

    // Array to store markers
    var markers = [];

    // Function to mark a location on the map
    window.markOnMap = function () {
        var accountId = document.getElementById('accountId').value;
        var mapOverlay = document.getElementById('mapOverlay');

        // Check if the maximum number of markers is reached
        if (markers.length > 10) {
            alert("You can only add up to 10 markers for demonstration purposes.");
            return;
        }

        // Check if the account ID already exists
        if (markers.some(item => item.accountId === accountId)) {
            alert("Account ID already exists. Please enter a different one.");
            return;
        }

        var validLocationFound = false;

        // Asynchronous function to find a valid location on the map
        (async function findValidLocation() {
            while (!validLocationFound) {
                var latitude = Math.random() * (49.384358 - 24.396308) + 24.396308;
                var longitude = Math.random() * (-66.934570 + 125.000000) - 125.000000;

                // Check if the generated coordinates are over the ocean
                var isOverOcean = await checkIfOverOcean(latitude, longitude);

                if (!isOverOcean) {
                    validLocationFound = true;
                    var accountDetails = getAccountDetails(accountId);
                    var fullName = accountDetails.fullName;

                    // Create a marker on the map
                    var marker = L.marker([latitude, longitude], { icon: carIcon }).addTo(map);
                    marker.bindPopup(`<b>Account ID:</b> ${accountId}<br><b>Full Name:</b> ${fullName}`).openPopup();
                    markers.push({ marker, accountId, fullName });
                    mapOverlay.style.display = 'block';
                }
            }
        })();
    }

    // Function to check if a location is over the ocean using reverse geocoding
    async function checkIfOverOcean(latitude, longitude) {
        // Use OpenStreetMap Nominatim API for reverse geocoding
        var apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
        var response = await fetch(apiUrl);
        var data = await response.json();

        // Check if the result type is 'ocean'
        return data && data.type === 'ocean';
    }

    // Function to clear all markers from the map
    window.clearMarkers = function () {
        markers.forEach(function (item) {
            map.removeLayer(item.marker);
        });
        markers = [];
        document.getElementById('mapOverlay').style.display = 'none';
        document.getElementById('markerDetails').innerText = '';
    }

    // Function to show details of a specific marker
    window.showMarkerDetails = function () {
        var accountId = document.getElementById('accountId').value;

        // Find the marker with the given account ID
        var markerItem = markers.find(item => item.accountId === accountId);

        if (markerItem) {
            var fullName = markerItem.fullName;
            var role = getAccountDetails(accountId).role;

            // Display details of the marker
            var details = `Account ID: ${accountId}, Full Name: ${fullName}, Role: ${role}, Latitude: ${markerItem.marker.getLatLng().lat}, Longitude: ${markerItem.marker.getLatLng().lng}`;

            document.getElementById('markerDetails').innerText = details;
        } else {
            alert("Marker not found for the specified Account ID.");
        }
    };
});
