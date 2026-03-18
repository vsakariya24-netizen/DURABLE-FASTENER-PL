import fetch from 'node-fetch';

// ✅ Server-side memory cache (Vercel function warm rehti hai)
let cache = null;
let cacheTime = 0;
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  // ✅ Cache check — 1 hour tak Google API call nahi
  if (cache && Date.now() - cacheTime < CACHE_TTL) {
    res.setHeader("X-Cache", "HIT");
    return res.status(200).json(cache);
  }

  const API_KEY = process.env.GOOGLE_API_KEY;
  const PLACE_ID = "ChIJr-Xe6gXLWTkR_HMq1UxmLzE";

  if (!API_KEY) {
    return res.status(500).json({ error: "Missing API Key" });
  }

  try {
    const baseUrl = "https://maps.googleapis.com/maps/api/place/details/json";
    const params = new URLSearchParams({
      place_id: PLACE_ID,
      fields: "name,rating,user_ratings_total,reviews",
      language: "en",
      key: API_KEY
    });

    const response = await fetch(`${baseUrl}?${params.toString()}`);
    const data = await response.json();

    if (!data.result) {
      return res.status(502).json({
        error: "Google API Error",
        google_status: data.status
      });
    }

    // ✅ Cache mein save karo
    cache = {
      result: {
        reviews: data.result.reviews || [],
        rating: data.result.rating || 4.9,
        total: data.result.user_ratings_total || 0,
      },
      cachedAt: new Date().toISOString()
    };
    cacheTime = Date.now();

    res.setHeader("X-Cache", "MISS");
    return res.status(200).json(cache);

  } catch (error) {
    // ✅ Error pe purana cache return karo agar available ho
    if (cache) {
      res.setHeader("X-Cache", "STALE");
      return res.status(200).json(cache);
    }
    return res.status(500).json({ error: "Server error", details: error.message });
  }
}
