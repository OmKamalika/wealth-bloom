// Netlify serverless function to determine city type from coordinates
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
    
    // Validate required fields - fix validation to properly handle zero coordinates
    if (typeof data.latitude !== 'number' || typeof data.longitude !== 'number') {
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
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${data.latitude}&lon=${data.longitude}`,
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
    
    // Determine city type based on place data
    let cityType = 'tier2'; // Default
    
    // Extract place information
    const place = {
      city: geocodingData.address?.city,
      town: geocodingData.address?.town,
      village: geocodingData.address?.village,
      state: geocodingData.address?.state,
      country: geocodingData.address?.country,
      countryCode: geocodingData.address?.country_code?.toUpperCase()
    };
    
    // Indian metro cities
    const metroCities = [
      'Mumbai', 'Delhi', 'Bangalore', 'Bengaluru', 'Kolkata', 'Chennai', 
      'Hyderabad', 'Ahmedabad', 'Pune', 'Surat', 'Jaipur'
    ];
    
    // Tier 2 cities in India
    const tier2Cities = [
      'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam',
      'Pimpri-Chinchwad', 'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana', 'Agra',
      'Nashik', 'Faridabad', 'Meerut', 'Rajkot', 'Kalyan-Dombivli', 'Vasai-Virar',
      'Varanasi', 'Srinagar', 'Aurangabad', 'Dhanbad', 'Amritsar', 'Navi Mumbai',
      'Allahabad', 'Ranchi', 'Howrah', 'Coimbatore', 'Jabalpur', 'Gwalior', 'Vijayawada',
      'Jodhpur', 'Madurai', 'Raipur', 'Kota', 'Guwahati', 'Chandigarh', 'Solapur',
      'Hubli-Dharwad', 'Mysore', 'Tiruchirappalli', 'Bareilly', 'Aligarh', 'Tiruppur',
      'Gurgaon', 'Moradabad', 'Jalandhar', 'Bhubaneswar', 'Salem', 'Warangal',
      'Mira-Bhayandar', 'Jalgaon', 'Guntur', 'Thiruvananthapuram', 'Bhiwandi'
    ];
    
    if (place.city) {
      if (metroCities.includes(place.city)) {
        cityType = 'metro';
      } else if (tier2Cities.includes(place.city)) {
        cityType = 'tier2';
      } else {
        // For other cities, use population-based heuristic if available
        if (geocodingData.address?.population) {
          const population = parseInt(geocodingData.address.population);
          if (population > 1000000) cityType = 'metro';
          else if (population > 500000) cityType = 'tier2';
          else if (population > 100000) cityType = 'tier3';
          else cityType = 'rural';
        } else {
          // Default for cities not in our lists
          cityType = 'tier3';
        }
      }
    } else if (place.town) {
      cityType = 'tier3';
    } else if (place.village) {
      cityType = 'rural';
    }
    
    // Return the city type
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        cityType,
        place,
        confidence: 0.8
      })
    };
  } catch (error) {
    console.error('Error determining city type:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        success: false,
        error: 'Error determining city type',
        message: error.message || 'Unknown error'
      })
    };
  }
};