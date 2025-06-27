// src/services/AdvancedWealthCalculatorComplexity.ts
// Implementation of complexity analysis for the advanced wealth calculation engine

import { CalculatorData } from '../types/calculator';

/**
 * Advanced Wealth Calculator Complexity Analysis Service
 * Implements sophisticated complexity modeling for Indian family financial planning
 */
export class AdvancedWealthCalculatorComplexity {
  // Complexity factors and their weights
  private static readonly COMPLEXITY_FACTORS = {
    'children_count': { weight: 0.15, maxScore: 10 },
    'parent_care': { weight: 0.20, maxScore: 10 },
    'sibling_coordination': { weight: 0.12, maxScore: 10 },
    'geographic_dispersion': { weight: 0.10, maxScore: 10 },
    'health_issues': { weight: 0.18, maxScore: 10 },
    'education_aspirations': { weight: 0.12, maxScore: 10 },
    'financial_sophistication': { weight: 0.08, maxScore: 10 },
    'employment_complexity': { weight: 0.05, maxScore: 10 }
  };

  // Coordination opportunity multipliers
  private static readonly COORDINATION_OPPORTUNITIES = {
    'family_meetings': { potentialSavings: 0.05, difficulty: 'low', timeToImplement: '1 month' },
    'shared_resources': { potentialSavings: 0.08, difficulty: 'medium', timeToImplement: '3 months' },
    'bulk_purchases': { potentialSavings: 0.03, difficulty: 'low', timeToImplement: '2 weeks' },
    'care_coordination': { potentialSavings: 0.12, difficulty: 'high', timeToImplement: '6 months' },
    'education_planning': { potentialSavings: 0.06, difficulty: 'medium', timeToImplement: '4 months' },
    'investment_pooling': { potentialSavings: 0.10, difficulty: 'high', timeToImplement: '8 months' }
  };

  // Risk factors and their characteristics
  private static readonly RISK_FACTORS = {
    'health_emergency': { baseProbability: 0.08, impactMultiplier: 1.5 },
    'job_loss': { baseProbability: 0.03, impactMultiplier: 1.2 },
    'market_crash': { baseProbability: 0.15, impactMultiplier: 1.8 },
    'family_conflict': { baseProbability: 0.12, impactMultiplier: 1.3 },
    'education_cost_spike': { baseProbability: 0.06, impactMultiplier: 1.4 },
    'parent_care_crisis': { baseProbability: 0.05, impactMultiplier: 1.6 }
  };

  /**
   * Analyze complexity factors comprehensively
   */
  static analyzeComplexityFactors(inputs: CalculatorData): any {
    // Calculate individual complexity scores
    const childrenComplexity = this.calculateChildrenComplexity(inputs);
    const parentCareComplexity = this.calculateParentCareComplexity(inputs);
    const siblingComplexity = this.calculateSiblingComplexity(inputs);
    const geographicComplexity = this.calculateGeographicComplexity(inputs);
    const healthComplexity = this.calculateHealthComplexity(inputs);
    const educationComplexity = this.calculateEducationComplexity(inputs);
    const financialComplexity = this.calculateFinancialComplexity(inputs);
    const employmentComplexity = this.calculateEmploymentComplexity(inputs);

    // Calculate weighted complexity score
    const complexityScore = this.calculateWeightedComplexityScore({
      childrenComplexity,
      parentCareComplexity,
      siblingComplexity,
      geographicComplexity,
      healthComplexity,
      educationComplexity,
      financialComplexity,
      employmentComplexity
    });

    // Identify primary complexity drivers
    const primaryDrivers = this.identifyPrimaryComplexityDrivers({
      childrenComplexity,
      parentCareComplexity,
      siblingComplexity,
      geographicComplexity,
      healthComplexity,
      educationComplexity,
      financialComplexity,
      employmentComplexity
    });

    // Calculate coordination opportunities
    const coordinationOpportunities = this.calculateCoordinationOpportunities(inputs, complexityScore);

    // Calculate optimization potential
    const optimizationPotential = this.calculateOptimizationPotential(inputs, coordinationOpportunities);

    // Identify risk factors
    const riskFactors = this.identifyRiskFactors(inputs, complexityScore);

    return {
      score: complexityScore,
      primaryComplexityDrivers: primaryDrivers,
      coordinationOpportunities,
      optimizationPotential,
      riskFactors,
      detailedScores: {
        childrenComplexity,
        parentCareComplexity,
        siblingComplexity,
        geographicComplexity,
        healthComplexity,
        educationComplexity,
        financialComplexity,
        employmentComplexity
      }
    };
  }

  /**
   * Calculate children-related complexity
   */
  private static calculateChildrenComplexity(inputs: CalculatorData): number {
    const children = inputs.childrenContext.children;
    let complexity = 0;

    // Base complexity from number of children
    complexity += children.length * 2; // 2 points per child

    // Additional complexity from education aspirations
    children.forEach(child => {
      switch (child.educationAspirations) {
        case 'international':
          complexity += 3; // High complexity for international education
          break;
        case 'private_premium':
          complexity += 2; // Medium-high complexity
          break;
        case 'private_state':
          complexity += 1.5; // Medium complexity
          break;
        case 'public_premium':
          complexity += 1; // Low-medium complexity
          break;
        case 'public_state':
          complexity += 0.5; // Low complexity
          break;
      }

      // Additional complexity from academic performance
      if (child.academicPerformance === 'struggling') {
        complexity += 1.5; // Extra support needed
      } else if (child.academicPerformance === 'exceptional') {
        complexity += 0.5; // May need special programs
      }
    });

    return Math.min(10, complexity);
  }

  /**
   * Calculate parent care complexity
   */
  private static calculateParentCareComplexity(inputs: CalculatorData): number {
    const parents = inputs.familyCareContext.parents;
    let complexity = 0;

    parents.forEach(parent => {
      // Base complexity from health status
      switch (parent.healthStatus) {
        case 'poor':
          complexity += 4;
          break;
        case 'fair':
          complexity += 2.5;
          break;
        case 'good':
          complexity += 1.5;
          break;
        case 'excellent':
          complexity += 0.5;
          break;
      }

      // Additional complexity from dependency level
      switch (parent.financialIndependence) {
        case 'full_dependency':
          complexity += 3;
          break;
        case 'regular_support':
          complexity += 2;
          break;
        case 'occasional_support':
          complexity += 1;
          break;
        case 'independent':
          complexity += 0.2;
          break;
      }

      // Geographic complexity
      switch (parent.location) {
        case 'different_state':
          complexity += 2;
          break;
        case 'different_city':
          complexity += 1;
          break;
        case 'same_city':
          complexity += 0.2;
          break;
      }
    });

    return Math.min(10, complexity);
  }

  /**
   * Calculate sibling coordination complexity
   */
  private static calculateSiblingComplexity(inputs: CalculatorData): number {
    const siblings = inputs.familyCareContext.siblings;
    let complexity = 0;

    // Base complexity from number of siblings
    complexity += siblings.length * 1.5;

    // Additional complexity from relationship quality
    siblings.forEach(sibling => {
      switch (sibling.relationshipQuality) {
        case 'non_communicative':
          complexity += 3;
          break;
        case 'strained':
          complexity += 2;
          break;
        case 'good':
          complexity += 1;
          break;
        case 'close':
          complexity += 0.5;
          break;
      }

      // Financial capacity impact
      switch (sibling.financialCapacity) {
        case 'limited':
          complexity += 2; // May need more support
          break;
        case 'moderate':
          complexity += 1;
          break;
        case 'strong':
          complexity += 0.2;
          break;
      }
    });

    return Math.min(10, complexity);
  }

  /**
   * Calculate geographic dispersion complexity
   */
  private static calculateGeographicComplexity(inputs: CalculatorData): number {
    let complexity = 0;

    // Base complexity from city type
    switch (inputs.coreIdentity.location.cityType) {
      case 'metro':
        complexity += 2; // Higher costs and complexity in metros
        break;
      case 'tier2':
        complexity += 1;
        break;
      case 'tier3':
        complexity += 0.5;
        break;
      case 'rural':
        complexity += 0.2;
        break;
    }

    // Additional complexity from family dispersion
    const familyLocations = new Set();
    familyLocations.add(inputs.coreIdentity.location.cityType);

    inputs.familyCareContext.parents.forEach(parent => {
      if (parent.location === 'different_state') {
        familyLocations.add('different_state');
      } else if (parent.location === 'different_city') {
        familyLocations.add('different_city');
      }
    });

    complexity += familyLocations.size * 1.5;

    return Math.min(10, complexity);
  }

  /**
   * Calculate health-related complexity
   */
  private static calculateHealthComplexity(inputs: CalculatorData): number {
    let complexity = 0;

    // Health complexity from parents
    inputs.familyCareContext.parents.forEach(parent => {
      if (parent.healthStatus === 'poor') {
        complexity += 3;
      } else if (parent.healthStatus === 'fair') {
        complexity += 2;
      }
    });

    // Health complexity from age
    if (inputs.coreIdentity.age > 50) {
      complexity += 1;
    }
    if (inputs.coreIdentity.age > 60) {
      complexity += 1.5;
    }

    // Health complexity from marital status
    if (inputs.coreIdentity.maritalStatus === 'married') {
      complexity += 0.5; // Additional health considerations for spouse
    }

    return Math.min(10, complexity);
  }

  /**
   * Calculate education complexity
   */
  private static calculateEducationComplexity(inputs: CalculatorData): number {
    let complexity = 0;

    inputs.childrenContext.children.forEach(child => {
      // Complexity from current school type
      switch (child.currentSchoolType) {
        case 'international':
          complexity += 2;
          break;
        case 'private_english':
          complexity += 1.5;
          break;
        case 'private_vernacular':
          complexity += 1;
          break;
        case 'government':
          complexity += 0.5;
          break;
      }

      // Complexity from future aspirations
      switch (child.educationAspirations) {
        case 'international':
          complexity += 3;
          break;
        case 'private_premium':
          complexity += 2;
          break;
        case 'private_state':
          complexity += 1.5;
          break;
        case 'public_premium':
          complexity += 1;
          break;
        case 'public_state':
          complexity += 0.5;
          break;
      }
    });

    return Math.min(10, complexity);
  }

  /**
   * Calculate financial sophistication complexity
   */
  private static calculateFinancialComplexity(inputs: CalculatorData): number {
    let complexity = 0;

    // Lower sophistication means higher complexity
    switch (inputs.coreIdentity.financialSophistication) {
      case 'beginner':
        complexity += 4;
        break;
      case 'moderate':
        complexity += 2;
        break;
      case 'good':
        complexity += 1;
        break;
      case 'expert':
        complexity += 0.5;
        break;
    }

    // Employment complexity
    switch (inputs.coreIdentity.employment.status) {
      case 'business_owner':
        complexity += 2;
        break;
      case 'self_employed':
        complexity += 1.5;
        break;
      case 'corporate':
        complexity += 0.5;
        break;
    }

    return Math.min(10, complexity);
  }

  /**
   * Calculate employment complexity
   */
  private static calculateEmploymentComplexity(inputs: CalculatorData): number {
    let complexity = 0;

    // Employment status complexity
    switch (inputs.coreIdentity.employment.status) {
      case 'business_owner':
        complexity += 3;
        break;
      case 'self_employed':
        complexity += 2;
        break;
      case 'corporate':
        complexity += 0.5;
        break;
    }

    // Role level complexity
    switch (inputs.coreIdentity.employment.roleLevel) {
      case 'leadership':
        complexity += 1.5;
        break;
      case 'senior':
        complexity += 1;
        break;
      case 'mid':
        complexity += 0.5;
        break;
      case 'junior':
        complexity += 0.2;
        break;
    }

    return Math.min(10, complexity);
  }

  /**
   * Calculate weighted complexity score
   */
  private static calculateWeightedComplexityScore(scores: any): number {
    let weightedScore = 0;
    let totalWeight = 0;

    Object.entries(this.COMPLEXITY_FACTORS).forEach(([factor, config]) => {
      const score = scores[factor.replace('_', '') + 'Complexity'] || 0;
      weightedScore += score * config.weight;
      totalWeight += config.weight;
    });

    return totalWeight > 0 ? weightedScore / totalWeight : 0;
  }

  /**
   * Identify primary complexity drivers
   */
  private static identifyPrimaryComplexityDrivers(scores: any): string[] {
    const drivers = [];
    const threshold = 7; // High complexity threshold

    if (scores.childrenComplexity > threshold) {
      drivers.push('Multiple children with diverse education needs');
    }
    if (scores.parentCareComplexity > threshold) {
      drivers.push('Complex parent care requirements');
    }
    if (scores.siblingComplexity > threshold) {
      drivers.push('Challenging sibling coordination');
    }
    if (scores.geographicComplexity > threshold) {
      drivers.push('Geographic dispersion of family');
    }
    if (scores.healthComplexity > threshold) {
      drivers.push('Health-related financial risks');
    }
    if (scores.educationComplexity > threshold) {
      drivers.push('High-aspiration education planning');
    }
    if (scores.financialComplexity > threshold) {
      drivers.push('Limited financial sophistication');
    }
    if (scores.employmentComplexity > threshold) {
      drivers.push('Complex employment situation');
    }

    return drivers;
  }

  /**
   * Calculate coordination opportunities
   */
  private static calculateCoordinationOpportunities(inputs: CalculatorData, complexityScore: number): Array<{
    opportunity: string;
    potentialSavings: number;
    implementationDifficulty: 'low' | 'medium' | 'high';
    timeToImplement: string;
  }> {
    const opportunities: Array<{
      opportunity: string;
      potentialSavings: number;
      implementationDifficulty: 'low' | 'medium' | 'high';
      timeToImplement: string;
    }> = [];

    Object.entries(this.COORDINATION_OPPORTUNITIES).forEach(([opportunity, config]) => {
      // Determine if this opportunity is applicable
      let isApplicable = false;
      let potentialSavings = config.potentialSavings;

      switch (opportunity) {
        case 'family_meetings':
          isApplicable = inputs.familyCareContext.siblings.length > 0;
          break;
        case 'shared_resources':
          isApplicable = inputs.familyCareContext.siblings.length > 0;
          break;
        case 'bulk_purchases':
          isApplicable = inputs.childrenContext.children.length > 1;
          break;
        case 'care_coordination':
          isApplicable = inputs.familyCareContext.parents.length > 0;
          break;
        case 'education_planning':
          isApplicable = inputs.childrenContext.children.length > 0;
          break;
        case 'investment_pooling':
          isApplicable = inputs.familyCareContext.siblings.length > 0;
          break;
      }

      if (isApplicable) {
        // Adjust savings based on complexity score
        const adjustedSavings = potentialSavings * (1 + complexityScore * 0.1);
        
        opportunities.push({
          opportunity: this.formatOpportunityName(opportunity),
          potentialSavings: adjustedSavings,
          implementationDifficulty: config.difficulty as 'low' | 'medium' | 'high',
          timeToImplement: config.timeToImplement
        });
      }
    });

    return opportunities.sort((a, b) => b.potentialSavings - a.potentialSavings);
  }

  /**
   * Calculate optimization potential
   */
  private static calculateOptimizationPotential(
    inputs: CalculatorData, 
    coordinationOpportunities: Array<{
      opportunity: string;
      potentialSavings: number;
      implementationDifficulty: 'low' | 'medium' | 'high';
      timeToImplement: string;
    }>
  ): number {
    let potential = 0;

    // Base potential from coordination opportunities
    coordinationOpportunities.forEach(opp => {
      potential += opp.potentialSavings;
    });

    // Additional potential from financial sophistication
    switch (inputs.coreIdentity.financialSophistication) {
      case 'beginner':
        potential += 0.15; // 15% additional potential for improvement
        break;
      case 'moderate':
        potential += 0.10;
        break;
      case 'good':
        potential += 0.05;
        break;
      case 'expert':
        potential += 0.02;
        break;
    }

    return Math.min(0.5, potential); // Cap at 50%
  }

  /**
   * Identify risk factors
   */
  private static identifyRiskFactors(inputs: CalculatorData, complexityScore: number): Array<{
    risk: string;
    probability: number;
    impact: number;
    mitigation: string;
  }> {
    const riskFactors: Array<{
      risk: string;
      probability: number;
      impact: number;
      mitigation: string;
    }> = [];

    Object.entries(this.RISK_FACTORS).forEach(([risk, config]) => {
      // Calculate adjusted probability based on inputs
      let adjustedProbability = config.baseProbability;

      // Adjust based on complexity score
      adjustedProbability *= (1 + complexityScore * 0.1);

      // Specific adjustments based on risk type
      switch (risk) {
        case 'health_emergency':
          if (inputs.coreIdentity.age > 50) {
            adjustedProbability *= 1.5;
          }
          break;
        case 'job_loss':
          if (inputs.coreIdentity.employment.status === 'self_employed') {
            adjustedProbability *= 1.3;
          }
          break;
        case 'family_conflict':
          if (inputs.familyCareContext.siblings.length > 2) {
            adjustedProbability *= 1.2;
          }
          break;
      }

      riskFactors.push({
        risk: this.formatRiskName(risk),
        probability: Math.min(0.5, adjustedProbability),
        impact: config.impactMultiplier,
        mitigation: this.getRiskMitigation(risk)
      });
    });

    return riskFactors.sort((a, b) => (b.probability * b.impact) - (a.probability * a.impact));
  }

  /**
   * Format opportunity name for display
   */
  private static formatOpportunityName(opportunity: string): string {
    return opportunity.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }

  /**
   * Format risk name for display
   */
  private static formatRiskName(risk: string): string {
    return risk.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }

  /**
   * Get risk mitigation strategy
   */
  private static getRiskMitigation(risk: string): string {
    const mitigations: Record<string, string> = {
      'health_emergency': 'Build emergency fund, maintain health insurance, regular health checkups',
      'job_loss': 'Diversify income sources, maintain skill development, build emergency fund',
      'market_crash': 'Diversify investments, maintain long-term perspective, avoid panic selling',
      'family_conflict': 'Open communication, family meetings, professional mediation if needed',
      'education_cost_spike': 'Start education planning early, explore scholarship options, consider education loans',
      'parent_care_crisis': 'Plan for parent care early, coordinate with siblings, explore care options'
    };

    return mitigations[risk] || 'Monitor and plan for potential risks';
  }
} 