var UniqueEmployeeList = [];

// // Function to create options for a roller
// function createRollerOptions() {
//     var optionsHtml = '';
//     for (var i = 0; i <= 9; i++) {
//       optionsHtml += `<option value="${i}">${i}</option>`;
//     }
//     return optionsHtml;
//   }

// document.addEventListener('DOMContentLoaded', function() {
//     var table = document.getElementById('myTable');
//     var columnIndex = 10; // Index of the column you want to target
  
    
  
//     // Insert rollers into the specified column of each row
//     // for (var row of table.rows) {
//     //   var cell = row.cells[columnIndex];
//     //   if (cell) {
//     //     var rollerHtml = '<select class="number-roller">' + createRollerOptions() + '</select>';
//     //     // Add as many rollers as you need
//     //     cell.innerHTML = rollerHtml.repeat(4); // Example: 4 rollers
//     //   }
//     // }
//   });
  document.getElementById("pay_master_schedule_form").addEventListener("submit", async function (event) {
    event.preventDefault();

    //Parse form data into json object
    var formData = [];
    var table = document.getElementById("data-table").getElementsByTagName('tbody')[0];
    
    Array.from(table.rows).forEach(element => {
        var newObj = {};
        var rowData = [];
        for(i = 0; i < element.children.length; i++){
            rowData.push(element.children[i].firstChild.value);
        }
        newObj = {
            date: rowData[0],
            dayOfTheWeek: rowData[1],
            account: rowData[2],
            employeeID: Number(rowData[3]),
            firstName: rowData[4],
            lastName: rowData[5],
            location: rowData[6],
            paidTimeIn: rowData[7],
            paidTimeOut: rowData[8],
            hours: Number(rowData[9]),
            rate: Number(rowData[10]),
            tipsCredited: Number(rowData[11]),
            reportedTips: Number(rowData[12]),
            wage: Number(rowData[13]),
            minimumPay: Number(rowData[14]),
            minimumTip: Number(rowData[15]),
            tips: Number(rowData[16]),
            pay: Number(rowData[17]),
            totalPay: Number(rowData[18])
        };
        formData.push(newObj);
    });
    try{
        const response = await fetch(`http://localhost:3000/api/payMasterSchedule/${localStorage.getItem('masterScheduleId')}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        if(response.ok){
            const data = await response.json();
            localStorage.setItem("payMasterSchedule", JSON.stringify(formData));
            window.location.href = "./TimeMaster.html";
            
        }else{
            console.error('Failed to receive a valid response from the server.');
        }
    }catch (error) {
        console.error('Error sending message to the server:', error);
      }
});

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
        }else if(i === 10){ //var rollerHtml = '<select class="number-roller">' + createRollerOptions() + '</select>';
        // Add as many rollers as you need
        cell.innerHTML = /*rollerHtml.repeat(4);*/ `<input type="number" name="column${i + 1}" oninput="validity.valid||(value='');" onfocusout="fillRate(this)" min="0" max="99" step="0.01" required>`; // Example: 4 rollers
        }else if(i === 11){
            cell.innerHTML = `<input type="number" name="column${i + 1}" oninput="validity.valid||(value='');" onfocusout="fillTips(this)" min="0" max="99" step="0.01" required>`;
        }else if(i === 12){
            cell.innerHTML = `<input type="text" placeholder="~~~~~~~~~~~~~~~~~~~~~~~~~~" name="column${i + 1}" value="" readonly>`;
        }else if(i === 13){
            cell.innerHTML = `<input type="text" name="column${i + 1}" value="0" required readonly>`;
        }else if(i === 14){
            cell.innerHTML = `<input type="text" placeholder="~~~~~~~~~~~~~~~~~~~~~~~~~~" name="column${i + 1}" value="" readonly>`;
        }else if(i === 15){
            cell.innerHTML = `<input type="text" name="column${i + 1}" value="0" required readonly>`;
        }else if(i === 16){
            cell.innerHTML = `<input type="text" name="column${i + 1}" value="0" required readonly>`;
        }
        else{
            cell.innerHTML = `<input type="text" name="column${i + 1}" value="0" required readonly>`;
        }
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

function getMaster(){
    const masterSchedule = JSON.parse(localStorage.getItem("masterSchedule"));

    for(i=0;i<masterSchedule.length;i++){
        fillRow(masterSchedule[i]);
    }
}

function fillTips(tCredit){
    var tipCredit = Number(tCredit.value);
    if(tipCredit > 99) {
        tipCredit = 99;
        tCredit.value = tipCredit;
    }
    const hours = Number(tCredit.parentNode.parentNode.children[9].firstChild.value);
    const rate = Number(tCredit.parentNode.parentNode.children[10].firstChild.value)
    tCredit.parentNode.parentNode.children[15].firstChild.value = tipCredit*hours;
    tCredit.parentNode.parentNode.children[16].firstChild.value = tipCredit*hours;
    tCredit.parentNode.parentNode.children[13].firstChild.value = rate+tipCredit;
}

function fillRate(rate){
    var rateVal = Number(rate.value);
    if(rateVal > 99) {
        rateVal = 99;
        rate.value = rateVal;
    }
    const hours = Number(rate.parentNode.parentNode.children[9].firstChild.value);
    rate.parentNode.parentNode.children[17].firstChild.value = rateVal*hours;
    rate.parentNode.parentNode.children[18].firstChild.value = rateVal*hours;
}