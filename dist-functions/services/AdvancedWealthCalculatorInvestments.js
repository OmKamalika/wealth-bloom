"use strict";
// src/services/AdvancedWealthCalculatorInvestments.ts
// Implementation of investment return calculations for the advanced wealth calculation engine
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdvancedWealthCalculatorInvestments = void 0;
/**
 * Advanced Wealth Calculator Investments Service
 * Implements sophisticated investment return modeling with Indian market context
 */
class AdvancedWealthCalculatorInvestments {
    /**
     * Calculate Indian investment returns with comprehensive modeling
     */
    static calculateIndianInvestmentReturns(wealth, year, inputs) {
        // Get portfolio allocation
        const allocation = inputs.financialFoundation.investmentAllocation;
        // Check for market crash this year
        const isMarketCrash = Math.random() < this.MARKET_CRASH_PROBABILITY;
        // Calculate returns for each asset class
        const stockReturns = this.calculateStockReturns(wealth * allocation.stocks, year, inputs, isMarketCrash);
        const bondReturns = this.calculateBondReturns(wealth * allocation.bonds, year, inputs, isMarketCrash);
        const realEstateReturns = this.calculateRealEstateReturns(wealth * allocation.realEstate, year, inputs, isMarketCrash);
        const alternativeReturns = this.calculateAlternativeReturns(wealth * allocation.alternatives, year, inputs, isMarketCrash);
        // Calculate total portfolio return
        const totalReturn = stockReturns + bondReturns + realEstateReturns + alternativeReturns;
        // Apply behavioral finance adjustments
        const behaviorAdjustedReturn = this.applyBehavioralAdjustments(totalReturn, inputs, isMarketCrash);
        // Apply expense and tax drag
        const netReturn = this.applyExpenseAndTaxDrag(behaviorAdjustedReturn, allocation, inputs);
        return netReturn;
    }
    /**
     * Calculate stock market returns with Indian market characteristics
     */
    static calculateStockReturns(allocatedWealth, year, inputs, isMarketCrash) {
        if (allocatedWealth <= 0)
            return 0;
        // Get base stock characteristics
        const stockCharacteristics = this.ASSET_CLASS_RETURNS.stocks;
        const baseReturn = stockCharacteristics.baseReturn;
        const volatility = stockCharacteristics.volatility;
        // Get market cycle position
        const cyclePosition = year % 7;
        const cycleReturn = this.MARKET_CYCLES.equity[cyclePosition];
        // Calculate expected return for this year
        let expectedReturn = baseReturn + (cycleReturn * 0.5); // 50% weight to cycle (increased from 30%)
        // Add random volatility
        const randomFactor = (Math.random() - 0.5) * volatility;
        expectedReturn += randomFactor;
        // Apply market crash if applicable
        if (isMarketCrash) {
            expectedReturn = this.MARKET_CRASH_IMPACT.stocks;
        }
        // Adjust for risk tolerance
        const riskAdjustment = this.getRiskToleranceAdjustment(inputs.behavioralProfile.riskTolerance);
        expectedReturn *= riskAdjustment;
        // Apply financial sophistication bonus
        const sophisticationBonus = this.getFinancialSophisticationBonus(inputs.coreIdentity.financialSophistication);
        expectedReturn *= (1 + sophisticationBonus);
        return allocatedWealth * expectedReturn;
    }
    /**
     * Calculate bond returns with Indian debt market characteristics
     */
    static calculateBondReturns(allocatedWealth, year, inputs, isMarketCrash) {
        if (allocatedWealth <= 0)
            return 0;
        // Get base bond characteristics
        const bondCharacteristics = this.ASSET_CLASS_RETURNS.bonds;
        const baseReturn = bondCharacteristics.baseReturn;
        const volatility = bondCharacteristics.volatility;
        // Get market cycle position
        const cyclePosition = year % 7;
        const cycleReturn = this.MARKET_CYCLES.debt[cyclePosition];
        // Calculate expected return for this year
        let expectedReturn = baseReturn + (cycleReturn * 0.5); // 50% weight to cycle (increased from 40%)
        // Add small random volatility
        const randomFactor = (Math.random() - 0.5) * volatility;
        expectedReturn += randomFactor;
        // Apply market crash if applicable
        if (isMarketCrash) {
            expectedReturn = this.MARKET_CRASH_IMPACT.bonds;
        }
        // Adjust for interest rate environment (simplified)
        const interestRateAdjustment = this.getInterestRateAdjustment(year);
        expectedReturn *= interestRateAdjustment;
        return allocatedWealth * expectedReturn;
    }
    /**
     * Calculate real estate returns with Indian property market characteristics
     */
    static calculateRealEstateReturns(allocatedWealth, year, inputs, isMarketCrash) {
        if (allocatedWealth <= 0)
            return 0;
        // Get base real estate characteristics
        const realEstateCharacteristics = this.ASSET_CLASS_RETURNS.realEstate;
        const baseReturn = realEstateCharacteristics.baseReturn;
        const volatility = realEstateCharacteristics.volatility;
        // Get market cycle position
        const cyclePosition = year % 7;
        const cycleReturn = this.MARKET_CYCLES.real_estate[cyclePosition];
        // Calculate expected return for this year
        let expectedReturn = baseReturn + (cycleReturn * 0.6); // 60% weight to cycle (increased from 50%)
        // Add random volatility
        const randomFactor = (Math.random() - 0.5) * volatility;
        expectedReturn += randomFactor;
        // Apply market crash if applicable
        if (isMarketCrash) {
            expectedReturn = this.MARKET_CRASH_IMPACT.realEstate;
        }
        // Adjust for location (metro cities have higher returns)
        const locationMultiplier = this.getLocationMultiplier(inputs.coreIdentity.location.cityType);
        expectedReturn *= locationMultiplier;
        // Real estate has higher transaction costs and illiquidity
        const illiquidityDiscount = 0.03; // 3% discount for illiquidity (increased from 2%)
        expectedReturn -= illiquidityDiscount;
        return allocatedWealth * expectedReturn;
    }
    /**
     * Calculate alternative investment returns
     */
    static calculateAlternativeReturns(allocatedWealth, year, inputs, isMarketCrash) {
        if (allocatedWealth <= 0)
            return 0;
        // Get base alternative characteristics
        const alternativeCharacteristics = this.ASSET_CLASS_RETURNS.alternatives;
        const baseReturn = alternativeCharacteristics.baseReturn;
        const volatility = alternativeCharacteristics.volatility;
        // Calculate expected return for this year
        let expectedReturn = baseReturn;
        // Add random volatility
        const randomFactor = (Math.random() - 0.5) * volatility;
        expectedReturn += randomFactor;
        // Apply market crash if applicable
        if (isMarketCrash) {
            expectedReturn = this.MARKET_CRASH_IMPACT.alternatives;
        }
        // Alternatives have higher fees and complexity
        const complexityDiscount = 0.02; // 2% discount for complexity (increased from 1.5%)
        expectedReturn -= complexityDiscount;
        return allocatedWealth * expectedReturn;
    }
    /**
     * Apply behavioral finance adjustments based on user profile
     */
    static applyBehavioralAdjustments(totalReturn, inputs, isMarketCrash) {
        let adjustedReturn = totalReturn;
        // Market crash response impact (much higher during crashes)
        const behaviorGap = this.calculateBehaviorGap(inputs.behavioralProfile.marketCrashResponse, isMarketCrash);
        adjustedReturn -= (totalReturn * behaviorGap);
        // Review frequency impact (more frequent review can lead to overtrading)
        const reviewImpact = this.getReviewFrequencyImpact(inputs.behavioralProfile.reviewFrequency);
        adjustedReturn *= reviewImpact;
        // Planning approach impact
        const planningImpact = this.getPlanningApproachImpact(inputs.behavioralProfile.planningApproach);
        adjustedReturn *= planningImpact;
        return adjustedReturn;
    }
    /**
     * Apply expense and tax drag to returns
     */
    static applyExpenseAndTaxDrag(totalReturn, allocation, inputs) {
        let netReturn = totalReturn;
        // Calculate weighted average expense ratio
        const weightedExpenseRatio = ((allocation.stocks * this.EXPENSE_RATIOS.mutual_funds) +
            (allocation.bonds * this.EXPENSE_RATIOS.bonds) +
            (allocation.realEstate * this.EXPENSE_RATIOS.real_estate) +
            (allocation.alternatives * this.EXPENSE_RATIOS.mutual_funds));
        // Apply expense drag
        netReturn -= (totalReturn * weightedExpenseRatio);
        // Calculate tax drag (simplified)
        const taxDrag = this.calculateTaxDrag(totalReturn, allocation);
        netReturn -= taxDrag;
        return netReturn;
    }
    /**
     * Calculate tax drag on investment returns
     */
    static calculateTaxDrag(totalReturn, allocation) {
        // Simplified tax calculation
        const equityTaxRate = this.TAX_RATES.equity_ltcg;
        const debtTaxRate = this.TAX_RATES.debt_ltcg;
        const equityTax = (totalReturn * allocation.stocks * equityTaxRate * 0.4); // Assume 40% of returns are realized (increased from 30%)
        const debtTax = (totalReturn * allocation.bonds * debtTaxRate * 0.3); // Assume 30% of returns are realized (increased from 20%)
        return equityTax + debtTax;
    }
    /**
     * Calculate behavior gap based on market crash response
     */
    static calculateBehaviorGap(crashResponse, isMarketCrash) {
        const baseBehaviorGaps = {
            'panic_sell': 0.035, // 3.5% annual drag from poor timing
            'worry_hold': 0.018, // 1.8% drag from suboptimal decisions
            'buying_opportunity': -0.005, // 0.5% benefit from good timing
            'ignore_it': 0.008 // 0.8% drag from neglect
        };
        // During market crashes, behavior gap is amplified
        const crashMultiplier = isMarketCrash ? 5.0 : 1.0;
        return (baseBehaviorGaps[crashResponse] || 0.015) * crashMultiplier;
    }
    /**
     * Get risk tolerance adjustment factor
     */
    static getRiskToleranceAdjustment(riskTolerance) {
        switch (riskTolerance) {
            case 'conservative': return 0.75;
            case 'moderate': return 1.0;
            case 'aggressive': return 1.25;
            default: return 1.0;
        }
    }
    /**
     * Get financial sophistication bonus
     */
    static getFinancialSophisticationBonus(sophistication) {
        switch (sophistication) {
            case 'expert': return 0.03; // 3% bonus
            case 'good': return 0.015; // 1.5% bonus
            case 'moderate': return 0.005; // 0.5% bonus
            case 'beginner': return -0.01; // 1% penalty
            default: return 0.0;
        }
    }
    /**
     * Get location multiplier for real estate returns
     */
    static getLocationMultiplier(cityType) {
        switch (cityType) {
            case 'metro': return 1.3; // 30% higher returns in metros
            case 'tier2': return 1.1; // 10% higher in tier 2
            case 'tier3': return 0.9; // 10% lower in tier 3
            case 'rural': return 0.7; // 30% lower in rural
            default: return 1.0;
        }
    }
    /**
     * Get interest rate adjustment for bonds
     */
    static getInterestRateAdjustment(year) {
        // Simplified interest rate cycle
        const cyclePosition = year % 10;
        if (cyclePosition < 3)
            return 1.1; // Rising rates
        if (cyclePosition < 7)
            return 0.95; // High rates
        return 1.05; // Falling rates
    }
    /**
     * Get review frequency impact
     */
    static getReviewFrequencyImpact(reviewFrequency) {
        switch (reviewFrequency) {
            case 'daily': return 0.93; // 7% penalty for overtrading (increased from 5%)
            case 'weekly': return 0.96; // 4% penalty (increased from 2%)
            case 'monthly': return 1.0; // No impact
            case 'quarterly': return 1.01; // 1% benefit
            case 'rarely': return 0.95; // 5% penalty for neglect (increased from 3%)
            default: return 1.0;
        }
    }
    /**
     * Get planning approach impact
     */
    static getPlanningApproachImpact(planningApproach) {
        switch (planningApproach) {
            case 'detailed_research': return 1.02; // 2% benefit
            case 'important_overwhelming': return 0.97; // 3% penalty (increased from 2%)
            case 'delegate_experts': return 1.01; // 1% benefit
            case 'avoid_thinking': return 0.94; // 6% penalty (increased from 4%)
            default: return 1.0;
        }
    }
    /**
     * Calculate portfolio rebalancing impact
     */
    static calculateRebalancingImpact(currentAllocation, targetAllocation, wealth) {
        // Calculate rebalancing costs (simplified)
        const rebalancingCost = 0.006; // 0.6% cost for rebalancing (increased from 0.5%)
        const allocationDrift = Math.abs(currentAllocation.stocks - targetAllocation.stocks) +
            Math.abs(currentAllocation.bonds - targetAllocation.bonds) +
            Math.abs(currentAllocation.realEstate - targetAllocation.realEstate) +
            Math.abs(currentAllocation.alternatives - targetAllocation.alternatives);
        return wealth * rebalancingCost * (allocationDrift / 2);
    }
    /**
     * Calculate optimal asset allocation based on age and risk tolerance
     */
    static calculateOptimalAllocation(age, riskTolerance) {
        // Base allocation by age
        let baseStockAllocation = Math.max(0.2, 1 - (age - 25) / 40); // Decrease stocks with age
        let baseBondAllocation = Math.min(0.6, (age - 25) / 40); // Increase bonds with age
        // Adjust for risk tolerance
        switch (riskTolerance) {
            case 'conservative':
                baseStockAllocation *= 0.7;
                baseBondAllocation *= 1.3;
                break;
            case 'aggressive':
                baseStockAllocation *= 1.3;
                baseBondAllocation *= 0.7;
                break;
        }
        // Ensure allocations sum to 1
        const total = baseStockAllocation + baseBondAllocation;
        baseStockAllocation /= total;
        baseBondAllocation /= total;
        return {
            stocks: baseStockAllocation * 0.8, // 80% of equity allocation
            bonds: baseBondAllocation,
            realEstate: baseStockAllocation * 0.15, // 15% of equity allocation
            alternatives: baseStockAllocation * 0.05 // 5% of equity allocation
        };
    }
    /**
     * Generate correlated random returns for Monte Carlo simulation
     */
    static generateCorrelatedReturns(numYears, numSimulations) {
        const assetClasses = ['stocks', 'bonds', 'realEstate', 'alternatives', 'gold'];
        const returns = {};
        // Initialize returns object
        assetClasses.forEach(asset => {
            returns[asset] = Array(numSimulations).fill(0).map(() => Array(numYears).fill(0));
        });
        // Generate correlated returns for each simulation
        for (let sim = 0; sim < numSimulations; sim++) {
            for (let year = 0; year < numYears; year++) {
                // Generate uncorrelated random numbers
                const uncorrelatedRandoms = {};
                assetClasses.forEach(asset => {
                    uncorrelatedRandoms[asset] = this.generateNormalRandom();
                });
                // Apply correlations
                assetClasses.forEach(asset => {
                    const assetChar = this.ASSET_CLASS_RETURNS[asset];
                    let correlatedRandom = uncorrelatedRandoms[asset];
                    // Apply correlation with other asset classes
                    assetClasses.forEach(otherAsset => {
                        if (asset !== otherAsset) {
                            const correlation = this.CORRELATION_MATRIX[asset][otherAsset] || 0;
                            correlatedRandom += correlation * uncorrelatedRandoms[otherAsset];
                        }
                    });
                    // Normalize and apply to return distribution
                    const normalizedRandom = correlatedRandom / Math.sqrt(assetClasses.length);
                    const assetReturn = assetChar.baseReturn + (normalizedRandom * assetChar.volatility);
                    returns[asset][sim][year] = assetReturn;
                });
            }
        }
        return returns;
    }
    /**
     * Generate a random number from a normal distribution
     */
    static generateNormalRandom() {
        // Box-Muller transform
        let u = 0, v = 0;
        while (u === 0)
            u = Math.random();
        while (v === 0)
            v = Math.random();
        return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    }
    /**
     * Calculate the Sharpe ratio for a portfolio
     */
    static calculateSharpeRatio(returns, riskFreeRate = 0.05) {
        if (returns.length === 0)
            return 0;
        // Calculate average return
        const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
        // Calculate standard deviation (volatility)
        const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length;
        const stdDev = Math.sqrt(variance);
        // Calculate Sharpe ratio
        return (avgReturn - riskFreeRate) / stdDev;
    }
    /**
     * Calculate the maximum drawdown for a wealth trajectory
     */
    static calculateMaxDrawdown(wealthTrajectory) {
        if (wealthTrajectory.length <= 1)
            return 0;
        let maxDrawdown = 0;
        let peak = wealthTrajectory[0];
        for (let i = 1; i < wealthTrajectory.length; i++) {
            const currentValue = wealthTrajectory[i];
            // Update peak if current value is higher
            if (currentValue > peak) {
                peak = currentValue;
            }
            else {
                // Calculate drawdown
                const drawdown = (peak - currentValue) / peak;
                maxDrawdown = Math.max(maxDrawdown, drawdown);
            }
        }
        return maxDrawdown;
    }
}
exports.AdvancedWealthCalculatorInvestments = AdvancedWealthCalculatorInvestments;
// Indian market return characteristics by asset class
AdvancedWealthCalculatorInvestments.ASSET_CLASS_RETURNS = {
    'stocks': { baseReturn: 0.10, volatility: 0.28, correlation: 1.0 }, // Reduced return, increased volatility
    'bonds': { baseReturn: 0.06, volatility: 0.10, correlation: 0.3 }, // Reduced return, increased volatility
    'realEstate': { baseReturn: 0.08, volatility: 0.18, correlation: 0.4 }, // Reduced return, increased volatility
    'alternatives': { baseReturn: 0.09, volatility: 0.25, correlation: 0.6 }, // Reduced return, increased volatility
    'gold': { baseReturn: 0.05, volatility: 0.20, correlation: 0.1 }, // Reduced return, increased volatility
    'fixed_deposits': { baseReturn: 0.06, volatility: 0.03, correlation: 0.1 } // Increased volatility
};
// Indian market cycle patterns (7-year cycles)
AdvancedWealthCalculatorInvestments.MARKET_CYCLES = {
    'equity': [0.15, 0.12, -0.12, 0.20, 0.08, -0.18, 0.16], // More extreme cycles
    'debt': [0.07, 0.05, 0.09, 0.04, 0.08, 0.10, 0.06],
    'real_estate': [0.10, 0.12, 0.03, 0.15, 0.06, -0.08, 0.11], // More extreme cycles
    'gold': [0.07, 0.13, -0.04, 0.08, 0.15, 0.05, -0.03] // More extreme cycles
};
// Expense ratios for different investment vehicles in India
AdvancedWealthCalculatorInvestments.EXPENSE_RATIOS = {
    'direct_stocks': 0.008, // Increased from 0.005
    'mutual_funds': 0.018, // Increased from 0.015
    'etfs': 0.010, // Increased from 0.008
    'real_estate': 0.025, // Increased from 0.02
    'gold_physical': 0.015, // Increased from 0.01
    'gold_etf': 0.008, // Increased from 0.005
    'fixed_deposits': 0.002, // Increased from 0.001
    'bonds': 0.005 // Increased from 0.003
};
// Tax rates for different investment types in India
AdvancedWealthCalculatorInvestments.TAX_RATES = {
    'equity_ltcg': 0.10, // 10% for equity LTCG
    'equity_stcg': 0.15, // 15% for equity STCG
    'debt_ltcg': 0.20, // 20% for debt LTCG
    'debt_stcg': 0.30, // 30% for debt STCG
    'real_estate': 0.20, // 20% for real estate gains
    'gold': 0.20, // 20% for gold gains
    'interest_income': 0.30 // 30% for interest income
};
// Correlation matrix for asset classes
AdvancedWealthCalculatorInvestments.CORRELATION_MATRIX = {
    'stocks': {
        'stocks': 1.0,
        'bonds': -0.3,
        'realEstate': 0.4,
        'alternatives': 0.6,
        'gold': -0.2
    },
    'bonds': {
        'stocks': -0.3,
        'bonds': 1.0,
        'realEstate': 0.1,
        'alternatives': 0.2,
        'gold': 0.3
    },
    'realEstate': {
        'stocks': 0.4,
        'bonds': 0.1,
        'realEstate': 1.0,
        'alternatives': 0.3,
        'gold': 0.1
    },
    'alternatives': {
        'stocks': 0.6,
        'bonds': 0.2,
        'realEstate': 0.3,
        'alternatives': 1.0,
        'gold': 0.0
    },
    'gold': {
        'stocks': -0.2,
        'bonds': 0.3,
        'realEstate': 0.1,
        'alternatives': 0.0,
        'gold': 1.0
    }
};
// Market crash probabilities
AdvancedWealthCalculatorInvestments.MARKET_CRASH_PROBABILITY = 0.08; // 8% chance of crash in any given year
AdvancedWealthCalculatorInvestments.MARKET_CRASH_IMPACT = {
    'stocks': -0.35, // 35% drop
    'bonds': -0.10, // 10% drop
    'realEstate': -0.25, // 25% drop
    'alternatives': -0.30, // 30% drop
    'gold': 0.15 // 15% gain (safe haven)
};
