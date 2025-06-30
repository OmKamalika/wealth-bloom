// API client for wealth calculation
// This file provides a client-side API for the wealth calculation service

import { getAnonymousSessionId } from '../utils/sessionUtils';
import { supabase } from '../lib/supabase';
import { validateCalculatorData } from '../utils/validation';

/**
 * Calculate wealth extinction using the API
 * @param calculatorData The input data for the calculation
 * @returns The calculation results
 */
export async function calculateWealthExtinction(calculatorData: any): Promise<any> {
  try {
    console.log('🔄 calculateWealthExtinction called with data structure:', {
      dataType: typeof calculatorData,
      hasInputsNesting: calculatorData.inputs !== undefined,
      topLevelKeys: Object.keys(calculatorData),
      coreIdentity: calculatorData.coreIdentity || calculatorData.inputs?.coreIdentity,
      financialFoundation: calculatorData.financialFoundation || calculatorData.inputs?.financialFoundation
    });

    // Validate the data structure
    const validationError = validateCalculatorData(calculatorData);
    if (validationError) {
      console.error('❌ Input validation failed:', validationError);
      throw new Error(`Invalid input data: ${validationError}`);
    }

    // Get the current user (if logged in)
    const { data: { user } } = await supabase.auth.getUser();
    
    // Get anonymous session ID if user is not logged in
    const sessionId = user ? null : getAnonymousSessionId();
    
    // Add user ID or session ID to the calculator data
    const enrichedData = {
      ...calculatorData,
      userId: user?.id || null,
      sessionId: sessionId
    };
    
    // Log the enriched data being sent to the API
    console.log('📤 Sending data to API:', JSON.stringify({
      endpoint: 'calculate-wealth',
      dataSize: JSON.stringify(enrichedData).length,
      userId: user?.id || 'Anonymous',
      sessionId: sessionId || 'N/A (Logged in user)',
      hasCoreIdentity: !!enrichedData.coreIdentity,
      hasFinancialFoundation: !!enrichedData.financialFoundation,
      complexityScore: enrichedData.complexityAnalysis?.complexityScore || 'N/A'
    }));
    
    // For detailed debugging, uncomment this to log the full payload
    console.log('📦 Full API payload:', JSON.stringify(enrichedData, null, 2));
    
    // Determine the API endpoint based on environment
    const apiUrl = import.meta.env.PROD 
      ? '/.netlify/functions/calculate-wealth'
      : '/api/calculate-wealth';
    
    console.log('🔄 Calling wealth calculation API at:', apiUrl);
    
    // Make the API request
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(sessionId && { 'X-Session-ID': sessionId })
      },
      body: JSON.stringify(enrichedData),
    });
    
    // Log the response status
    console.log('📥 API response status:', response.status);
    
    // Check if the response is OK
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API request failed with status:', response.status);
      console.error('❌ Error response:', errorText);
      
      try {
        // Try to parse the error as JSON
        const errorData = JSON.parse(errorText);
        throw new Error(errorData.message || 'API request failed');
      } catch (parseError) {
        // If parsing fails, use the raw text
        throw new Error(`API request failed with status ${response.status}: ${errorText}`);
      }
    }
    
    // Parse the response
    const data = await response.json();
    
    // Log the response data structure
    console.log('📥 API response structure:', {
      success: data.success,
      hasData: !!data.data,
      dataKeys: data.data ? Object.keys(data.data) : [],
      calculatedAt: data.calculatedAt,
      version: data.version
    });
    
    // For detailed debugging, uncomment this to log the full response
    console.log('📦 Full API response:', JSON.stringify(data, null, 2));
    
    // Verify the response contains the expected data
    if (!data.success || !data.data) {
      console.error('❌ API response missing success or data fields');
      throw new Error('Invalid API response format');
    }
    
    // Check for critical fields in the results
    const results = data.data;
    const requiredFields = ['extinctionYear', 'yearsRemaining', 'currentWealth', 'projections'];
    const missingFields = requiredFields.filter(field => results[field] === undefined);
    
    if (missingFields.length > 0) {
      console.error('❌ API response missing required fields:', missingFields);
      console.error('❌ Available fields:', Object.keys(results));
      throw new Error(`API response missing required fields: ${missingFields.join(', ')}`);
    }
    
    console.log('✅ API calculation successful');
    console.log('📊 Results summary:', {
      extinctionYear: results.extinctionYear,
      yearsRemaining: results.yearsRemaining,
      currentWealth: results.currentWealth,
      childrenInheritance: results.childrenInheritance,
      grandchildrenInheritance: results.grandchildrenInheritance,
      projectionsCount: results.projections?.length || 0
    });
    
    return data.data;
    
  } catch (error) {
    console.error('❌ API calculation error:', error);
    console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace available');
    
    // Throw the error to be handled by the component
    throw error;
  }
}

/**
 * Associate anonymous calculations with a user account
 * @param userId The user ID to associate with
 * @param sessionId The anonymous session ID
 * @returns Success status
 */
export async function associateAnonymousCalculations(userId: string, sessionId: string): Promise<boolean> {
  try {
    console.log('🔄 Associating anonymous calculations with user:', userId);
    console.log('🔑 Session ID:', sessionId);
    
    // Determine the API endpoint based on environment
    const apiUrl = import.meta.env.PROD 
      ? '/.netlify/functions/associate-calculation'
      : '/api/associate-calculation';
    
    console.log('🔄 Calling association API at:', apiUrl);
    
    // Make the API request
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId, sessionId }),
    });
    
    console.log('📥 Association API response status:', response.status);
    
    // Check if the response is OK
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Association API request failed with status:', response.status);
      console.error('❌ Error response:', errorText);
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }
    
    // Parse the response
    const data = await response.json();
    
    console.log('✅ Association successful:', data);
    return data.success;
    
  } catch (error) {
    console.error('❌ Error in associateAnonymousCalculations:', error);
    console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace available');
    return false;
  }
}
