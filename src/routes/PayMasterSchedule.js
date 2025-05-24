const express = require('express');
const router = express.Router();
const getClient = require("../db");
const validatePayMasterScheduleRequest = require('../RequestModels/payMasterSchedule');

router.post('/:scheduleId', async (req, res) =>{//Upload Pay Schedule
    //Parse Request Object
    const scheduleId = req.params.scheduleId;
    const payScheduleData = req.body;
    //validate request Object
    payScheduleData.forEach(element => {
        const { error } = validatePayMasterScheduleRequest(element);
        if(error){
            console.log(error.details[0].message);
            return res.status(400).send(error.details[0].message);
        }
    });
    //Open Connection to MongoDB
    try{
        // Connect the client to the server
        const client = getClient(__dirname+'/../.env'); 
        
        await client.connect();
        
        let results = [];
        for(i=0;i<payScheduleData.length;i++){
            const filter = {
                masterScheduleId: scheduleId,
                rowNum: i
            };
            results.push(await client.db("ParkingSystemsDBdev").collection("Scheduler").updateOne(filter, {$set: payScheduleData[i]}))
        }
        client.close();
        
        res.send(results);
    }catch (error) {
        console.log('error:', error);
    }
});

module.exports = router;