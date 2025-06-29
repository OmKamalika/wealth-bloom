// src/services/AdvancedWealthCalculatorRecommendations.ts
// Implementation of recommendations generation for the advanced wealth calculation engine

import { CalculatorData } from '../types/calculator';

/**
 * Advanced Wealth Calculator Recommendations Service
 * Implements sophisticated recommendation generation for Indian family financial planning
 */
export class AdvancedWealthCalculatorRecommendations {
  // Recommendation categories and their priorities
  private static readonly RECOMMENDATION_CATEGORIES = {
    'emergency_fund': { priority: 'critical', baseCost: 50000 },
    'insurance_coverage': { priority: 'critical', baseCost: 25000 },
    'debt_management': { priority: 'high', baseCost: 0 },
    'investment_optimization': { priority: 'high', baseCost: 100000 },
    'education_planning': { priority: 'high', baseCost: 200000 },
    'parent_care_planning': { priority: 'medium', baseCost: 50000 },
    'tax_optimization': { priority: 'medium', baseCost: 15000 },
    'estate_planning': { priority: 'medium', baseCost: 30000 },
    'retirement_planning': { priority: 'high', baseCost: 100000 },
    'family_coordination': { priority: 'medium', baseCost: 0 }
  };

  // Action templates for different recommendation types
  private static readonly ACTION_TEMPLATES = {
    'emergency_fund': {
      immediate: 'Build emergency fund of ₹{amount} within {timeline}',
      shortTerm: 'Increase emergency fund to 6 months of expenses',
      longTerm: 'Maintain emergency fund at 8-12 months of expenses'
    },
    'insurance_coverage': {
      immediate: 'Purchase {type} insurance with ₹{amount} coverage',
      shortTerm: 'Review and update insurance coverage annually',
      longTerm: 'Consider additional riders and coverage options'
    },
    'debt_management': {
      immediate: 'Prioritize high-interest debt repayment',
      shortTerm: 'Consolidate debts and negotiate better terms',
      longTerm: 'Maintain debt-to-income ratio below 40%'
    },
    'investment_optimization': {
      immediate: 'Rebalance portfolio to {allocation} allocation',
      shortTerm: 'Increase systematic investment plan (SIP)',
      longTerm: 'Diversify into international and alternative investments'
    },
    'education_planning': {
      immediate: 'Start education fund for {child} with ₹{amount}',
      shortTerm: 'Explore scholarship and financial aid options',
      longTerm: 'Consider education loans and repayment strategies'
    },
    'parent_care_planning': {
      immediate: 'Coordinate with siblings for parent care responsibilities',
      shortTerm: 'Research and budget for care facilities',
      longTerm: 'Plan for long-term care insurance'
    },
    'tax_optimization': {
      immediate: 'Maximize tax-saving investments under Section 80C',
      shortTerm: 'Optimize tax structure for business income',
      longTerm: 'Consider tax-efficient investment vehicles'
    },
    'estate_planning': {
      immediate: 'Create will and nominate beneficiaries',
      shortTerm: 'Set up family trust for asset protection',
      longTerm: 'Plan for smooth wealth transfer to next generation'
    },
    'retirement_planning': {
      immediate: 'Increase retirement corpus contribution by ₹{amount}',
      shortTerm: 'Diversify retirement investments',
      longTerm: 'Plan for post-retirement income sources'
    },
    'family_coordination': {
      immediate: 'Schedule monthly family financial meetings',
      shortTerm: 'Create shared family financial goals',
      longTerm: 'Establish family investment pool'
    }
  };

  /**
   * Generate comprehensive recommendations based on inputs and analysis
   */
  static generateRecommendations(inputs: CalculatorData, complexityAnalysis: any): any {
    const immediate = this.generateImmediateRecommendations(inputs, complexityAnalysis);
    const shortTerm = this.generateShortTermRecommendations(inputs, complexityAnalysis);
    const longTerm = this.generateLongTermRecommendations(inputs, complexityAnalysis);

    return {
      immediate,
      shortTerm,
      longTerm
    };
  }

  /**
   * Generate immediate (critical) recommendations
   */
  private static generateImmediateRecommendations(inputs: CalculatorData, complexityAnalysis: any): Array<{
    action: string;
    priority: 'critical' | 'high' | 'medium';
    timelineImpact: number;
    costToImplement: number;
    deadline: string;
  }> {
    const recommendations: Array<{
      action: string;
      priority: 'critical' | 'high' | 'medium';
      timelineImpact: number;
      costToImplement: number;
      deadline: string;
    }> = [];

    // Emergency fund recommendation
    const emergencyFundAmount = this.calculateEmergencyFundAmount(inputs);
    recommendations.push({
      action: this.ACTION_TEMPLATES.emergency_fund.immediate
        .replace('{amount}', (emergencyFundAmount / 100000).toFixed(1) + 'L')
        .replace('{timeline}', '3 months'),
      priority: 'critical',
      timelineImpact: 2, // 2 years extension
      costToImplement: emergencyFundAmount,
      deadline: this.getDeadline(30) // 30 days
    });

    // Insurance coverage recommendation
    const insuranceRecommendation = this.generateInsuranceRecommendation(inputs);
    if (insuranceRecommendation) {
      recommendations.push(insuranceRecommendation);
    }

    // Debt management recommendation
    const debtRecommendation = this.generateDebtRecommendation(inputs);
    if (debtRecommendation) {
      recommendations.push(debtRecommendation);
    }

    // Investment optimization recommendation
    const investmentRecommendation = this.generateInvestmentRecommendation(inputs);
    if (investmentRecommendation) {
      recommendations.push(investmentRecommendation);
    }

    // Education planning recommendation
    const educationRecommendation = this.generateEducationRecommendation(inputs);
    if (educationRecommendation) {
      recommendations.push(educationRecommendation);
    }

    return recommendations.sort((a, b) => {
      const priorityOrder = { 'critical': 3, 'high': 2, 'medium': 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  /**
   * Generate short-term recommendations
   */
  private static generateShortTermRecommendations(inputs: CalculatorData, complexityAnalysis: any): Array<{
    action: string;
    timeframe: string;
    expectedBenefit: string;
  }> {
    const recommendations: Array<{
      action: string;
      timeframe: string;
      expectedBenefit: string;
    }> = [];

    // Family coordination opportunities
    if (complexityAnalysis.coordinationOpportunities.length > 0) {
      complexityAnalysis.coordinationOpportunities.slice(0, 3).forEach((opp: any) => {
        recommendations.push({
          action: `Implement ${typeof opp === 'string' ? opp.toLowerCase() : opp.opportunity.toLowerCase()}`,
          timeframe: typeof opp === 'string' ? '6 months' : opp.timeToImplement,
          expectedBenefit: typeof opp === 'string' ? 'Reduce family financial stress and improve coordination' : `Save ${(opp.potentialSavings * 100).toFixed(1)}% of annual expenses`
        });
      });
    }

    // Tax optimization
    recommendations.push({
      action: this.ACTION_TEMPLATES.tax_optimization.shortTerm,
      timeframe: '6 months',
      expectedBenefit: 'Reduce tax liability by 15-20%'
    });

    // Investment optimization
    recommendations.push({
      action: this.ACTION_TEMPLATES.investment_optimization.shortTerm,
      timeframe: '12 months',
      expectedBenefit: 'Improve portfolio returns by 2-3% annually'
    });

    // Parent care planning
    if (inputs.familyCareContext.parents.length > 0) {
      recommendations.push({
        action: this.ACTION_TEMPLATES.parent_care_planning.shortTerm,
        timeframe: '8 months',
        expectedBenefit: 'Reduce care costs by 25-30% through coordination'
      });
    }

    return recommendations;
  }

  /**
   * Generate long-term recommendations
   */
  private static generateLongTermRecommendations(inputs: CalculatorData, complexityAnalysis: any): Array<{
    action: string;
    timeframe: string;
    expectedBenefit: string;
  }> {
    const recommendations: Array<{
      action: string;
      timeframe: string;
      expectedBenefit: string;
    }> = [];

    // Estate planning
    recommendations.push({
      action: this.ACTION_TEMPLATES.estate_planning.longTerm,
      timeframe: '2-3 years',
      expectedBenefit: 'Ensure smooth wealth transfer and minimize taxes'
    });

    // Retirement planning
    recommendations.push({
      action: this.ACTION_TEMPLATES.retirement_planning.longTerm,
      timeframe: '5-10 years',
      expectedBenefit: 'Achieve financial independence by age 60'
    });

    // Family coordination
    if (inputs.familyCareContext.siblings.length > 0) {
      recommendations.push({
        action: this.ACTION_TEMPLATES.family_coordination.longTerm,
        timeframe: '3-5 years',
        expectedBenefit: 'Create sustainable family wealth management system'
      });
    }

    // Investment diversification
    recommendations.push({
      action: this.ACTION_TEMPLATES.investment_optimization.longTerm,
      timeframe: '5-7 years',
      expectedBenefit: 'Build globally diversified portfolio for better risk-adjusted returns'
    });

    return recommendations;
  }

  /**
   * Calculate emergency fund amount
   */
  private static calculateEmergencyFundAmount(inputs: CalculatorData): number {
    const monthlyExpenses = inputs.financialFoundation.annualIncome * 0.6 / 12; // Assume 60% expense ratio
    const emergencyMonths = 6; // 6 months of expenses
    
    // Adjust based on complexity
    const complexityMultiplier = 1 + (inputs.complexityAnalysis.complexityScore / 10);
    
    return monthlyExpenses * emergencyMonths * complexityMultiplier;
  }

  /**
   * Generate insurance recommendation
   */
  private static generateInsuranceRecommendation(inputs: CalculatorData): any {
    const baseIncome = inputs.financialFoundation.annualIncome;
    const recommendedCoverage = baseIncome * 10; // 10x annual income
    
    return {
      action: this.ACTION_TEMPLATES.insurance_coverage.immediate
        .replace('{type}', 'term life')
        .replace('{amount}', (recommendedCoverage / 100000).toFixed(1) + 'L'),
      priority: 'critical' as const,
      timelineImpact: 3, // 3 years extension
      costToImplement: 25000, // Annual premium
      deadline: this.getDeadline(15) // 15 days
    };
  }

  /**
   * Generate debt management recommendation
   */
  private static generateDebtRecommendation(inputs: CalculatorData): any {
    // Simplified debt assessment
    const hasHighInterestDebt = Math.random() < 0.3; // 30% probability
    
    if (hasHighInterestDebt) {
      return {
        action: this.ACTION_TEMPLATES.debt_management.immediate,
        priority: 'high' as const,
        timelineImpact: 1, // 1 year extension
        costToImplement: 0,
        deadline: this.getDeadline(60) // 60 days
      };
    }
    
    return null;
  }

  /**
   * Generate investment recommendation
   */
  private static generateInvestmentRecommendation(inputs: CalculatorData): any {
    const currentAllocation = inputs.financialFoundation.investmentAllocation;
    const optimalAllocation = this.calculateOptimalAllocation(inputs);
    
    // Check if rebalancing is needed
    const allocationDrift = Math.abs(currentAllocation.stocks - optimalAllocation.stocks) +
                           Math.abs(currentAllocation.bonds - optimalAllocation.bonds);
    
    if (allocationDrift > 0.1) { // More than 10% drift
      return {
        action: this.ACTION_TEMPLATES.investment_optimization.immediate
          .replace('{allocation}', `${(optimalAllocation.stocks * 100).toFixed(0)}% equity, ${(optimalAllocation.bonds * 100).toFixed(0)}% debt`),
        priority: 'high' as const,
        timelineImpact: 1, // 1 year extension
        costToImplement: 100000,
        deadline: this.getDeadline(45) // 45 days
      };
    }
    
    return null;
  }

  /**
   * Generate education recommendation
   */
  private static generateEducationRecommendation(inputs: CalculatorData): any {
    if (inputs.childrenContext.children.length === 0) return null;
    
    const child = inputs.childrenContext.children[0]; // Focus on first child
    const educationCost = this.estimateEducationCost(child);
    
    return {
      action: this.ACTION_TEMPLATES.education_planning.immediate
        .replace('{child}', child.name)
        .replace('{amount}', (educationCost / 100000).toFixed(1) + 'L'),
      priority: 'high' as const,
      timelineImpact: 2, // 2 years extension
      costToImplement: educationCost * 0.1, // 10% initial investment
      deadline: this.getDeadline(90) // 90 days
    };
  }

  /**
   * Calculate optimal asset allocation
   */
  private static calculateOptimalAllocation(inputs: CalculatorData): any {
    const age = inputs.coreIdentity.age;
    const riskTolerance = inputs.behavioralProfile.riskTolerance;
    
    // Base allocation by age
    let equityAllocation = Math.max(0.2, 1 - (age - 25) / 40);
    let debtAllocation = Math.min(0.6, (age - 25) / 40);
    
    // Adjust for risk tolerance
    switch (riskTolerance) {
      case 'conservative':
        equityAllocation *= 0.7;
        debtAllocation *= 1.3;
        break;
      case 'aggressive':
        equityAllocation *= 1.3;
        debtAllocation *= 0.7;
        break;
    }
    
    // Normalize
    const total = equityAllocation + debtAllocation;
    equityAllocation /= total;
    debtAllocation /= total;
    
    return {
      stocks: equityAllocation * 0.8,
      bonds: debtAllocation,
      realEstate: equityAllocation * 0.15,
      alternatives: equityAllocation * 0.05
    };
  }

  /**
   * Estimate education cost for a child
   */
  private static estimateEducationCost(child: any): number {
    let baseCost = 2000000; // ₹20L base cost
    
    switch (child.educationAspirations) {
      case 'international':
        baseCost = 8000000; // ₹80L
        break;
      case 'private_premium':
        baseCost = 4000000; // ₹40L
        break;
      case 'private_state':
        baseCost = 2500000; // ₹25L
        break;
      case 'public_premium':
        baseCost = 1500000; // ₹15L
        break;
      case 'public_state':
        baseCost = 800000; // ₹8L
        break;
    }
    
    return baseCost;
  }

  /**
   * Get deadline date string
   */
  private static getDeadline(daysFromNow: number): string {
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + daysFromNow);
    return deadline.toLocaleDateString('en-IN');
  }

  /**
   * Calculate recommendation impact score
   */
  static calculateRecommendationImpact(recommendation: any, inputs: CalculatorData): number {
    let impact = 0;
    
    // Base impact from timeline extension
    impact += recommendation.timelineImpact * 10;
    
    // Cost efficiency (lower cost, higher impact)
    if (recommendation.costToImplement > 0) {
      impact += (recommendation.timelineImpact * 10) / (recommendation.costToImplement / 100000);
    }
    
    // Priority multiplier
    const priorityMultipliers: Record<string, number> = { 'critical': 3, 'high': 2, 'medium': 1 };
    impact *= priorityMultipliers[recommendation.priority] || 1;
    
    return Math.round(impact);
  }

  /**
   * Get personalized recommendation insights
   */
  static getPersonalizedInsights(inputs: CalculatorData, complexityAnalysis: any): string[] {
    const insights: string[] = [];
    
    // Complexity-based insights
    if (complexityAnalysis.score > 7) {
      insights.push('Your family situation is highly complex. Consider professional financial planning assistance.');
    }
    
    // Age-based insights
    if (inputs.coreIdentity.age > 50) {
      insights.push('Focus on wealth preservation and retirement planning as you approach retirement age.');
    }
    
    // Children-based insights
    if (inputs.childrenContext.children.length > 2) {
      insights.push('With multiple children, prioritize education planning and consider bulk purchase strategies.');
    }
    
    // Parent care insights
    if (inputs.familyCareContext.parents.length > 0) {
      insights.push('Coordinate with siblings for parent care to reduce costs and improve care quality.');
    }
    
    // Financial sophistication insights
    if (inputs.coreIdentity.financialSophistication === 'beginner') {
      insights.push('Consider working with a financial advisor to improve your investment knowledge and strategy.');
    }
    
    return insights;
  }
}