export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // Your actual Supabase URL
    const SUPABASE_URL = "https://wterhjmgsgyqgbwviomo.supabase.co"; 

    // 1. Handle Preflight (OPTIONS) requests
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          // UPDATED: Added accept-profile and content-profile here
          "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey, x-client-info, accept-profile, content-profile",
          "Access-Control-Max-Age": "86400",
        },
      });
    }

    // 2. Setup the proxy request
    const newUrl = SUPABASE_URL + url.pathname + url.search;
    const newHeaders = new Headers(request.headers);
    newHeaders.set("Origin", SUPABASE_URL);

    const modifiedRequest = new Request(newUrl, {
      method: request.method,
      headers: newHeaders,
      body: request.body,
    });

    // 3. Get response and OVERWRITE the CORS headers
    const response = await fetch(modifiedRequest);
    
    const newResponseHeaders = new Headers(response.headers);
    
    // Force allow everything for the browser
    newResponseHeaders.set("Access-Control-Allow-Origin", "*");
    newResponseHeaders.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    // UPDATED: Added accept-profile and content-profile here too
    newResponseHeaders.set("Access-Control-Allow-Headers", "Content-Type, Authorization, apikey, x-client-info, accept-profile, content-profile");

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newResponseHeaders,
    });
  },
};