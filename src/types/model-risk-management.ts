// src/types/model-risk-management.ts
// Additional types for the Model Risk Management Framework

/**
 * Model risk categories
 */
export enum ModelRiskCategory {
  DATA_QUALITY = 'Data Quality',
  METHODOLOGY = 'Methodology',
  IMPLEMENTATION = 'Implementation',
  GOVERNANCE = 'Governance',
  USAGE = 'Usage'
}

/**
 * Model risk factor
 */
export interface ModelRiskFactor {
  category: ModelRiskCategory;
  description: string;
  likelihood: 'LOW' | 'MEDIUM' | 'HIGH';
  impact: 'LOW' | 'MEDIUM' | 'HIGH';
  mitigationStrategy: string;
}

/**
 * Model validation strategy
 */
export interface ModelValidationStrategy {
  modelId: string;
  validationApproach: 'BACKTESTING' | 'BENCHMARKING' | 'OUTCOME_ANALYSIS' | 'EXPERT_JUDGMENT';
  validationFrequency: 'MONTHLY' | 'QUARTERLY' | 'ANNUALLY' | 'AD_HOC';
  validationTests: string[];
  acceptanceCriteria: {
    statisticalThresholds: Record<string, number>;
    businessThresholds: Record<string, number>;
  };
  independentValidation: boolean;
  validationTeam: string[];
}

/**
 * Model monitoring plan
 */
export interface ModelMonitoringPlan {
  modelId: string;
  monitoringMetrics: string[];
  alertThresholds: Record<string, number>;
  monitoringFrequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY';
  responsibleParty: string;
  escalationProcedure: string[];
  reportingSchedule: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY';
}

/**
 * Model change management
 */
export interface ModelChangeManagement {
  modelId: string;
  changeType: 'PARAMETER' | 'METHODOLOGY' | 'DATA_SOURCE' | 'IMPLEMENTATION' | 'USAGE';
  changeDescription: string;
  justification: string;
  impactAssessment: {
    businessImpact: 'LOW' | 'MEDIUM' | 'HIGH';
    technicalImpact: 'LOW' | 'MEDIUM' | 'HIGH';
    riskImpact: 'LOW' | 'MEDIUM' | 'HIGH';
  };
  approvalRequired: boolean;
  approvalLevel: 'MODEL_OWNER' | 'MODEL_RISK_MANAGER' | 'COMMITTEE' | 'BOARD';
  testingRequired: boolean;
  testingPlan?: string;
  implementationPlan: string;
  rollbackPlan: string;
}

/**
 * Model inventory report
 */
export interface ModelInventoryReport {
  reportDate: Date;
  totalModels: number;
  modelsByType: Record<string, number>;
  modelsByRiskRating: Record<string, number>;
  modelsByStatus: Record<string, number>;
  highRiskModels: string[];
  modelsRequiringReview: string[];
  modelsWithValidationIssues: string[];
  recentChanges: {
    modelId: string;
    changeType: string;
    changeDate: Date;
  }[];
  recommendations: string[];
}

/**
 * Model documentation
 */
export interface ModelDocumentation {
  modelId: string;
  version: string;
  documentationType: 'TECHNICAL' | 'USER' | 'VALIDATION' | 'GOVERNANCE';
  author: string;
  creationDate: Date;
  lastUpdated: Date;
  content: string;
  attachments?: string[];
  reviewStatus: 'DRAFT' | 'UNDER_REVIEW' | 'APPROVED';
  reviewedBy?: string;
  reviewDate?: Date;
}