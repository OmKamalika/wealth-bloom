// src/types/calculator.ts
// Type definitions for the advanced wealth calculation engine

import { EVTResults } from './evt';

export interface CoreIdentityMatrix {
  age: number;
  gender: 'male' | 'female' | 'prefer_not_to_say';
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed';
  location: {
    state: string;
    city: string;
    zipCode: string;
    cityType: 'metro' | 'tier2' | 'tier3' | 'rural';
  };
  education: {
    level: 'high_school' | 'bachelors' | 'masters' | 'professional' | 'phd';
    institution: 'tier1' | 'tier2' | 'tier3';
  };
  employment: {
    status: 'corporate' | 'business_owner' | 'self_employed';
    industry: string;
    roleLevel: 'junior' | 'mid' | 'senior' | 'leadership';
  };
  financialSophistication: 'expert' | 'good' | 'moderate' | 'beginner';
}

export interface FinancialFoundation {
  currentNetWorth: number;
  annualIncome: number;
  primaryIncomeSource: 'salary' | 'business' | 'mixed';
  investmentAllocation: {
    stocks: number;
    bonds: number;
    realEstate: number;
    alternatives: number;
  };
}

export interface ChildrenEducationContext {
  children: Array<{
    name: string;
    age: number;
    academicPerformance: 'struggling' | 'average' | 'above_average' | 'exceptional';
    interests?: string[];
    educationAspirations: 'public_state' | 'public_premium' | 'private_state' | 'private_premium' | 'international';
    currentSchoolType: 'government' | 'private_vernacular' | 'private_english' | 'international';
    gender?: 'male' | 'female' | 'other';
  }>;
}

export interface FamilyCareContext {
  parents: Array<{
    name: string;
    age: number;
    healthStatus: 'excellent' | 'good' | 'fair' | 'poor';
    financialIndependence: 'independent' | 'occasional_support' | 'regular_support' | 'full_dependency';
    currentMonthlyCost: number;
    livingArrangement: 'independent' | 'assisted' | 'with_family';
    location: 'same_city' | 'different_city' | 'different_state';
  }>;
  spouseParents: Array<{
    name: string;
    age: number;
    supportNeeded: boolean;
    location: string;
  }>;
  siblings: Array<{
    relationshipQuality: 'close' | 'good' | 'strained' | 'non_communicative';
    financialCapacity: 'strong' | 'moderate' | 'limited';
    careInvolvement: 'high' | 'moderate' | 'low';
  }>;
  familyCoordination: 'excellent' | 'good' | 'chaotic' | 'poor';
}

export interface BehavioralFinanceProfile {
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  marketCrashResponse: 'panic_sell' | 'worry_hold' | 'buying_opportunity' | 'ignore_it';
  biggestFear: 'retirement_insufficient' | 'burden_children' | 'wrong_decisions' | 'parent_care_costs';
  planningApproach: 'detailed_research' | 'important_overwhelming' | 'delegate_experts' | 'avoid_thinking';
  reviewFrequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'rarely';
}

export interface ComplexityRevealation {
  complexityScore: number;
  majorDecisions: Array<{
    year: number;
    decision: string;
    impact: 'high' | 'medium' | 'low';
  }>;
  interconnections: string[];
  sandwichGenerationOverload: boolean;
}

export interface CalculatorData {
  coreIdentity: CoreIdentityMatrix;
  financialFoundation: FinancialFoundation;
  childrenContext: ChildrenEducationContext;
  familyCareContext: FamilyCareContext;
  behavioralProfile: BehavioralFinanceProfile;
  complexityAnalysis: ComplexityRevealation;
  currentStep?: number;
  email?: string;
  phoneNumber?: string;
}

export interface WealthProjection {
  year: number;
  age: number;
  wealth: number;
  income: number;
  expenses: number;
  netCashFlow: number;
  majorEvents: string[];
  confidenceLevel: number;
}

export interface CalculationResults {
  extinctionYear: number;
  yearsRemaining: number;
  currentWealth: number;
  childrenInheritance: number;
  grandchildrenInheritance: number;
  projections: WealthProjection[];
  topWealthDestroyers: Array<{ 
    factor: string; 
    impact: number; 
    description: string;
    preventionStrategy?: string;
  }>;
  familyImpact: {
    today: { netWorth: number; status: string };
    inheritance: { 
      year: number; 
      children: Array<{ name: string; inheritance: number; age?: number }> 
    };
    grandchildren: { 
      year: number; 
      inheritance: number; 
      collegeShortfall: number;
      estimatedGrandchildren?: number;
      inheritancePerGrandchild?: number;
      futureEducationCost?: number;
    };
  };
  protectedScenario: {
    extinctionYear: number;
    additionalYears: number;
    grandchildrenInheritance: number;
    improvements: Array<{
      action: string;
      impact: string;
      timelineExtension: number;
      costSavings: number;
    }> | string[];
  };
  complexityAnalysis: {
    score: number;
    primaryComplexityDrivers: string[];
    coordinationOpportunities: string[] | Array<{
      opportunity: string;
      potentialSavings: number;
      implementationDifficulty: 'low' | 'medium' | 'high';
      timeToImplement: string;
    }>;
    optimizationPotential: number;
    riskFactors?: Array<{
      risk: string;
      probability: number;
      impact: number;
      mitigation: string;
    }>;
  };
  scenarioAnalysis: {
    bestCase: { 
      extinctionYear: number; 
      probability: number;
      conditions?: string[];
    };
    mostLikely: { 
      extinctionYear: number; 
      probability: number;
      conditions?: string[];
    };
    worstCase: { 
      extinctionYear: number; 
      probability: number;
      conditions?: string[];
    };
    stressTests?: Array<{
      scenario: string;
      extinctionYearImpact: number;
      wealthImpact: number;
      probability: number;
      description: string;
    }>;
    statistics?: {
      median: number;
      mean: number;
      standardDeviation: number;
      confidenceInterval95: number[];
    };
  };
  recommendations: {
    immediate: Array<{
      action: string;
      priority: 'critical' | 'high' | 'medium';
      timelineImpact: number;
      costToImplement: number;
      deadline: string;
    }>;
    shortTerm: Array<{
      action: string;
      timeframe: string;
      expectedBenefit: string;
    }>;
    longTerm: Array<{
      action: string;
      timeframe: string;
      expectedBenefit: string;
    }>;
  };
  extremeValueAnalysis?: EVTResults; // Added EVT results
}