// src/services/ModelRiskManagementExample.ts
// Example usage of the Model Risk Management Framework

import { ModelRiskManagementFramework } from './ModelRiskManagement';
import { ModelRegistrationService } from './ModelRegistrationService';
import { ModelMonitoringService } from './ModelMonitoringService';
import { TimeSeriesData } from '../types/model-governance';

/**
 * Example usage of the Model Risk Management Framework
 */
export class ModelRiskManagementExample {
  /**
   * Run the example
   */
  static async run(): Promise<void> {
    console.log('🏭 Running Model Risk Management Framework Example');
    console.log('=' .repeat(80));

    try {
      // Initialize the framework
      const framework = new ModelRiskManagementFramework();
      const registrationService = new ModelRegistrationService(framework);
      const monitoringService = new ModelMonitoringService(framework);
      
      // Register wealth calculation model
      console.log('📝 Registering wealth calculation model...');
      const wealthModelId = registrationService.registerModel({
        modelId: 'WEALTH_CALC_001',
        modelType: 'STATISTICAL',
        riskRating: 'HIGH',
        businessPurpose: 'Calculate wealth extinction timeline for family financial planning',
        methodology: 'Monte Carlo simulation with stochastic modeling',
        dataRequirements: [
          'User financial profile',
          'Family structure data',
          'Market return assumptions',
          'Inflation projections'
        ],
        assumptions: [
          'Log-normal market returns',
          'Stable inflation environment',
          'Consistent income growth',
          'No major economic disruptions'
        ],
        limitations: [
          'Cannot predict black swan events',
          'Limited by quality of user inputs',
          'Assumes rational financial behavior',
          'Does not account for policy changes'
        ],
        approvedBy: 'Model Governance Committee'
      });
      
      console.log(`✅ Model registered with ID: ${wealthModelId}`);
      
      // Register EVT model
      console.log('📝 Registering Extreme Value Theory model...');
      const evtModelId = registrationService.registerModel({
        modelId: 'EVT_MODEL_001',
        modelType: 'RISK',
        riskRating: 'CRITICAL',
        businessPurpose: 'Analyze tail risk in wealth projections',
        methodology: 'Generalized Pareto Distribution (GPD) for modeling extreme events',
        dataRequirements: [
          'Wealth projection time series',
          'Historical market returns',
          'Extreme event data'
        ],
        assumptions: [
          'Exceedances follow Generalized Pareto Distribution',
          'Threshold selection is appropriate',
          'Sufficient tail events for reliable estimation'
        ],
        limitations: [
          'Requires sufficient data in the tail',
          'Sensitive to threshold selection',
          'May not capture regime changes',
          'Limited by historical data availability'
        ],
        reviewFrequency: 'QUARTERLY',
        approvedBy: 'Risk Management Committee'
      });
      
      console.log(`✅ EVT Model registered with ID: ${evtModelId}`);
      
      // Register behavioral model
      console.log('📝 Registering behavioral finance model...');
      const behavioralModelId = registrationService.registerModel({
        modelId: 'BEHAV_FIN_001',
        modelType: 'BEHAVIORAL',
        riskRating: 'MEDIUM',
        businessPurpose: 'Quantify behavioral biases in financial decision making',
        methodology: 'Prospect theory application with empirical calibration',
        dataRequirements: [
          'User risk tolerance assessment',
          'Historical investment decisions',
          'Market crash response patterns'
        ],
        assumptions: [
          'Stable behavioral patterns over time',
          'Prospect theory applicability',
          'Loss aversion is quantifiable'
        ],
        limitations: [
          'Individual variation in behavior',
          'Context-dependent decision making',
          'Limited historical data for calibration'
        ],
        reviewFrequency: 'QUARTERLY',
        approvedBy: 'Behavioral Science Team'
      });
      
      console.log(`✅ Model registered with ID: ${behavioralModelId}`);
      
      // Generate sample time series data for validation
      const timeSeriesData: TimeSeriesData = {
        dates: Array.from({ length: 100 }, (_, i) => new Date(2020, 0, i + 1)),
        values: Array.from({ length: 100 }, () => Math.random() * 100)
      };
      
      // Validate wealth calculation model
      console.log('🔍 Validating wealth calculation model...');
      const validationReport = framework.validateModel(wealthModelId, timeSeriesData);
      
      console.log(`✅ Validation complete with rating: ${validationReport.overallRating}`);
      console.log(`📊 Statistical tests: ${Object.values(validationReport.tests).filter(t => t.passed).length} passed, ${Object.values(validationReport.tests).filter(t => !t.passed).length} failed`);
      
      // Validate EVT model
      console.log('🔍 Validating EVT model...');
      const evtValidationReport = framework.validateModel(evtModelId, timeSeriesData);
      
      console.log(`✅ EVT Validation complete with rating: ${evtValidationReport.overallRating}`);
      console.log(`📊 Statistical tests: ${Object.values(evtValidationReport.tests).filter(t => t.passed).length} passed, ${Object.values(evtValidationReport.tests).filter(t => !t.passed).length} failed`);
      
      // Monitor model performance
      console.log('📡 Monitoring model performance...');
      
      // Generate sample predictions and actuals
      const predictions = Array.from({ length: 50 }, () => Math.random() * 100);
      const actuals = predictions.map(p => p + (Math.random() - 0.5) * 20); // Add some noise
      
      const monitoringResult = monitoringService.monitorPerformance(wealthModelId, predictions, actuals);
      
      console.log(`✅ Monitoring complete with status: ${monitoringResult.status}`);
      console.log(`⚠️ Alerts: ${monitoringResult.alerts.length}`);
      
      // Check for population drift
      console.log('🔄 Checking for population drift...');
      
      // Generate sample baseline and current data
      const baselineData = Array.from({ length: 100 }, () => Math.random() * 100);
      const currentData = Array.from({ length: 100 }, () => Math.random() * 120); // Slight drift
      
      const psi = monitoringService.checkPopulationDrift(wealthModelId, baselineData, currentData);
      
      console.log(`✅ Population Stability Index: ${psi.toFixed(3)}`);
      
      // Generate governance report
      console.log('📋 Generating governance report...');
      const governanceReport = framework.generateGovernanceReport(wealthModelId);
      
      console.log(`✅ Governance report generated with ${governanceReport.recommendations.length} recommendations`);
      
      // Print summary
      console.log('\n📊 Model Risk Management Summary:');
      console.log('=' .repeat(80));
      console.log(`Total models registered: ${framework.getAllModels().length}`);
      console.log(`Models by risk rating: HIGH=${framework.getAllModels().filter(m => m.riskRating === 'HIGH').length}, MEDIUM=${framework.getAllModels().filter(m => m.riskRating === 'MEDIUM').length}, CRITICAL=${framework.getAllModels().filter(m => m.riskRating === 'CRITICAL').length}`);
      console.log(`Validation status: ${validationReport.overallRating}`);
      console.log(`Monitoring status: ${monitoringResult.status}`);
      console.log(`Governance recommendations: ${governanceReport.recommendations.join(', ')}`);
      
      console.log('\n✅ Model Risk Management Framework Example completed successfully!');
      
    } catch (error) {
      console.error('❌ Error in Model Risk Management Example:', error);
    }
  }
}

// Run the example if this file is executed directly
if (require.main === module) {
  ModelRiskManagementExample.run().catch(console.error);
}