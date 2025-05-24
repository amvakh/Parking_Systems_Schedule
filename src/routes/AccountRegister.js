const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const getClient = require('../db');
const validateRegisterRequest = require('../RequestModels/AccountRegisterModel');

const saltRounds = 10;

router.post('/', async (req, res) => {
    const { error } = validateRegisterRequest(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    let {id, firstName, lastName, username, password, isManager} = req.body
    try{
        const client = getClient(__dirname+'/../.env');

        await client.connect();
        //check that Id doesn't already exist
        const idResult = await client.db("ParkingSystemsDBdev").collection("EmployeeAccounts").findOne({"id": Number(id)});
        if(idResult != null) return res.status(400).send("ID already exists with a registered account.");
        //Make sure username is unique
        const usernameResult = await client.db("ParkingSystemsDBdev").collection("EmployeeAccounts").findOne({"username": username});
        if(usernameResult != null) return res.status(400).send("Username already taken. Username must be unique");
        //hash password
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(password, salt);
        //create new database entry
        await client.db("ParkingSystemsDBdev").collection("EmployeeAccounts").insertOne({id: Number(id), firstName: firstName, lastName: lastName, username: username, password: hash, isManager: isManager});
    }catch(error){
        console.log('error:', error);
        return res.status(500).send("Server Error");
    }
    return res.status(200).send("Account created");
});

module.exports = router;