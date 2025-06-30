// src/services/AdvancedWealthCalculatorScenarios.ts
// Implementation of scenario analysis for the advanced wealth calculation engine
/**
 * Advanced Wealth Calculator Scenarios Service
 * Implements sophisticated scenario analysis for wealth projections
 */
export class AdvancedWealthCalculatorScenarios {
    /**
     * Analyze scenarios from Monte Carlo simulations
     */
    static analyzeScenarios(scenarios, baselineExtinctionYear) {
        // Sort scenarios by extinction year
        const sortedScenarios = [...scenarios].sort((a, b) => a.extinctionYear - b.extinctionYear);
        // Calculate percentiles
        const totalScenarios = sortedScenarios.length;
        const p10Index = Math.floor(0.1 * totalScenarios);
        const p25Index = Math.floor(0.25 * totalScenarios);
        const p50Index = Math.floor(0.5 * totalScenarios);
        const p75Index = Math.floor(0.75 * totalScenarios);
        const p90Index = Math.floor(0.9 * totalScenarios);
        // Extract key scenarios
        const worstCase = sortedScenarios[p10Index];
        const lowerQuartile = sortedScenarios[p25Index];
        const median = sortedScenarios[p50Index];
        const upperQuartile = sortedScenarios[p75Index];
        const bestCase = sortedScenarios[p90Index];
        // Generate scenario analysis
        return {
            bestCase: {
                extinctionYear: bestCase.extinctionYear,
                probability: this.SCENARIO_PROBABILITIES.bestCase,
                conditions: [
                    'Optimal investment returns',
                    'Lower than expected inflation',
                    'Minimal unexpected expenses',
                    'Excellent family coordination'
                ]
            },
            mostLikely: {
                extinctionYear: median.extinctionYear,
                probability: this.SCENARIO_PROBABILITIES.mostLikely,
                conditions: [
                    'Average investment returns',
                    'Expected inflation rates',
                    'Typical life events and expenses',
                    'Good family coordination'
                ]
            },
            worstCase: {
                extinctionYear: worstCase.extinctionYear,
                probability: this.SCENARIO_PROBABILITIES.worstCase,
                conditions: [
                    'Below average investment returns',
                    'Higher than expected inflation',
                    'Multiple unexpected expenses',
                    'Poor family coordination'
                ]
            },
            stressTests: [
                {
                    scenario: 'Market Crash + Health Emergency',
                    extinctionYearImpact: -8,
                    wealthImpact: -3500000,
                    probability: 0.03,
                    description: 'Simultaneous 30% market decline and major health emergency'
                },
                {
                    scenario: 'Extended Bear Market',
                    extinctionYearImpact: -5,
                    wealthImpact: -2200000,
                    probability: 0.05,
                    description: '5-year period of negative real returns'
                },
                {
                    scenario: 'Family Coordination Failure',
                    extinctionYearImpact: -4,
                    wealthImpact: -1800000,
                    probability: 0.07,
                    description: 'Lack of coordination leading to inefficient resource allocation'
                }
            ],
            statistics: {
                median: median.extinctionYear,
                mean: this.calculateMean(scenarios.map(s => s.extinctionYear)),
                standardDeviation: this.calculateStandardDeviation(scenarios.map(s => s.extinctionYear)),
                confidenceInterval95: [lowerQuartile.extinctionYear, upperQuartile.extinctionYear]
            }
        };
    }
    /**
     * Generate alternative scenarios based on different assumptions
     */
    static generateAlternativeScenarios(inputs, baseProjections) {
        const scenarios = {};
        // Generate best case scenario
        scenarios.bestCase = this.generateScenario(inputs, baseProjections, 'bestCase');
        // Generate worst case scenario
        scenarios.worstCase = this.generateScenario(inputs, baseProjections, 'worstCase');
        // Generate stress test scenario
        scenarios.stressTest = this.generateScenario(inputs, baseProjections, 'stressTest');
        return scenarios;
    }
    /**
     * Generate a specific scenario
     */
    static generateScenario(inputs, baseProjections, scenarioType) {
        // Adjust inputs based on scenario type
        const adjustedInputs = this.adjustInputsForScenario(inputs, scenarioType);
        // For demonstration, we'll simulate the scenario by adjusting the base projections
        const adjustedProjections = this.adjustProjectionsForScenario(baseProjections, scenarioType);
        // Find extinction year in adjusted projections
        const extinctionYear = this.findExtinctionYear(adjustedProjections);
        return {
            type: scenarioType,
            extinctionYear,
            projections: adjustedProjections,
            probability: this.SCENARIO_PROBABILITIES[scenarioType],
            description: this.getScenarioDescription(scenarioType)
        };
    }
    /**
     * Adjust inputs for a specific scenario
     */
    static adjustInputsForScenario(inputs, scenarioType) {
        // Create a deep copy of inputs
        const adjustedInputs = JSON.parse(JSON.stringify(inputs));
        // Adjust investment allocation based on scenario
        if (scenarioType === 'bestCase') {
            // More aggressive allocation for best case
            adjustedInputs.financialFoundation.investmentAllocation.stocks += 0.1;
            adjustedInputs.financialFoundation.investmentAllocation.bonds -= 0.1;
        }
        else if (scenarioType === 'worstCase') {
            // More conservative allocation for worst case
            adjustedInputs.financialFoundation.investmentAllocation.stocks -= 0.1;
            adjustedInputs.financialFoundation.investmentAllocation.bonds += 0.1;
        }
        // Adjust behavioral profile based on scenario
        if (scenarioType === 'bestCase') {
            adjustedInputs.behavioralProfile.marketCrashResponse = 'buying_opportunity';
            adjustedInputs.behavioralProfile.planningApproach = 'detailed_research';
        }
        else if (scenarioType === 'worstCase') {
            adjustedInputs.behavioralProfile.marketCrashResponse = 'panic_sell';
            adjustedInputs.behavioralProfile.planningApproach = 'avoid_thinking';
        }
        return adjustedInputs;
    }
    /**
     * Adjust projections for a specific scenario
     */
    static adjustProjectionsForScenario(baseProjections, scenarioType) {
        // Create a deep copy of projections
        const adjustedProjections = JSON.parse(JSON.stringify(baseProjections));
        // Get adjustment factors
        const returnAdjustment = this.MARKET_RETURN_ADJUSTMENTS[scenarioType];
        const inflationAdjustment = this.INFLATION_ADJUSTMENTS[scenarioType];
        const eventAdjustment = this.LIFE_EVENT_ADJUSTMENTS[scenarioType];
        // Apply adjustments to each projection
        let currentWealth = adjustedProjections[0].wealth;
        for (let i = 1; i < adjustedProjections.length; i++) {
            const projection = adjustedProjections[i];
            // Adjust income for inflation
            projection.income *= (1 + inflationAdjustment);
            // Adjust expenses for inflation
            projection.expenses *= (1 + inflationAdjustment);
            // Adjust investment returns
            const baseReturn = (projection.wealth - currentWealth - projection.netCashFlow) / currentWealth;
            const adjustedReturn = baseReturn + returnAdjustment;
            const adjustedInvestmentReturn = currentWealth * adjustedReturn;
            // Recalculate net cash flow
            projection.netCashFlow = projection.income - projection.expenses + adjustedInvestmentReturn;
            // Recalculate wealth
            projection.wealth = Math.max(0, currentWealth + projection.netCashFlow);
            // Update current wealth for next iteration
            currentWealth = projection.wealth;
            // If wealth is zero, mark as extinction and break
            if (projection.wealth <= 0) {
                projection.wealth = 0;
                adjustedProjections.splice(i + 1); // Remove all future projections
                break;
            }
        }
        return adjustedProjections;
    }
    /**
     * Find extinction year in projections
     */
    static findExtinctionYear(projections) {
        for (const projection of projections) {
            if (projection.wealth <= 0) {
                return projection.year;
            }
        }
        // If no extinction found, return the last year + 10
        return projections[projections.length - 1].year + 10;
    }
    /**
     * Get scenario description
     */
    static getScenarioDescription(scenarioType) {
        switch (scenarioType) {
            case 'bestCase':
                return 'Optimistic scenario with above-average returns and minimal unexpected expenses';
            case 'mostLikely':
                return 'Most likely scenario based on average historical performance';
            case 'worstCase':
                return 'Pessimistic scenario with below-average returns and higher expenses';
            case 'stressTest':
                return 'Extreme scenario testing resilience against multiple simultaneous challenges';
            default:
                return 'Alternative scenario';
        }
    }
    /**
     * Calculate mean of an array of numbers
     */
    static calculateMean(values) {
        if (values.length === 0)
            return 0;
        return values.reduce((sum, val) => sum + val, 0) / values.length;
    }
    /**
     * Calculate standard deviation of an array of numbers
     */
    static calculateStandardDeviation(values) {
        if (values.length === 0)
            return 0;
        const mean = this.calculateMean(values);
        const squaredDifferences = values.map(val => Math.pow(val - mean, 2));
        const variance = this.calculateMean(squaredDifferences);
        return Math.sqrt(variance);
    }
    /**
     * Generate what-if scenarios based on user inputs
     */
    static generateWhatIfScenarios(inputs) {
        const scenarios = [];
        // What if investment allocation changes?
        scenarios.push({
            name: 'Aggressive Investment Strategy',
            description: 'Increase stock allocation by 20%, decrease bonds by 20%',
            extinctionYearImpact: 5,
            wealthImpact: 2500000
        });
        // What if retirement is delayed?
        scenarios.push({
            name: 'Delayed Retirement',
            description: 'Work 5 years longer than planned',
            extinctionYearImpact: 7,
            wealthImpact: 3500000
        });
        // What if children's education path changes?
        if (inputs.childrenContext.children.length > 0) {
            scenarios.push({
                name: 'Public University Education',
                description: 'Choose public universities instead of private/international',
                extinctionYearImpact: 3,
                wealthImpact: 1500000
            });
        }
        // What if parent care is coordinated with siblings?
        if (inputs.familyCareContext.parents.length > 0 && inputs.familyCareContext.siblings.length > 0) {
            scenarios.push({
                name: 'Coordinated Parent Care',
                description: 'Improve sibling coordination for parent care expenses',
                extinctionYearImpact: 2,
                wealthImpact: 1200000
            });
        }
        // What if expenses are reduced?
        scenarios.push({
            name: 'Expense Optimization',
            description: 'Reduce discretionary expenses by 15%',
            extinctionYearImpact: 4,
            wealthImpact: 2000000
        });
        return scenarios;
    }
}
// Scenario probability distributions
AdvancedWealthCalculatorScenarios.SCENARIO_PROBABILITIES = {
    'bestCase': 0.1, // 10% probability
    'mostLikely': 0.6, // 60% probability
    'worstCase': 0.1, // 10% probability
    'stressTest': 0.05 // 5% probability
};
// Market return adjustments for different scenarios
AdvancedWealthCalculatorScenarios.MARKET_RETURN_ADJUSTMENTS = {
    'bestCase': 0.02, // +2% annual returns
    'mostLikely': 0.0, // Baseline
    'worstCase': -0.02, // -2% annual returns
    'stressTest': -0.04 // -4% annual returns
};
// Inflation adjustments for different scenarios
AdvancedWealthCalculatorScenarios.INFLATION_ADJUSTMENTS = {
    'bestCase': -0.01, // -1% inflation
    'mostLikely': 0.0, // Baseline
    'worstCase': 0.01, // +1% inflation
    'stressTest': 0.02 // +2% inflation
};
// Life event probability adjustments
AdvancedWealthCalculatorScenarios.LIFE_EVENT_ADJUSTMENTS = {
    'bestCase': 0.5, // 50% of baseline probability
    'mostLikely': 1.0, // Baseline
    'worstCase': 1.5, // 150% of baseline probability
    'stressTest': 2.0 // 200% of baseline probability
};
