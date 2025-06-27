// src/services/AdvancedWealthCalculatorInvestments.ts
// Implementation of investment return calculations for the advanced wealth calculation engine

import { CalculatorData } from '../types/calculator';

/**
 * Advanced Wealth Calculator Investments Service
 * Implements sophisticated investment return modeling with Indian market context
 */
export class AdvancedWealthCalculatorInvestments {
  // Indian market return characteristics by asset class
  private static readonly ASSET_CLASS_RETURNS: Record<string, { 
    baseReturn: number; 
    volatility: number; 
    correlation: number;
  }> = {
    'stocks': { baseReturn: 0.12, volatility: 0.25, correlation: 1.0 },
    'bonds': { baseReturn: 0.07, volatility: 0.08, correlation: 0.3 },
    'realEstate': { baseReturn: 0.09, volatility: 0.15, correlation: 0.4 },
    'alternatives': { baseReturn: 0.11, volatility: 0.20, correlation: 0.6 },
    'gold': { baseReturn: 0.06, volatility: 0.18, correlation: 0.1 },
    'fixed_deposits': { baseReturn: 0.065, volatility: 0.02, correlation: 0.1 }
  };

  // Indian market cycle patterns (7-year cycles)
  private static readonly MARKET_CYCLES = {
    'equity': [0.18, 0.15, -0.08, 0.25, 0.10, -0.12, 0.20],
    'debt': [0.08, 0.06, 0.10, 0.05, 0.09, 0.11, 0.07],
    'real_estate': [0.12, 0.15, 0.05, 0.18, 0.08, -0.03, 0.13],
    'gold': [0.08, 0.15, -0.02, 0.10, 0.18, 0.06, -0.01]
  };

  // Expense ratios for different investment vehicles in India
  private static readonly EXPENSE_RATIOS: Record<string, number> = {
    'direct_stocks': 0.005, // 0.5% for direct stock investing
    'mutual_funds': 0.015, // 1.5% for mutual funds
    'etfs': 0.008, // 0.8% for ETFs
    'real_estate': 0.02, // 2% for real estate (maintenance, taxes)
    'gold_physical': 0.01, // 1% for physical gold (storage, making charges)
    'gold_etf': 0.005, // 0.5% for gold ETFs
    'fixed_deposits': 0.001, // 0.1% for FDs
    'bonds': 0.003 // 0.3% for bonds
  };

  // Tax rates for different investment types in India
  private static readonly TAX_RATES: Record<string, number> = {
    'equity_ltcg': 0.10, // 10% for equity LTCG
    'equity_stcg': 0.15, // 15% for equity STCG
    'debt_ltcg': 0.20, // 20% for debt LTCG
    'debt_stcg': 0.30, // 30% for debt STCG
    'real_estate': 0.20, // 20% for real estate gains
    'gold': 0.20, // 20% for gold gains
    'interest_income': 0.30 // 30% for interest income
  };

  /**
   * Calculate Indian investment returns with comprehensive modeling
   */
  static calculateIndianInvestmentReturns(
    wealth: number, 
    year: number, 
    inputs: CalculatorData
  ): number {
    // Get portfolio allocation
    const allocation = inputs.financialFoundation.investmentAllocation;
    
    // Calculate returns for each asset class
    const stockReturns = this.calculateStockReturns(wealth * allocation.stocks, year, inputs);
    const bondReturns = this.calculateBondReturns(wealth * allocation.bonds, year, inputs);
    const realEstateReturns = this.calculateRealEstateReturns(wealth * allocation.realEstate, year, inputs);
    const alternativeReturns = this.calculateAlternativeReturns(wealth * allocation.alternatives, year, inputs);
    
    // Calculate total portfolio return
    const totalReturn = stockReturns + bondReturns + realEstateReturns + alternativeReturns;
    
    // Apply behavioral finance adjustments
    const behaviorAdjustedReturn = this.applyBehavioralAdjustments(totalReturn, inputs);
    
    // Apply expense and tax drag
    const netReturn = this.applyExpenseAndTaxDrag(behaviorAdjustedReturn, allocation, inputs);
    
    return netReturn;
  }

  /**
   * Calculate stock market returns with Indian market characteristics
   */
  private static calculateStockReturns(allocatedWealth: number, year: number, inputs: CalculatorData): number {
    if (allocatedWealth <= 0) return 0;
    
    // Get base stock characteristics
    const stockCharacteristics = this.ASSET_CLASS_RETURNS.stocks;
    const baseReturn = stockCharacteristics.baseReturn;
    const volatility = stockCharacteristics.volatility;
    
    // Get market cycle position
    const cyclePosition = year % 7;
    const cycleReturn = this.MARKET_CYCLES.equity[cyclePosition];
    
    // Calculate expected return for this year
    let expectedReturn = baseReturn + (cycleReturn * 0.3); // 30% weight to cycle
    
    // Add random volatility
    const randomFactor = (Math.random() - 0.5) * volatility;
    expectedReturn += randomFactor;
    
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
  private static calculateBondReturns(allocatedWealth: number, year: number, inputs: CalculatorData): number {
    if (allocatedWealth <= 0) return 0;
    
    // Get base bond characteristics
    const bondCharacteristics = this.ASSET_CLASS_RETURNS.bonds;
    const baseReturn = bondCharacteristics.baseReturn;
    const volatility = bondCharacteristics.volatility;
    
    // Get market cycle position
    const cyclePosition = year % 7;
    const cycleReturn = this.MARKET_CYCLES.debt[cyclePosition];
    
    // Calculate expected return for this year
    let expectedReturn = baseReturn + (cycleReturn * 0.4); // 40% weight to cycle
    
    // Add small random volatility
    const randomFactor = (Math.random() - 0.5) * volatility;
    expectedReturn += randomFactor;
    
    // Adjust for interest rate environment (simplified)
    const interestRateAdjustment = this.getInterestRateAdjustment(year);
    expectedReturn *= interestRateAdjustment;
    
    return allocatedWealth * expectedReturn;
  }

  /**
   * Calculate real estate returns with Indian property market characteristics
   */
  private static calculateRealEstateReturns(allocatedWealth: number, year: number, inputs: CalculatorData): number {
    if (allocatedWealth <= 0) return 0;
    
    // Get base real estate characteristics
    const realEstateCharacteristics = this.ASSET_CLASS_RETURNS.realEstate;
    const baseReturn = realEstateCharacteristics.baseReturn;
    const volatility = realEstateCharacteristics.volatility;
    
    // Get market cycle position
    const cyclePosition = year % 7;
    const cycleReturn = this.MARKET_CYCLES.real_estate[cyclePosition];
    
    // Calculate expected return for this year
    let expectedReturn = baseReturn + (cycleReturn * 0.5); // 50% weight to cycle
    
    // Add random volatility
    const randomFactor = (Math.random() - 0.5) * volatility;
    expectedReturn += randomFactor;
    
    // Adjust for location (metro cities have higher returns)
    const locationMultiplier = this.getLocationMultiplier(inputs.coreIdentity.location.cityType);
    expectedReturn *= locationMultiplier;
    
    // Real estate has higher transaction costs and illiquidity
    const illiquidityDiscount = 0.02; // 2% discount for illiquidity
    expectedReturn -= illiquidityDiscount;
    
    return allocatedWealth * expectedReturn;
  }

  /**
   * Calculate alternative investment returns
   */
  private static calculateAlternativeReturns(allocatedWealth: number, year: number, inputs: CalculatorData): number {
    if (allocatedWealth <= 0) return 0;
    
    // Get base alternative characteristics
    const alternativeCharacteristics = this.ASSET_CLASS_RETURNS.alternatives;
    const baseReturn = alternativeCharacteristics.baseReturn;
    const volatility = alternativeCharacteristics.volatility;
    
    // Calculate expected return for this year
    let expectedReturn = baseReturn;
    
    // Add random volatility
    const randomFactor = (Math.random() - 0.5) * volatility;
    expectedReturn += randomFactor;
    
    // Alternatives have higher fees and complexity
    const complexityDiscount = 0.015; // 1.5% discount for complexity
    expectedReturn -= complexityDiscount;
    
    return allocatedWealth * expectedReturn;
  }

  /**
   * Apply behavioral finance adjustments based on user profile
   */
  private static applyBehavioralAdjustments(totalReturn: number, inputs: CalculatorData): number {
    let adjustedReturn = totalReturn;
    
    // Market crash response impact
    const behaviorGap = this.calculateBehaviorGap(inputs.behavioralProfile.marketCrashResponse);
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
  private static applyExpenseAndTaxDrag(
    totalReturn: number, 
    allocation: any, 
    inputs: CalculatorData
  ): number {
    let netReturn = totalReturn;
    
    // Calculate weighted average expense ratio
    const weightedExpenseRatio = (
      (allocation.stocks * this.EXPENSE_RATIOS.mutual_funds) +
      (allocation.bonds * this.EXPENSE_RATIOS.bonds) +
      (allocation.realEstate * this.EXPENSE_RATIOS.real_estate) +
      (allocation.alternatives * this.EXPENSE_RATIOS.mutual_funds)
    );
    
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
  private static calculateTaxDrag(totalReturn: number, allocation: any): number {
    // Simplified tax calculation
    const equityTaxRate = this.TAX_RATES.equity_ltcg;
    const debtTaxRate = this.TAX_RATES.debt_ltcg;
    
    const equityTax = (totalReturn * allocation.stocks * equityTaxRate * 0.3); // Assume 30% of returns are realized
    const debtTax = (totalReturn * allocation.bonds * debtTaxRate * 0.2); // Assume 20% of returns are realized
    
    return equityTax + debtTax;
  }

  /**
   * Calculate behavior gap based on market crash response
   */
  private static calculateBehaviorGap(crashResponse: string): number {
    const behaviorGaps: Record<string, number> = {
      'panic_sell': 0.035, // 3.5% annual drag from poor timing
      'worry_hold': 0.018, // 1.8% drag from suboptimal decisions
      'buying_opportunity': -0.005, // 0.5% benefit from good timing
      'ignore_it': 0.008 // 0.8% drag from neglect
    };
    
    return behaviorGaps[crashResponse] || 0.015;
  }

  /**
   * Get risk tolerance adjustment factor
   */
  private static getRiskToleranceAdjustment(riskTolerance: string): number {
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
  private static getFinancialSophisticationBonus(sophistication: string): number {
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
  private static getLocationMultiplier(cityType: string): number {
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
  private static getInterestRateAdjustment(year: number): number {
    // Simplified interest rate cycle
    const cyclePosition = year % 10;
    if (cyclePosition < 3) return 1.1; // Rising rates
    if (cyclePosition < 7) return 0.95; // High rates
    return 1.05; // Falling rates
  }

  /**
   * Get review frequency impact
   */
  private static getReviewFrequencyImpact(reviewFrequency: string): number {
    switch (reviewFrequency) {
      case 'daily': return 0.95; // 5% penalty for overtrading
      case 'weekly': return 0.98; // 2% penalty
      case 'monthly': return 1.0; // No impact
      case 'quarterly': return 1.01; // 1% benefit
      case 'rarely': return 0.97; // 3% penalty for neglect
      default: return 1.0;
    }
  }

  /**
   * Get planning approach impact
   */
  private static getPlanningApproachImpact(planningApproach: string): number {
    switch (planningApproach) {
      case 'detailed_research': return 1.02; // 2% benefit
      case 'important_overwhelming': return 0.98; // 2% penalty
      case 'delegate_experts': return 1.01; // 1% benefit
      case 'avoid_thinking': return 0.96; // 4% penalty
      default: return 1.0;
    }
  }

  /**
   * Calculate portfolio rebalancing impact
   */
  static calculateRebalancingImpact(
    currentAllocation: any, 
    targetAllocation: any, 
    wealth: number
  ): number {
    // Calculate rebalancing costs (simplified)
    const rebalancingCost = 0.005; // 0.5% cost for rebalancing
    const allocationDrift = Math.abs(currentAllocation.stocks - targetAllocation.stocks) +
                           Math.abs(currentAllocation.bonds - targetAllocation.bonds) +
                           Math.abs(currentAllocation.realEstate - targetAllocation.realEstate) +
                           Math.abs(currentAllocation.alternatives - targetAllocation.alternatives);
    
    return wealth * rebalancingCost * (allocationDrift / 2);
  }

  /**
   * Calculate optimal asset allocation based on age and risk tolerance
   */
  static calculateOptimalAllocation(age: number, riskTolerance: string): any {
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
}
