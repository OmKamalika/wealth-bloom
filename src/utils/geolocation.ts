// src/utils/geolocation.ts
// Utility functions for geolocation detection and country lookup

import { CurrencyInfo, defaultCurrency, getCurrencyInfoFromCountry } from './currencyData';

/**
 * Get the user's current position using the Geolocation API
 * @returns Promise that resolves to the user's coordinates
 */ 
export function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: false,
      timeout: 5000,
      maximumAge: 0
    });
  });
}

/**
 * Get the country code from coordinates using reverse geocoding
 * @param latitude Latitude coordinate
 * @param longitude Longitude coordinate
 * @returns Promise that resolves to the country code (ISO 3166-1 alpha-2)
 */
export async function getCountryFromCoordinates(
  latitude: number,
  longitude: number
): Promise<string> {
  try {
    // In a production environment, you would call a reverse geocoding API
    // For this implementation, we'll use a free service
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=3`,
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
    
    const data = await response.json();
    
    // Extract the country code
    const countryCode = data.address?.country_code?.toUpperCase();
    
    if (!countryCode) {
      throw new Error('Country code not found in geocoding response');
    }
    
    return countryCode;
  } catch (error) {
    console.error('Error getting country from coordinates:', error);
    throw error;
  }
}

/**
 * Get the user's country and currency information
 * @returns Promise that resolves to the user's currency info
 */
export async function detectUserCurrency(): Promise<CurrencyInfo> {
  try {
    // Try to get the user's position
    const position = await getCurrentPosition();
    
    // Get the country code from the coordinates
    const countryCode = await getCountryFromCoordinates(
      position.coords.latitude,
      position.coords.longitude
    );
    
    // Get the currency info for the country
    return getCurrencyInfoFromCountry(countryCode);
  } catch (error) {
    console.error('Error detecting user currency:', error);
    
    // Fallback to browser locale if geolocation fails
    try {
      const browserLocale = navigator.language;
      const countryCode = browserLocale.split('-')[1];
      
      if (countryCode) {
        const currencyInfo = getCurrencyInfoFromCountry(countryCode);
        if (currencyInfo) {
          return currencyInfo;
        }
      }
    } catch (localeError) {
      console.error('Error getting currency from browser locale:', localeError);
    }
    
    // Return default currency as last resort
    return defaultCurrency;
  }
}

/**
 * Get the user's country code from their IP address
 * This is a fallback method if geolocation is denied
 * @returns Promise that resolves to the country code or null if rate limited
 */
export async function getCountryFromIP(): Promise<string | null> {
  try {
    // Use a free IP geolocation service
    const response = await fetch('https://ipapi.co/json/');
    
    if (response.status === 429) {
      // Handle rate limiting gracefully
      console.warn('IP geolocation service rate limited. Falling back to default currency.');
      return null;
    }
    
    if (!response.ok) {
      throw new Error(`IP geolocation API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.country_code;
  } catch (error) {
    console.error('Error getting country from IP:', error);
    return null;
  }
}

/**
 * Determine city type based on location data
 * @param latitude Latitude coordinate
 * @param longitude Longitude coordinate
 * @returns Promise that resolves to the city type
 */
export async function determineCityType(
  latitude: number,
  longitude: number
): Promise<'metro' | 'tier2' | 'tier3' | 'rural'> {
  try {
    // Call our serverless function to determine city type
    const response = await fetch('/api/get-city-type', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ latitude, longitude })
    });
    
    if (!response.ok) {
      throw new Error(`City type API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.cityType;
  } catch (error) {
    console.error('Error determining city type:', error);
    
    // Fallback to a simple heuristic based on reverse geocoding
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
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
      
      const data = await response.json();
      
      // Simple classification based on place type
      if (data.address?.city) {
        // Check for major cities
        const majorCities = ['Mumbai', 'Delhi', 'Bangalore', 'Kolkata', 'Chennai', 'Hyderabad'];
        if (majorCities.includes(data.address.city)) {
          return 'metro';
        }
        
        // Check population if available
        if (data.address?.population) {
          const population = parseInt(data.address.population);
          if (population > 1000000) return 'metro';
          if (population > 500000) return 'tier2';
          if (population > 100000) return 'tier3';
        }
        
        return 'tier2'; // Default for cities
      } else if (data.address?.town) {
        return 'tier3';
      } else {
        return 'rural';
      }
    } catch (fallbackError) {
      console.error('Fallback geocoding failed:', fallbackError);
      return 'tier2'; // Default fallback
    }
  }
}

/**
 * Fast IP-based location detection as fallback
 * This is much faster than GPS and works when GPS is denied
 * @returns Promise that resolves to basic location info
 */
export async function getLocationFromIP(): Promise<{
  city: string;
  state: string;
  country: string;
  cityType: 'metro' | 'tier2' | 'tier3' | 'rural';
}> {
  try {
    // Use a fast IP geolocation service with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
    
    const response = await fetch('https://ipapi.co/json/', {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json'
      }
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`IP geolocation failed: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Determine city type based on city name and country
    let cityType: 'metro' | 'tier2' | 'tier3' | 'rural' = 'tier2';
    
    if (data.country_code === 'IN') {
      // Indian cities classification
      const metroCities = ['Mumbai', 'Delhi', 'Bangalore', 'Bengaluru', 'Kolkata', 'Chennai', 'Hyderabad', 'Ahmedabad', 'Pune'];
      const tier2Cities = ['Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam'];
      
      if (metroCities.includes(data.city)) {
        cityType = 'metro';
      } else if (tier2Cities.includes(data.city)) {
        cityType = 'tier2';
      } else if (data.city) {
        cityType = 'tier3';
      } else {
        cityType = 'rural';
      }
    } else {
      // Non-Indian cities - use population as proxy
      if (data.population && data.population > 1000000) {
        cityType = 'metro';
      } else if (data.population && data.population > 500000) {
        cityType = 'tier2';
      } else if (data.population && data.population > 100000) {
        cityType = 'tier3';
      } else {
        cityType = 'rural';
      }
    }
    
    return {
      city: data.city || 'Unknown',
      state: data.region || data.state || 'Unknown',
      country: data.country_name || 'Unknown',
      cityType
    };
    
  } catch (error) {
    console.error('IP-based location detection failed:', error);
    
    // Return default Indian location
    return {
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      cityType: 'metro'
    };
  }
}

/**
 * Optimized location detection that tries multiple methods
 * @returns Promise that resolves to location info
 */
export async function getOptimizedLocation(): Promise<{
  city: string;
  state: string;
  country: string;
  cityType: 'metro' | 'tier2' | 'tier3' | 'rural';
  method: 'gps' | 'ip' | 'default';
}> {
  try {
    // First try GPS with a short timeout
    const gpsPromise = Promise.race([
      getCurrentPosition(),
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('GPS timeout')), 3000)
      )
    ]);
    
    const position = await gpsPromise;
    
    // If GPS succeeds, get detailed location
    const [cityType, geocodingData] = await Promise.allSettled([
      determineCityType(position.coords.latitude, position.coords.longitude),
      fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`,
        {
          headers: {
            'Accept-Language': 'en-US,en;q=0.9',
            'User-Agent': 'WealthBloomApp/1.0'
          }
        }
      ).then(res => res.ok ? res.json() : Promise.reject(new Error(`Geocoding API error: ${res.status}`)))
    ]);
    
    const cityTypeResult = cityType.status === 'fulfilled' ? cityType.value : 'tier2';
    const data = geocodingData.status === 'fulfilled' ? geocodingData.value : {};
    
    return {
      city: data.address?.city || data.address?.town || data.address?.village || 'Unknown',
      state: data.address?.state || 'Unknown',
      country: data.address?.country || 'Unknown',
      cityType: cityTypeResult,
      method: 'gps'
    };
    
  } catch (gpsError) {
    console.log('GPS failed, trying IP-based location...');
    
    try {
      // Fallback to IP-based location
      const ipLocation = await getLocationFromIP();
      return {
        ...ipLocation,
        method: 'ip'
      };
      
    } catch (ipError) {
      console.log('IP location failed, using default...');
      
      // Final fallback to default
      return {
        city: 'Mumbai',
        state: 'Maharashtra',
        country: 'India',
        cityType: 'metro',
        method: 'default'
      };
    }
  }
}