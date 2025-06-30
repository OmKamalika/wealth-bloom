// src/services/ModelRegistrationService.ts
// Service for registering and managing models in the risk management framework
/**
 * Service for registering and managing models in the risk management framework
 */
export class ModelRegistrationService {
    constructor(riskManagementFramework) {
        this.validationStrategies = new Map();
        this.monitoringPlans = new Map();
        this.modelDocumentation = new Map();
        this.riskManagementFramework = riskManagementFramework;
    }
    /**
     * Register a new model in the risk management framework
     * @param modelInfo Model registration information
     * @returns The registered model ID
     */
    registerModel(modelInfo) {
        // Generate model ID if not provided
        const modelId = modelInfo.modelId || this.generateModelId(modelInfo.modelType);
        // Set approval date and next review date
        const approvalDate = new Date();
        let nextReviewDate;
        switch (modelInfo.reviewFrequency) {
            case 'MONTHLY':
                nextReviewDate = new Date(approvalDate);
                nextReviewDate.setMonth(nextReviewDate.getMonth() + 1);
                break;
            case 'QUARTERLY':
                nextReviewDate = new Date(approvalDate);
                nextReviewDate.setMonth(nextReviewDate.getMonth() + 3);
                break;
            case 'ANNUALLY':
            default:
                nextReviewDate = new Date(approvalDate);
                nextReviewDate.setFullYear(nextReviewDate.getFullYear() + 1);
                break;
        }
        // Create model registration
        const registration = {
            ...modelInfo,
            modelId,
            approvalDate,
            nextReviewDate
        };
        // Register model in the framework
        this.riskManagementFramework.registerModel(registration);
        // Create default validation strategy
        this.createDefaultValidationStrategy(modelId, modelInfo.riskRating);
        // Create default monitoring plan
        this.createDefaultMonitoringPlan(modelId, modelInfo.riskRating);
        // Create initial technical documentation
        this.createInitialDocumentation(modelId, modelInfo);
        return modelId;
    }
    /**
     * Validate a model using the risk management framework
     * @param modelId The ID of the model to validate
     * @param data Time series data for validation
     * @returns Validation report
     */
    validateModel(modelId, data) {
        return this.riskManagementFramework.validateModel(modelId, data);
    }
    /**
     * Get model information
     * @param modelId The ID of the model
     * @returns Model registration information
     */
    getModelInfo(modelId) {
        return this.riskManagementFramework.getModelInfo(modelId);
    }
    /**
     * Get validation strategy for a model
     * @param modelId The ID of the model
     * @returns Validation strategy
     */
    getValidationStrategy(modelId) {
        return this.validationStrategies.get(modelId);
    }
    /**
     * Set validation strategy for a model
     * @param modelId The ID of the model
     * @param strategy Validation strategy
     */
    setValidationStrategy(modelId, strategy) {
        this.validationStrategies.set(modelId, strategy);
    }
    /**
     * Get monitoring plan for a model
     * @param modelId The ID of the model
     * @returns Monitoring plan
     */
    getMonitoringPlan(modelId) {
        return this.monitoringPlans.get(modelId);
    }
    /**
     * Set monitoring plan for a model
     * @param modelId The ID of the model
     * @param plan Monitoring plan
     */
    setMonitoringPlan(modelId, plan) {
        this.monitoringPlans.set(modelId, plan);
    }
    /**
     * Get documentation for a model
     * @param modelId The ID of the model
     * @returns Model documentation
     */
    getModelDocumentation(modelId) {
        return this.modelDocumentation.get(modelId) || [];
    }
    /**
     * Add documentation for a model
     * @param modelId The ID of the model
     * @param documentation Model documentation
     */
    addModelDocumentation(modelId, documentation) {
        const docs = this.modelDocumentation.get(modelId) || [];
        docs.push(documentation);
        this.modelDocumentation.set(modelId, docs);
    }
    /**
     * Generate a model ID
     * @param modelType Model type
     * @returns Generated model ID
     */
    generateModelId(modelType) {
        const prefix = modelType.substring(0, 3).toUpperCase();
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 6);
        return `${prefix}_${timestamp}_${random}`;
    }
    /**
     * Create default validation strategy for a model
     * @param modelId The ID of the model
     * @param riskRating Risk rating
     */
    createDefaultValidationStrategy(modelId, riskRating) {
        const strategy = {
            modelId,
            validationApproach: 'BACKTESTING',
            validationFrequency: riskRating === 'CRITICAL' ? 'MONTHLY' :
                riskRating === 'HIGH' ? 'QUARTERLY' : 'ANNUALLY',
            validationTests: [
                'Stationarity',
                'Structural Breaks',
                'Heteroskedasticity',
                'Normality',
                'Autocorrelation'
            ],
            acceptanceCriteria: {
                statisticalThresholds: {
                    'pValue': 0.05,
                    'r2': 0.7,
                    'mape': 0.15
                },
                businessThresholds: {
                    'directionalAccuracy': 0.6,
                    'profitFactor': 1.5
                }
            },
            independentValidation: riskRating === 'HIGH' || riskRating === 'CRITICAL',
            validationTeam: ['Model Validator']
        };
        this.validationStrategies.set(modelId, strategy);
    }
    /**
     * Create default monitoring plan for a model
     * @param modelId The ID of the model
     * @param riskRating Risk rating
     */
    createDefaultMonitoringPlan(modelId, riskRating) {
        const plan = {
            modelId,
            monitoringMetrics: [
                'MAE',
                'RMSE',
                'Directional Accuracy',
                'Population Stability Index',
                'Outlier Rate'
            ],
            alertThresholds: {
                'MAE': 0.15,
                'RMSE': 0.2,
                'Directional Accuracy': 0.6,
                'Population Stability Index': 0.25,
                'Outlier Rate': 0.05
            },
            monitoringFrequency: riskRating === 'CRITICAL' ? 'DAILY' :
                riskRating === 'HIGH' ? 'WEEKLY' : 'MONTHLY',
            responsibleParty: 'Model Owner',
            escalationProcedure: [
                'Alert Model Owner',
                'Investigate within 24 hours',
                'Escalate to Model Risk Manager if unresolved',
                'Implement mitigation measures'
            ],
            reportingSchedule: riskRating === 'CRITICAL' ? 'WEEKLY' : 'MONTHLY'
        };
        this.monitoringPlans.set(modelId, plan);
    }
    /**
     * Create initial documentation for a model
     * @param modelId The ID of the model
     * @param modelInfo Model information
     */
    createInitialDocumentation(modelId, modelInfo) {
        const technicalDoc = {
            modelId,
            version: '1.0',
            documentationType: 'TECHNICAL',
            author: 'Model Developer',
            creationDate: new Date(),
            lastUpdated: new Date(),
            content: `
# Technical Documentation for ${modelId}

## Overview
${modelInfo.businessPurpose}

## Methodology
${modelInfo.methodology}

## Data Requirements
${modelInfo.dataRequirements.join('\n')}

## Assumptions
${modelInfo.assumptions.join('\n')}

## Limitations
${modelInfo.limitations.join('\n')}
      `,
            reviewStatus: 'DRAFT'
        };
        const governanceDoc = {
            modelId,
            version: '1.0',
            documentationType: 'GOVERNANCE',
            author: 'Model Risk Manager',
            creationDate: new Date(),
            lastUpdated: new Date(),
            content: `
# Governance Documentation for ${modelId}

## Risk Rating
${modelInfo.riskRating}

## Review Frequency
${modelInfo.reviewFrequency}

## Approved By
${modelInfo.approvedBy}

## Next Review Date
${modelInfo.nextReviewDate}
      `,
            reviewStatus: 'DRAFT'
        };
        this.modelDocumentation.set(modelId, [technicalDoc, governanceDoc]);
    }
}
