const express = require('express');
const cors = require('cors');
// Use this specific way to import fetch for Vercel compatibility
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
app.use(cors()); 

const API_KEY = process.env.GOOGLE_API_KEY; 
const PLACE_ID = "ChIJr-Xe6gXLWTkR_HMq1UxmLzE";

app.get('/api/reviews', async (req, res) => {
    try {
        if (!API_KEY) {
            return res.status(500).json({ error: "Missing API Key in Vercel Settings" });
        }

        const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=reviews,rating&key=${API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();
        
        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

module.exports = app;
