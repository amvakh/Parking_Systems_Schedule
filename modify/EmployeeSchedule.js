document.getElementById("employee_schedule_form").addEventListener("submit", async function (event) {
    event.preventDefault();
    const employeeID = document.getElementById("employeeID").value;

    try {
        const response = await fetch(`http://localhost:3000/api/employeeSchedule/${employeeID}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (response.ok) {
            const data = await response.json();
            displaySchedule(data);
        } else {
            console.error('Failed to receive a valid response from the server.');
        }
    } catch (error) {
        console.error('Error fetching schedule from the server:', error);
    }
});

function displaySchedule(scheduleData) {
    const tableBody = document.getElementById('schedule-table').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; // Clear existing rows

    scheduleData.forEach(schedule => {
        const row = tableBody.insertRow();
        row.insertCell(0).innerText = schedule.account;
        row.insertCell(1).innerText = schedule.location;
        row.insertCell(2).innerText = schedule.date;
        row.insertCell(3).innerText = schedule.dayOfTheWeek;
        row.insertCell(4).innerText = schedule.paidTimeIn;
        row.insertCell(5).innerText = schedule.paidTimeOut;
        row.insertCell(6).innerText = schedule.dinnerLunchBreak;
    });
}
