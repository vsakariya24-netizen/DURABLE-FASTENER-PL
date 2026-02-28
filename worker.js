export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const SUPABASE_URL = "https://wterhjmgsgyqgbwviomo.supabase.co"; 

    // 1. Handle CORS Preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey, x-client-info, accept-profile, content-profile",
        },
      });
    }

    // 2. Setup the proxy request
    const newUrl = SUPABASE_URL + url.pathname + url.search;
    const newHeaders = new Headers(request.headers);
    newHeaders.set("Origin", SUPABASE_URL);
    newHeaders.set("Host", "wterhjmgsgyqgbwviomo.supabase.co");

    const modifiedRequest = new Request(newUrl, {
      method: request.method,
      headers: newHeaders,
      body: request.method !== "GET" && request.method !== "HEAD" ? request.body : undefined,
    });

    // 3. Fetch and add CORS headers to the response
    const response = await fetch(modifiedRequest);
    const newResponseHeaders = new Headers(response.headers);
    
    newResponseHeaders.set("Access-Control-Allow-Origin", "*");
    
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newResponseHeaders,
    });
  },
};