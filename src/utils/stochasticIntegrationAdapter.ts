// src/utils/stochasticIntegrationAdapter.ts
// Integration adapter to seamlessly incorporate stochastic modeling into existing wealth calculator

import { calculateWealthExtinction } from './wealthCalculations';
import { AdvancedWealthCalculator } from '../services/AdvancedWealthCalculator';
import { adaptToAdvancedEngine, adaptAdvancedResults } from './wealthCalculationAdapter';
import { CalculatorData } from '../types/calculator';

// Define the interface locally since it's not exported from wealthCalculations
interface CalculationInputs {
  userProfile: {
    age: number;
    maritalStatus: string;
    location: { zipCode: string; state: string };
    healthStatus: string;
  };
  familyStructure: {
    children: Array<{
      name: string;
      age: number;
      academicPerformance: string;
      educationPath: string;
    }>;
    parents: Array<{
      age: number;
      healthStatus: string;
      financialStatus: string;
      location: string;
    }>;
    siblings: Array<{
      relationshipQuality: string;
      financialCapacity: string;
      careWillingness: string;
    }>;
  };
  financialProfile: {
    netWorth: number;
    income: number;
    expenses: number;
    riskTolerance: string;
  };
  complexityScore: number;
}

export interface StochasticIntegrationOptions {
  enableStochasticModeling: boolean;
  fallbackToLegacy: boolean;
  confidenceThreshold: number;
}

/**
 * Enhanced wealth calculator that can use either stochastic or legacy modeling
 */
export class StochasticIntegrationAdapter {
  private options: StochasticIntegrationOptions;

  constructor(options: Partial<StochasticIntegrationOptions> = {}) {
    this.options = {
      enableStochasticModeling: true,
      fallbackToLegacy: true,
      confidenceThreshold: 0.8,
      ...options
    };
  }

  /**
   * Main calculation method that intelligently chooses between stochastic and legacy modeling
   */
  async calculateWealthExtinction(inputs: CalculationInputs): Promise<any> {
    console.log('Stochastic integration adapter: Starting calculation');

    try {
      if (this.options.enableStochasticModeling) {
        return await this.calculateWithStochasticModeling(inputs);
      } else {
        return await this.calculateWithLegacyModeling(inputs);
      }
    } catch (error) {
      console.error('Error in stochastic integration adapter:', error);
      
      if (this.options.fallbackToLegacy) {
        console.log('Falling back to legacy calculation method');
        return await this.calculateWithLegacyModeling(inputs);
      } else {
        throw error;
      }
    }
  }

  /**
   * Calculate using advanced stochastic modeling
   */
  private async calculateWithStochasticModeling(inputs: CalculationInputs): Promise<any> {
    console.log('Using advanced stochastic modeling');
    
    // Convert legacy inputs to new format
    const advancedData = adaptToAdvancedEngine(inputs);
    
    // Use the static method from AdvancedWealthCalculator
    const results = await AdvancedWealthCalculator.calculateWealthExtinction(advancedData);
    
    // Convert results back to legacy format if needed
    return this.adaptResultsForCompatibility(results, inputs);
  }

  /**
   * Calculate using legacy modeling
   */
  private async calculateWithLegacyModeling(inputs: CalculationInputs): Promise<any> {
    console.log('Using legacy calculation method');
    return calculateWealthExtinction(inputs);
  }

  /**
   * Adapt results to ensure compatibility with existing application
   */
  private adaptResultsForCompatibility(results: any, originalInputs: CalculationInputs): any {
    // Ensure all required fields from legacy results are present
    const adaptedResults = {
      ...results,
      // Add any missing fields that the legacy system expects
      stochasticModelingUsed: true,
      confidenceLevel: this.calculateOverallConfidence(results),
      modelVersion: 'stochastic_v1.0'
    };

    // Validate that all required fields are present
    this.validateResultsCompatibility(adaptedResults);
    
    return adaptedResults;
  }

  /**
   * Calculate overall confidence level based on stochastic analysis
   */
  private calculateOverallConfidence(results: any): number {
    if (!results.projections || results.projections.length === 0) {
      return 0.5; // Default confidence
    }

    // Calculate average confidence from projections
    const avgConfidence = results.projections.reduce((sum: number, proj: any) => {
      return sum + (proj.confidenceLevel || 0.5);
    }, 0) / results.projections.length;

    // Adjust based on scenario analysis
    const scenarioConfidence = results.scenarioAnalysis?.mostLikely?.probability || 0.5;
    
    // Weighted average
    return (avgConfidence * 0.7) + (scenarioConfidence * 0.3);
  }

  /**
   * Validate that results contain all required fields for compatibility
   */
  private validateResultsCompatibility(results: any): void {
    const requiredFields = [
      'extinctionYear',
      'yearsRemaining',
      'currentWealth',
      'projections',
      'topWealthDestroyers',
      'familyImpact',
      'protectedScenario',
      'complexityAnalysis',
      'scenarioAnalysis'
    ];

    const missingFields = requiredFields.filter(field => !(field in results));
    
    if (missingFields.length > 0) {
      console.warn('Missing required fields in results:', missingFields);
      throw new Error(`Incomplete results: missing fields ${missingFields.join(', ')}`);
    }
  }

  /**
   * Compare stochastic vs legacy results for validation
   */
  async compareResults(inputs: CalculationInputs): Promise<{
    stochastic: any;
    legacy: any;
    differences: {
      extinctionYearDiff: number;
      confidenceDiff: number;
      keyDifferences: string[];
    };
  }> {
    console.log('Comparing stochastic vs legacy results');

    const [stochasticResults, legacyResults] = await Promise.all([
      this.calculateWithStochasticModeling(inputs),
      this.calculateWithLegacyModeling(inputs)
    ]);

    const differences = {
      extinctionYearDiff: stochasticResults.extinctionYear - legacyResults.extinctionYear,
      confidenceDiff: (stochasticResults.confidenceLevel || 0.5) - (legacyResults.confidenceLevel || 0.5),
      keyDifferences: this.identifyKeyDifferences(stochasticResults, legacyResults)
    };

    return {
      stochastic: stochasticResults,
      legacy: legacyResults,
      differences
    };
  }

  /**
   * Identify key differences between stochastic and legacy results
   */
  private identifyKeyDifferences(stochastic: any, legacy: any): string[] {
    const differences: string[] = [];

    // Compare extinction years
    if (Math.abs(stochastic.extinctionYear - legacy.extinctionYear) > 2) {
      differences.push(`Extinction year differs by ${Math.abs(stochastic.extinctionYear - legacy.extinctionYear)} years`);
    }

    // Compare wealth projections
    if (stochastic.projections && legacy.projections) {
      const stochasticFinalWealth = stochastic.projections[stochastic.projections.length - 1]?.wealth || 0;
      const legacyFinalWealth = legacy.projections[legacy.projections.length - 1]?.wealth || 0;
      
      if (Math.abs(stochasticFinalWealth - legacyFinalWealth) > 100000) {
        differences.push(`Final wealth projection differs by ₹${Math.abs(stochasticFinalWealth - legacyFinalWealth).toLocaleString()}`);
      }
    }

    // Compare scenario analysis
    if (stochastic.scenarioAnalysis && legacy.scenarioAnalysis) {
      const stochasticWorstCase = stochastic.scenarioAnalysis.worstCase?.extinctionYear || 0;
      const legacyWorstCase = legacy.scenarioAnalysis.worstCase?.extinctionYear || 0;
      
      if (Math.abs(stochasticWorstCase - legacyWorstCase) > 5) {
        differences.push(`Worst-case scenario differs by ${Math.abs(stochasticWorstCase - legacyWorstCase)} years`);
      }
    }

    return differences;
  }

  /**
   * Get stochastic modeling insights for a given scenario
   */
  async getStochasticInsights(inputs: CalculationInputs): Promise<{
    volatilityAnalysis: {
      wealthVolatility: number;
      incomeVolatility: number;
      expenseVolatility: number;
    };
    riskFactors: Array<{
      factor: string;
      probability: number;
      impact: number;
      mitigation: string;
    }>;
    optimizationOpportunities: Array<{
      opportunity: string;
      potentialBenefit: number;
      implementationCost: number;
      timeline: string;
    }>;
  }> {
    console.log('Generating stochastic insights');

    // Use stochastic modeling to get detailed insights
    const advancedData = adaptToAdvancedEngine(inputs);
    
    // Use the static method from AdvancedWealthCalculator
    const results = await AdvancedWealthCalculator.calculateWealthExtinction(advancedData);
    
    return {
      volatilityAnalysis: {
        wealthVolatility: this.calculateWealthVolatility(results),
        incomeVolatility: 0.15, // Based on typical income volatility
        expenseVolatility: 0.12  // Based on typical expense volatility
      },
      riskFactors: (results.complexityAnalysis?.riskFactors || []).map((risk: any) => ({
        factor: risk.risk,
        probability: risk.probability,
        impact: risk.impact,
        mitigation: risk.mitigation
      })),
      optimizationOpportunities: this.generateOptimizationOpportunities(results)
    };
  }

  /**
   * Calculate wealth volatility from stochastic results
   */
  private calculateWealthVolatility(results: any): number {
    if (!results.projections || results.projections.length < 2) {
      return 0.15; // Default volatility
    }

    const wealthValues = results.projections.map((proj: any) => proj.wealth);
    const mean = wealthValues.reduce((sum: number, val: number) => sum + val, 0) / wealthValues.length;
    const variance = wealthValues.reduce((sum: number, val: number) => sum + Math.pow(val - mean, 2), 0) / wealthValues.length;
    
    return Math.sqrt(variance) / mean; // Coefficient of variation
  }

  /**
   * Generate optimization opportunities based on stochastic analysis
   */
  private generateOptimizationOpportunities(results: any): Array<{
    opportunity: string;
    potentialBenefit: number;
    implementationCost: number;
    timeline: string;
  }> {
    const opportunities = [];

    // Investment optimization
    if (results.topWealthDestroyers?.some((d: any) => d.factor.includes('Investment'))) {
      opportunities.push({
        opportunity: 'Implement systematic investment strategy',
        potentialBenefit: 200000,
        implementationCost: 50000,
        timeline: '6 months'
      });
    }

    // Healthcare cost management
    if (results.topWealthDestroyers?.some((d: any) => d.factor.includes('Healthcare'))) {
      opportunities.push({
        opportunity: 'Optimize healthcare cost management',
        potentialBenefit: 150000,
        implementationCost: 25000,
        timeline: '3 months'
      });
    }

    // Family coordination
    if (results.complexityAnalysis?.coordinationOpportunities?.length > 0) {
      opportunities.push({
        opportunity: 'Improve family financial coordination',
        potentialBenefit: 100000,
        implementationCost: 10000,
        timeline: '12 months'
      });
    }

    return opportunities;
  }

  /**
   * Update integration options
   */
  updateOptions(newOptions: Partial<StochasticIntegrationOptions>): void {
    this.options = { ...this.options, ...newOptions };
  }

  /**
   * Get current integration status
   */
  getStatus(): {
    stochasticEnabled: boolean;
    fallbackEnabled: boolean;
    confidenceThreshold: number;
    lastCalculationTime?: string;
  } {
    return {
      stochasticEnabled: this.options.enableStochasticModeling,
      fallbackEnabled: this.options.fallbackToLegacy,
      confidenceThreshold: this.options.confidenceThreshold
    };
  }
}

/**
 * Factory function to create integration adapter with sensible defaults
 */
export function createStochasticIntegrationAdapter(
  options: Partial<StochasticIntegrationOptions> = {}
): StochasticIntegrationAdapter {
  return new StochasticIntegrationAdapter(options);
}

/**
 * Utility function to determine if stochastic modeling should be used
 */
export function shouldUseStochasticModeling(
  inputs: CalculationInputs,
  options: StochasticIntegrationOptions
): boolean {
  if (!options.enableStochasticModeling) {
    return false;
  }

  // Check complexity score - higher complexity benefits more from stochastic modeling
  if (inputs.complexityScore > 7) {
    return true;
  }

  // Check if user has significant wealth that would benefit from sophisticated modeling
  if (inputs.financialProfile.netWorth > 10000000) { // 1 crore
    return true;
  }

  // Check if user has complex family structure
  if (inputs.familyStructure.children.length > 2 || 
      inputs.familyStructure.parents.some((p: any) => p.financialStatus !== 'independent')) {
    return true;
  }

  return false;
} 