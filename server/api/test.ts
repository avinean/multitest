export default defineEventHandler(async (event) => {
  // Get query parameters
  const query = getQuery(event)
  
  // Get request body for POST/PUT requests
  let body = null

  // Return test response
  return {
    success: true,
    message: 'Тестовий API ендпоінт працює!',
    timestamp: new Date().toISOString(),
    query,
    body,
    headers: getHeaders(event),
    userAgent: getHeader(event, 'user-agent'),
    ip: getRequestIP(event),
    // Test data
    testData: {
      randomNumber: Math.floor(Math.random() * 1000),
      randomString: Math.random().toString(36).substring(7),
      serverTime: new Date().toLocaleString('uk-UA'),
      environment: process.env.NODE_ENV || 'development'
    }
  }
}) 