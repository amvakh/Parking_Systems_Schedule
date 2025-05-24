const express = require('express');
const router = express.Router();
const getClient = require('../db');
const bcrypt = require('bcrypt');
const validateLoginRequest = require('../RequestModels/loginModel');

router.post('/', async (req, res) => {
    const { error } = validateLoginRequest(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
    const { username, password } = req.body;

    try {
        const client = getClient(__dirname + '/../.env');
        await client.connect();

        // Check to see if they are an employee
        const account = await client.db("ParkingSystemsDBdev").collection("EmployeeAccounts").findOne({ "username": username });
        
        if (account) {
            // Compare the input password with the stored hash
            const match = await bcrypt.compare(password, account.password);
            if (match) {
                // Password matches
                //return user account to store on client side
                const { password, ...employeeAccountWithoutPassword } = account;
                return res.send({ employeeDetails: employeeAccountWithoutPassword });
            } else {
                // Password does not match
                return res.status(401).send("Invalid credentials.");
            }
        }
        return res.status(401).send("Invalid credentials.");
    } catch (error) {
        console.error('error:', error);
        return res.status(500).send("Internal server error.");
    }
});

module.exports = router;