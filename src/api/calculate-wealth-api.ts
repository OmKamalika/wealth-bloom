// API client for wealth calculation
// This file provides a client-side API for the wealth calculation service

/**
 * Calculate wealth extinction using the API
 * @param calculatorData The input data for the calculation
 * @returns The calculation results
 */
export async function calculateWealthExtinction(calculatorData: any): Promise<any> {
  try {
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
      },
      body: JSON.stringify(calculatorData),
    });
    
    // Check if the response is OK
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'API request failed');
    }
    
    // Parse the response
    const data = await response.json();
    
    console.log('✅ API calculation successful');
    return data.data;
    
  } catch (error) {
    console.error('❌ API calculation error:', error);
    
    // Fallback to client-side calculation if API fails
    console.log('🔄 Falling back to client-side calculation...');
    
    // Implement a simplified client-side calculation for fallback
    return fallbackClientCalculation(calculatorData);
  }
}

/**
 * Fallback client-side calculation for when the API is unavailable
 * This is a simplified version of the calculation for emergency use
 */
function fallbackClientCalculation(calculatorData: any): any {
  console.log('⚠️ Using simplified client-side calculation');
  
  const { coreIdentity, financialFoundation } = calculatorData;
  
  // Simplified calculation
  const currentYear = 2025;
  const baseExtinctionYear = currentYear + 40; // Simple approximation
  const adjustedExtinctionYear = Math.max(
    currentYear + 10,
    baseExtinctionYear - (coreIdentity.age / 10)
  );
  
  // Round to nearest year
  const extinctionYear = Math.round(adjustedExtinctionYear);
  const yearsRemaining = extinctionYear - currentYear;
  
  // Simple inheritance calculation
  const childrenInheritance = financialFoundation.currentNetWorth * 0.3;
  const grandchildrenInheritance = financialFoundation.currentNetWorth * 0.1;
  
  return {
    extinctionYear,
    yearsRemaining,
    currentWealth: financialFoundation.currentNetWorth,
    childrenInheritance,
    grandchildrenInheritance,
    projections: [],
    topWealthDestroyers: [
      {
        factor: 'Simplified Calculation',
        impact: 0.1,
        description: 'Using simplified client-side calculation'
      }
    ],
    familyImpact: {
      today: {
        netWorth: financialFoundation.currentNetWorth,
        status: 'Building wealth actively'
      },
      inheritance: {
        year: currentYear + (85 - coreIdentity.age),
        children: []
      },
      grandchildren: {
        year: currentYear + (85 - coreIdentity.age) + 30,
        inheritance: grandchildrenInheritance,
        collegeShortfall: 400000 - grandchildrenInheritance
      }
    },
    protectedScenario: {
      extinctionYear: extinctionYear + 8,
      additionalYears: 8,
      grandchildrenInheritance: grandchildrenInheritance * 3,
      improvements: [
        'Family coordination planning',
        'Investment optimization',
        'Expense management'
      ]
    },
    complexityAnalysis: {
      score: 5,
      primaryComplexityDrivers: ['Simplified client-side calculation'],
      coordinationOpportunities: ['Contact us for detailed analysis'],
      optimizationPotential: 5
    },
    scenarioAnalysis: {
      bestCase: { extinctionYear: extinctionYear + 10, probability: 0.2 },
      mostLikely: { extinctionYear: extinctionYear, probability: 0.6 },
      worstCase: { extinctionYear: extinctionYear - 5, probability: 0.2 }
    }
  };
}