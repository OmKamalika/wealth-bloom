// src/api/calculate-wealth.ts
// API route handler for wealth calculation

import { CalculatorData, CalculationResults } from '../types/calculator';
import { AdvancedWealthCalculator } from '../services/AdvancedWealthCalculator';

/**
 * API Route Handler for Wealth Calculation
 * Handles POST requests to calculate wealth extinction analysis
 */
export async function POST(request: Request): Promise<Response> {
  try {
    // Parse request body
    const calculatorData: CalculatorData = await request.json();
    
    // Validate input data
    if (!calculatorData || !calculatorData.coreIdentity || !calculatorData.financialFoundation) {
      return Response.json(
        { 
          success: false,
          error: 'Invalid input data provided',
          message: 'Required fields: coreIdentity, financialFoundation'
        },
        { status: 400 }
      );
    }
    
    // Additional validation
    if (calculatorData.coreIdentity.age < 18 || calculatorData.coreIdentity.age > 100) {
      return Response.json(
        { 
          success: false,
          error: 'Invalid age provided',
          message: 'Age must be between 18 and 100'
        },
        { status: 400 }
      );
    }
    
    if (calculatorData.financialFoundation.currentNetWorth < 0) {
      return Response.json(
        { 
          success: false,
          error: 'Invalid net worth provided',
          message: 'Net worth cannot be negative'
        },
        { status: 400 }
      );
    }
    
    console.log('📝 Received calculation request for user age:', calculatorData.coreIdentity.age);
    console.log('💰 Net worth:', calculatorData.financialFoundation.currentNetWorth);
    console.log('🔢 Complexity score:', calculatorData.complexityAnalysis.complexityScore);
    
    // Run the calculation
    const results: CalculationResults = await AdvancedWealthCalculator.calculateWealthExtinction(calculatorData);
    
    // Log results for monitoring
    console.log('✅ Calculation completed');
    console.log('📅 Extinction year:', results.extinctionYear);
    console.log('⏰ Years remaining:', results.yearsRemaining);
    
    // Return successful response
    return Response.json({
      success: true,
      data: results,
      calculatedAt: new Date().toISOString(),
      version: '2.0',
      metadata: {
        simulationYears: 75,
        monteCarloRuns: 5000,
        variablesMonitored: 247
      }
    });
    
  } catch (error) {
    console.error('❌ Calculation API error:', error);
    
    // Return error response
    return Response.json(
      { 
        success: false,
        error: 'Internal server error during calculation',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

/**
 * GET handler for API health check
 */
export async function GET(): Promise<Response> {
  return Response.json({
    success: true,
    message: 'Wealth Calculation API is running',
    version: '2.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      POST: '/api/calculate-wealth',
      description: 'Calculate wealth extinction analysis'
    }
  });
}

/**
 * OPTIONS handler for CORS preflight requests
 */
export async function OPTIONS(): Promise<Response> {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400'
    }
  });
} 