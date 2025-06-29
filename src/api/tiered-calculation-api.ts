// src/api/tiered-calculation-api.ts
// API client for tiered calculation service

import { getAnonymousSessionId } from '../utils/sessionUtils';
import { supabase } from '../lib/supabase';
import { validateCalculatorData } from '../utils/validation';
import { 
  BasicCalculationInputs, 
  BasicCalculationResults,
  ComprehensiveCalculationRequest,
  ComprehensiveCalculationResponse,
  CalculationJobStatus
} from '../types/tiered-calculation';
import { tieredCalculationService } from '../services/TieredCalculationService';

/**
 * Perform basic wealth calculation (immediate response)
 * @param inputs Basic calculation inputs
 * @returns Basic calculation results
 */
export async function performBasicCalculation(inputs: BasicCalculationInputs): Promise<BasicCalculationResults> {
  try {
    console.log('🔄 Performing basic calculation with inputs:', {
      age: inputs.age,
      netWorth: inputs.netWorth,
      annualIncome: inputs.annualIncome,
      children: inputs.children,
      riskTolerance: inputs.riskTolerance,
      location: inputs.location
    });
    
    // Get the current user (if logged in)
    const { data: { user } } = await supabase.auth.getUser();
    
    // Get anonymous session ID if user is not logged in
    const sessionId = user ? null : getAnonymousSessionId();
    
    // Perform basic calculation
    const results = await tieredCalculationService.performBasicCalculation(inputs);
    
    console.log('✅ Basic calculation completed successfully');
    console.log('📊 Results summary:', {
      extinctionYear: results.extinctionYear,
      yearsRemaining: results.yearsRemaining,
      calculationId: results.calculationId
    });
    
    return results;
  } catch (error) {
    console.error('❌ Error in basic calculation:', error);
    throw error;
  }
}

/**
 * Queue comprehensive calculation (for registered users)
 * @param request Comprehensive calculation request
 * @returns Comprehensive calculation response
 */
export async function queueComprehensiveCalculation(
  request: ComprehensiveCalculationRequest
): Promise<ComprehensiveCalculationResponse> {
  try {
    console.log('🔄 Queueing comprehensive calculation for user:', request.userId);
    
    // Validate inputs
    const validationError = validateCalculatorData(request.inputs);
    if (validationError) {
      throw new Error(`Invalid input data: ${validationError}`);
    }
    
    // Queue calculation
    const response = await tieredCalculationService.queueComprehensiveCalculation(request);
    
    console.log('✅ Comprehensive calculation queued successfully');
    console.log('📊 Queue response:', {
      jobId: response.jobId,
      estimatedCompletionTime: response.estimatedCompletionTime,
      queuePosition: response.queuePosition
    });
    
    return response;
  } catch (error) {
    console.error('❌ Error queueing comprehensive calculation:', error);
    throw error;
  }
}

/**
 * Get calculation job status
 * @param jobId Job ID
 * @returns Job status
 */
export async function getCalculationJobStatus(jobId: string): Promise<CalculationJobStatus | null> {
  try {
    return await tieredCalculationService.getJobStatus(jobId);
  } catch (error) {
    console.error('❌ Error getting calculation job status:', error);
    return null;
  }
}

/**
 * Get calculation results
 * @param jobId Job ID
 * @returns Calculation results
 */
export async function getCalculationResults(jobId: string): Promise<any | null> {
  try {
    return await tieredCalculationService.getCalculationResults(jobId);
  } catch (error) {
    console.error('❌ Error getting calculation results:', error);
    return null;
  }
}