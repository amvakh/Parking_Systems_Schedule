function setEmployeeHome(){
    const employeeDetails = JSON.parse(localStorage.getItem("employeeDetails"));
    document.getElementById("Employee-welcome").innerHTML = `Welcome ${employeeDetails.firstName} to the Employee Portal`
}