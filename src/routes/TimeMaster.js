const express = require('express');
const router = express.Router();
const axios = require('axios');
const fs = require('fs');
const csv = require('csv-parser');

/* Function to read data from CSV file
function readCSV(filePath) {
    return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => resolve(results))
            .on('error', (err) => reject(err));
    });
} */

// Fetch comparison data from Flsk app
router.get('/compare', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:5000/compare');
        console.log("Response from Flask:", response.data);  // For debugging
        res.json(response.data);
    } catch (err) {
        console.error('Error fetching data from Flask:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Export the router instance
module.exports = router;