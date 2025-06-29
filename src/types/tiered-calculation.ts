// src/types/tiered-calculation.ts
// Type definitions for the tiered calculation architecture

/**
 * Basic calculation inputs - simplified for fast processing
 */
export interface BasicCalculationInputs {
  age: number;
  netWorth: number;
  annualIncome: number;
  children: number;
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  location: 'metro' | 'tier2' | 'tier3' | 'rural';
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed';
  parentCare: boolean;
}

/**
 * Basic calculation results - returned immediately
 */
export interface BasicCalculationResults {
  extinctionYear: number;
  yearsRemaining: number;
  currentWealth: number;
  childrenInheritance: number;
  grandchildrenInheritance: number;
  topRisks: Array<{
    factor: string;
    impact: number;
    description: string;
  }>;
  confidenceLevel: number;
  calculationId: string;
  upgradeIncentives: {
    comprehensiveAnalysisValue: string;
    additionalInsights: string[];
  };
  complexityAnalysis: {
    score: number;
    majorDecisions: Array<{
      decision: string;
      impact: number;
      urgency: 'low' | 'medium' | 'high';
      description: string;
    }>;
    interconnections: Array<{
      factor1: string;
      factor2: string;
      strength: number;
      description: string;
    }>;
    sandwichGenerationOverload: boolean;
  };
}

/**
 * Calculation job status
 */
export interface CalculationJobStatus {
  jobId: string;
  userId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed' | 'cancelled';
  progress: number;
  currentStep: string;
  estimatedTimeRemaining: number;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  error?: string;
}

/**
 * Calculation job notification preferences
 */
export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  inApp: boolean;
}

/**
 * Comprehensive calculation request
 */
export interface ComprehensiveCalculationRequest {
  userId: string;
  calculationId?: string; // Reference to basic calculation
  inputs: any; // Full CalculatorData
  priority: 'standard' | 'priority' | 'urgent';
  notificationPreferences: NotificationPreferences;
}

/**
 * Comprehensive calculation response
 */
export interface ComprehensiveCalculationResponse {
  success: boolean;
  jobId: string;
  estimatedCompletionTime: string;
  queuePosition?: number;
  notificationPreferences: NotificationPreferences;
}