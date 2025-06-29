// Netlify serverless function to get country from coordinates
exports.handler = async (event, context) => {
  try {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Method not allowed' })
      };
    }

    // Parse the request body
    const data = JSON.parse(event.body);
    
    // Validate required fields
    if (!data.latitude || !data.longitude) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          error: 'Missing required fields',
          message: 'Required fields: latitude, longitude'
        })
      };
    }
    
    // Call the OpenStreetMap Nominatim API for reverse geocoding
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${data.latitude}&lon=${data.longitude}&zoom=3`,
      {
        headers: {
          'Accept-Language': 'en-US,en;q=0.9',
          'User-Agent': 'WealthBloomApp/1.0'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.status}`);
    }
    
    const geocodingData = await response.json();
    
    // Extract the country code
    const countryCode = geocodingData.address?.country_code?.toUpperCase();
    
    if (!countryCode) {
      throw new Error('Country code not found in geocoding response');
    }
    
    // Return the country code
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        countryCode,
        countryName: geocodingData.address?.country || 'Unknown'
      })
    };
  } catch (error) {
    console.error('Error getting country from coordinates:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        success: false,
        error: 'Error getting country from coordinates',
        message: error.message || 'Unknown error'
      })
    };
  }
};