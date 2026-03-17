import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
app.use(cors());

// Vercel gets this from your Dashboard Settings
const API_KEY = process.env.GOOGLE_API_KEY;
const PLACE_ID = "ChIJr-Xe6gXLWTkR_HMq1UxmLzE";

app.get('/api/reviews', async (req, res) => {
  try {
    if (!API_KEY) {
      console.error("Missing GOOGLE_API_KEY in Vercel Settings");
      return res.status(500).json({ error: "Missing API Key" });
    }

    const url = ``;
    
    const response = await fetch(url);
    const data = await response.json();

    res.status(200).json(data);
  } catch (error) {
    console.error("Backend error:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

export default app;
