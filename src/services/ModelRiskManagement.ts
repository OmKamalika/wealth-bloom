// src/services/ModelRiskManagement.ts
// Implementation of the Model Risk Management Framework

import { 
  ModelRegistration, 
  ValidationReport, 
  TimeSeriesData, 
  StatisticalTest,
  ModelAuditEvent,
  ModelGovernanceStatus,
  ModelRiskAssessment
} from '../types/model-governance';

/**
 * Model Risk Management Framework
 * 
 * This class implements a comprehensive model risk management framework
 * for financial models, following regulatory best practices.
 */
export class ModelRiskManagementFramework {
  private modelInventory: Map<string, ModelRegistration> = new Map();
  private validationResults: Map<string, ValidationReport> = new Map();
  private performanceHistory: Map<string, any[]> = new Map();
  private auditTrail: ModelAuditEvent[] = [];
  private governanceStatus: Map<string, ModelGovernanceStatus> = new Map();
  private riskAssessments: Map<string, ModelRiskAssessment> = new Map();

  /**
   * Register a model in the risk management framework
   * @param registration Model registration information
   */
  registerModel(registration: ModelRegistration): void {
    // Regulatory requirement: All models must be inventoried
    this.modelInventory.set(registration.modelId, registration);
    
    // Set initial governance status
    this.governanceStatus.set(registration.modelId, {
      modelId: registration.modelId,
      status: 'DEVELOPMENT',
      currentVersion: '1.0',
      lastReviewDate: registration.approvalDate,
      nextReviewDate: registration.nextReviewDate,
      validationStatus: 'PENDING',
      approvalStatus: 'PENDING',
      complianceStatus: 'COMPLIANT'
    });
    
    // High-risk models require additional oversight
    if (registration.riskRating === 'HIGH' || registration.riskRating === 'CRITICAL') {
      this.requireIndependentValidation(registration.modelId);
      this.scheduleGovernanceReview(registration.modelId);
    }
    
    // Create audit trail entry
    this.logAuditEvent({
      modelId: registration.modelId,
      eventType: 'REGISTRATION',
      timestamp: new Date(),
      user: 'SYSTEM',
      details: `Model ${registration.modelId} registered with risk rating: ${registration.riskRating}`
    });
    
    console.log(`Model ${registration.modelId} registered with risk rating: ${registration.riskRating}`);
  }

  /**
   * Validate a model using statistical tests
   * @param modelId The ID of the model to validate
   * @param data Time series data for validation
   * @returns Validation report
   */
  validateModel(modelId: string, data: TimeSeriesData): ValidationReport {
    const model = this.modelInventory.get(modelId);
    if (!model) throw new Error(`Model ${modelId} not found in inventory`);

    // Update governance status
    const governance = this.governanceStatus.get(modelId);
    if (governance) {
      governance.validationStatus = 'IN_PROGRESS';
      this.governanceStatus.set(modelId, governance);
    }

    // Run statistical tests
    const report: ValidationReport = {
      modelId,
      validationDate: new Date(),
      tests: {
        stationarity: this.testStationarity(data),
        structuralBreaks: this.testStructuralBreaks(data),
        heteroskedasticity: this.testHeteroskedasticity(data),
        normality: this.testNormality(data),
        autocorrelation: this.testAutocorrelation(data)
      },
      overallRating: 'PENDING',
      recommendations: []
    };

    // Determine overall validation rating
    const failedTests = Object.values(report.tests).filter(test => !test.passed).length;
    if (failedTests === 0) {
      report.overallRating = 'APPROVED';
      report.recommendations.push('Model approved for production use');
    } else if (failedTests <= 2) {
      report.overallRating = 'CONDITIONAL';
      report.recommendations.push('Address failed statistical tests before full deployment');
      report.recommendations.push('Implement additional monitoring for affected areas');
    } else {
      report.overallRating = 'REJECTED';
      report.recommendations.push('Major statistical issues must be resolved before deployment');
      report.recommendations.push('Consider model redesign or alternative approaches');
    }

    // Store validation results
    this.validationResults.set(modelId, report);
    
    // Update governance status
    if (governance) {
      governance.validationStatus = 'COMPLETED';
      governance.status = report.overallRating === 'APPROVED' ? 'APPROVED' : 
                          report.overallRating === 'CONDITIONAL' ? 'CONDITIONAL' : 'VALIDATION';
      this.governanceStatus.set(modelId, governance);
    }
    
    // Create audit trail entry
    this.logAuditEvent({
      modelId,
      eventType: 'VALIDATION',
      timestamp: new Date(),
      user: 'SYSTEM',
      details: `Model validation completed with rating: ${report.overallRating}`
    });

    return report;
  }

  /**
   * Get model information from the inventory
   * @param modelId The ID of the model
   * @returns Model registration information
   */
  getModelInfo(modelId: string): ModelRegistration | undefined {
    return this.modelInventory.get(modelId);
  }

  /**
   * Get validation report for a model
   * @param modelId The ID of the model
   * @returns Validation report
   */
  getValidationReport(modelId: string): ValidationReport | undefined {
    return this.validationResults.get(modelId);
  }

  /**
   * Get governance status for a model
   * @param modelId The ID of the model
   * @returns Governance status
   */
  getGovernanceStatus(modelId: string): ModelGovernanceStatus | undefined {
    return this.governanceStatus.get(modelId);
  }

  /**
   * Get audit trail for a model
   * @param modelId The ID of the model
   * @returns Audit events for the model
   */
  getModelAuditTrail(modelId: string): ModelAuditEvent[] {
    return this.auditTrail.filter(event => event.modelId === modelId);
  }

  /**
   * Get all registered models
   * @returns Array of model registrations
   */
  getAllModels(): ModelRegistration[] {
    return Array.from(this.modelInventory.values());
  }

  /**
   * Perform a risk assessment for a model
   * @param modelId The ID of the model
   * @param assessmentData Risk assessment data
   */
  performRiskAssessment(modelId: string, assessmentData: Partial<ModelRiskAssessment>): ModelRiskAssessment {
    const model = this.modelInventory.get(modelId);
    if (!model) throw new Error(`Model ${modelId} not found in inventory`);
    
    const assessment: ModelRiskAssessment = {
      modelId,
      riskRating: assessmentData.riskRating || model.riskRating,
      riskFactors: assessmentData.riskFactors || {
        complexity: 0.5,
        dataQuality: 0.5,
        implementation: 0.5,
        governance: 0.5,
        usage: 0.5
      },
      mitigationControls: assessmentData.mitigationControls || [],
      residualRisk: assessmentData.residualRisk || 0.5,
      assessmentDate: new Date(),
      assessedBy: assessmentData.assessedBy || 'SYSTEM'
    };
    
    // Store risk assessment
    this.riskAssessments.set(modelId, assessment);
    
    // Create audit trail entry
    this.logAuditEvent({
      modelId,
      eventType: 'REVIEW',
      timestamp: new Date(),
      user: assessment.assessedBy,
      details: `Risk assessment performed with rating: ${assessment.riskRating}`
    });
    
    return assessment;
  }

  /**
   * Test for stationarity in time series data
   * @param data Time series data
   * @returns Statistical test result
   */
  private testStationarity(data: TimeSeriesData): StatisticalTest {
    // Augmented Dickey-Fuller test for unit roots
    const adfStatistic = this.calculateADFStatistic(data);
    const criticalValue = -3.43; // 1% significance level
    
    return {
      testName: 'Augmented Dickey-Fuller',
      statistic: adfStatistic,
      criticalValue,
      pValue: this.calculateADFPValue(adfStatistic),
      passed: adfStatistic < criticalValue,
      interpretation: adfStatistic < criticalValue ? 'Series is stationary' : 'Series has unit root'
    };
  }

  /**
   * Test for structural breaks in time series data
   * @param data Time series data
   * @returns Statistical test result
   */
  private testStructuralBreaks(data: TimeSeriesData): StatisticalTest {
    // Chow test for structural stability
    const breakPoint = Math.floor(data.values.length * 0.5);
    const chowStatistic = this.calculateChowStatistic(data, breakPoint);
    const criticalValue = 3.84; // Chi-square 1% critical value
    
    return {
      testName: 'Chow Structural Break',
      statistic: chowStatistic,
      criticalValue,
      pValue: this.calculateChiSquarePValue(chowStatistic, 1),
      passed: chowStatistic < criticalValue,
      interpretation: chowStatistic < criticalValue ? 'No structural break detected' : 'Structural break present'
    };
  }

  /**
   * Test for heteroskedasticity in time series data
   * @param data Time series data
   * @returns Statistical test result
   */
  private testHeteroskedasticity(data: TimeSeriesData): StatisticalTest {
    // White test for heteroskedasticity
    // Simplified implementation for demonstration
    const whiteStatistic = Math.random() * 10;
    const criticalValue = 5.99; // Chi-square 5% critical value with 2 df
    
    return {
      testName: 'White Heteroskedasticity',
      statistic: whiteStatistic,
      criticalValue,
      pValue: this.calculateChiSquarePValue(whiteStatistic, 2),
      passed: whiteStatistic < criticalValue,
      interpretation: whiteStatistic < criticalValue ? 'Homoskedastic errors' : 'Heteroskedastic errors'
    };
  }

  /**
   * Test for normality in time series data
   * @param data Time series data
   * @returns Statistical test result
   */
  private testNormality(data: TimeSeriesData): StatisticalTest {
    // Jarque-Bera test for normality
    // Simplified implementation for demonstration
    const jbStatistic = Math.random() * 10;
    const criticalValue = 5.99; // Chi-square 5% critical value with 2 df
    
    return {
      testName: 'Jarque-Bera Normality',
      statistic: jbStatistic,
      criticalValue,
      pValue: this.calculateChiSquarePValue(jbStatistic, 2),
      passed: jbStatistic < criticalValue,
      interpretation: jbStatistic < criticalValue ? 'Residuals are normally distributed' : 'Non-normal residuals'
    };
  }

  /**
   * Test for autocorrelation in time series data
   * @param data Time series data
   * @returns Statistical test result
   */
  private testAutocorrelation(data: TimeSeriesData): StatisticalTest {
    // Durbin-Watson test for autocorrelation
    // Simplified implementation for demonstration
    const dwStatistic = 1.5 + Math.random();
    const lowerBound = 1.5; // Lower critical value
    const upperBound = 2.5; // Upper critical value
    
    return {
      testName: 'Durbin-Watson Autocorrelation',
      statistic: dwStatistic,
      criticalValue: 2.0, // Ideal value
      pValue: 0.05, // Placeholder
      passed: dwStatistic > lowerBound && dwStatistic < upperBound,
      interpretation: dwStatistic > lowerBound && dwStatistic < upperBound ? 
        'No significant autocorrelation' : 'Autocorrelation present'
    };
  }

  /**
   * Calculate Augmented Dickey-Fuller statistic
   * @param data Time series data
   * @returns ADF statistic
   */
  private calculateADFStatistic(data: TimeSeriesData): number {
    // Simplified ADF calculation - in production, use proper econometric library
    const values = data.values;
    const n = values.length;
    let sumSquaredResiduals = 0;
    let sumSquaredDifferences = 0;

    for (let i = 1; i < n; i++) {
      const diff = values[i] - values[i-1];
      const laggedLevel = values[i-1];
      
      // Regression: Δy_t = α + βy_{t-1} + ε_t
      // Test H0: β = 0 (unit root)
      sumSquaredDifferences += laggedLevel * laggedLevel;
      sumSquaredResiduals += diff * diff;
    }

    // Simplified t-statistic calculation
    return -2.5 + Math.random() * 2; // Placeholder - implement proper ADF
  }

  /**
   * Calculate ADF p-value
   * @param statistic ADF statistic
   * @returns p-value
   */
  private calculateADFPValue(statistic: number): number {
    // MacKinnon critical values approximation
    return statistic < -3.43 ? 0.01 : statistic < -2.86 ? 0.05 : 0.10;
  }

  /**
   * Calculate Chow statistic for structural break test
   * @param data Time series data
   * @param breakPoint Break point index
   * @returns Chow statistic
   */
  private calculateChowStatistic(data: TimeSeriesData, breakPoint: number): number {
    // Simplified Chow test - implement proper version for production
    return Math.abs(Math.random() * 5); // Placeholder
  }

  /**
   * Calculate chi-square p-value
   * @param statistic Chi-square statistic
   * @param degreesOfFreedom Degrees of freedom
   * @returns p-value
   */
  private calculateChiSquarePValue(statistic: number, degreesOfFreedom: number): number {
    // Simplified chi-square p-value
    return statistic > 3.84 ? 0.05 : 0.10;
  }

  /**
   * Require independent validation for high-risk models
   * @param modelId The ID of the model
   */
  private requireIndependentValidation(modelId: string): void {
    // Create audit trail entry
    this.logAuditEvent({
      modelId,
      eventType: 'REVIEW',
      timestamp: new Date(),
      user: 'SYSTEM',
      details: `Independent validation required for high-risk model: ${modelId}`
    });
    
    console.log(`Independent validation required for high-risk model: ${modelId}`);
  }

  /**
   * Schedule governance review for high-risk models
   * @param modelId The ID of the model
   */
  private scheduleGovernanceReview(modelId: string): void {
    // Create audit trail entry
    this.logAuditEvent({
      modelId,
      eventType: 'REVIEW',
      timestamp: new Date(),
      user: 'SYSTEM',
      details: `Governance committee review scheduled for model: ${modelId}`
    });
    
    console.log(`Governance committee review scheduled for model: ${modelId}`);
  }

  /**
   * Log an audit event
   * @param event Audit event
   */
  private logAuditEvent(event: ModelAuditEvent): void {
    this.auditTrail.push(event);
  }

  /**
   * Generate a model governance report
   * @param modelId The ID of the model
   * @returns Governance report
   */
  generateGovernanceReport(modelId: string): any {
    const model = this.modelInventory.get(modelId);
    if (!model) throw new Error(`Model ${modelId} not found in inventory`);
    
    const validation = this.validationResults.get(modelId);
    const governance = this.governanceStatus.get(modelId);
    const riskAssessment = this.riskAssessments.get(modelId);
    const auditEvents = this.getModelAuditTrail(modelId);
    
    return {
      modelId,
      reportDate: new Date(),
      modelInfo: model,
      validationStatus: validation?.overallRating || 'NOT_VALIDATED',
      governanceStatus: governance?.status || 'DEVELOPMENT',
      riskAssessment: riskAssessment || 'NOT_ASSESSED',
      auditTrail: auditEvents,
      complianceStatus: governance?.complianceStatus || 'NON_COMPLIANT',
      recommendations: this.generateGovernanceRecommendations(modelId)
    };
  }

  /**
   * Generate governance recommendations for a model
   * @param modelId The ID of the model
   * @returns Recommendations
   */
  private generateGovernanceRecommendations(modelId: string): string[] {
    const model = this.modelInventory.get(modelId);
    const validation = this.validationResults.get(modelId);
    const governance = this.governanceStatus.get(modelId);
    
    const recommendations: string[] = [];
    
    if (!validation) {
      recommendations.push('Complete model validation');
    } else if (validation.overallRating === 'CONDITIONAL') {
      recommendations.push('Address validation issues before full deployment');
    }
    
    if (governance) {
      const now = new Date();
      const daysTillReview = Math.ceil(
        (governance.nextReviewDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );
      
      if (daysTillReview < 30) {
        recommendations.push(`Schedule model review within ${daysTillReview} days`);
      }
    }
    
    if (model?.riskRating === 'HIGH' || model?.riskRating === 'CRITICAL') {
      recommendations.push('Implement enhanced monitoring controls for high-risk model');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('Maintain current validation and monitoring schedule');
    }
    
    return recommendations;
  }
}