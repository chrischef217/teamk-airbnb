export async function onRequest(context) {
  const { request, next } = context;
  
  // Add security headers
  const response = await next();
  
  // Clone response to make it mutable
  const newResponse = new Response(response.body, response);
  
  // Add CORS headers for API calls
  newResponse.headers.set('Access-Control-Allow-Origin', '*');
  newResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  newResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Add security headers
  newResponse.headers.set('X-Frame-Options', 'DENY');
  newResponse.headers.set('X-Content-Type-Options', 'nosniff');
  newResponse.headers.set('X-XSS-Protection', '1; mode=block');
  
  return newResponse;
}