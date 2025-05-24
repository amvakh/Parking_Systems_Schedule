const express = require('express');
const router = express.Router();
const getClient = require("../db");

function getCurrentWeekDates() {
    const today = new Date();
    const currentDay = today.getDay();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - currentDay + (currentDay === 0 ? -6 : 1));
  
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      const formattedDate = currentDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).replace(/\//g, '-');
      weekDates.push(formattedDate);
    }
  
    return weekDates;
  }
  
//get the schedule for the current week based on employeeID
router.get('/:employeeId', async (req, res) =>{
    try{
        const currentWeekDates = getCurrentWeekDates();
        // Connect the client to the server
        const client = getClient(__dirname+'/../.env');
        await client.connect();
        // Send a ping to confirm a successful connection
        const results = await client.db("ParkingSystemsDBdev").collection("Scheduler").find({"employeeID": Number(req.params.employeeId)/*, "Date": {"$in": currentWeekDates}*/}).toArray();
        res.send(results);
        client.close();
    }catch (error) {
        console.log('error:', error);
    }
});

module.exports = router;