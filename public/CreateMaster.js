var UniqueEmployeeList = [];

document.getElementById("master_schedule_form").addEventListener("submit", async function (event) {
    event.preventDefault();

    //Parse form data into json object
    var formData = [];
    var table = document.getElementById("data-table").getElementsByTagName('tbody')[0];
    
    Array.from(table.rows).forEach(element => {
        var newObj = {};
        var rowData = [];
        for(i = 0; i < element.children.length - 1; i++){
            if(i === 4 || i === 5 || i === 6) rowData.push(element.children[i].firstChild.children[0].value)
            else rowData.push(element.children[i].firstChild.value);
        }
        newObj = {
            account: rowData[0],
            location: rowData[1],
            date: changeDateFormat(rowData[2]),
            dayOfTheWeek: rowData[3],
            firstName: rowData[4],
            lastName: rowData[5],
            employeeID: Number(rowData[6]),
            paidTimeOut: rowData[7],
            paidTimeIn: rowData[8],
            dinnerLunchBreak: Number(rowData[9]),
            hours: Number(rowData[10])
        };
        formData.push(newObj);
    });
    //all form data in an array
    console.log(formData);
    try{
        const response = await fetch('http://localhost:3000/api/masterSchedule', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        if(response.ok){
            const data = await response.json();
            //TODO: parse responce
            const masterScheduleId = data[0].masterScheduleId;
            localStorage.setItem("masterScheduleId", masterScheduleId);
            localStorage.setItem("masterSchedule", JSON.stringify(data));
            window.location.href = "./PayMaster.html";
            
        }else{
            console.error('Failed to receive a valid response from the server.');
        }
    }catch (error) {
        console.error('Error sending message to the server:', error);
      }
});

function changeDateFormat(inputDate) {
    // Parse the input date in "yyyy-mm-dd" format
    const dateParts = inputDate.split("-");
    
    if (dateParts.length !== 3) {
        // Handle invalid input format
        return "Invalid date format";
    }

    const year = dateParts[0];
    const month = dateParts[1];
    const day = dateParts[2];

    // Create the new date format "mm-dd-yyyy"
    const newDateFormat = `${month}-${day}-${year}`;

    return newDateFormat;
}

function addRow() {
    var table = document.getElementById("data-table").getElementsByTagName('tbody')[0];
    var newRow = table.insertRow(table.rows.length);
    
    for (var i = 0; i < 11; i++) {
        var cell = newRow.insertCell(i);
        if(i === 2){
            const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
            cell.innerHTML = `<input type="date" name="column${i + 1}" value="" pattern="\\d{2}-\\d{2}-\\d{4}" placeholder="MM-DD-YYYY" oninput="SetDOTW(this)" required min="${currentDate}" required>`;
        }else if(i === 3){
            cell.innerHTML = `<input type="text" name="column${i + 1}" value="" readonly required>`;
        }else if(i === 4){
            cell.innerHTML = `<div class="autocomplete">
                    <input type="text" name="column${i + 1}" value="" onfocus='autoComplete(this, "first")' onfocusout="closeAutoCompleteList(this)" oninput='autoComplete(this, "first")' required>
                    <div class="autocomplete-items" id="autocomplete-list"></div>
                  </div>`;
        }else if(i === 5){
            cell.innerHTML = `<div class="autocomplete">
                    <input type="text" name="column${i + 1}" value="" onfocus='autoComplete(this, "last")' onfocusout="closeAutoCompleteList(this)" oninput='autoComplete(this, "last")' required>
                    <div class="autocomplete-items" id="autocomplete-list"></div>
                  </div>`;
        }else if(i === 6){
            cell.innerHTML = `<div class="autocomplete">
                    <input type="text" name="column${i + 1}" value="" onfocus='autoCompleteId(this)' onfocusout="closeAutoCompleteList(this)" oninput='autoCompleteId(this)' required>
                    <div class="autocomplete-items" id="autocomplete-list"></div>
                  </div>`;
        }else if(i === 7 || i === 8){//allows autofill detection for hours
            cell.innerHTML = `<input type="time" name="column${i + 1}" onfocusout="fillHours(this)" value="">`;    
        }else if(i === 9){
            cell.innerHTML = `<input type="number" name="column${i + 1}" value="" min="0" max="1" step="0.01" placeholder="0.00" required>`;    
        }else if(i === 10){
            cell.innerHTML = `<input type="text" name="column${i + 1}" value="" readonly required>`;
        }else{
            cell.innerHTML = `<input type="text" name="column${i + 1}" value="" required>`;
        }
    }
    var removeCell = newRow.insertCell(11);
    removeCell.innerHTML = '<button onclick="removeRow(this)">Remove</button>';
}

function removeRow(button) {
    let text = "Are you sure you want to delete this row?";
    if (confirm(text) == true) {
        var row = button.parentNode.parentNode;
        row.parentNode.removeChild(row);
    }
}

//For Autofill

Number.prototype.countDecimals = function () {
    if(Math.floor(this.valueOf()) === this.valueOf()) return 0;
    return this.toString().split(".")[1].length || 0; 
}

function fillHours(element){
    if(element.parentNode.parentNode.children[7].firstChild.value && element.parentNode.parentNode.children[8].firstChild.value){
        // Extract hours and minutes from the input strings
        var startTime = element.parentNode.parentNode.children[7].firstChild.value;
        var endTime = element.parentNode.parentNode.children[8].firstChild.value;

        let startTimeArr = startTime.split(":");
        let startHour = parseInt(startTimeArr[0], 10);
        let startMinute = parseInt(startTimeArr[1], 10);

        let endTimeArr = endTime.split(":");
        let endHour = parseInt(endTimeArr[0], 10);
        let endMinute = parseInt(endTimeArr[1], 10);

        // Convert start and end times to minutes
        let startInMinutes = startHour * 60 + startMinute;
        let endInMinutes = endHour * 60 + endMinute;

        // Calculate the difference
        let differenceInMinutes = endInMinutes - startInMinutes;

        // Convert the difference back to hours and minutes
        let hours = Math.floor(differenceInMinutes / 60);
        let minutes = differenceInMinutes % 60;
        let hourDifference = endHour - startHour;
        let minuteDifference = endMinute - startMinute;

        if (minuteDifference < 0) {
            minuteDifference += 60;
            hourDifference--;
        }

        if (hourDifference < 0) {
            hourDifference += 24;
        }
        // Combine hours and minutes in the result
        const result = hourDifference + minuteDifference / 60;
        if(result.countDecimals() > 2){
            element.parentNode.parentNode.children[10].firstChild.value = parseFloat(result.toFixed(2)); 
        }
        else{
            element.parentNode.parentNode.children[10].firstChild.value = result;
        }
    }else{
        element.parentNode.parentNode.children[10].firstChild.value = '';
    }

}

function SetDOTW(element){
    const enteredDate = new Date(element.parentNode.parentNode.children[2].firstChild.value);
    if (!isNaN(enteredDate)) { // Check if the entered date is valid
        const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][enteredDate.getUTCDay()];
        //alert(`Entered date is a ${dayOfWeek}`);
        element.parentNode.parentNode.children[3].firstChild.value = dayOfWeek;
    } else {
        element.parentNode.parentNode.children[3].firstChild.value = '';
    }
}

async function getSearchFields(){
    try{
        const response = await fetch(`http://localhost:3000/api/masterSchedule/getUniqueEmployees`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if(response.ok){
            const data = await response.json();
            //TODO: do something with response
            UniqueEmployeeList = data;       
        }else{
            console.error('Failed to receive a valid response from the server.');
        }
    }catch (error) {
        console.error('Error sending message to the server:', error);
      }
}

async function closeAutoCompleteList(element){
    setTimeout(() => {
        element.parentNode.children[1].innerHTML = "";
      }, 100);
}

function autoComplete(element, searchList) {
    const inputElement = element;
    const autocompleteList = element.parentNode.children[1];

    const inputValue = inputElement.value.toLowerCase();
    autocompleteList.innerHTML = "";

    if(searchList === "first"){
        // Filter the UniqueEmployeeList based on the Employee_First_Name
        const filteredEmployees = UniqueEmployeeList.filter(employee =>
            employee.Employee_First_Name.toLowerCase().startsWith(inputValue.toLowerCase())
        );
        // Create and append suggestion items to the dropdown
        filteredEmployees.forEach(employee => {
            const item = document.createElement("div");
            item.classList.add("autocomplete-item");
            item.textContent = employee.Employee_First_Name + " " + employee.Employee_Last_Name;

            // Set the input value to the selected suggestion when clicked
            item.addEventListener("click", function() {
                inputElement.value = employee.Employee_First_Name;
                //Check if other cells can be autoFilled
                element.parentNode.parentNode.parentNode.children[5].firstChild.children[0].value = employee.Employee_Last_Name;
                element.parentNode.parentNode.parentNode.children[6].firstChild.children[0].value = employee.Employee_ID;
                autocompleteList.innerHTML = "";
            });

            autocompleteList.appendChild(item);
    });
    }else{
        // Filter the UniqueEmployeeList based on the Employee_Last_Name
        const filteredNames = UniqueEmployeeList.filter(employee =>
            employee.Employee_Last_Name.toLowerCase().startsWith(inputValue.toLowerCase())
        );
        // Create and append suggestion items to the dropdown
    filteredNames.forEach(employee => {
        const item = document.createElement("div");
        item.classList.add("autocomplete-item");
        item.textContent = employee.Employee_Last_Name + " " + employee.Employee_First_Name;

        // Set the input value to the selected suggestion when clicked
        item.addEventListener("click", function() {
            inputElement.value = employee.Employee_Last_Name;
            //Check if other cells can be autoFilled
            element.parentNode.parentNode.parentNode.children[4].firstChild.children[0].value = employee.Employee_First_Name;
            element.parentNode.parentNode.parentNode.children[6].firstChild.children[0].value = employee.Employee_ID;
            autocompleteList.innerHTML = "";
        });

        autocompleteList.appendChild(item);
    });
    }

    // // Auto-fill if there's only one suggestion
    // if (filteredNames.length === 1) {
    //     inputElement.value = filteredNames[0];
    //     autocompleteList.innerHTML = "";
    // }
}

function autoCompleteId(element) {
    const inputElement = element;
    const autocompleteList = element.parentNode.children[1];

    const inputValue = inputElement.value.toLowerCase();
    autocompleteList.innerHTML = "";

    // Filter array for numbers that start with the input value
    const filteredEmployees = UniqueEmployeeList.filter(employee =>
        employee.Employee_ID.toString().startsWith(inputValue)
    );

    // Create and append suggestion items to the dropdown
    filteredEmployees.forEach(employee => {
        const item = document.createElement("div");
        item.classList.add("autocomplete-item");
        item.textContent = employee.Employee_ID;

        // Set the input value to the selected suggestion when clicked
        item.addEventListener("click", function() {
            inputElement.value = employee.Employee_ID;
            //Set First and Last name Associated with ID
            //console.log();
            element.parentNode.parentNode.parentNode.children[4].firstChild.children[0].value = employee.Employee_First_Name
            element.parentNode.parentNode.parentNode.children[5].firstChild.children[0].value = employee.Employee_Last_Name
            autocompleteList.innerHTML = "";
        });

        autocompleteList.appendChild(item);
    });
}