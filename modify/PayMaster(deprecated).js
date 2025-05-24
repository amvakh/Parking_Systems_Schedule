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
            date: changeDateFormat(rowData[0]),
            dayOfTheWeek: rowData[1],
            account: rowData[2],
            employeeID: Number(rowData[3]),
            firstName: rowData[4],
            lastName: rowData[5],
            location: rowData[6],
            paidTimeOut: rowData[7],
            paidTimeIn: rowData[8],
            hours: Number(rowData[9]),
            minimumTip: Number(rowData[10]),
            reportedTips: Number(rowData[11]),
            tips: Number(rowData[12]),
            pay: Number(rowData[13]),
            minimumPay: Number(rowData[14]),
            totalPay: Number(rowData[15]),
            rate: Number(rowData[16]),
            tipCredit: Number(rowData[17]),
            wage: Number(rowData[18])
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
            //TODO: do something with response
            
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

function fillRow(masterScheduleRowData) {//only use for loading master schedule data to table
    var table = document.getElementById("data-table").getElementsByTagName('tbody')[0];
    var newRow = table.insertRow(table.rows.length);
    
    for (var i = 0; i < 19; i++) {
        var cell = newRow.insertCell(i);
        if(i === 0){
            cell.innerHTML = `<input type="date" name="column${i + 1}" value="${convertDateFormat(masterScheduleRowData.date)}" readonly required>`;
        }else if(i === 1){
            cell.innerHTML = `<input type="text" name="column${i + 1}" value="${masterScheduleRowData.dayOfTheWeek}" readonly required>`;
        }else if(i === 2){
            cell.innerHTML = `<input type="text" name="column${i + 1}" value="${masterScheduleRowData.account}" readonly required>`;
        }else if(i === 3){
            cell.innerHTML = `<input type="text" name="column${i + 1}" value="${masterScheduleRowData.employeeID}" readonly required>`;
        }else if(i === 4){
            cell.innerHTML = `<input type="text" name="column${i + 1}" value="${masterScheduleRowData.firstName}" readonly required>`;
        }else if(i === 5){
            cell.innerHTML = `<input type="text" name="column${i + 1}" value="${masterScheduleRowData.lastName}" readonly required>`;
        }else if(i === 6){
            cell.innerHTML = `<input type="text" name="column${i + 1}" value="${masterScheduleRowData.location}" readonly required>`;
        }else if(i === 7){
            cell.innerHTML = `<input type="time" name="column${i + 1}" value="${masterScheduleRowData.paidTimeIn}" readonly required>`;    
        }else if(i === 8){
            cell.innerHTML = `<input type="time" name="column${i + 1}" value="${masterScheduleRowData.paidTimeOut}" readonly required>`;    
        }else if(i === 9){
            cell.innerHTML = `<input type="text" name="column${i + 1}" value="${masterScheduleRowData.hours}" readonly required>`;
        }else if(i === 10){
            cell.innerHTML = `<input type="text" name="column${i + 1}" value="">`;
        }else if(i === 11){
            cell.innerHTML = `<input type="text" name="column${i + 1}" value="">`;
        }else if(i === 12){
            cell.innerHTML = `<input type="text" name="column${i + 1}" value="">`;
        }else if(i === 13){
            cell.innerHTML = `<input type="text" name="column${i + 1}" value="" required>`;
        }else if(i === 14){
            cell.innerHTML = `<input type="text" name="column${i + 1}" value="" >`;
        }else if(i === 15){
            cell.innerHTML = `<input type="text" name="column${i + 1}" value="" required>`;
        }else if(i === 16){
            cell.innerHTML = `<input type="text" name="column${i + 1}" value="" required>`;
        }
        else{
            cell.innerHTML = `<input type="text" name="column${i + 1}" value="">`;
        }
    }
    var removeCell = newRow.insertCell(19);
    removeCell.innerHTML = '<button onclick="removeRow(this)">Remove</button>';
}

function addRow() {
    var table = document.getElementById("data-table").getElementsByTagName('tbody')[0];
    var newRow = table.insertRow(table.rows.length);
    
    for (var i = 0; i < 19; i++) {
        var cell = newRow.insertCell(i);
        if(i === 0){
            const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
            cell.innerHTML = `<input type="date" name="column${i + 1}" value="" pattern="\\d{2}-\\d{2}-\\d{4}" placeholder="MM-DD-YYYY" oninput="SetDOTW(this)" required min="${currentDate}" required>`;
        }else if(i === 1){
            cell.innerHTML = `<input type="text" name="column${i + 1}" value="" readonly required>`;
        }else if(i === 3){
            cell.innerHTML = `<div class="autocomplete">
                    <input type="text" name="column${i + 1}" value="" onfocus='autoCompleteId(this)' onfocusout="closeAutoCompleteList(this)" oninput='autoCompleteId(this)' required>
                    <div class="autocomplete-items" id="autocomplete-list"></div>
                  </div>`;
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
        }else if(i === 7 || i === 8){//allows autofill detection for hours
            cell.innerHTML = `<input type="time" name="column${i + 1}" onfocusout="fillHours(this)" value="">`;    
        }else if(i === 9){
            cell.innerHTML = `<input type="text" name="column${i + 1}" value="" readonly required>`;
        }
        else{
            cell.innerHTML = `<input type="text" name="column${i + 1}" value="" required>`;
        }
    }
    var removeCell = newRow.insertCell(19);
    removeCell.innerHTML = '<button onclick="removeRow(this)">Remove</button>';
}

function removeRow(button) {
    let text = "Are you sure you want to delete this row?";
    if (confirm(text) == true) {
        var row = button.parentNode.parentNode;
        row.parentNode.removeChild(row);
    }
}


//Auto-complete stuff

function convertDateFormat(inputDate) {
    var dateParts = inputDate.split("-");
  
    var originalDate = new Date(dateParts[2], dateParts[0] - 1, dateParts[1]);
  
    var year = originalDate.getFullYear();
    var month = (originalDate.getMonth() + 1).toString().padStart(2, "0");
    var day = originalDate.getDate().toString().padStart(2, "0");
  
    var formattedDate = year + "-" + month + "-" + day;
  
    return formattedDate;
  }

async function getMaster(){
    const masterSchedule = JSON.parse(localStorage.getItem("masterSchedule"));

    for(i=0;i<masterSchedule.length;i++){
        fillRow(masterSchedule[i]);
    }
}