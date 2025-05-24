document.addEventListener("DOMContentLoaded", function() {
    fetch('http://localhost:3000/api/timeMaster/compare')
        .then(response =>  {
            console.log("Response status:", response.status);  // Log status
            return response.json();
        })
        .then(data => {
            console.log("Data received from Node.js:", data);  // Log data for debugging
            const tbody = document.getElementById('data-body');
            if (data.error) {
                console.error("Error from server:", data.error);
                return;
            }
            data.forEach(row => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${row['Employee Name']}</td>
                    <td>${row['Location']}</td>
                    <td>${row['Clock-In Date']}</td>
                    <td>${row['Ordered Time In']}</td>
                    <td>${row['Clock-In Time']}</td>
                    <td>${row['Clock-Out Date']}</td>
                    <td>${row['Ordered Time Out']}</td>
                    <td>${row['Clock-Out Time']}</td>
                    <td class="${row['Comparison Result'] ? row['Comparison Result'].replace(' ', '') : ''}">${row['Comparison Result'] || 'N/A'}</td>
                `;
                tbody.appendChild(tr);
            });
        })
        .catch(error => console.error('Error fetching data:', error));
});