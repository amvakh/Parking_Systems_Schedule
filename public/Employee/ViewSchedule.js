const scheduleBody = document.getElementById('scheduleBody');
    const employeeIdForm = document.getElementById('employeeIdForm');
  
    async function getSchedule() {

      // Clear existing schedule before fetching new data
      scheduleBody.innerHTML = '';
      const employeeDetails = JSON.parse(localStorage.getItem("employeeDetails"));
      try {
        const response = await fetch(`http://localhost:3000/api/weeklyEmployeeSchedule/${employeeDetails.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
  
        if (response.ok) {
          const data = await response.json();
          createScheduleRows(data);
        } else {
          console.error('Failed to receive a valid response from the server.');
        }
  
      } catch (error) {
        console.error('Error sending message to the server:', error);
      }
    }
  
    function createScheduleRows(filteredSchedule) {
      let rowsHtml = '';
      const dataToUse = filteredSchedule || [];
  
      dataToUse.forEach(entry => {
        rowsHtml += `
          <tr>
            <td>${entry.date}</td>
            <td>${entry.dayOfTheWeek}</td>
            <td>${entry.location}</td>
            <td>${entry.paidTimeIn}</td>
            <td>${entry.paidTimeOut}</td>
            <td>${entry.dinnerLunchBreak}</td>
            <td>${entry.hours}</td>
          </tr>
        `;
      });
  
      scheduleBody.innerHTML = rowsHtml;
    }
  
    // Call the function to initialize the table
    createScheduleRows();