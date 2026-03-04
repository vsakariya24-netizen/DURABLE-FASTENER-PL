export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const SUPABASE_URL = "https://wterhjmgsgyqgbwviomo.supabase.co"; 

    // 1. Handle Preflight (OPTIONS) - Added x-upsert to Allowed Headers
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

    // 2. Prepare the proxied request
    const newHeaders = new Headers(request.headers);
    newHeaders.set("Origin", SUPABASE_URL);
    newHeaders.set("Host", "wterhjmgsgyqgbwviomo.supabase.co");

    // 3. Handle the Request Body (Crucial for PDF/Image uploads)
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

    // 4. Fetch and return with CORS headers
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
        headers: { "Access-Control-Allow-Origin": "*" }
      });
    }
  },
};