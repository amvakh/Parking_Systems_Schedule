const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const getClient = require("../db");
const validateMasterScheduleRequest = require('../RequestModels/masterScheduleModel');

router.post('/', async (req, res) =>{//Upload Master Schedule
    var foundError = false;
    var errorMessage;
    //Parse Request Object
    const masterScheduleData = req.body;
    
    //validate request Object
    masterScheduleData.forEach(element => {
        const { error } = validateMasterScheduleRequest(element);
        if(error){
            errorMessage = error.details[0].message;
            foundError = true;
        }
    });
    console.log(errorMessage)
    if(foundError) return res.status(400).send(errorMessage);
    //Open Connection to MongoDB
    
    //adds unique id to group entries to a single master schedule
    const timestamp = new Date().getTime().toString(36);
    const randomPart = Math.random().toString(36).slice(2, 7);
    const masterScheduleUniqueId = `${uuidv4()}-${timestamp}-${randomPart}`;
    for(i=0;i<masterScheduleData.length;i++){
        masterScheduleData[i].masterScheduleId = masterScheduleUniqueId;
        masterScheduleData[i].rowNum = i;
    }
   
    try{
        // Connect the client to the server
        const client = getClient(__dirname+'/../.env'); 
        
        await client.connect();
        
        // Send a ping to confirm a successful connection
        
        const results = await client.db("ParkingSystemsDBdev").collection("Scheduler").insertMany(masterScheduleData);
        client.close();
        
        res.send(masterScheduleData);
    }catch (error) {
        console.log('error:', error);
    }
});

router.get('/getUniqueEmployees/:field', async (req, res) =>{//get unique values from table
    //Parse Request Param
    var lookupField = req.params.field;
    //Open Connection to MongoDB
    try{
        // Connect the client to the server
        const client = getClient(__dirname+'/../.env');
        await client.connect();
        const results = await client.db("ParkingSystemsDBdev").collection("EmployeeAccounts").find({ isManager: { $ne: true } }).distinct(lookupField);
        client.close();
        res.status(200).send(results);
    }catch (error) {
        console.log('error:', error);
    }
});


router.get('/getUniqueEmployees', async (req, res) => {
    // Open Connection to MongoDB
    try {
        // Connect the client to the server
        const client = getClient(__dirname + '/../.env');
        await client.connect();

        // Find unique employee IDs excluding managers
        const uniqueEmployeeIDs = await client.db("ParkingSystemsDBdev").collection("EmployeeAccounts")
            .distinct('id', { isManager: { $ne: true } });

        // Fetch employee details for each unique employee ID
        const employeeDetails = await Promise.all(
            uniqueEmployeeIDs.map(async (employeeID) => {
                const employeeData = await client.db("ParkingSystemsDBdev").collection("EmployeeAccounts")
                    .findOne({ id: employeeID }, { projection: { _id: 0, firstName: 1, lastName: 1 } });

                return {
                    Employee_ID: employeeID,
                    Employee_First_Name: employeeData.firstName,
                    Employee_Last_Name: employeeData.lastName,
                };
            })
        );

        // Close the client connection
        await client.close();

        // Send the employee details as the response
        res.status(200).send(employeeDetails);
    } catch (error) {
        console.error('error:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;