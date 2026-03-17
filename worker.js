export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const SUPABASE_URL = "https://wterhjmgsgyqgbwviomo.supabase.co";

    // ✅ NEW: Intercept Google Reviews route BEFORE Supabase proxy
    if (url.pathname === "/api/reviews") {
      if (request.method === "OPTIONS") {
        return new Response(null, {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Max-Age": "86400",
          },
        });
      }

      const CACHE_TTL = 21600; // 6 hours
      const cache = caches.default;
      const cacheRequest = new Request("https://fake-cache-key.internal/google_reviews_v1");
      const cachedResponse = await cache.match(cacheRequest);

      if (cachedResponse) {
        const body = await cachedResponse.json();
        return new Response(JSON.stringify(body), {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "X-Cache": "HIT",
          },
        });
      }

      // Cache miss — call Google Places API
      const PLACE_ID = "ChIJr-Xe6gXLWTkR_HMq1UxmLzE";
      const API_KEY = env.GOOGLE_API_KEY; // ← Add this in Worker env variables

      try {
        const googleRes = await fetch(
          `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=reviews,rating&key=${API_KEY}`
        );
        const data = await googleRes.json();

        // Store in Cloudflare edge cache
        await cache.put(
          cacheRequest,
          new Response(JSON.stringify(data), {
            headers: { "Cache-Control": `public, max-age=${CACHE_TTL}`, "Content-Type": "application/json" },
          })
        );

        return new Response(JSON.stringify(data), {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "X-Cache": "MISS",
          },
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), {
          status: 500,
          headers: { "Access-Control-Allow-Origin": "*" },
        });
      }
    }

    // ──────────────────────────────────────────────
    // EXISTING SUPABASE PROXY — completely untouched
    // ──────────────────────────────────────────────

    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS, PATCH",
          "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey, x-client-info, accept-profile, content-profile, x-supabase-api-version, x-upsert",
          "Access-Control-Max-Age": "86400",
        },
      });
    }

    const newHeaders = new Headers(request.headers);
    newHeaders.set("Origin", SUPABASE_URL);
    newHeaders.set("Host", "wterhjmgsgyqgbwviomo.supabase.co");

    let body = null;
    if (request.method !== "GET" && request.method !== "HEAD") {
      body = await request.clone().arrayBuffer();
    }

    const modifiedRequest = new Request(SUPABASE_URL + url.pathname + url.search, {
      method: request.method,
      headers: newHeaders,
      body: body,
      redirect: "follow",
    });

    try {
      const response = await fetch(modifiedRequest);
      const newResponseHeaders = new Headers(response.headers);

      newResponseHeaders.set("Access-Control-Allow-Origin", "*");
      newResponseHeaders.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
      newResponseHeaders.set("Access-Control-Allow-Headers", "Content-Type, Authorization, apikey, x-client-info, accept-profile, content-profile, x-supabase-api-version, x-upsert");

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newResponseHeaders,
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), {
        status: 500,
        headers: { "Access-Control-Allow-Origin": "*" },
      });
    }
  },
};
