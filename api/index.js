const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors()); 

// Vercel will use your environment variable for the key
const API_KEY = process.env.GOOGLE_API_KEY; 
const PLACE_ID = "ChIJr-Xe6gXLWTkR_HMq1UxmLzE";

app.get('/api/reviews', async (req, res) => {
    try {
        const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=reviews,rating&key=${API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = app; // This is critical for Vercel