// Netlify serverless function to associate anonymous calculations with a user
const { createClient } = require('@supabase/supabase-js');

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
    const { userId, sessionId } = JSON.parse(event.body);
    
    // Validate input
    if (!userId || !sessionId) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          error: 'Invalid input data provided',
          message: 'Required fields: userId, sessionId'
        })
      };
    }
    
    console.log('👤 User ID:', userId);
    console.log('🔑 Session ID:', sessionId);
    
    // Initialize Supabase client - use backend environment variables
    const supabase = createClient(
      process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY
    );
    
    // Update all calculations with this session ID to be owned by the user
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
      return {
        statusCode: 500,
        body: JSON.stringify({
          success: false,
          error: 'Database error',
          message: error.message
        })
      };
    }
    
    console.log('✅ Calculations associated successfully');
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Calculations associated with user account',
        updatedCount: data?.length || 0
      })
    };
    
  } catch (error) {
    console.error('❌ Association API error:', error);
    
    // Return error response
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        success: false,
        error: 'Internal server error during association',
        message: error.message || 'Unknown error',
        timestamp: new Date().toISOString()
      })
    };
  }
};