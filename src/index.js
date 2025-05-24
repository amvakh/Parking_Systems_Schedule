require('dotenv').config();
const express = require('express');
const cors = require('cors');
const getClient = require("./db");

//API Endpoints
const loginApi = require('./routes/Login');
const weeklyEmployeeScheduleApi = require('./routes/WeeklyEmployeeSchedule');
const masterScheduleApi = require('./routes/MasterSchedule');
const payMasterScheduleApi = require('./routes/PayMasterSchedule');
const AccountRegisterApi = require('./routes/AccountRegister');
const TimeMasterApi = require('./routes/TimeMaster');

//Test Connection to MongoDB Atlas
async function run() {
  const client = getClient(__dirname+ "\\" + '.env');
  try {
    // Connect the client to the server
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("ParkingSystemsDBdev").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  }finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

run().catch(console.dir);

//Middleware
const app = express();
app.use(cors());
app.use(express.json());

//Routes
app.use('/api/login', loginApi);
app.use('/api/weeklyEmployeeSchedule', weeklyEmployeeScheduleApi);
app.use('/api/masterSchedule', masterScheduleApi);
app.use('/api/payMasterSchedule', payMasterScheduleApi);
app.use('/api/accountRegister', AccountRegisterApi);
app.use('/api/timeMaster', TimeMasterApi);

//Start Server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));