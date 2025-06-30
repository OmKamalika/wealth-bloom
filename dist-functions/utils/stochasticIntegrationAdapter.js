"use strict";
// src/utils/stochasticIntegrationAdapter.ts
// Integration adapter to seamlessly incorporate stochastic modeling into existing wealth calculator
Object.defineProperty(exports, "__esModule", { value: true });
exports.StochasticIntegrationAdapter = void 0;
exports.createStochasticIntegrationAdapter = createStochasticIntegrationAdapter;
exports.shouldUseStochasticModeling = shouldUseStochasticModeling;
const wealthCalculations_1 = require("./wealthCalculations");
const AdvancedWealthCalculator_1 = require("../services/AdvancedWealthCalculator");
const wealthCalculationAdapter_1 = require("./wealthCalculationAdapter");
/**
 * Enhanced wealth calculator that can use either stochastic or legacy modeling
 */
class StochasticIntegrationAdapter {
    constructor(options = {}) {
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
    async calculateWealthExtinction(inputs) {
        console.log('Stochastic integration adapter: Starting calculation');
        try {
            if (this.options.enableStochasticModeling) {
                return await this.calculateWithStochasticModeling(inputs);
            }
            else {
                return await this.calculateWithLegacyModeling(inputs);
            }
        }
        catch (error) {
            console.error('Error in stochastic integration adapter:', error);
            if (this.options.fallbackToLegacy) {
                console.log('Falling back to legacy calculation method');
                return await this.calculateWithLegacyModeling(inputs);
            }
            else {
                throw error;
            }
        }
    }
    /**
     * Calculate using advanced stochastic modeling
     */
    async calculateWithStochasticModeling(inputs) {
        console.log('Using advanced stochastic modeling');
        // Convert legacy inputs to new format
        const advancedData = (0, wealthCalculationAdapter_1.adaptToAdvancedEngine)(inputs);
        // Use the static method from AdvancedWealthCalculator
        const results = await AdvancedWealthCalculator_1.AdvancedWealthCalculator.calculateWealthExtinction(advancedData);
        // Convert results back to legacy format if needed
        return this.adaptResultsForCompatibility(results, inputs);
    }
    /**
     * Calculate using legacy modeling
     */
    async calculateWithLegacyModeling(inputs) {
        console.log('Using legacy calculation method');
        return (0, wealthCalculations_1.calculateWealthExtinction)(inputs);
    }
    /**
     * Adapt results to ensure compatibility with existing application
     */
    adaptResultsForCompatibility(results, originalInputs) {
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
    calculateOverallConfidence(results) {
        if (!results.projections || results.projections.length === 0) {
            return 0.5; // Default confidence
        }
        // Calculate average confidence from projections
        const avgConfidence = results.projections.reduce((sum, proj) => {
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
    validateResultsCompatibility(results) {
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
    async compareResults(inputs) {
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
    identifyKeyDifferences(stochastic, legacy) {
        const differences = [];
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
    async getStochasticInsights(inputs) {
        console.log('Generating stochastic insights');
        // Use stochastic modeling to get detailed insights
        const advancedData = (0, wealthCalculationAdapter_1.adaptToAdvancedEngine)(inputs);
        // Use the static method from AdvancedWealthCalculator
        const results = await AdvancedWealthCalculator_1.AdvancedWealthCalculator.calculateWealthExtinction(advancedData);
        return {
            volatilityAnalysis: {
                wealthVolatility: this.calculateWealthVolatility(results),
                incomeVolatility: 0.15, // Based on typical income volatility
                expenseVolatility: 0.12 // Based on typical expense volatility
            },
            riskFactors: (results.complexityAnalysis?.riskFactors || []).map((risk) => ({
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
    calculateWealthVolatility(results) {
        if (!results.projections || results.projections.length < 2) {
            return 0.15; // Default volatility
        }
        const wealthValues = results.projections.map((proj) => proj.wealth);
        const mean = wealthValues.reduce((sum, val) => sum + val, 0) / wealthValues.length;
        const variance = wealthValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / wealthValues.length;
        return Math.sqrt(variance) / mean; // Coefficient of variation
    }
    /**
     * Generate optimization opportunities based on stochastic analysis
     */
    generateOptimizationOpportunities(results) {
        const opportunities = [];
        // Investment optimization
        if (results.topWealthDestroyers?.some((d) => d.factor.includes('Investment'))) {
            opportunities.push({
                opportunity: 'Implement systematic investment strategy',
                potentialBenefit: 200000,
                implementationCost: 50000,
                timeline: '6 months'
            });
        }
        // Healthcare cost management
        if (results.topWealthDestroyers?.some((d) => d.factor.includes('Healthcare'))) {
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
    updateOptions(newOptions) {
        this.options = { ...this.options, ...newOptions };
    }
    /**
     * Get current integration status
     */
    getStatus() {
        return {
            stochasticEnabled: this.options.enableStochasticModeling,
            fallbackEnabled: this.options.fallbackToLegacy,
            confidenceThreshold: this.options.confidenceThreshold
        };
    }
}
exports.StochasticIntegrationAdapter = StochasticIntegrationAdapter;
/**
 * Factory function to create integration adapter with sensible defaults
 */
function createStochasticIntegrationAdapter(options = {}) {
    return new StochasticIntegrationAdapter(options);
}
/**
 * Utility function to determine if stochastic modeling should be used
 */
function shouldUseStochasticModeling(inputs, options) {
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
        inputs.familyStructure.parents.some((p) => p.financialStatus !== 'independent')) {
        return true;
    }
    return false;
}
