import fetch from 'node-fetch';

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");

  if (req.method === "OPTIONS") return res.status(200).end();

  const API_KEY = process.env.GOOGLE_API_KEY;
  const PLACE_ID = "ChIJr-Xe6gXLWTkR_HMq1UxmLzE";

  // ✅ Debug — API key hai ya nahi
  if (!API_KEY) {
    return res.status(500).json({ 
      error: "Missing API Key",
      env_keys: Object.keys(process.env).filter(k => k.includes('GOOGLE'))
    });
  }

  try {
    // ✅ URL alag alag build karo
    const baseUrl = "https://maps.googleapis.com/maps/api/place/details/json";
    const params = new URLSearchParams({
      place_id: PLACE_ID,
      fields: "name,rating,user_ratings_total,reviews",
      language: "en",
      key: API_KEY
    });

    const finalUrl = `${baseUrl}?${params.toString()}`;
    
    const response = await fetch(finalUrl);
    const data = await response.json();

    if (!data.result) {
      return res.status(502).json({ 
        error: "Google API Error", 
        google_status: data.status 
      });
    }

    return res.status(200).json({
      result: {
        reviews: data.result.reviews || [],
        rating: data.result.rating || 4.9,
        total: data.result.user_ratings_total || 0,
      }
    });

  } catch (error) {
    return res.status(500).json({ 
      error: "Server error", 
      details: error.message 
    });
  }
}
