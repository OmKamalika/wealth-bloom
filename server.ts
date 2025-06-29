import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { createClient } from '@supabase/supabase-js';
import { AdvancedWealthCalculator } from './src/services/AdvancedWealthCalculator.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Supabase client - use backend environment variables
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

let supabase = null;
if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
  console.log('✅ Supabase client initialized');
} else {
  console.warn('⚠️ Supabase environment variables not found. Running without database integration.');
}

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Session-ID']
}));
app.use(express.json());

// API Routes
app.post('/api/calculate-wealth', async (req, res) => {
  try {
    console.log('📝 Received calculation request');
    console.log('📦 Request headers:', req.headers);
    console.log('📦 Request body:', JSON.stringify(req.body, null, 2));
    
    const calculatorData = req.body;
    
    // Extract user ID and session ID
    const userId = calculatorData.userId || null;
    const sessionId = calculatorData.sessionId || null;
    
    console.log('👤 User ID:', userId || 'Anonymous');
    console.log('🔑 Session ID:', sessionId || 'Not provided');
    
    // Validate input data
    if (!calculatorData || !calculatorData.coreIdentity || !calculatorData.financialFoundation) {
      console.error('❌ Validation failed: Missing required fields');
      return res.status(400).json({
        success: false,
        error: 'Invalid input data provided',
        message: 'Required fields: coreIdentity, financialFoundation'
      });
    }
    
    // Additional validation
    if (calculatorData.coreIdentity.age < 18 || calculatorData.coreIdentity.age > 100) {
      console.error('❌ Validation failed: Invalid age');
      return res.status(400).json({
        success: false,
        error: 'Invalid age provided',
        message: 'Age must be between 18 and 100'
      });
    }
    
    if (calculatorData.financialFoundation.currentNetWorth < 0) {
      console.error('❌ Validation failed: Invalid net worth');
      return res.status(400).json({
        success: false,
        error: 'Invalid net worth provided',
        message: 'Net worth cannot be negative'
      });
    }
    
    console.log('📝 Received calculation request for user age:', calculatorData.coreIdentity.age);
    console.log('💰 Net worth:', calculatorData.financialFoundation.currentNetWorth);
    console.log('🔢 Complexity score:', calculatorData.complexityAnalysis.complexityScore);
    
    // Run the advanced calculation using the AdvancedWealthCalculator
    console.log('🔮 Starting calculation with AdvancedWealthCalculator...');
    const results = await AdvancedWealthCalculator.calculateWealthExtinction(calculatorData);
    console.log('✅ Advanced calculation completed');
    
    // Log results for monitoring
    console.log('📅 Extinction year:', results.extinctionYear);
    console.log('⏰ Years remaining:', results.yearsRemaining);
    console.log('💰 Current wealth:', results.currentWealth);
    console.log('👨‍👩‍👧‍👦 Children inheritance:', results.childrenInheritance);
    console.log('🎓 Grandchildren inheritance:', results.grandchildrenInheritance);
    
    // Store calculation in database if Supabase is configured
    if (supabase) {
      try {
        const { error } = await supabase
          .from('wealth_calculations')
          .insert([
            {
              user_id: userId,
              session_id: sessionId,
              anonymous: !userId && !!sessionId,
              inputs: calculatorData,
              results: results
            }
          ]);
          
        if (error) {
          console.error('❌ Error storing calculation in database:', error);
        } else {
          console.log('✅ Calculation stored in database');
        }
      } catch (dbError) {
        console.error('❌ Database error:', dbError);
      }
    }
    
    const responseData = {
      success: true,
      data: results,
      calculatedAt: new Date().toISOString(),
      version: '2.0',
      metadata: {
        simulationYears: 75,
        monteCarloRuns: 5000,
        variablesMonitored: 247
      }
    };
    
    console.log('📤 About to send response');
    console.log('📦 Response data structure:', {
      success: responseData.success,
      extinctionYear: responseData.data.extinctionYear,
      yearsRemaining: responseData.data.yearsRemaining,
      hasProjections: !!responseData.data.projections,
      projectionsCount: responseData.data.projections?.length || 0,
      hasTopWealthDestroyers: !!responseData.data.topWealthDestroyers,
      hasFamilyImpact: !!responseData.data.familyImpact,
      hasProtectedScenario: !!responseData.data.protectedScenario,
      hasComplexityAnalysis: !!responseData.data.complexityAnalysis,
      hasScenarioAnalysis: !!responseData.data.scenarioAnalysis
    });
    
    res.json(responseData);
    console.log('✅ Response sent successfully');
    
  } catch (error) {
    console.error('❌ Calculation API error:', error);
    console.error('❌ Error stack:', error.stack);
    
    // Return error response
    res.status(500).json({
      success: false,
      error: 'Internal server error during calculation',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

// City type determination endpoint
app.post('/api/get-city-type', async (req, res) => {
  try {
    console.log('📍 Received city type request');
    
    const data = req.body;
    
    // Validate required fields - fix validation to properly handle zero coordinates
    if (typeof data.latitude !== 'number' || typeof data.longitude !== 'number') {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'Required fields: latitude, longitude'
      });
    }
    
    console.log('📍 Coordinates:', data.latitude, data.longitude);
    
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
    
    console.log('📍 Determined city type:', cityType);
    console.log('📍 Place info:', place);
    
    // Return the city type
    res.json({
      success: true,
      cityType,
      place,
      confidence: 0.8
    });
    
  } catch (error) {
    console.error('❌ Error determining city type:', error);
    
    res.status(500).json({ 
      success: false,
      error: 'Error determining city type',
      message: error.message || 'Unknown error'
    });
  }
});

// Associate anonymous calculations with a user
app.post('/api/associate-calculation', async (req, res) => {
  try {
    console.log('📝 Received association request');
    
    const { userId, sessionId } = req.body;
    
    // Validate input
    if (!userId || !sessionId) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input data provided',
        message: 'Required fields: userId, sessionId'
      });
    }
    
    console.log('👤 User ID:', userId);
    console.log('🔑 Session ID:', sessionId);
    
    // Update all calculations with this session ID to be owned by the user
    if (supabase) {
      const { error, data } = await supabase
        .from('wealth_calculations')
        .update({ 
          user_id: userId,
          anonymous: false
        })
        .eq('session_id', sessionId)
        .is('user_id', null);
      
      if (error) {
        console.error('❌ Error associating calculations:', error);
        return res.status(500).json({
          success: false,
          error: 'Database error',
          message: error.message
        });
      }
      
      console.log('✅ Calculations associated successfully');
      return res.json({
        success: true,
        message: 'Calculations associated with user account',
        updatedCount: data?.length || 0
      });
    } else {
      console.warn('⚠️ Supabase not configured, skipping database update');
      return res.json({
        success: true,
        message: 'Supabase not configured, association simulated',
        updatedCount: 0
      });
    }
    
  } catch (error) {
    console.error('❌ Association API error:', error);
    
    // Return error response
    res.status(500).json({
      success: false,
      error: 'Internal server error during association',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Wealth Calculation API is running',
    version: '2.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      POST: '/api/calculate-wealth',
      POST: '/api/associate-calculation',
      POST: '/api/get-city-type',
      description: 'Calculate wealth extinction analysis, associate anonymous calculations, and determine city type'
    }
  });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(join(__dirname, 'dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(join(__dirname, 'dist', 'index.html'));
  });
} else {
  // In development, proxy frontend requests to Vite dev server
  // Try multiple possible ports for the frontend
  const frontendPorts = [5173, 5174, 5175];
  let proxyTarget = null;
  
  // Find which port the frontend is actually running on
  for (const port of frontendPorts) {
    try {
      const response = await fetch(`http://localhost:${port}`);
      if (response.ok) {
        proxyTarget = `http://localhost:${port}`;
        break;
      }
    } catch (e) {
      // Port not available, try next one
    }
  }
  
  if (proxyTarget) {
    console.log(`🔄 Proxying frontend requests to ${proxyTarget}`);
    app.use('/', createProxyMiddleware({
      target: proxyTarget,
      changeOrigin: true,
      ws: true
    }));
  } else {
    console.log('⚠️ Frontend not found on expected ports, serving API only');
    app.get('/', (req, res) => {
      res.json({
        message: 'Backend API is running',
        endpoints: {
          health: '/api/health',
          calculate: '/api/calculate-wealth',
          associate: '/api/associate-calculation',
          cityType: '/api/get-city-type'
        }
      });
    });
  }
}

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
});