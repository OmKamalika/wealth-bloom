// src/types/model-governance.ts
// Type definitions for the Model Risk Management Framework

/**
 * Model registration information for the risk management framework
 */
export interface ModelRegistration {
  modelId: string;
  modelType: 'STATISTICAL' | 'MACHINE_LEARNING' | 'BEHAVIORAL' | 'RISK';
  riskRating: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  businessPurpose: string;
  methodology: string;
  dataRequirements: string[];
  assumptions: string[];
  limitations: string[];
  approvalDate: Date;
  approvedBy: string;
  reviewFrequency: 'MONTHLY' | 'QUARTERLY' | 'ANNUALLY';
  nextReviewDate: Date;
}

/**
 * Time series data for model validation
 */
export interface TimeSeriesData {
  dates: Date[];
  values: number[];
}

/**
 * Statistical test result for model validation
 */
export interface StatisticalTest {
  testName: string;
  statistic: number;
  criticalValue: number;
  pValue: number;
  passed: boolean;
  interpretation: string;
}

/**
 * Validation report for a model
 */
export interface ValidationReport {
  modelId: string;
  validationDate: Date;
  tests: {
    stationarity: StatisticalTest;
    structuralBreaks: StatisticalTest;
    heteroskedasticity: StatisticalTest;
    normality: StatisticalTest;
    autocorrelation: StatisticalTest;
  };
  overallRating: 'APPROVED' | 'CONDITIONAL' | 'REJECTED' | 'PENDING';
  recommendations: string[];
}

/**
 * Performance metrics for model monitoring
 */
export interface PerformanceMetrics {
  mse: number;
  mae: number;
  rmse: number;
  directionalAccuracy: number;
  hitRate: number;
  informationRatio: number;
  maxDrawdown: number;
  sharpeRatio: number;
  calmarRatio: number;
}

/**
 * Model risk assessment
 */
export interface ModelRiskAssessment {
  modelId: string;
  riskRating: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  riskFactors: {
    complexity: number;
    dataQuality: number;
    implementation: number;
    governance: number;
    usage: number;
  };
  mitigationControls: string[];
  residualRisk: number;
  assessmentDate: Date;
  assessedBy: string;
}

/**
 * Model audit event
 */
export interface ModelAuditEvent {
  modelId: string;
  eventType: 'REGISTRATION' | 'VALIDATION' | 'APPROVAL' | 'REJECTION' | 'REVIEW' | 'DECOMMISSION';
  timestamp: Date;
  user: string;
  details: string;
  changes?: Record<string, any>;
}

/**
 * Model governance status
 */
export interface ModelGovernanceStatus {
  modelId: string;
  status: 'DEVELOPMENT' | 'VALIDATION' | 'APPROVED' | 'CONDITIONAL' | 'REJECTED' | 'DECOMMISSIONED';
  currentVersion: string;
  lastReviewDate: Date;
  nextReviewDate: Date;
  validationStatus: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  complianceStatus: 'COMPLIANT' | 'NON_COMPLIANT';
}