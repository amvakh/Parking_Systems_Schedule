document.getElementById("login-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    try {
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: username, password: password })
        });
    
        if (response.ok) {
            const data = await response.json();
            localStorage.setItem("employeeDetails", JSON.stringify(data.employeeDetails));
            switch (data.employeeDetails.isManager) {
                case false:
                    window.location.href = "./Employee/employeeLandingPage.html";
                    break;
                case true:
                    window.location.href = "./managerLandingPage.html";
                    break;
                case "unauthorized":
                    alert("Wrong username or password.");
                    break;
                default:
                    alert("Login failed. Please check your credentials.");
            }
        } else {
            console.error('Failed to receive a valid response from the server.');
        }
    } catch (error) {
        console.error('Error sending message to the server:', error);
    }
});