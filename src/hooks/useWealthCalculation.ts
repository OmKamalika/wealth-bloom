// src/hooks/useWealthCalculation.ts
// React hook for using the advanced wealth calculation engine

import { useState, useCallback } from 'react';
import { CalculatorData, CalculationResults } from '../types/calculator';
import { AdvancedWealthCalculator } from '../services/AdvancedWealthCalculator';

/**
 * React hook for advanced wealth calculation
 * Provides state management and error handling for the wealth calculation engine
 */
export function useWealthCalculation() {
  const [isCalculating, setIsCalculating] = useState(false);
  const [results, setResults] = useState<CalculationResults | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<{
    phase: string;
    percentage: number;
    message: string;
  } | null>(null);

  /**
   * Calculate wealth extinction analysis
   */
  const calculateWealth = useCallback(async (data: CalculatorData): Promise<CalculationResults> => {
    setIsCalculating(true);
    setError(null);
    setResults(null);
    
    try {
      // Validate input data
      if (!data || !data.coreIdentity || !data.financialFoundation) {
        throw new Error('Invalid input data provided');
      }

      // Set initial progress
      setProgress({
        phase: 'Initializing',
        percentage: 0,
        message: 'Starting wealth extinction calculation...'
      });

      console.log('📝 Starting calculation for user age:', data.coreIdentity.age);
      console.log('💰 Net worth:', data.financialFoundation.currentNetWorth);
      console.log('🔢 Complexity score:', data.complexityAnalysis.complexityScore);

      // Update progress for Monte Carlo simulation
      setProgress({
        phase: 'Monte Carlo Simulation',
        percentage: 20,
        message: 'Running 5,000 scenario simulations...'
      });

      // Run the calculation
      const calculationResults = await AdvancedWealthCalculator.calculateWealthExtinction(data);

      // Update progress for completion
      setProgress({
        phase: 'Finalizing',
        percentage: 100,
        message: 'Calculation completed successfully!'
      });

      // Set results
      setResults(calculationResults);
      
      // Log results for monitoring
      console.log('✅ Calculation completed');
      console.log('📅 Extinction year:', calculationResults.extinctionYear);
      console.log('⏰ Years remaining:', calculationResults.yearsRemaining);
      console.log('💰 Current wealth:', calculationResults.currentWealth);
      console.log('👨‍👩‍👧‍👦 Children inheritance:', calculationResults.childrenInheritance);
      console.log('🎓 Grandchildren inheritance:', calculationResults.grandchildrenInheritance);

      return calculationResults;
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred during calculation';
      setError(errorMessage);
      console.error('❌ Calculation error:', err);
      throw err;
    } finally {
      setIsCalculating(false);
      setProgress(null);
    }
  }, []);

  /**
   * Clear calculation results
   */
  const clearResults = useCallback(() => {
    setResults(null);
    setError(null);
    setProgress(null);
  }, []);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Get calculation insights
   */
  const getInsights = useCallback(() => {
    if (!results) return [];

    const insights: string[] = [];

    // Extinction year insights
    if (results.extinctionYear < 2050) {
      insights.push('⚠️ Your wealth may be at risk of extinction before retirement age. Immediate action is recommended.');
    } else if (results.extinctionYear < 2070) {
      insights.push('⚠️ Your wealth may not last through retirement. Consider implementing protective measures.');
    } else {
      insights.push('✅ Your wealth trajectory looks sustainable with proper planning.');
    }

    // Years remaining insights
    if (results.yearsRemaining < 20) {
      insights.push('⏰ Limited time remaining to build wealth. Focus on high-impact strategies.');
    } else if (results.yearsRemaining < 40) {
      insights.push('⏰ Moderate time horizon. Balance growth and protection strategies.');
    } else {
      insights.push('⏰ Long time horizon available. Focus on wealth building and compounding.');
    }

    // Wealth destroyer insights
    if (results.topWealthDestroyers.length > 0) {
      const topDestroyer = results.topWealthDestroyers[0];
      insights.push(`🎯 Top wealth destroyer: ${topDestroyer.factor} - ${topDestroyer.description}`);
    }

    // Family impact insights
    if (results.childrenInheritance < 1000000) {
      insights.push('👨‍👩‍👧‍👦 Children may receive limited inheritance. Consider education funding strategies.');
    }

    if (results.grandchildrenInheritance < 500000) {
      insights.push('🎓 Grandchildren may face college funding shortfall. Plan for multi-generational wealth transfer.');
    }

    // Complexity insights
    if (results.complexityAnalysis.score > 7) {
      insights.push('🔧 High complexity situation detected. Professional financial planning recommended.');
    }

    return insights;
  }, [results]);

  /**
   * Get actionable recommendations
   */
  const getActionableRecommendations = useCallback(() => {
    if (!results) return [];

    const recommendations: Array<{
      priority: 'critical' | 'high' | 'medium';
      action: string;
      timeline: string;
      impact: string;
    }> = [];

    // Add immediate recommendations
    results.recommendations.immediate.forEach(rec => {
      recommendations.push({
        priority: rec.priority,
        action: rec.action,
        timeline: `Due by ${rec.deadline}`,
        impact: `Extends timeline by ${rec.timelineImpact} years`
      });
    });

    // Add short-term recommendations
    results.recommendations.shortTerm.slice(0, 3).forEach(rec => {
      recommendations.push({
        priority: 'medium',
        action: rec.action,
        timeline: rec.timeframe,
        impact: rec.expectedBenefit
      });
    });

    return recommendations.sort((a, b) => {
      const priorityOrder = { 'critical': 3, 'high': 2, 'medium': 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }, [results]);

  /**
   * Get scenario analysis summary
   */
  const getScenarioSummary = useCallback(() => {
    if (!results) return null;

    return {
      bestCase: {
        year: results.scenarioAnalysis.bestCase.extinctionYear,
        probability: results.scenarioAnalysis.bestCase.probability,
        conditions: results.scenarioAnalysis.bestCase.conditions
      },
      mostLikely: {
        year: results.scenarioAnalysis.mostLikely.extinctionYear,
        probability: results.scenarioAnalysis.mostLikely.probability,
        conditions: results.scenarioAnalysis.mostLikely.conditions
      },
      worstCase: {
        year: results.scenarioAnalysis.worstCase.extinctionYear,
        probability: results.scenarioAnalysis.worstCase.probability,
        conditions: results.scenarioAnalysis.worstCase.conditions
      }
    };
  }, [results]);

  /**
   * Export calculation results
   */
  const exportResults = useCallback(() => {
    if (!results) return null;

    const exportData = {
      calculationDate: new Date().toISOString(),
      results,
      insights: getInsights(),
      recommendations: getActionableRecommendations(),
      scenarioSummary: getScenarioSummary()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wealth-calculation-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [results, getInsights, getActionableRecommendations, getScenarioSummary]);

  return {
    // State
    isCalculating,
    results,
    error,
    progress,
    
    // Actions
    calculateWealth,
    clearResults,
    clearError,
    exportResults,
    
    // Computed values
    insights: getInsights(),
    actionableRecommendations: getActionableRecommendations(),
    scenarioSummary: getScenarioSummary(),
    
    // Helper methods
    hasResults: !!results,
    hasError: !!error,
    isReady: !isCalculating && !error
  };
} 